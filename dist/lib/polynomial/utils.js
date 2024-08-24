"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.polynomialToString = exports.updatePolynomialCoefficient = exports.hasStrictlyNegativeRoots = exports.hasStrictlyPositiveRoots = exports.trimLeadingZeroes = exports.createPolynomial = void 0;
/**
 * Creates a new polynomial from the given coefficients.
 * @param coefficients The coefficients of the polynomial in increasing order of degree.
 * @returns The created polynomial.
 * @throws {Error} Thrown when the coefficients list is null, empty, or contains NaN values.
 */
function createPolynomial(coefficients) {
    if (coefficients === null || coefficients.length === 0) {
        throw new Error("Coefficients list cannot be null or empty.");
    }
    for (let i = 0; i < coefficients.length; i++) {
        const coefficient = coefficients[i];
        if (isNaN(coefficient)) {
            throw new Error(`NaN detected in coefficient at index ${i}.\nPolynomial coefficients: ${coefficients.join(", ")}`);
        }
    }
    return trimLeadingZeroes(coefficients);
}
exports.createPolynomial = createPolynomial;
/**
 * Removes leading zeros (trailing zeroes in the array) from a polynomial.
 * @param polynomial The polynomial to trim.
 * @returns The trimmed polynomial.
 */
function trimLeadingZeroes(polynomial) {
    let lastIndex = polynomial.length - 1;
    // If the polynomial is empty, return a polynomial that represents 0.
    if (polynomial.length === 0) {
        return [0];
    }
    // While there are more than one coefficient and the last one is zero, decrement lastIndex
    while (lastIndex > 0 && Math.abs(polynomial[lastIndex]) < Number.EPSILON) {
        lastIndex--;
    }
    // If all coefficients were zero, return a polynomial that represents 0.
    if (lastIndex === 0 && Math.abs(polynomial[0]) < Number.EPSILON) {
        return [0];
    }
    // Return the polynomial up to the last non-zero coefficient
    return polynomial.slice(0, lastIndex + 1);
}
exports.trimLeadingZeroes = trimLeadingZeroes;
function hasStrictlyPositiveRoots(polynomial) {
    return polynomial.some(coeff => coeff < 0);
}
exports.hasStrictlyPositiveRoots = hasStrictlyPositiveRoots;
function hasStrictlyNegativeRoots(polynomial) {
    return polynomial.some(coeff => coeff > 0);
}
exports.hasStrictlyNegativeRoots = hasStrictlyNegativeRoots;
/**
 * Updates the coefficient at a specified index within the polynomial.
 * @param polynomial The polynomial to update.
 * @param index The zero-based index where the coefficient is to be updated.
 * @param newValue The new value of the coefficient at the specified index.
 * @throws {Error} Thrown when the index is outside the bounds of the polynomial.
 */
function updatePolynomialCoefficient(polynomial, index, newValue) {
    if (index < 0 || index >= polynomial.length) {
        throw new Error("Index is out of range.");
    }
    polynomial[index] = newValue;
}
exports.updatePolynomialCoefficient = updatePolynomialCoefficient;
/**
 * Converts a polynomial to its string representation.
 * @param polynomial The polynomial to convert.
 * @returns The string representation of the polynomial.
 */
function polynomialToString(polynomial) {
    const terms = polynomial.map((coeff, index) => {
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
//# sourceMappingURL=utils.js.map