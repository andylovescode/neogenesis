import type {Variable} from "$lib/families";

export type Expression =
	| ['sum', Expression[]]
	| ['sub', Expression, Expression]
	| ['product', Expression[]]
	| ['divide', Expression, Expression]
	| ['literal', number, string?]
	| Variable
	| ['sqrt', Expression]
	| ['exp', Expression, number]
	| ['paren', Expression]
	| ['sin', Expression]
	| ['cos', Expression]
	| ['tan', Expression]
	| ['atan', Expression]
	| ['ref', Expression];

export function substitute(
	expr: Expression,
	variables: Map<string, number>
): Expression {
	switch (expr[0]) {
		case 'sum':
			return ['sum', expr[1].map(e => substitute(e, variables))];
		case 'product':
			return ['product', expr[1].map(e => substitute(e, variables))];
		case 'divide':
			return ['divide', substitute(expr[1], variables), substitute(expr[2], variables)];
		case 'literal':
			return expr;
		case 'variable': {
			let variable = variables.get(expr[1]);

			if (variable === undefined) {
				throw new Error(`variable ${expr[1]} not found when substituting`);
			}

			return  ['literal', variable, expr[2]];
		}
		case 'sqrt':
			return ['sqrt', substitute(expr[1], variables)];
		case 'exp':
			return ['exp', substitute(expr[1], variables), expr[2]];
		case 'paren':
			return ['paren', substitute(expr[1], variables)];
		case "sub":
			return ['sub', substitute(expr[1], variables), substitute(expr[2], variables)];
		case "sin":
			return ['sin', substitute(expr[1], variables)];
		case "cos":
			return ['cos', substitute(expr[1], variables)];
		case "tan":
			return ['tan', substitute(expr[1], variables)];
		case "atan":
			return ['atan', substitute(expr[1], variables)];
		case "ref":
			return ['ref', substitute(expr[1], variables)];
		default:
			throw new Error(`unknown expression type ${expr[0]}`);
	}
}

export function wrapAngle(angle: number) {
	return angle % 360;
}

export function solve(expr: Expression): number {
	switch (expr[0]) {
		case 'sum':
			return expr[1].reduce((acc, e) => acc + solve(e), 0);
		case 'product':
			return expr[1].reduce((acc, e) => acc * solve(e), 1);
		case 'divide':
			return solve(expr[1]) / solve(expr[2]);
		case 'literal':
			return expr[1];
		case 'variable':
			throw new Error(`attempted to solve an expression with a variable, substitution must be done first`);
		case 'sqrt':
			return Math.sqrt(solve(expr[1]));
		case 'exp':
			return solve(expr[1]) ** expr[2];
		case 'paren':
			return solve(expr[1]);
		case 'sub':
			return solve(expr[1]) - solve(expr[2]);
		case 'sin':
			return Math.sin(solve(expr[1]) * Math.PI / 180);
		case 'cos':
			return Math.cos(solve(expr[1]) * Math.PI / 180);
		case 'tan':
			return Math.tan(solve(expr[1]) * Math.PI / 180);
		case 'atan':
			return Math.atan(solve(expr[1])) * 180 / Math.PI;
		case 'ref': { //reference angles are always acute
			let inner = wrapAngle(solve(expr[1]));

			if (inner > 0 && inner < 90) {
				return wrapAngle(90 - inner);
			}

			if (inner > 90 && inner < 180) {
				return wrapAngle(180 - inner	);
			}

			if (inner > 180 && inner < 270) {
				return wrapAngle(270 - inner);
			}

			if (inner > 270 && inner < 360) {
				return wrapAngle(360 - inner);
			}
		}
		default:
			throw new Error(`unknown expression type ${expr[0]}`);
	}
}

let pri = 0;

const PEMDAS = {
	literal: pri++,
	multiply: pri++,
	divide: pri++,
	sum: pri++,
	subtraction: pri++,
	sqrt: pri++,
	exp: pri++,
	func: pri++,
	paren: pri++,
}

export function getPriority(expr: Expression): number {
	switch (expr[0]) {
		case 'sum':
			return PEMDAS.sum;
		case 'product':
			return PEMDAS.multiply;
		case 'divide':
			return PEMDAS.divide;
		case 'literal':
			return PEMDAS.literal;
		case 'variable':
			return PEMDAS.literal;
		case 'sqrt':
			return PEMDAS.exp;
		case 'exp':
			return PEMDAS.exp;
		case 'paren':
			return PEMDAS.paren;
		case 'sub':
			return PEMDAS.subtraction;
		case 'sin':
			return PEMDAS.func;
		case 'cos':
			return PEMDAS.func;
		case 'tan':
			return PEMDAS.func;
		case 'atan':
			return PEMDAS.func;
		default:
			throw new Error(`unknown expression type ${expr[0]}`);
	}
}

export function minPriority(priority: number): (expr: Expression) => Expression {
	return (expr: Expression) => {
		if (getPriority(expr) <= priority) {
			return expr;
		}

		return ['paren', expr];
	}
}

export function parenthesiseMinimally(expr: Expression): Expression {
	switch (expr[0]) {
		case 'sum':
			return ['sum', expr[1].map(minPriority(PEMDAS.sum))];
		case 'product':
			return ['product', expr[1].map(minPriority(PEMDAS.multiply))];
		case 'divide':
			return ['divide', minPriority(PEMDAS.divide)(expr[1]), minPriority(PEMDAS.divide)(expr[2])];
		case 'literal':
			return expr
		case 'variable':
			return expr;
		case 'sqrt':
			return ['sqrt', minPriority(PEMDAS.sqrt)(expr[1])];
		case 'exp':
			return ['exp', minPriority(PEMDAS.exp)(expr[1]), expr[2]];
		case 'paren':
			return expr;
		case 'sub':
			return ['sub', minPriority(PEMDAS.subtraction)(expr[1]), minPriority(PEMDAS.subtraction)(expr[2])];
		case 'sin':
			return ['sin', minPriority(PEMDAS.func)(expr[1])];
		case 'cos':
			return ['cos', minPriority(PEMDAS.func)(expr[1])];
		case 'tan':
			return ['tan', minPriority(PEMDAS.func)(expr[1])];
		case 'atan':
			return ['atan', minPriority(PEMDAS.func)(expr[1])];
		default:
			throw new Error(`unknown expression type ${expr[0]}`);
	}
}

export function sum(...exprs: Expression[]): Expression {
	return ['sum', exprs];
}

export function product(...exprs: Expression[]): Expression {
	return ['product', exprs];
}

export function divide(a: Expression, b: Expression): Expression {
	return ['divide', a, b];
}

export function literal(n: number, unit: string | undefined = undefined): Expression {
	return ['literal', n, unit];
}

export function variable(name: string, unit: string | undefined = undefined): Variable {
	return ['variable', name, unit];
}

export function sqrt(expr: Expression): Expression {
	return ['sqrt', expr];
}

export function exp(expr: Expression, n: number): Expression {
	return ['exp', expr, n];
}

export function sub(a: Expression, b: Expression): Expression {
	return ['sub', a, b];
}

export function sin(expr: Expression): Expression {
	return ['sin', expr];
}

export function cos(expr: Expression): Expression {
	return ['cos', expr];
}

export function tan(expr: Expression): Expression {
	return ['tan', expr];
}

export function atan(expr: Expression): Expression {
	return ['atan', expr];
}