"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isolatePositiveRealRootsContinuedFractions = exports.isolatePositiveRealRootsBisection = void 0;
const operations_1 = require("../polynomial/operations");
const rootBounds_1 = require("../polynomial/rootBounds");
const transformations_1 = require("../polynomial/transformations");
const operations_2 = require("../mobius/operations");
const evaluation_1 = require("../polynomial/evaluation");
/**
 * Isolates the positive real roots of a polynomial using the bisection method and Descartes' rule of signs.
 * @param polynomial The polynomial to find the positive real roots of.
 * @param maxIterations The maximum number of iterations to perform (default: 50).
 * @returns A list of intervals, each containing a single positive real root.
 */
function isolatePositiveRealRootsBisection(polynomial, maxIterations = 50) {
    // Validate input
    if (polynomial.length === 0) {
        throw new Error("The polynomial cannot be empty.");
    }
    if (polynomial.some(coeff => isNaN(coeff))) {
        throw new Error("The polynomial coefficients cannot contain NaN.");
    }
    if (!hasStrictlyPositiveRoots(polynomial)) {
        if (polynomial[0] === 0) {
            return [[0, 0]];
        }
        return [];
    }
    // Process polynomial
    const squareFreePolynomial = (0, operations_1.makeSquareFree)(polynomial);
    const positiveUpperBound = (0, rootBounds_1.lmqPositiveUpperBound)(squareFreePolynomial);
    const horizontallyShrunkenPolynomial = (0, transformations_1.scaleInput)(squareFreePolynomial, positiveUpperBound);
    const initialMobius = (0, operations_2.createMobiusTransformation)(positiveUpperBound, 0, 0, 1);
    const initialSignVariationCount = countSignVariations(horizontallyShrunkenPolynomial);
    const tasks = [[horizontallyShrunkenPolynomial, initialMobius, initialSignVariationCount]];
    const isolatingIntervals = [];
    for (let iteration = 0; iteration < maxIterations && tasks.length > 0; iteration++) {
        if (iteration === maxIterations) {
            return isolatingIntervals.length === 0 ? [] : isolatingIntervals;
        }
        const [currentPolynomial, currentMobius, currentSignVariationCount] = tasks.shift();
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
                const originalMidpoint = (0, operations_2.evaluateAt)(currentMobius, 0.5);
                let foundRootAtMidpoint = 0;
                if ((0, evaluation_1.evaluatePolynomial)(horizontallyShrunkenPolynomial, originalMidpoint) === 0) {
                    addIntervalSort(isolatingIntervals, [originalMidpoint, originalMidpoint]);
                    foundRootAtMidpoint = 1;
                }
                // Left half
                const leftHalfPolynomial = (0, transformations_1.scaleInputInReverseOrder)(currentPolynomial, 2);
                const leftHalfVariations = countSignVariationsInUnitInterval(leftHalfPolynomial);
                const leftMobius = (0, operations_2.scaleInput)(currentMobius, 0.5);
                if (leftHalfVariations === 1) {
                    addIsolatingInterval(isolatingIntervals, leftMobius, squareFreePolynomial);
                }
                else if (leftHalfVariations > 1) {
                    tasks.push([leftHalfPolynomial, leftMobius, leftHalfVariations]);
                }
                // Right half
                const rightHalfVariations = currentSignVariationCount - foundRootAtMidpoint - leftHalfVariations;
                if (rightHalfVariations === 0) {
                    break;
                }
                const rightHalfPolynomial = (0, transformations_1.taylorShiftBy1)(leftHalfPolynomial);
                const rightMobius = (0, operations_2.taylorShiftBy1)(leftMobius);
                if (rightHalfVariations === 1) {
                    addIsolatingInterval(isolatingIntervals, rightMobius, squareFreePolynomial);
                }
                else if (rightHalfVariations > 1) {
                    tasks.push([rightHalfPolynomial, rightMobius, rightHalfVariations]);
                }
                break;
        }
    }
    return isolatingIntervals;
}
exports.isolatePositiveRealRootsBisection = isolatePositiveRealRootsBisection;
/**
 * Isolates the positive real roots of a polynomial using the continued fractions method and Descartes' rule of signs.
 * @param polynomial The polynomial to find the positive real roots of.
 * @param maxIterations The maximum number of iterations to perform (default: 50).
 * @returns A list of intervals, each containing a single positive real root.
 */
function isolatePositiveRealRootsContinuedFractions(inputPolynomial, maxIterations = 50) {
    // Validate input
    if (inputPolynomial.length === 0) {
        throw new Error("The input polynomial cannot be empty.");
    }
    if (!hasStrictlyPositiveRoots(inputPolynomial)) {
        return [];
    }
    // Ensure immutability
    const polynomial = [...inputPolynomial];
    const squareFreePolynomial = (0, operations_1.makeSquareFree)(polynomial);
    const initialSignVariationCount = countSignVariations(squareFreePolynomial);
    const tasks = [[squareFreePolynomial.slice(), (0, operations_2.createMobiusTransformation)(1, 0, 0, 1), initialSignVariationCount]];
    const isolatedRootIntervals = [];
    for (let iteration = 0; iteration < maxIterations && tasks.length > 0; iteration++) {
        if (iteration === maxIterations) {
            return isolatedRootIntervals.length === 0 ? [] : isolatedRootIntervals;
        }
        if (isolatedRootIntervals.length > initialSignVariationCount) {
            throw new Error("Something went wrong: found too many positive roots (more than number of sign variations).");
        }
        const [currentPolynomial, currentMobius, variationCount0ToInf] = [...tasks.shift()];
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
        const lowerBound = (0, rootBounds_1.lmqPositiveLowerBound)(currentPolynomial);
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
        const polynomial1ToInf = (0, transformations_1.taylorShiftBy1)(currentPolynomial);
        const mobius1ToInf = (0, operations_2.taylorShiftBy1)(currentMobius);
        // [1,1]
        let foundRootAt1 = 0;
        foundRootAt1 += checkAndHandleRootAtZero(isolatedRootIntervals, polynomial1ToInf, mobius1ToInf) ? 1 : 0;
        const variationCount1ToInf = countSignVariations(polynomial1ToInf);
        if (variationCount1ToInf === 1) {
            addMobiusIntervalAdjusted(isolatedRootIntervals, mobius1ToInf, squareFreePolynomial);
        }
        else if (variationCount1ToInf > 1) {
            tasks.push([polynomial1ToInf, mobius1ToInf, variationCount1ToInf]);
        }
        // ]0, 1[
        const variationCount0To1 = variationCount0ToInf - variationCount1ToInf - foundRootAt1;
        if (variationCount0To1 === 0) {
            continue; // No roots in this interval, avoid extra computation
        }
        const polynomial0To1 = (0, transformations_1.transformedForLowerInterval)(currentPolynomial, 1);
        const mobius0To1 = (0, operations_2.transformedForLowerInterval)(currentMobius, 1);
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
exports.isolatePositiveRealRootsContinuedFractions = isolatePositiveRealRootsContinuedFractions;
// Helper functions
function hasStrictlyPositiveRoots(polynomial) {
    return polynomial.some(coeff => coeff < 0);
}
function handleZeroFunction(isolatedRootIntervals, polynomial) {
    if (polynomial.length === 1 && polynomial[0] === 0) {
        addIntervalSort(isolatedRootIntervals, [0, Infinity]);
        return true;
    }
    return false;
}
function adjustForLowerBound(polynomial, mobius, lowerBound) {
    if (lowerBound >= 1) {
        const transformedPolynomial = (0, transformations_1.taylorShiftBy1)((0, transformations_1.scaleInput)(polynomial, lowerBound));
        const transformedMobius = (0, operations_2.taylorShiftBy1)((0, operations_2.scaleInput)(mobius, lowerBound));
        polynomial.splice(0, polynomial.length, ...transformedPolynomial);
        mobius.splice(0, mobius.length, ...transformedMobius);
    }
}
function checkAndHandleRootAtZero(intervals, polynomial, mobius) {
    if (polynomial[0] !== 0) {
        return false;
    }
    const root = (0, operations_2.evaluateAt)(mobius, 0);
    addIntervalSort(intervals, [root, root]);
    polynomial.shift();
    return true;
}
function addMobiusIntervalAdjusted(isolatedRootIntervals, mobius, initialPolynomial) {
    const mobiusImage = (0, operations_2.positiveDomainImage)(mobius);
    if (mobiusImage[1] === Infinity) {
        const updatedRightBound = (0, rootBounds_1.lmqPositiveUpperBound)(initialPolynomial);
        addIntervalSort(isolatedRootIntervals, [mobiusImage[0], updatedRightBound]);
        return;
    }
    addIntervalSort(isolatedRootIntervals, mobiusImage);
}
function addIsolatingInterval(isolatedRootIntervals, mobius, initialPolynomial) {
    const mobiusImage = (0, operations_2.positiveDomainImage)(mobius);
    if (mobiusImage[1] === Infinity) {
        const updatedRightBound = (0, rootBounds_1.lmqPositiveUpperBound)(initialPolynomial);
        addIntervalSort(isolatedRootIntervals, [mobiusImage[0], updatedRightBound]);
        return;
    }
    addIntervalSort(isolatedRootIntervals, mobiusImage);
}
function addIntervalSort(intervals, newInterval) {
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
        }
        else if (isNewSubintervalOfExisting) {
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
        }
        else if (newLeft >= existingRight) {
            // New interval is completely to the right of the existing interval
            continue;
        }
    }
    intervals.push(newInterval);
}
function countSignVariations(polynomial) {
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
function countSignVariationsInUnitInterval(polynomial) {
    return countSignVariations((0, transformations_1.mapUnitIntervalToPositiveReals)(polynomial));
}
function countSignVariationsInInterval(polynomial, interval) {
    return countSignVariations((0, transformations_1.mapIntervalToPositiveReals)(polynomial, interval));
}
//# sourceMappingURL=realRootIsolation.js.map