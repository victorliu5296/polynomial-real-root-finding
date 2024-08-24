import { Interval } from './types';
/**
 * Finds a root of the function within the specified Interval using the bisection method.
 * @param func The function whose roots we are trying to refine.
 * @param interval The OPEN interval to search for a root.
 * @param tolerance The tolerance for convergence. The method aims to find a root such that the size of the final interval is less than or equal to this value. Default is 1e-5.
 * @param maxIterations The maximum number of iterations to perform. This prevents the method from running indefinitely. Default is 100.
 * @returns Returns bound if length 0, otherwise the approximate position of the root
 * within the specified interval, determined to be within the specified tolerance,
 * or NaN if the root cannot be found within the given number of iterations.
 * @throws {Error} Thrown if the initial interval does not contain a root.
 */
export declare function refineRootIntervalBisection(func: (x: number) => number, interval: Interval, tolerance?: number, maxIterations?: number): number;
/**
 * Finds a root of the function within the specified OPEN interval using the bisection method.
 * @param func The function whose roots we are trying to refine.
 * @param leftBound The EXCLUDED left boundary of the interval to search for a root.
 * @param rightBound The EXCLUDED right boundary of the interval to search for a root.
 * @param tolerance The tolerance for convergence. The method aims to find a root such that the size of the final interval is less than or equal to this value. Default is 1e-5.
 * @param maxIterations The maximum number of iterations to perform. This prevents the method from running indefinitely. Default is 100.
 * @returns The approximate position of the root within the specified interval, determined to be within the specified tolerance, or NaN if the root cannot be found within the given number of iterations.
 * @throws {Error} Thrown if the initial interval does not contain a root.
 */
export declare function refineRootIntervalBisectionBounds(func: (x: number) => number, leftBound: number, rightBound: number, tolerance?: number, maxIterations?: number): number;
