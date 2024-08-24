import { Polynomial } from '../polynomial/types';
import { Interval } from '../interval/types';
/**
 * Isolates the positive real roots of a polynomial using the bisection method and Descartes' rule of signs.
 * @param polynomial The polynomial to find the positive real roots of.
 * @param maxIterations The maximum number of iterations to perform (default: 50).
 * @returns A list of intervals, each containing a single positive real root.
 */
export declare function isolatePositiveRealRootsBisection(polynomial: Polynomial, maxIterations?: number): Interval[];
/**
 * Isolates the positive real roots of a polynomial using the continued fractions method and Descartes' rule of signs.
 * @param polynomial The polynomial to find the positive real roots of.
 * @param maxIterations The maximum number of iterations to perform (default: 50).
 * @returns A list of intervals, each containing a single positive real root.
 */
export declare function isolatePositiveRealRootsContinuedFractions(inputPolynomial: Polynomial, maxIterations?: number): Interval[];
