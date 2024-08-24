"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findStrictlyNegativeRoots = exports.findStrictlyPositiveRoots = exports.findAllRealRoots = void 0;
const polynomial_1 = require("../polynomial");
const operations_1 = require("../polynomial/operations");
const realRootIsolation_1 = require("./realRootIsolation");
const bisection_1 = require("../interval/bisection");
const evaluation_1 = require("../polynomial/evaluation");
const transformations_1 = require("../polynomial/transformations");
function calculateDecimalPlacesFromPrecision(precision) {
    if (precision <= 0)
        return 0; // safeguard against non-positive precision
    return -Math.floor(Math.log10(precision));
}
function roundToPrecisionBasedOnDecimal(num, precision) {
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
function findAllRealRoots(polynomial, precision = 1e-5) {
    const roots = [];
    if (polynomial.length === 0) {
        throw new Error("The polynomial cannot be empty.");
    }
    const squareFreePolynomial = (0, operations_1.makeSquareFree)(polynomial);
    if (Math.abs(polynomial[0]) < Number.EPSILON) {
        roots.push(0);
        polynomial.splice(0, 1);
    }
    const processRoots = (polynomial, isNegative = false) => {
        const rootIntervals = (0, realRootIsolation_1.isolatePositiveRealRootsContinuedFractions)(polynomial);
        const evaluateFunc = (x) => (0, evaluation_1.evaluatePolynomial)(polynomial, x);
        for (const interval of rootIntervals) {
            const rawRoot = (0, bisection_1.refineRootIntervalBisection)(evaluateFunc, interval, precision);
            const root = isNegative ? -rawRoot : rawRoot;
            insertRootSorted(roots, roundToPrecisionBasedOnDecimal(root, precision), precision);
        }
    };
    // Find negative roots
    if ((0, polynomial_1.hasStrictlyNegativeRoots)(squareFreePolynomial)) {
        const negatedPolynomial = (0, transformations_1.scaleInput)(squareFreePolynomial, -1);
        processRoots(negatedPolynomial, true);
    }
    // Find positive roots
    if ((0, polynomial_1.hasStrictlyPositiveRoots)(squareFreePolynomial)) {
        processRoots(squareFreePolynomial);
    }
    return roots;
}
exports.findAllRealRoots = findAllRealRoots;
function insertRootSorted(roots, newRoot, tolerance = 1e-6) {
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
function findStrictlyPositiveRoots(polynomial, precision) {
    if (!(0, polynomial_1.hasStrictlyPositiveRoots)(polynomial)) {
        return [];
    }
    const roots = [];
    const squareFreePolynomial = (0, operations_1.makeSquareFree)(polynomial);
    const isolatedRootIntervals = (0, realRootIsolation_1.isolatePositiveRealRootsContinuedFractions)(squareFreePolynomial);
    const evaluateFunc = (x) => (0, evaluation_1.evaluatePolynomial)(squareFreePolynomial, x);
    for (const interval of isolatedRootIntervals) {
        const root = (0, bisection_1.refineRootIntervalBisection)(evaluateFunc, interval, precision);
        roots.push(root);
    }
    return roots;
}
exports.findStrictlyPositiveRoots = findStrictlyPositiveRoots;
function findStrictlyNegativeRoots(polynomial, precision) {
    if (!(0, polynomial_1.hasStrictlyNegativeRoots)(polynomial)) {
        return [];
    }
    const negatedNegativeRoots = [];
    const squareFreePolynomial = (0, operations_1.makeSquareFree)(polynomial);
    const negatedPolynomial = (0, transformations_1.scaleInput)(squareFreePolynomial, -1);
    const isolatedRootIntervals = (0, realRootIsolation_1.isolatePositiveRealRootsContinuedFractions)(negatedPolynomial);
    const evaluateFunc = (x) => (0, evaluation_1.evaluatePolynomial)(negatedPolynomial, x);
    for (const interval of isolatedRootIntervals) {
        const root = (0, bisection_1.refineRootIntervalBisection)(evaluateFunc, interval, precision);
        negatedNegativeRoots.push(root);
    }
    return negatedNegativeRoots.map(root => -root).sort();
}
exports.findStrictlyNegativeRoots = findStrictlyNegativeRoots;
//# sourceMappingURL=rootFinding.js.map