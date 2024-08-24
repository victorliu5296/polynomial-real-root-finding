"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.polynomialToString = exports.addPolynomials = exports.evaluatePolynomial = void 0;
function evaluatePolynomial(poly, x) {
    let result = 0;
    for (let i = poly.length - 1; i >= 0; i--) {
        result = result * x + poly[i];
    }
    return result;
}
exports.evaluatePolynomial = evaluatePolynomial;
function addPolynomials(poly1, poly2) {
    const maxLength = Math.max(poly1.length, poly2.length);
    const result = new Array(maxLength).fill(0);
    for (let i = 0; i < maxLength; i++) {
        if (i < poly1.length)
            result[i] += poly1[i];
        if (i < poly2.length)
            result[i] += poly2[i];
    }
    return result;
}
exports.addPolynomials = addPolynomials;
function polynomialToString(poly) {
    const terms = poly.map((coeff, index) => {
        if (coeff === 0) {
            return '';
        }
        const sign = coeff >= 0 ? '+' : '-';
        const absCoeff = Math.abs(coeff);
        const variable = index === 0 ? '' : `x^${index}`;
        return `${sign} ${absCoeff}${variable}`;
    }).filter(term => term !== '');
    return terms.join(' ').trim().replace(/^\+/, '').trim();
}
exports.polynomialToString = polynomialToString;
//# sourceMappingURL=polynomial.js.map