import { Polynomial } from "./types";

/**
 * Add two polynomials together
 * @param poly1 First polynomial to add
 * @param poly2 Second polynomial to add
 * @returns The sum of the two polynomials
 */
export function addPolynomials(poly1: Polynomial, poly2: Polynomial): Polynomial {
  const maxLength = Math.max(poly1.length, poly2.length);
  const result: Polynomial = new Array(maxLength).fill(0);

  for (let i = 0; i < maxLength; i++) {
    if (i < poly1.length) result[i] += poly1[i];
    if (i < poly2.length) result[i] += poly2[i];
  }

  return result;
}

/**
 * Create a normalized version of the polynomial (leading coefficient is 1).
 * @param polynomial The polynomial to normalize.
 * @returns A normalized version of the polynomial (leading coefficient is 1).
 */
export function normalizePolynomial(polynomial: Polynomial): Polynomial {
  if (polynomial.length === 0 || Math.abs(polynomial[polynomial.length - 1]) < Number.EPSILON) {
    return [0];
  }

  const scalingFactor = polynomial[polynomial.length - 1];
  return polynomial.map(c => c / scalingFactor);
}

/**
 * Calculates x * P'(x) = x * dP(x)/dx
 * @param polynomial The polynomial to calculate the derivative times x.
 * @returns A new polynomial representing x * dP(x)/dx.
 */
export function derivativeTimesX(polynomial: Polynomial): Polynomial {
  return polynomial.map((c, i) => c * i);
}

/**
 * Calculates the derivative of the polynomial.
 * @param polynomial The polynomial to calculate the derivative of.
 * @returns A new polynomial representing the derivative of the original polynomial.
 */
export function polynomialDerivative(polynomial: Polynomial): Polynomial {
  if (polynomial.length <= 1) return [0];

  return polynomial.slice(1).map((c, i) => c * (i + 1));
}

/**
 * Shifts the polynomial coefficients by one degree lower, effectively removing the constant term.
 * This operation creates a new polynomial where each coefficient's degree is lowered by one,
 * and the constant term is removed from the array.
 * For example, if the polynomial was 3 + 2X + X^2, it becomes 2 + X after the shift.
 * @param polynomial The polynomial to shift the coefficients of.
 * @returns A new polynomial with coefficients shifted by one degree lower.
 */
export function shiftCoefficientsBy1(polynomial: Polynomial): Polynomial {
  if (polynomial.length <= 1) {
    // If there's only a constant term (or none), return a polynomial that represents 0.
    return [0];
  }

  // Return a new polynomial with the coefficients starting from index 1 (skip the constant term).
  return polynomial.slice(1);
}

/**
 * Generates a square-free version of the polynomial by removing any repeated roots.
 * @param polynomial The polynomial to make square-free.
 * @returns A new polynomial that is square-free.
 */
export function makeSquareFree(polynomial: Polynomial): Polynomial {
  const derivative = polynomialDerivative(polynomial);
  const gcd = polynomialGCD(polynomial, derivative);

  // If the GCD is a constant, the original polynomial is already square-free.
  if (gcd.length === 1 && Math.abs(gcd[0] - 1) < Number.EPSILON) {
    return polynomial;
  }

  const [squareFree] = polynomialDivision(polynomial, gcd);
  return squareFree;
}

/**
 * Divides one polynomial by another, returning the quotient and remainder.
 * @param dividend The polynomial to be divided.
 * @param divisor The polynomial to divide by.
 * @returns An array containing the quotient and remainder polynomials.
 * @throws {Error} Thrown when attempting to divide by a zero polynomial.
 */
export function polynomialDivision(dividend: Polynomial, divisor: Polynomial): [Polynomial, Polynomial] {
  if (divisor.every(coefficient => Math.abs(coefficient) < Number.EPSILON)) {
    throw new Error("Attempted to divide by a zero polynomial.");
  }

  const lenDiff = dividend.length - divisor.length;
  if (lenDiff < 0) {
    // When dividend's degree is less than divisor's, quotient is 0, and remainder is the dividend.
    return [[0], dividend];
  }

  const quotientCoeffs: number[] = [];
  const remainderCoeffs = [...dividend];
  const normalizer = divisor[divisor.length - 1];

  for (let i = 0; i <= lenDiff; i++) {
    // Calculate the scale factor for the divisor to subtract from the dividend
    const scale = remainderCoeffs[remainderCoeffs.length - 1] / normalizer;
    quotientCoeffs.unshift(scale); // Insert at the beginning to maintain the order from highest to lowest degree

    // Subtract the scaled divisor from the remainder
    for (let j = 0; j < divisor.length; j++) {
      const remainderIndex = remainderCoeffs.length - divisor.length + j;
      if (remainderIndex < remainderCoeffs.length) {
        remainderCoeffs[remainderIndex] -= scale * divisor[j];
      }
    }

    // Remove the last element of the remainder as it's been fully processed
    remainderCoeffs.pop();
  }

  // Trim leading zeros from the remainder
  while (remainderCoeffs.length > 1 && Math.abs(remainderCoeffs[remainderCoeffs.length - 1]) < Number.EPSILON) {
    remainderCoeffs.pop();
  }

  // Ensure at least one zero remains if the remainder is fully divided
  if (remainderCoeffs.length === 0) {
    remainderCoeffs.push(0);
  }

  return [quotientCoeffs, remainderCoeffs];
}

/**
 * Calculates the greatest common divisor (GCD) of two polynomials.
 * @param a The first polynomial.
 * @param b The second polynomial.
 * @param tolerance The tolerance for the remainder of the polynomial division. Default is 1e-7.
 * @returns The GCD of the two polynomials.
 * @remarks Implements the Euclidean algorithm tailored for polynomials.
 */
export function polynomialGCD(a: Polynomial, b: Polynomial, tolerance: number = 1e-7): Polynomial {
  while (b.length > 1 || Math.abs(b[0]) > tolerance) {
    const [, remainder] = polynomialDivision(a, b);
    a = b;
    b = remainder;
  }

  // Normalize the leading coefficient to 1 for the GCD.
  return normalizePolynomial(a);
}