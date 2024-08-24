import { Polynomial } from '../polynomial/types';
import { makeSquareFree } from '../polynomial/operations';
import { lmqPositiveUpperBound, lmqPositiveLowerBound } from '../polynomial/rootBounds';
import { scaleInput, scaleInputInReverseOrder, taylorShiftBy1, mapIntervalToPositiveReals, mapUnitIntervalToPositiveReals, transformedForLowerInterval } from '../polynomial/transformations';
import { Interval } from '../interval/types';
import { createMobiusTransformation, evaluateAt, positiveDomainImage, scaleInput as mobiusScaleInput, taylorShiftBy1 as mobiusTaylorShiftBy1, transformedForLowerInterval as mobiusTransformedForLowerInterval } from '../mobius/operations';
import { evaluatePolynomial } from '../polynomial/evaluation';
import { MobiusTransformation } from '../mobius/types';

/**
 * Isolates the positive real roots of a polynomial using the bisection method and Descartes' rule of signs.
 * @param polynomial The polynomial to find the positive real roots of.
 * @param maxIterations The maximum number of iterations to perform (default: 50).
 * @returns A list of intervals, each containing a single positive real root.
 */
export function isolatePositiveRealRootsBisection(polynomial: Polynomial, maxIterations = 50): Interval[] {
  // Validate input
  if (polynomial.length === 0) {
    throw new Error("The polynomial cannot be empty.");
  }
  if (polynomial.some(coeff => isNaN(coeff))) {
    throw new Error("The polynomial coefficients cannot contain NaN.");
  }
  if (!hasStrictlyPositiveRoots(polynomial)) {
    if (polynomial[0] === 0) {
      return [[0,0]];
    }
    return [];
  }

  // Process polynomial
  const squareFreePolynomial = makeSquareFree(polynomial);
  const positiveUpperBound = lmqPositiveUpperBound(squareFreePolynomial);
  const horizontallyShrunkenPolynomial = scaleInput(squareFreePolynomial, positiveUpperBound);
  const initialMobius = createMobiusTransformation(positiveUpperBound, 0, 0, 1);
  const initialSignVariationCount = countSignVariations(horizontallyShrunkenPolynomial);

  const tasks: [Polynomial, MobiusTransformation, number][] = [[horizontallyShrunkenPolynomial, initialMobius, initialSignVariationCount]];
  const isolatingIntervals: Interval[] = [];

  for (let iteration = 0; iteration < maxIterations && tasks.length > 0; iteration++) {
    if (iteration === maxIterations) {
      return isolatingIntervals.length === 0 ? [] : isolatingIntervals;
    }

    const [currentPolynomial, currentMobius, currentSignVariationCount] = tasks.shift()!;

    switch (currentSignVariationCount) {
      case 0:
        // No roots in this interval
        break;
      case 1:
        // One root in this interval, add to the list
        addIsolatingInterval(isolatingIntervals, currentMobius, squareFreePolynomial);
        break;
      default:
        // More than one root, split the interval and add both halves to the queue
        // Check midpoint for root
        const originalMidpoint = evaluateAt(currentMobius, 0.5);
        let foundRootAtMidpoint = 0;
        if (evaluatePolynomial(horizontallyShrunkenPolynomial, originalMidpoint) === 0) {
          addIntervalSort(isolatingIntervals, [originalMidpoint, originalMidpoint]);
          foundRootAtMidpoint = 1;
        }

        // Left half
        const leftHalfPolynomial = scaleInputInReverseOrder(currentPolynomial, 2);
        const leftHalfVariations = countSignVariationsInUnitInterval(leftHalfPolynomial);
        const leftMobius = mobiusScaleInput(currentMobius, 0.5);
        if (leftHalfVariations === 1) {
          addIsolatingInterval(isolatingIntervals, leftMobius, squareFreePolynomial);
        } else if (leftHalfVariations > 1) {
          tasks.push([leftHalfPolynomial, leftMobius, leftHalfVariations]);
        }

        // Right half
        const rightHalfVariations = currentSignVariationCount - foundRootAtMidpoint - leftHalfVariations;
        if (rightHalfVariations === 0) {
          break;
        }
        const rightHalfPolynomial = taylorShiftBy1(leftHalfPolynomial);
        const rightMobius = mobiusTaylorShiftBy1(leftMobius);
        if (rightHalfVariations === 1) {
          addIsolatingInterval(isolatingIntervals, rightMobius, squareFreePolynomial);
        } else if (rightHalfVariations > 1) {
          tasks.push([rightHalfPolynomial, rightMobius, rightHalfVariations]);
        }

        break;
    }
  }

  return isolatingIntervals;
}

/**
 * Isolates the positive real roots of a polynomial using the continued fractions method and Descartes' rule of signs.
 * @param polynomial The polynomial to find the positive real roots of.
 * @param maxIterations The maximum number of iterations to perform (default: 50).
 * @returns A list of intervals, each containing a single positive real root.
 */
export function isolatePositiveRealRootsContinuedFractions(inputPolynomial: Polynomial, maxIterations = 50): Interval[] {
  // Validate input
  if (inputPolynomial.length === 0) {
    throw new Error("The input polynomial cannot be empty.");
  }
  if (!hasStrictlyPositiveRoots(inputPolynomial)) {
    return [];
  }
  
  // Ensure immutability
  const polynomial = [...inputPolynomial];
  const squareFreePolynomial = makeSquareFree(polynomial);
  const initialSignVariationCount = countSignVariations(squareFreePolynomial);
  const tasks: [Polynomial, MobiusTransformation, number][] = [[squareFreePolynomial.slice(), createMobiusTransformation(1, 0, 0, 1), initialSignVariationCount]];
  const isolatedRootIntervals: Interval[] = [];

  for (let iteration = 0; iteration < maxIterations && tasks.length > 0; iteration++) {
    if (iteration === maxIterations) {
      return isolatedRootIntervals.length === 0 ? [] : isolatedRootIntervals;
    }

    if (isolatedRootIntervals.length > initialSignVariationCount) {
      throw new Error("Something went wrong: found too many positive roots (more than number of sign variations).");
    }

    const [currentPolynomial, currentMobius, variationCount0ToInf] = [...tasks.shift()!];

    // Handle edge cases
    if (currentPolynomial.length === 0) {
      throw new Error("The current polynomial cannot be empty.");
    }
    if (handleZeroFunction(isolatedRootIntervals, currentPolynomial)) {
      break;
    }
    if (currentPolynomial.some(coeff => isNaN(coeff))) {
      throw new Error("The polynomial coefficients cannot contain NaN.");
    }

    // Main algorithm
    const lowerBound = lmqPositiveLowerBound(currentPolynomial);
    adjustForLowerBound(currentPolynomial, currentMobius, lowerBound);

    // Divide by x if needed (input polynomial is square-free, so only once is OK)
    checkAndHandleRootAtZero(isolatedRootIntervals, currentPolynomial, currentMobius);

    if (variationCount0ToInf === 0) {
      continue; // No roots, exit
    }
    if (variationCount0ToInf === 1) {
      // 1 root, add to isolated and exit
      addMobiusIntervalAdjusted(isolatedRootIntervals, currentMobius, squareFreePolynomial);
      continue;
    }

    // If var(P) > 1, then proceed to splitting into ]0,1[, [1,1], and ]1,+inf[

    // Starting with ]1,+inf[ because it only requires a Taylor shift, compared to
    // ]0,1[ where it needs a Taylor shift + reversion
    // ]1,+inf[
    const polynomial1ToInf = taylorShiftBy1(currentPolynomial);
    const mobius1ToInf = mobiusTaylorShiftBy1(currentMobius);

    // [1,1]
    let foundRootAt1 = 0;
    foundRootAt1 += checkAndHandleRootAtZero(isolatedRootIntervals, polynomial1ToInf, mobius1ToInf) ? 1 : 0;

    const variationCount1ToInf = countSignVariations(polynomial1ToInf);
    if (variationCount1ToInf === 1) {
      addMobiusIntervalAdjusted(isolatedRootIntervals, mobius1ToInf, squareFreePolynomial);
    } else if (variationCount1ToInf > 1) {
      tasks.push([polynomial1ToInf, mobius1ToInf, variationCount1ToInf]);
    }

    // ]0, 1[
    const variationCount0To1 = variationCount0ToInf - variationCount1ToInf - foundRootAt1;
    if (variationCount0To1 === 0) {
      continue; // No roots in this interval, avoid extra computation
    }
    const polynomial0To1 = transformedForLowerInterval(currentPolynomial, 1);
    const mobius0To1 = mobiusTransformedForLowerInterval(currentMobius, 1);
    if (variationCount0To1 === 1) {
      addMobiusIntervalAdjusted(isolatedRootIntervals, mobius0To1, squareFreePolynomial);
      continue;
    }

    if (Math.abs(polynomial0To1[0]) < Number.EPSILON) {
      polynomial0To1.shift();
    }
    tasks.push([polynomial0To1, mobius0To1, variationCount0To1]);
  }

  return isolatedRootIntervals;
}

// Helper functions

function hasStrictlyPositiveRoots(polynomial: Polynomial): boolean {
  return polynomial.some(coeff => coeff < 0);
}

function handleZeroFunction(isolatedRootIntervals: Interval[], polynomial: Polynomial): boolean {
  if (polynomial.length === 1 && polynomial[0] === 0) {
    addIntervalSort(isolatedRootIntervals, [0, Infinity]);
    return true;
  }
  return false;
}

function adjustForLowerBound(polynomial: Polynomial, mobius: MobiusTransformation, lowerBound: number): void {
  if (lowerBound >= 1) {
    const transformedPolynomial = taylorShiftBy1(scaleInput(polynomial, lowerBound));
    const transformedMobius = mobiusTaylorShiftBy1(mobiusScaleInput(mobius, lowerBound));
    polynomial.splice(0, polynomial.length, ...transformedPolynomial);
    mobius.splice(0, mobius.length, ...transformedMobius);
  }
}

function checkAndHandleRootAtZero(intervals: Interval[], polynomial: Polynomial, mobius: MobiusTransformation): boolean {
  if (polynomial[0] !== 0) {
    return false;
  }

  const root = evaluateAt(mobius, 0);
  addIntervalSort(intervals, [root, root]);
  polynomial.shift();
  return true;
}

function addMobiusIntervalAdjusted(isolatedRootIntervals: Interval[], mobius: MobiusTransformation, initialPolynomial: Polynomial): void {
  const mobiusImage = positiveDomainImage(mobius);
  if (mobiusImage[1] === Infinity) {
    const updatedRightBound = lmqPositiveUpperBound(initialPolynomial);
    addIntervalSort(isolatedRootIntervals, [mobiusImage[0], updatedRightBound]);
    return;
  }

  addIntervalSort(isolatedRootIntervals, mobiusImage);
}

function addIsolatingInterval(isolatedRootIntervals: Interval[], mobius: MobiusTransformation, initialPolynomial: Polynomial): void {
  const mobiusImage = positiveDomainImage(mobius);
  if (mobiusImage[1] === Infinity) {
    const updatedRightBound = lmqPositiveUpperBound(initialPolynomial);
    addIntervalSort(isolatedRootIntervals, [mobiusImage[0], updatedRightBound]);
    return;
  }

  addIntervalSort(isolatedRootIntervals, mobiusImage);
}

function addIntervalSort(intervals: Interval[], newInterval: Interval): void {
  for (let i = 0; i < intervals.length; i++) {
    const existingInterval = intervals[i];
    const isDuplicate = existingInterval[0] === newInterval[0] && existingInterval[1] === newInterval[1];
    if (isDuplicate) {
      return;
    }

    const isExistingSubintervalOfNew = existingInterval[0] > newInterval[0] && existingInterval[1] < newInterval[1];
    const isNewSubintervalOfExisting = newInterval[0] > existingInterval[0] && newInterval[1] < existingInterval[1];

    if (isExistingSubintervalOfNew) {
      return;
    } else if (isNewSubintervalOfExisting) {
      intervals.splice(i, 1);
      i--;
    }
  }

  const [newLeft, newRight] = newInterval;

  for (let i = 0; i < intervals.length; i++) {
    const [existingLeft, existingRight] = intervals[i];

    if (newRight <= existingLeft) {
      // New interval is completely to the left of the existing interval
      intervals.splice(i, 0, newInterval);
      return;
    } else if (newLeft >= existingRight) {
      // New interval is completely to the right of the existing interval
      continue;
    }
  }

  intervals.push(newInterval);
}

function countSignVariations(polynomial: Polynomial): number {
  let signVariations = 0;
  let previousSign = 0;

  for (let i = 0; i < polynomial.length; i++) {
    const coefficient = polynomial[i];

    if (coefficient === 0) {
      continue;
    }

    if (isNaN(coefficient)) {
      throw new Error(`NaN detected in coefficient at index ${i}.\nPolynomial coefficients: ${polynomial.join(", ")}`);
    }

    const currentSign = Math.sign(coefficient);

    if (previousSign !== 0 && currentSign !== previousSign) {
      signVariations++;
    }

    previousSign = currentSign;
  }

  return signVariations;
}

function countSignVariationsInUnitInterval(polynomial: Polynomial): number {
  return countSignVariations(mapUnitIntervalToPositiveReals(polynomial));
}

function countSignVariationsInInterval(polynomial: Polynomial, interval: Interval): number {
  return countSignVariations(mapIntervalToPositiveReals(polynomial, interval));
}