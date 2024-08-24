import { Polynomial } from "./types";
/**
 * Add two polynomials together
 * @param poly1 First polynomial to add
 * @param poly2 Second polynomial to add
 * @returns The sum of the two polynomials
 */
export declare function addPolynomials(poly1: Polynomial, poly2: Polynomial): Polynomial;
/**
 * Create a normalized version of the polynomial (leading coefficient is 1).
 * @param polynomial The polynomial to normalize.
 * @returns A normalized version of the polynomial (leading coefficient is 1).
 */
export declare function normalizePolynomial(polynomial: Polynomial): Polynomial;
/**
 * Calculates x * P'(x) = x * dP(x)/dx
 * @param polynomial The polynomial to calculate the derivative times x.
 * @returns A new polynomial representing x * dP(x)/dx.
 */
export declare function derivativeTimesX(polynomial: Polynomial): Polynomial;
/**
 * Calculates the derivative of the polynomial.
 * @param polynomial The polynomial to calculate the derivative of.
 * @returns A new polynomial representing the derivative of the original polynomial.
 */
export declare function polynomialDerivative(polynomial: Polynomial): Polynomial;
/**
 * Shifts the polynomial coefficients by one degree lower, effectively removing the constant term.
 * This operation creates a new polynomial where each coefficient's degree is lowered by one,
 * and the constant term is removed from the array.
 * For example, if the polynomial was 3 + 2X + X^2, it becomes 2 + X after the shift.
 * @param polynomial The polynomial to shift the coefficients of.
 * @returns A new polynomial with coefficients shifted by one degree lower.
 */
export declare function shiftCoefficientsBy1(polynomial: Polynomial): Polynomial;
/**
 * Generates a square-free version of the polynomial by removing any repeated roots.
 * @param polynomial The polynomial to make square-free.
 * @returns A new polynomial that is square-free.
 */
export declare function makeSquareFree(polynomial: Polynomial): Polynomial;
/**
 * Divides one polynomial by another, returning the quotient and remainder.
 * @param dividend The polynomial to be divided.
 * @param divisor The polynomial to divide by.
 * @returns An array containing the quotient and remainder polynomials.
 * @throws {Error} Thrown when attempting to divide by a zero polynomial.
 */
export declare function polynomialDivision(dividend: Polynomial, divisor: Polynomial): [Polynomial, Polynomial];
/**
 * Calculates the greatest common divisor (GCD) of two polynomials.
 * @param a The first polynomial.
 * @param b The second polynomial.
 * @param tolerance The tolerance for the remainder of the polynomial division. Default is 1e-7.
 * @returns The GCD of the two polynomials.
 * @remarks Implements the Euclidean algorithm tailored for polynomials.
 */
export declare function polynomialGCD(a: Polynomial, b: Polynomial, tolerance?: number): Polynomial;
