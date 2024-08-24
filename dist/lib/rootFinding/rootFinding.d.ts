import { Polynomial } from '../polynomial/types';
/** Performance efficient version (less duplicate function calls by caching results)
 * Finds all real roots of a polynomial with the given precision.
 *
 * @param {Polynomial} polynomial - the polynomial to find roots for
 * @param {number} precision - the precision for finding roots, defaults to 1e-5
 * @return {number[]} an array of all real roots found sorted in increasing order.
 */
export declare function findAllRealRoots(polynomial: Polynomial, precision?: number): number[];
export declare function findStrictlyPositiveRoots(polynomial: Polynomial, precision: number): number[];
export declare function findStrictlyNegativeRoots(polynomial: Polynomial, precision: number): number[];
