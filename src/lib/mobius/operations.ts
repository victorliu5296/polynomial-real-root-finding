import { Interval } from "../interval/types";
import { MobiusTransformation } from "./types";

export function createMobiusTransformation(
  numeratorCoefficient: number,
  numeratorConstant: number,
  denominatorCoefficient: number,
  denominatorConstant: number
): MobiusTransformation {
  return [numeratorCoefficient, numeratorConstant, denominatorCoefficient, denominatorConstant];
}

export function identityMobiusTransformation(): MobiusTransformation {
  return [1, 0, 0, 1];
}

export function processUnitInterval(mobius: MobiusTransformation): MobiusTransformation {
  const [a, b, c, d] = mobius;
  return [b, b + a, d, d + c];
}

export function transformedForLowerInterval(mobius: MobiusTransformation, shift: number): MobiusTransformation {
  const [a, b, c, d] = mobius;
  const newA = b;
  const newB = b + shift * a;
  const newC = d;
  const newD = d + shift * c;

  return [newA, newB, newC, newD];
}

export function evaluateAt(mobius: MobiusTransformation, x: number): number {
  const [a, b, c, d] = mobius;
  const denominator = c * x + d;
  if (Math.abs(denominator) < Number.EPSILON) {
    const numerator = a * x + b;
    if (numerator > 0) return Infinity;
    if (numerator < 0) return -Infinity;
  }
  return (a * x + b) / denominator;
}

export function positiveDomainImage(mobius: MobiusTransformation): Interval {
  const [a, b, c, d] = mobius;
  if (c === 0 && d === 0) {
    return [0, Infinity];
  }
  const bound1 = b / d;
  const bound2 = a / c;

  return [Math.min(bound1, bound2), Math.max(bound1, bound2)];
}

export function unitIntervalImage(mobius: MobiusTransformation): Interval {
  const [a, b, c, d] = mobius;
  if (c === 0 && d === 0) {
    return [0, Infinity];
  }

  const bound1 = b / d;
  const bound2 = (a + b) / (c + d);

  return [Math.min(bound1, bound2), Math.max(bound1, bound2)];
}

export function taylorShiftBy1(mobius: MobiusTransformation): MobiusTransformation {
  const [a, b, c, d] = mobius;
  return [a, b + a, c, d + c];
}

export function taylorShift(mobius: MobiusTransformation, shift: number): MobiusTransformation {
  const [a, b, c, d] = mobius;
  return [a, b + shift * a, c, d + shift * c];
}

export function reciprocalInput(mobius: MobiusTransformation): MobiusTransformation {
  const [a, b, c, d] = mobius;
  return [b, a, d, c];
}

export function scaleInput(mobius: MobiusTransformation, factor: number): MobiusTransformation {
  const [a, b, c, d] = mobius;
  return [a * factor, b, c * factor, d];
}