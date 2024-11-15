import type {Expression} from "$lib/math";
import {kinematics} from "$lib/families/kinematics";
import {slopes} from "$lib/families/slopes";
import type {QuickButton} from "$lib/solve";
import {unitCircle} from "$lib/families/unit-circle";

export type Variable = ['variable', string, string | undefined]

export type Family = {
	formulas: Formula[],
	implicits: Record<string, number>,
	warnings: WarningGenerator[]
}

export type WarningGenerator = {
	impl(variables: Map<string, number>): {
		text: string,
		actions: QuickButton[]
	} | undefined,
	id: string
};

export type Formula = {
	takes: Variable[],
	gives: Variable,
	formula: Expression,

	title: string,
	description: string,

	presume?: Record<string, number>
}

export const families = {kinematics, slopes, "unit-circle": unitCircle}