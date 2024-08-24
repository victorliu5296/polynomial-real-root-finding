"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluatePolynomial = void 0;
/**
 * Evaluates the polynomial at a specified value using the Horner method.
 */
function evaluatePolynomial(poly, x) {
    let result = 0;
    for (let i = poly.length - 1; i >= 0; i--) {
        result = result * x + poly[i];
    }
    return result;
}
exports.evaluatePolynomial = evaluatePolynomial;
//# sourceMappingURL=evaluation.js.map