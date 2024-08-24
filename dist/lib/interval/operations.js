"use strict";
/**
 * Open-closed interval ]a,b] due to Budan's theorem's statements
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.containsSingleRoot = exports.containsValue = exports.getLength = exports.getRightBound = exports.getLeftBound = exports.createInterval = void 0;
function createInterval(leftBound, rightBound) {
    if (isNaN(leftBound) || isNaN(rightBound)) {
        throw new Error("Bounds cannot be NaN.");
    }
    if (leftBound > rightBound) {
        return [rightBound, leftBound];
    }
    else {
        return [leftBound, rightBound];
    }
}
exports.createInterval = createInterval;
function getLeftBound(interval) {
    return interval[0];
}
exports.getLeftBound = getLeftBound;
function getRightBound(interval) {
    return interval[1];
}
exports.getRightBound = getRightBound;
function getLength(interval) {
    return Math.abs(interval[1] - interval[0]);
}
exports.getLength = getLength;
function containsValue(interval, value) {
    if (isNaN(value)) {
        throw new Error("Value cannot be NaN.");
    }
    return value >= interval[0] && value <= interval[1];
}
exports.containsValue = containsValue;
/**
 * Checks if the interval contains an odd number of roots of the given continuous function.
 * @param func The function to check for roots.
 * @returns True if the interval contains an odd number of roots, otherwise false.
 */
function containsSingleRoot(interval, func) {
    // Checking sign change as a necessary condition for a root in the interval
    const valueAtLeft = func(interval[0]);
    const valueAtRight = func(interval[1]);
    // If the signs are different, there is at least one root in the interval, odd number of roots
    return Math.sign(valueAtLeft) !== Math.sign(valueAtRight);
}
exports.containsSingleRoot = containsSingleRoot;
//# sourceMappingURL=operations.js.map