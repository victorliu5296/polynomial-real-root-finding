"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaleInputInReverseOrder = exports.scaleInput = exports.reversed = exports.taylorShift = exports.taylorShiftBy1 = exports.transformedForLowerInterval = exports.mapUnitIntervalToPositiveReals = exports.mapIntervalToPositiveReals = void 0;
/**
 * Map ]a,b[ to ]0,+inf[ by P(x) := (x+1)^n * P((ax+b)/(x+1))
 * @param polynomial The polynomial to transform.
 * @param interval The interval to map from.
 * @returns The new polynomial whose roots are mapped from ]a,b[ to ]0,+inf[
 */
function mapIntervalToPositiveReals(polynomial, interval) {
    const transformedCoefficients = [...polynomial];
    const [leftBound, rightBound] = interval;
    // Step 1: Apply x := x + a
    taylorShift(transformedCoefficients, leftBound);
    // Step 2: Apply x := (b-a)x
    scale(transformedCoefficients, rightBound - leftBound);
    // Step 3: Apply P(x) := x^degree(P) * P(1/x)
    transformedCoefficients.reverse();
    // Step 4: Apply x := x + 1
    taylorShiftBy1(transformedCoefficients);
    return transformedCoefficients;
}
exports.mapIntervalToPositiveReals = mapIntervalToPositiveReals;
/**
 * Map ]0,1[ to ]0,+inf[ by P(x) := x^n * P(1/(x+1))
 * @param polynomial The polynomial to transform.
 * @returns The new polynomial whose roots are mapped from ]0,1[ to ]0,+inf[
 */
function mapUnitIntervalToPositiveReals(polynomial) {
    const transformedCoefficients = [...polynomial];
    // Step 1: Apply P(x) := x^n * P(1/x)
    transformedCoefficients.reverse();
    // Step 2: Apply x := x + 1
    return taylorShiftBy1(transformedCoefficients);
}
exports.mapUnitIntervalToPositiveReals = mapUnitIntervalToPositiveReals;
/**
 * Transforms the polynomial according to the specified transformation: (x+1)^n * P(s / (x+1)).
 * @param polynomial The polynomial to transform.
 * @param scale The scale factor for the transformation.
 * @returns The new polynomial (x+1)^n*P(s/(1+x))
 */
function transformedForLowerInterval(polynomial, scale) {
    const transformedCoefficients = [...polynomial];
    // Step 1: Apply x := sx
    scaleCoefficients(transformedCoefficients, scale);
    // Step 2: Apply P(x) := x^degree(P)*P(1/x)
    transformedCoefficients.reverse();
    // Step 3: Apply x := x+1
    return taylorShiftBy1(transformedCoefficients);
}
exports.transformedForLowerInterval = transformedForLowerInterval;
/**
 * Applies the transformation p(x) := p(x + 1) in a quadratic complexity implementation.
 * @param polynomial The polynomial to transform.
 * @returns The shifted polynomial coefficients.
 */
function taylorShiftBy1(polynomial) {
    const newCoefficients = [...polynomial];
    for (let i = 1; i < newCoefficients.length; i++) {
        for (let k = 0; k < i; k++) {
            // s = 1 so s^k = 1
            newCoefficients[k] += polynomial[i] * binomial(i, k);
        }
    }
    return newCoefficients;
}
exports.taylorShiftBy1 = taylorShiftBy1;
/**
 * Applies the transformation p(x) := p(x + shift) in a quadratic complexity implementation.
 * @param polynomial The polynomial to transform.
 * @param shift The value to shift by, x := x + shift.
 * @returns The shifted polynomial coefficients.
 */
function taylorShift(polynomial, shift) {
    const newCoefficients = [...polynomial];
    for (let i = 1; i < newCoefficients.length; i++) {
        for (let k = 0; k < i; k++) {
            newCoefficients[k] += polynomial[i] * binomial(i, k) * Math.pow(shift, i - k);
        }
    }
    return newCoefficients;
}
exports.taylorShift = taylorShift;
/**
 * Applies the transformation p(x) := x^degree(p) * p(1/x), equivalent to flipping the coefficient list.
 * @param polynomial The polynomial to transform.
 * @returns A new polynomial with coefficients in reversed order.
 */
function reversed(polynomial) {
    return [...polynomial].reverse();
}
exports.reversed = reversed;
/**
 * Applies the transformation x := sx, equivalent to stretching the function horizontally
 * or squishing the x-axis.
 * @param polynomial The polynomial to transform.
 * @param scaleFactor The factor s by which you scale the input.
 * @returns A new polynomial with scaled coefficients.
 */
function scaleInput(polynomial, scaleFactor) {
    return polynomial.map((coefficient, i) => Math.pow(scaleFactor, i) * coefficient);
}
exports.scaleInput = scaleInput;
/**
 * Applies the transformation P(x) := s^n * P(x/s).
 * p_k := s^{n-k} * p_k.
 * @param polynomial The polynomial to transform.
 * @param scaleFactor The scale factor for the transformation.
 * @returns A new polynomial with scaled coefficients.
 */
function scaleInputInReverseOrder(polynomial, scaleFactor) {
    const degree = polynomial.length - 1;
    return polynomial.map((coefficient, i) => Math.pow(scaleFactor, degree - i) * coefficient);
}
exports.scaleInputInReverseOrder = scaleInputInReverseOrder;
function scale(coefficients, scaleFactor) {
    for (let i = 1; i < coefficients.length; i++) {
        coefficients[i] = Math.pow(scaleFactor, i) * coefficients[i];
    }
}
function scaleCoefficients(coefficients, scaleFactor) {
    for (let i = 1; i < coefficients.length; i++) {
        coefficients[i] = Math.pow(scaleFactor, i) * coefficients[i];
    }
}
// Calculate binomial coefficients with caching
const binomialCache = {};
function binomial(n, k) {
    if (k < 0 || k > n)
        return 0;
    if (k === 0 || k === n)
        return 1; // n choose 0 = n choose n = 1
    if (k === 1 || k === n - 1)
        return n; // Handle n choose 1 and n choose n-1
    // Leverage symmetry: \binom{n}{k} = \binom{n}{n-k}
    if (k > n / 2)
        k = n - k;
    const precomputed = [
        // Removed the cases for n = 0, 1, 2, 3 since they're already covered
        [6], // n = 4
        [10], // n = 5
        [15, 20],
        [21, 35],
        [28, 56, 70],
        [36, 84, 126],
        [45, 120, 210, 252], // n = 10
    ];
    if (n <= 10 && k < precomputed[n - 4].length) {
        return precomputed[n - 4][k - 2]; // Adjusted index for n and k (i=0,n=4 and j=0,k=2)
    }
    const cacheKey = `${n},${k}`;
    if (binomialCache[cacheKey]) {
        return binomialCache[cacheKey];
    }
    const value = binomial(n - 1, k - 1) + binomial(n - 1, k);
    binomialCache[cacheKey] = value;
    return value;
}
//# sourceMappingURL=transformations.js.map