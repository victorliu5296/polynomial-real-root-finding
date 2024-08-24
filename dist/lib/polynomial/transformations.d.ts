import { Interval } from '../interval/types';
import { Polynomial } from './types';
/**
 * Map ]a,b[ to ]0,+inf[ by P(x) := (x+1)^n * P((ax+b)/(x+1))
 * @param polynomial The polynomial to transform.
 * @param interval The interval to map from.
 * @returns The new polynomial whose roots are mapped from ]a,b[ to ]0,+inf[
 */
export declare function mapIntervalToPositiveReals(polynomial: Polynomial, interval: Interval): Polynomial;
/**
 * Map ]0,1[ to ]0,+inf[ by P(x) := x^n * P(1/(x+1))
 * @param polynomial The polynomial to transform.
 * @returns The new polynomial whose roots are mapped from ]0,1[ to ]0,+inf[
 */
export declare function mapUnitIntervalToPositiveReals(polynomial: Polynomial): Polynomial;
/**
 * Transforms the polynomial according to the specified transformation: (x+1)^n * P(s / (x+1)).
 * @param polynomial The polynomial to transform.
 * @param scale The scale factor for the transformation.
 * @returns The new polynomial (x+1)^n*P(s/(1+x))
 */
export declare function transformedForLowerInterval(polynomial: Polynomial, scale: number): Polynomial;
/**
 * Applies the transformation p(x) := p(x + 1) in a quadratic complexity implementation.
 * @param polynomial The polynomial to transform.
 * @returns The shifted polynomial coefficients.
 */
export declare function taylorShiftBy1(polynomial: Polynomial): Polynomial;
/**
 * Applies the transformation p(x) := p(x + shift) in a quadratic complexity implementation.
 * @param polynomial The polynomial to transform.
 * @param shift The value to shift by, x := x + shift.
 * @returns The shifted polynomial coefficients.
 */
export declare function taylorShift(polynomial: Polynomial, shift: number): Polynomial;
/**
 * Applies the transformation p(x) := x^degree(p) * p(1/x), equivalent to flipping the coefficient list.
 * @param polynomial The polynomial to transform.
 * @returns A new polynomial with coefficients in reversed order.
 */
export declare function reversed(polynomial: Polynomial): Polynomial;
/**
 * Applies the transformation x := sx, equivalent to stretching the function horizontally
 * or squishing the x-axis.
 * @param polynomial The polynomial to transform.
 * @param scaleFactor The factor s by which you scale the input.
 * @returns A new polynomial with scaled coefficients.
 */
export declare function scaleInput(polynomial: Polynomial, scaleFactor: number): Polynomial;
/**
 * Applies the transformation P(x) := s^n * P(x/s).
 * p_k := s^{n-k} * p_k.
 * @param polynomial The polynomial to transform.
 * @param scaleFactor The scale factor for the transformation.
 * @returns A new polynomial with scaled coefficients.
 */
export declare function scaleInputInReverseOrder(polynomial: Polynomial, scaleFactor: number): Polynomial;
