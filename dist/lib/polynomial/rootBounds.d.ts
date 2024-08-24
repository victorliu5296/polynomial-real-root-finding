import { Polynomial } from './types';
/**
 * Calculates the Local-Max-Quadratic (LMQ) bound for the positive roots of a polynomial.
 * This method provides an upper bound estimate based on the polynomial's coefficients.
 * @param polynomial The polynomial to calculate the LMQ upper bound for.
 * @returns The LMQ bound as a number, representing an upper bound on the polynomial's positive roots.
 * @throws {Error} Thrown when the polynomial is null or empty.
 */
export declare function lmqPositiveUpperBound(polynomial: Polynomial): number;
/**
 * Calculates the Local-Max-Quadratic (LMQ) lower bound for the positive roots of a polynomial
 * by transforming the polynomial P(x) -> x^n*P(1/x) and then computing the upper bound of the transformed polynomial.
 * @param polynomial The polynomial to calculate the LMQ lower bound for.
 * @returns The LMQ lower bound as a number, representing a lower bound on the polynomial's positive roots.
 * @throws {Error} Thrown when the polynomial is null or empty.
 */
export declare function lmqPositiveLowerBound(polynomial: Polynomial): number;
