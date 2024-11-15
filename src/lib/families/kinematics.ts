import type {Family} from "$lib/families/index";
import {cos, divide, exp, literal, product, sin, sqrt, sub, sum, variable} from "$lib/math";

const vix = variable('vix', 'm/s');
const ax = variable('ax', 'm/s²');
const vfx = variable('vfx', 'm/s');
const dx = variable('dx', 'm');

const viy = variable('viy', 'm/s');
const ay = variable('ay', 'm/s²');
const vfy = variable('vfy', 'm/s');
const dy = variable('dy', 'm');

const si = variable('si', 'm/s');
const ai = variable('ai', 'deg');

const sf = variable('sf', 'm/s');
const af = variable('af', 'deg');

const fx = variable('fx', 'N');
const fy = variable('fy', 'N');

const m = variable('m', 'kg');

const t = variable('t', 's');

export const kinematics: Family = {
	formulas: [{
		title: "Compute displacement",
		description: `Since we have velocity-initial and acceleration, we can use the formula for displacement to find the final position.`,
		takes: [vix, ax, t],
		gives: dx,
		formula: sum(
			product(vix, t),
			product(divide(literal(1), literal(2)), ax, exp(t, 2))
		)
	}, {
		title: "Compute final velocity",
		description: `Since we have velocity-initial and acceleration, we can use the formula for final velocity to find the final velocity.`,
		takes: [vix, ax, t],
		gives: vfx,
		formula: sum(vix, product(ax, t))
	}, {
		title: "Compute initial velocity",
		description: `Since we have final velocity and acceleration, we can use the formula for initial velocity to find the initial velocity.`,
		takes: [vfx, ax, t],
		gives: vix,
		formula: sub(vfx, product(ax, t))
	}, {
		title: "Compute time from velocity change",
		description: `Since we have final velocity and initial velocity, we can use the formula for time to find the time.`,
		takes: [vix, vfx, ax],
		gives: t,
		formula: divide(sub(vfx, vix), ax),
	}, {
		title: "Compute time from displacement",
		description: `Since we have displacement and acceleration, we can use the formula for time to find the time.`,

		takes: [dx, ax],
		gives: t,
		formula: sqrt(divide(product(literal(2), dx), ax)),

		presume: {
			vix: 0
		}
	}, {
		title: "Compute time from displacement",
		description: `Since we have displacement and initial velocity, we can use the formula for time to find the time.`,
		takes: [dx, vix],
		gives: t,
		formula: divide(dx, vix),

		presume: {
			ax: 0
		}
	},
		// Y
		{
			title: "Compute displacement",
			description: `Since we have velocity-initial and acceleration, we can use the formula for displacement to find the final position.`,
			takes: [viy, ay, t],
			gives: dy,
			formula: sum(
				product(viy, t),
				product(divide(literal(1), literal(2)), ay, exp(t, 2))
			)
		}, {
			title: "Compute final velocity",
			description: `Since we have velocity-initial and acceleration, we can use the formula for final velocity to find the final velocity.`,
			takes: [viy, ay, t],
			gives: vfy,
			formula: sum(viy, product(ay, t))
		}, {
			title: "Compute initial velocity",
			description: `Since we have final velocity and acceleration, we can use the formula for initial velocity to find the initial velocity.`,
			takes: [vfy, ay, t],
			gives: viy,
			formula: sub(vfy, product(ay, t))
		}, {
			title: "Compute time from velocity change",
			description: `Since we have final velocity and initial velocity, we can use the formula for time to find the time.`,
			takes: [viy, vfy, ay],
			gives: t,
			formula: divide(sub(vfy, viy), ay),
		}, {
			title: "Compute time from displacement",
			description: `Since we have displacement and acceleration, we can use the formula for time to find the time.`,

			takes: [dy, ay],
			gives: t,
			formula: sqrt(divide(product(literal(2), dy), ay)),

			presume: {
				viy: 0
			}
		}, {
			title: "Compute time from displacement",
			description: `Since we have displacement and initial velocity, we can use the formula for time to find the time.`,
			takes: [dy, viy],
			gives: t,
			formula: divide(dy, viy),

			presume: {
				ay: 0
			}
		}, {
			title: `Angle initial + Speed initial -> Vix`,
			description: `Since we have the angle and the speed, we can use cos to derive Vix`,
			takes: [si, ai],
			gives: vix,

			formula: product(si, cos(ai))
		}, {
			title: `Angle final + Speed final -> Viy`,
			description: `Since we have the angle and the speed, we can use sin to derive Viy`,
			takes: [si, ai],
			gives: viy,

			formula: product(si, sin(ai))
		}, {
			title: `Angle initial + Speed initial -> Vfx`,
			description: `Since we have the angle and the speed, we can use cos to derive Vfx`,
			takes: [sf, af],
			gives: vfx,

			formula: product(sf, cos(af))
		}, {
			title: `Angle final + Speed final -> Vfy`,
			description: `Since we have the angle and the speed, we can use sin to derive Vfy`,
			takes: [sf, af],
			gives: vfy,

			formula: product(sf, sin(af))
		}, {
			title: `Mass + Acceleration -> Force (X)`,
			description: `Since we have the mass and acceleration, we can use the formula for force to find the force in the x direction.`,
			takes: [m, ax],
			gives: fx,
			formula: product(m, ax)
		}, {
			title: `Mass + Acceleration -> Force (Y)`,
			description: `Since we have the mass and acceleration, we can use the formula for force to find the force in the y direction.`,
			takes: [m, ay],
			gives: fy,
			formula: product(m, ay)
		}, {
			title: `Force + Acceleration -> Mass (X)`,
			description: `Since we have the force and acceleration, we can use the formula for mass to find the mass.`,
			takes: [fx, ax],
			gives: m,
			formula: divide(fx, ax)
		}, {
			title: `Force + Acceleration -> Mass (Y)`,
			description: `Since we have the force and acceleration, we can use the formula for mass to find the mass.`,
			takes: [fy, ay],
			gives: m,
			formula: divide(fy, ay)
		}, {
			title: `Force + Mass -> Acceleration (X)`,
			description: `Since we have the force and mass, we can use the formula for acceleration to find the acceleration in the x direction.`,
			takes: [fx, m],
			gives: ax,
			formula: divide(fx, m)
		}, {
			title: `Force + Mass -> Acceleration (Y)`,
			description: `Since we have the force and mass, we can use the formula for acceleration to find the acceleration in the y direction.`,
			takes: [fy, m],
			gives: ay,
			formula: divide(fy, m)
		}],
	implicits: {
		ax: 0,
		ay: -10,
		viy: 0,
		vix: 0
	},
	warnings: [
		{
			id: 'negative-displacement',
			impl(variables) {
				if ((variables.get('dy') ?? 0) > 0) {
					return {
						text: 'The displacement is positive',
						actions: [
							{
								text: 'Flip the direction',
								set: {dy: -variables.get('dy')!},
								primary: true
							}
						]
					}
				}
			}
		},
		{
			id: 'negative-accel',
			impl(variables) {
				if ((variables.get('ay') ?? 0) > 0) {
					return {
						text: 'The acceleration is positive',
						actions: [
							{
								text: 'Flip the direction',
								set: {ay: -variables.get('ay')!},
								primary: true
							}
						]
					}
				}
			}
		},
		{
			id: 'realistic-gravity',
			impl(variables) {
				if ((variables.get('ay') ?? -10) !== -10) {
					return {
						text: 'The acceleration is not -10 m/s², which is the acceleration used in physics problems',
						actions: [
							{
								text: 'Set acceleration to -10 m/s²',
								set: {ay: -10},
								primary: true
							}
						]
					}
				}
			}
		}
	]
};