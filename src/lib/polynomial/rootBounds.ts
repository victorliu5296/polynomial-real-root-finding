import { Polynomial } from './types';

/**
 * Calculates the Local-Max-Quadratic (LMQ) bound for the positive roots of a polynomial.
 * This method provides an upper bound estimate based on the polynomial's coefficients.
 * @param polynomial The polynomial to calculate the LMQ upper bound for.
 * @returns The LMQ bound as a number, representing an upper bound on the polynomial's positive roots.
 * @throws {Error} Thrown when the polynomial is null or empty.
 */
export function lmqPositiveUpperBound(polynomial: Polynomial): number {
  // First, the polynomial must have a positive leading coefficient.
  const coefficientCount = polynomial.length;
  let coefficients: number[];
  if (polynomial[coefficientCount - 1] < 0) {
    coefficients = polynomial.map(coeff => -coeff);
  } else {
    coefficients = [...polynomial];
  }

  // Validate input
  if (coefficients.length === 0) {
    throw new Error("The polynomial cannot be empty.");
  }
  if (coefficients.every(coeff => coeff > 0)) {
    // If all coefficients are strictly positive, there will be no positive roots
    return NaN;
  }

  const degree = coefficientCount - 1;
  const usageCounts = new Array(coefficientCount).fill(1);
  let upperBound = Number.NEGATIVE_INFINITY;

  // For each i-th negative coefficient in decreasing order of degree:
  for (let neg_i = degree - 1; neg_i >= 0; neg_i--) {
    // Note: neg_i = i
    // max {a_i < 0}
    if (coefficients[neg_i] >= 0) {
      continue;
    }

    let minRadical = Number.POSITIVE_INFINITY;

    for (let pos_i = neg_i + 1; pos_i <= degree; pos_i++) {
      // Note: pos_i = j
      // min {a_j > 0; j > i}
      if (coefficients[pos_i] <= 0) {
        continue;
      }

      // Pair with j-th preceding (higher degree, j>i) positive coefficients: that is,
      // calculate 2^t_j * |a_i| / a_j where t_j is the number of usages of a_j up to that point, initialized at 1.
      const radical = Math.pow(
        Math.pow(2, usageCounts[pos_i]) * Math.abs(coefficients[neg_i]) / coefficients[pos_i],
        1.0 / (pos_i - neg_i)
      );

      // Then, take the minimum over all j
      minRadical = Math.min(minRadical, radical);

      usageCounts[pos_i]++;
    }

    // Finally, take the maximum of the minimums over i.
    if (minRadical !== Number.POSITIVE_INFINITY) {
      upperBound = Math.max(upperBound, minRadical);
    }
  }

  return upperBound < 0 ? NaN : upperBound;
}

/**
 * Calculates the Local-Max-Quadratic (LMQ) lower bound for the positive roots of a polynomial
 * by transforming the polynomial P(x) -> x^n*P(1/x) and then computing the upper bound of the transformed polynomial.
 * @param polynomial The polynomial to calculate the LMQ lower bound for.
 * @returns The LMQ lower bound as a number, representing a lower bound on the polynomial's positive roots.
 * @throws {Error} Thrown when the polynomial is null or empty.
 */
export function lmqPositiveLowerBound(polynomial: Polynomial): number {
  const coefficientCount = polynomial.length;
  let coefficients: number[];
  if (polynomial[0] < 0) {
    coefficients = polynomial.map(coeff => -coeff);
  } else {
    coefficients = [...polynomial];
  }

  // Validate input
  if (coefficients.length === 0) {
    throw new Error("The polynomial cannot be empty.");
  }

  if (coefficients.every(coeff => coeff > 0)) {
    // If all coefficients are strictly positive, there will be no positive roots
    return NaN;
  }

  const degree = coefficientCount - 1;
  const usageCounts = new Array(coefficientCount).fill(1);
  let maxMinRadical = Number.NEGATIVE_INFINITY;

  // Go in incremental order: from a_0 to a_n, skipping a_0
  // Negative coefficients
  for (let neg_i = 1; neg_i <= degree; neg_i++) {
    if (coefficients[neg_i] >= 0) {
      continue;
    }

    let minRadical = Number.POSITIVE_INFINITY;

    // Positive coefficients
    for (let pos_i = neg_i - 1; pos_i >= 0; pos_i--) {
      // Process every higher degree positive coefficient, so pos_i < neg_i
      if (coefficients[pos_i] <= 0) {
        continue;
      }

      // Compute (-2^t_j * a_i / a_j)^(1 / (j - i))
      const radical = Math.pow(
        Math.pow(2, usageCounts[pos_i]) * Math.abs(coefficients[neg_i]) / coefficients[pos_i],
        1.0 / (neg_i - pos_i)
      );
      minRadical = Math.min(minRadical, radical);

      usageCounts[pos_i]++;
    }

    if (minRadical !== Number.POSITIVE_INFINITY) {
      maxMinRadical = Math.max(maxMinRadical, minRadical);
    }
  }

  // Return the reciprocal of upper bound for the transformed polynomial as the lower bound for the original polynomial
  const lowerBound = 1.0 / maxMinRadical;
  return lowerBound < 0 ? NaN : lowerBound;
}