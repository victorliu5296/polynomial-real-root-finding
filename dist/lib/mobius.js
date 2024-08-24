"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobiusTransformation = void 0;
class MobiusTransformation {
    constructor(numeratorCoefficient, numeratorConstant, denominatorCoefficient, denominatorConstant) {
        this.numeratorCoefficient = numeratorCoefficient;
        this.numeratorConstant = numeratorConstant;
        this.denominatorCoefficient = denominatorCoefficient;
        this.denominatorConstant = denominatorConstant;
    }
    static identity() {
        return new MobiusTransformation(1, 0, 0, 1);
    }
    processUnitInterval() {
        return new MobiusTransformation(this.numeratorConstant, this.numeratorConstant + this.numeratorCoefficient, this.denominatorConstant, this.denominatorConstant + this.denominatorCoefficient);
    }
    transformedForLowerInterval(shift) {
        const newA = this.numeratorConstant;
        const newB = this.numeratorConstant + shift * this.numeratorCoefficient;
        const newC = this.denominatorConstant;
        const newD = this.denominatorConstant + shift * this.denominatorCoefficient;
        return new MobiusTransformation(newA, newB, newC, newD);
    }
    evaluateAt(x) {
        const denominator = this.denominatorCoefficient * x + this.denominatorConstant;
        if (Math.abs(denominator) < Number.EPSILON) {
            const numerator = this.numeratorCoefficient * x + this.numeratorConstant;
            if (numerator > 0)
                return Infinity;
            if (numerator < 0)
                return -Infinity;
        }
        return (this.numeratorCoefficient * x + this.numeratorConstant) / denominator;
    }
    positiveDomainImage() {
        if (this.denominatorCoefficient === 0 && this.denominatorConstant === 0) {
            return { leftBound: 0, rightBound: Infinity };
        }
        const bound1 = this.numeratorConstant / this.denominatorConstant;
        const bound2 = this.numeratorCoefficient / this.denominatorCoefficient;
        return {
            leftBound: Math.min(bound1, bound2),
            rightBound: Math.max(bound1, bound2),
        };
    }
    unitIntervalImage() {
        if (this.denominatorCoefficient === 0 && this.denominatorConstant === 0) {
            return { leftBound: 0, rightBound: Infinity };
        }
        const bound1 = this.numeratorConstant / this.denominatorConstant;
        const bound2 = (this.numeratorCoefficient + this.numeratorConstant) /
            (this.denominatorCoefficient + this.denominatorConstant);
        return {
            leftBound: Math.min(bound1, bound2),
            rightBound: Math.max(bound1, bound2),
        };
    }
    taylorShiftBy1() {
        return new MobiusTransformation(this.numeratorCoefficient, this.numeratorConstant + this.numeratorCoefficient, this.denominatorCoefficient, this.denominatorConstant + this.denominatorCoefficient);
    }
    taylorShift(shift) {
        return new MobiusTransformation(this.numeratorCoefficient, this.numeratorConstant + shift * this.numeratorCoefficient, this.denominatorCoefficient, this.denominatorConstant + shift * this.denominatorCoefficient);
    }
    reciprocalInput() {
        return new MobiusTransformation(this.numeratorConstant, this.numeratorCoefficient, this.denominatorConstant, this.denominatorCoefficient);
    }
    scaleInput(factor) {
        return new MobiusTransformation(this.numeratorCoefficient * factor, this.numeratorConstant, this.denominatorCoefficient * factor, this.denominatorConstant);
    }
}
exports.MobiusTransformation = MobiusTransformation;
//# sourceMappingURL=mobius.js.map