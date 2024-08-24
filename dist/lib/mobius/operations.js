"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaleInput = exports.reciprocalInput = exports.taylorShift = exports.taylorShiftBy1 = exports.unitIntervalImage = exports.positiveDomainImage = exports.evaluateAt = exports.transformedForLowerInterval = exports.processUnitInterval = exports.identityMobiusTransformation = exports.createMobiusTransformation = void 0;
function createMobiusTransformation(numeratorCoefficient, numeratorConstant, denominatorCoefficient, denominatorConstant) {
    return [numeratorCoefficient, numeratorConstant, denominatorCoefficient, denominatorConstant];
}
exports.createMobiusTransformation = createMobiusTransformation;
function identityMobiusTransformation() {
    return [1, 0, 0, 1];
}
exports.identityMobiusTransformation = identityMobiusTransformation;
function processUnitInterval(mobius) {
    const [a, b, c, d] = mobius;
    return [b, b + a, d, d + c];
}
exports.processUnitInterval = processUnitInterval;
function transformedForLowerInterval(mobius, shift) {
    const [a, b, c, d] = mobius;
    const newA = b;
    const newB = b + shift * a;
    const newC = d;
    const newD = d + shift * c;
    return [newA, newB, newC, newD];
}
exports.transformedForLowerInterval = transformedForLowerInterval;
function evaluateAt(mobius, x) {
    const [a, b, c, d] = mobius;
    const denominator = c * x + d;
    if (Math.abs(denominator) < Number.EPSILON) {
        const numerator = a * x + b;
        if (numerator > 0)
            return Infinity;
        if (numerator < 0)
            return -Infinity;
    }
    return (a * x + b) / denominator;
}
exports.evaluateAt = evaluateAt;
function positiveDomainImage(mobius) {
    const [a, b, c, d] = mobius;
    if (c === 0 && d === 0) {
        return [0, Infinity];
    }
    const bound1 = b / d;
    const bound2 = a / c;
    return [Math.min(bound1, bound2), Math.max(bound1, bound2)];
}
exports.positiveDomainImage = positiveDomainImage;
function unitIntervalImage(mobius) {
    const [a, b, c, d] = mobius;
    if (c === 0 && d === 0) {
        return [0, Infinity];
    }
    const bound1 = b / d;
    const bound2 = (a + b) / (c + d);
    return [Math.min(bound1, bound2), Math.max(bound1, bound2)];
}
exports.unitIntervalImage = unitIntervalImage;
function taylorShiftBy1(mobius) {
    const [a, b, c, d] = mobius;
    return [a, b + a, c, d + c];
}
exports.taylorShiftBy1 = taylorShiftBy1;
function taylorShift(mobius, shift) {
    const [a, b, c, d] = mobius;
    return [a, b + shift * a, c, d + shift * c];
}
exports.taylorShift = taylorShift;
function reciprocalInput(mobius) {
    const [a, b, c, d] = mobius;
    return [b, a, d, c];
}
exports.reciprocalInput = reciprocalInput;
function scaleInput(mobius, factor) {
    const [a, b, c, d] = mobius;
    return [a * factor, b, c * factor, d];
}
exports.scaleInput = scaleInput;
//# sourceMappingURL=operations.js.map