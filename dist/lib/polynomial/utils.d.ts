import { Polynomial } from './types';
/**
 * Creates a new polynomial from the given coefficients.
 * @param coefficients The coefficients of the polynomial in increasing order of degree.
 * @returns The created polynomial.
 * @throws {Error} Thrown when the coefficients list is null, empty, or contains NaN values.
 */
export declare function createPolynomial(coefficients: number[]): Polynomial;
/**
 * Removes leading zeros (trailing zeroes in the array) from a polynomial.
 * @param polynomial The polynomial to trim.
 * @returns The trimmed polynomial.
 */
export declare function trimLeadingZeroes(polynomial: Polynomial): Polynomial;
export declare function hasStrictlyPositiveRoots(polynomial: Polynomial): boolean;
export declare function hasStrictlyNegativeRoots(polynomial: Polynomial): boolean;
/**
 * Updates the coefficient at a specified index within the polynomial.
 * @param polynomial The polynomial to update.
 * @param index The zero-based index where the coefficient is to be updated.
 * @param newValue The new value of the coefficient at the specified index.
 * @throws {Error} Thrown when the index is outside the bounds of the polynomial.
 */
export declare function updatePolynomialCoefficient(polynomial: Polynomial, index: number, newValue: number): void;
/**
 * Converts a polynomial to its string representation.
 * @param polynomial The polynomial to convert.
 * @returns The string representation of the polynomial.
 */
export declare function polynomialToString(polynomial: Polynomial): string;
