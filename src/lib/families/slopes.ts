import type {Family} from "$lib/families/index";
import {atan, cos, divide, exp, product, sin, sqrt, sub, sum, tan, variable} from "$lib/math";

const Dx = variable('Dx');
const Dy = variable('Dy');
const xi = variable('xi');
const yi = variable('yi');
const xf = variable('xf');
const yf = variable('yf');
const m = variable('m');
const b = variable('b');
const c = variable('c');
const a = variable('a');

export const slopes: Family = {
	formulas: [
		{
			title: `Compute delta-x`,
			description: `Using the formula for delta-x, we can find the change in x.`,
			takes: [xf, xi],
			gives: Dx,
			formula: sub(xf, xi)
		},
		{
			title: `Compute x-initial`,
			description: `Using the formula for x-initial, we can find the initial x position.`,
			takes: [xf, Dx],
			gives: xi,
			formula: sub(xf, Dx)
		},
		{
			title: `Compute x-final`,
			description: `Using the formula for x-final, we can find the final x position.`,
			takes: [xi, Dx],
			gives: xf,
			formula: sum(xi, Dx)
		},
		{
			title: `Compute delta-y`,
			description: `Using the formula for delta-y, we can find the change in y.`,
			takes: [yf, yi],
			gives: Dy,
			formula: sub(yf, yi)
		},
		{
			title: `Compute y-initial`,
			description: `Using the formula for y-initial, we can find the initial y position.`,
			takes: [yf, Dy],
			gives: yi,
			formula: sub(yf, Dy)
		},
		{
			title: `Compute y-final`,
			description: `Using the formula for y-final, we can find the final y position.`,
			takes: [yi, Dy],
			gives: yf,
			formula: sum(yi, Dy)
		},
		{
			title: `Compute slope`,
			description: `Using the formula for slope, we can find the slope of the line.`,
			takes: [Dy, Dx],
			gives: m,
			formula: divide(Dy, Dx)
		},
		{
			title: `Compute y-intercept`,
			description: `Using the formula for y-intercept, we can find the y-intercept of the line.`,
			takes: [yi, m, xi],
			gives: b,
			formula: sub(yi, product(m, xi))
		},
		{
			title: `Compute y-intercept`,
			description: `Using the formula for y-intercept, we can find the y-intercept of the line.`,
			takes: [yf, m, xf],
			gives: b,
			formula: sub(yf, product(m, xf))
		},
		{
			title: `Compute delta-x from slope`,
			description: `Using the formula for delta-x, we can find the change in x.`,
			takes: [m, Dy],
			gives: Dx,
			formula: divide(Dy, m)
		},
		{
			title: `Compute delta-y from slope`,
			description: `Using the formula for delta-y, we can find the change in y.`,
			takes: [m, Dx],
			gives: Dy,
			formula: product(m, Dx)
		},
		{
			title: `Compute y-initial from x-initial`,
			description: `Using the formula for y-initial, we can find the initial y position.`,
			takes: [m, xi, b],
			gives: yi,
			formula: sum(product(m, xi), b)
		},
		{
			title: `Compute x-initial from y-initial`,
			description: `Using the formula for x-initial, we can find the initial x position.`,
			takes: [m, yi, b],
			gives: xi,
			formula: divide(sub(yi, b), m)
		},
		{
			title: `Compute y-final from x-final`,
			description: `Using the formula for y-final, we can find the final y position.`,
			takes: [m, xf, b],
			gives: yf,
			formula: sum(product(m, xf), b)
		},
		{
			title: `Compute x-final from y-final`,
			description: `Using the formula for x-final, we can find the final x position.`,
			takes: [m, yf, b],
			gives: xf,
			formula: divide(sub(yf, b), m)
		},
		{
			title: 'Compute length of hypotenuse',
			description: `Using the Pythagorean theorem, we can find the length of the hypotenuse.`,
			takes: [Dx, Dy],
			gives: c,
			formula: sqrt(sum(exp(Dx, 2), exp(Dy, 2)))
		},
		{
			title: 'Angle to slope',
			description: `Using the formula for slope, we can get the slope from the angle`,
			takes: [a],
			gives: m,
			formula: tan(a)
		},
		{
			title: 'Slope to angle',
			description: `Using the formula for slope, we can get the angle from the slope`,
			takes: [m],
			gives: a,
			formula: atan(m)
		},
	],
	implicits: {
		b: 0
	},
	warnings: [],
}