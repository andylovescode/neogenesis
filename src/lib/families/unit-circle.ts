import type {Family} from "$lib/families/index";
import {cos, sin, sum, tan, variable, product} from "$lib/math";

const a = variable('a', 'deg'); // theta
const x = variable('x'); //
const y = variable('y');
const t = variable('t');

export const unitCircle: Family = {
	formulas: [{
		title: `Compute x from angle`,
		description: `Using the formula for x, we can find the x position.`,
		takes: [a],
		gives: x,
		formula: cos(a)
	}, {
		title: `Compute y from angle`,
		description: `Using the formula for y, we can find the y position.`,
		takes: [a],
		gives: y,
		formula: sin(a)
	}, {
		title: `Compute y/x from angle`,
		description: `Using the formula for y, we can find the y position.`,
		takes: [a],
		gives: t,
		formula: tan(a)
	}],
	implicits: { // default vales, essentially
		a: 0,
		b: 0
	},
	warnings: [],
}