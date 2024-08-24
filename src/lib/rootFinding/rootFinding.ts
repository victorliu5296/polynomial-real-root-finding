import { Polynomial } from '../polynomial/types';
import { hasStrictlyPositiveRoots, hasStrictlyNegativeRoots } from '../polynomial';
import { makeSquareFree } from '../polynomial/operations';
import { isolatePositiveRealRootsBisection, isolatePositiveRealRootsContinuedFractions } from './realRootIsolation';
import { refineRootIntervalBisection } from '../interval/bisection';
import { evaluatePolynomial } from '../polynomial/evaluation';
import { scaleInput } from '../polynomial/transformations';

function calculateDecimalPlacesFromPrecision(precision: number): number {
  if (precision <= 0) return 0; // safeguard against non-positive precision
  return -Math.floor(Math.log10(precision));
}

function roundToPrecisionBasedOnDecimal(num: number, precision: number): number {
  const decimalPlaces = calculateDecimalPlacesFromPrecision(precision);
  return parseFloat(num.toFixed(decimalPlaces));
}

/** Performance efficient version (less duplicate function calls by caching results)
 * Finds all real roots of a polynomial with the given precision.
 *
 * @param {Polynomial} polynomial - the polynomial to find roots for
 * @param {number} precision - the precision for finding roots, defaults to 1e-5
 * @return {number[]} an array of all real roots found sorted in increasing order.
 */
export function findAllRealRoots(polynomial: Polynomial, precision: number = 1e-5): number[] {
  const roots: number[] = [];

  if (polynomial.length === 0) {
    throw new Error("The polynomial cannot be empty.");
  }

  const squareFreePolynomial = makeSquareFree(polynomial);

  if (Math.abs(polynomial[0]) < Number.EPSILON) {
    roots.push(0);
    polynomial.splice(0, 1);
  }

  const processRoots = (polynomial: Polynomial, isNegative: boolean = false) => {
    const rootIntervals = isolatePositiveRealRootsContinuedFractions(polynomial);
    const evaluateFunc = (x: number) => evaluatePolynomial(polynomial, x);

    for (const interval of rootIntervals) {
      const rawRoot = refineRootIntervalBisection(evaluateFunc, interval, precision);
      const root = isNegative ? -rawRoot : rawRoot;
      insertRootSorted(roots, roundToPrecisionBasedOnDecimal(root, precision), precision);
    }
  };

  // Find negative roots
  if (hasStrictlyNegativeRoots(squareFreePolynomial)) {
    const negatedPolynomial = scaleInput(squareFreePolynomial, -1);
    processRoots(negatedPolynomial, true);
  }

  // Find positive roots
  if (hasStrictlyPositiveRoots(squareFreePolynomial)) {
    processRoots(squareFreePolynomial);
  }

  return roots;
}

function insertRootSorted(roots: number[], newRoot: number, tolerance: number = 1e-6): void {
  let insertIndex = roots.length;
  for (let i = 0; i < roots.length; i++) {
    // Check if newRoot is considered equal to an existing root within the tolerance.
    if (Math.abs(newRoot - roots[i]) <= tolerance) {
      return; // Do not insert duplicates.
    }
    if (newRoot < roots[i]) {
      insertIndex = i;
      break;
    }
  }
  roots.splice(insertIndex, 0, newRoot);
}

// /** Clean version
//  * Finds all real roots of a polynomial with the given precision.
//  *
//  * @param {Polynomial} polynomial - the polynomial to find roots for
//  * @param {number} precision - the precision for finding roots, defaults to 1e-5
//  * @return {number[]} an array of all real roots found sorted in increasing order.
//  */
// export function findAllRealRoots(polynomial: Polynomial, precision: number = 1e-5): number[] {
//   const roots: number[] = [];

//   // Find negative roots by negating the input
//   const negativeRoots = findStrictlyNegativeRoots(polynomial, precision);
//   roots.push(...negativeRoots);

//   // Check root at zero
//   if (polynomial[0] === 0) {
//     roots.push(0);
//   }
  
//   // Find positive roots
//   const positiveRoots = findStrictlyPositiveRoots(polynomial, precision);
//   roots.push(...positiveRoots); // should already be sorted based on addIntervalSort logic

//   return roots;
// }

export function findStrictlyPositiveRoots(polynomial: Polynomial, precision: number): number[] {
  if (!hasStrictlyPositiveRoots(polynomial)) {
    return [];
  }

  const roots: number[] = [];
  const squareFreePolynomial = makeSquareFree(polynomial);
  const isolatedRootIntervals = isolatePositiveRealRootsContinuedFractions(squareFreePolynomial);
  const evaluateFunc = (x: number) => evaluatePolynomial(squareFreePolynomial, x);

  for (const interval of isolatedRootIntervals) {
    const root = refineRootIntervalBisection(evaluateFunc, interval, precision);
    roots.push(root);
  }

  return roots;
}

export function findStrictlyNegativeRoots(polynomial: Polynomial, precision: number): number[] {
  if (!hasStrictlyNegativeRoots(polynomial)) {
    return [];
  }

  const negatedNegativeRoots: number[] = [];
  const squareFreePolynomial = makeSquareFree(polynomial);
  const negatedPolynomial = scaleInput(squareFreePolynomial, -1);
  const isolatedRootIntervals = isolatePositiveRealRootsContinuedFractions(negatedPolynomial);
  const evaluateFunc = (x: number) => evaluatePolynomial(negatedPolynomial, x);

  for (const interval of isolatedRootIntervals) {
    const root = refineRootIntervalBisection(evaluateFunc, interval, precision);
    negatedNegativeRoots.push(root);
  }

  return negatedNegativeRoots.map(root => -root).sort();
}