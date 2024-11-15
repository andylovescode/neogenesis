import {families as familyRegistry, type Family, type Variable} from "$lib/families";
import {type Expression as TExpression, solve, substitute} from "$lib/math";

export type Step = ['error', string] | ['solve', {
	title: string;
	description: string;

	given: [Variable, number][];
	unknown: Variable;
	equation: TExpression;
	solve: number;
	substitute: TExpression;
}] | ['hint', {
	message: string;
	quickButtons: QuickButton[]
}] | ['summary', {
	variables: Map<string, number>;
}];

export type QuickButton = {
	text: string;
	set?: Record<string, number>,
	libraries?: string[],
	hints?: string[],
	primary?: boolean;
}

function trim(n: number) {
	return Math.round(n * 100) / 100;
}

export function parseScript(script: string) {
	let ip = 0;

	function next() {
		return script[ip++];
	}

	function peek() {
		return script[ip];
	}

	function skipWhitespace() {
		while (" \t\n\r".includes(peek())) {
			next();
		}
	}

	function parseNumber() {
		let num = '';
		while ("0123456789.-".includes(peek())) {
			num += next();
		}
		return parseFloat(num);
	}

	function parseText() {
		let text = '';
		while ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-".includes(peek())) {
			text += next();
		}
		return text;
	}

	function here() {
		return `...${script.slice(ip - 5, ip)}[here]${script.slice(ip, ip + 5)}...`;
	}

	let libraries: string[] = [];
	let errors: string[] = [];
	let solverHints: string[] = [];
	let variables = new Map<string, number>();

	while (true) {
		skipWhitespace();
		if (ip >= script.length) {
			break;
		}

		let identifier = peek();

		if (identifier == "!") {
			next();
			let library = parseText();
			libraries.push(library);
		} else if (identifier == "@") {
			next();
			let hint = parseText();
			solverHints.push(hint);
		} else {
			let variable = parseText();
			skipWhitespace();
			if (next() !== '=') {
				errors.push(`Expected "=" after variable "${variable}" at ${here()}`);
				continue
			}
			skipWhitespace();
			let value = parseNumber();
			if (isNaN(value)) {
				errors.push(`Expected number after "="`);
				continue
			}

			variables.set(variable, value);
		}
	}

	return {libraries, errors, solverHints, variables};
}

export function stringifyScript(props: {libraries: string[], hints: string[], variables: Map<string, number>}) {
	let {libraries, hints, variables} = props;

	let script = '';

	for (const library of libraries) {
		script += `!${library} `;
	}

	for (const hint of hints) {
		script += `@${hint} `;
	}

	for (const [key, value] of [...variables.entries()].toSorted(
		([a], [b]) => a.localeCompare(b)
	)) {
		script += `${key}=${value} `;
	}

	return script.trim();
}

export function rewriteScript(
	script: string,
	button: QuickButton
) {
	let {libraries, errors, solverHints, variables} = parseScript(script.trim());

	if (button.set) {
		for (const [key, value] of Object.entries(button.set)) {
			variables.set(key, value);
		}
	}

	if (button.libraries) {
		for (const library of button.libraries) {
			if (!libraries.includes(library)) {
				libraries.push(library);
			}
		}
	}

	if (button.hints) {
		for (const hint of button.hints) {
			if (!solverHints.includes(hint)) {
				solverHints.push(hint);
			}
		}
	}

	return stringifyScript({libraries, hints: solverHints, variables});
}

export function solveInternal(script: string) {
	let steps: Step[] = [];

	let {libraries, errors, solverHints, variables} = parseScript(script.trim());

	for (const error of errors) {
		steps.push(['error', error]);
	}

	// Import relation families
	let families: Family[] = [];

	for (let library of libraries) {
		if (library in familyRegistry) {
			families.push((familyRegistry as Record<string, Family>)[library]);
		} else {
			steps.push(['error', `Unknown library "${library}"`]);
			return steps;
		}
	}

	const validHints = new Set<string>();

	validHints.add('no-implicit');

	for (const family of families) {
		for (const warning of family.warnings) {
			validHints.add(`ignore-${warning.id}`);
		}
	}

	for (const hint of solverHints) {
		if (!validHints.has(hint)) {
			steps.push(['error', `Unknown hint "${hint}"`]);
		}
	}

	// Provide tips
	if (libraries.length === 0) {
		steps.push(['hint', {
			message: `You haven't imported any libraries yet.`,
			quickButtons: [{
				text: `I'm doing a kinematics (physics) problem`,
				libraries: ['kinematics'],
				primary: true
			}, {
				text: `I'm doing a slopes (geometry) problem`,
				libraries: ['slopes'],
			}]
		}]);
		return steps;
	}

	for (const family of families) {
		for (const warning of family.warnings) {
			let bypassFlag = `ignore-${warning.id}`;

			if (solverHints.includes(bypassFlag)) {
				continue;
			}

			let warningResult = warning.impl(variables);

			if (warningResult !== undefined) {
				steps.push(['hint', {
					message: warningResult.text,
					quickButtons: warningResult.actions.concat([{
						text: `Ignore this warning`,
						hints: [bypassFlag],
					}])
				}]);
			}
		}
	}

	// Evaluate all relations
	outer: while (true) {
		for (const family of families) {
			formulas: for (const formula of family.formulas) {
				if (variables.has(formula.gives[1])) {
					continue;
				}
				for (const take of formula.takes) {
					if (!variables.has(take[1])) {
						continue formulas;
					}
				}
				for (const [key, value] of Object.entries(formula.presume ?? {})) {
					if (variables.get(key) !== value) {
						continue formulas;
					}
				}

				let solved = trim(solve(substitute(formula.formula, variables)));

				variables.set(formula.gives[1], solved);

				steps.push(['solve', {
					title: formula.title,
					description: formula.description,
					given: formula.takes.map(take => [take, variables.get(take[1])!]),
					unknown: formula.gives,
					equation: formula.formula,
					solve: solved,
					substitute: substitute(formula.formula, variables),
				}]);

				continue outer;
			}
		}

		for (const family of families) {
			for (const [key, value] of Object.entries(family.implicits)) {
				if (!variables.has(key) && !solverHints.includes('no-implicit')) {
					variables.set(key, value);

					steps.push(['hint', {
						message: `${key} is implicitly ${value}`,
						quickButtons: [{
							text: `Make explicit`,
							set: {[key]: value},
							primary: true
						}, {
							text: `Disable implicit variables`,
							hints: ['no-implicit'],
						}]
					}])

					continue outer;
				}
			}
		}

		break;
	}

	steps.push(['summary', {variables}]);

	return steps;
}