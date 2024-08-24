import {
  addPolynomials,
  normalizePolynomial,
  derivativeTimesX,
  polynomialDerivative,
  shiftCoefficientsBy1,
  makeSquareFree,
  polynomialDivision,
  polynomialGCD
} from '../../src/lib/polynomial/operations'; // Adjust the import path as necessary

describe('Polynomial Operations', () => {

  describe('addPolynomials', () => {
    test('should add two polynomials of the same length', () => {
      expect(addPolynomials([1, 2, 3], [3, 2, 1])).toEqual([4, 4, 4]);
    });

    test('should add two polynomials of different lengths', () => {
      expect(addPolynomials([1, 2], [1, 2, 3, 4])).toEqual([2, 4, 3, 4]);
    });
  });

  describe('normalizePolynomial', () => {
    test('should normalize a non-zero polynomial', () => {
      expect(normalizePolynomial([2, 4, 6])).toEqual([1/3, 2/3, 1]);
    });

    test('should return [0] for a zero polynomial', () => {
      expect(normalizePolynomial([0, 0, 0])).toEqual([0]);
    });
  });

  describe('derivativeTimesX', () => {
    test('calculates x * P\'(x) correctly', () => {
      expect(derivativeTimesX([3, 2, 1])).toEqual([0, 2, 2]);
    });
  });

  describe('polynomialDerivative', () => {
    test('calculates the derivative of a polynomial correctly', () => {
      expect(polynomialDerivative([3, 2, 1])).toEqual([2, 2]);
    });

    test('returns [0] for constant or empty polynomial', () => {
      expect(polynomialDerivative([3])).toEqual([0]);
      expect(polynomialDerivative([])).toEqual([0]);
    });

  test('derivative is correct', () => {
    // (x+1)x(x-1)^2(x-5.5) = 0 - 5.5 x + 6.5 x^2 + 4.5 x^3 - 6.5 x^4 + x^5
    // d/dx (0 - 5.5 x + 6.5 x^2 + 4.5 x^3 - 6.5 x^4 + x^5) = -5.5 + 13x + 13.5x^2 - 26 x^3 + 5x^4
      expect(polynomialDerivative([0, -5.5, 6.5, 4.5, -6.5, 1])).toEqual([-5.5, 13, 13.5, -26, 5]);
    });
  });

  describe('shiftCoefficientsBy1', () => {
    test('shifts coefficients by one degree lower, removing the constant term', () => {
    const poly = [7, 3, -2, 1]; // 7 + 3x - 2x^2 + x^3
    expect(shiftCoefficientsBy1(poly)).toEqual([3, -2, 1]); // 3 - 2x + x^2
  });

  describe('makeSquareFree', () => {
    test('returns the original polynomial if it is already square-free', () => {
      
      const poly = [1, 0, 1]; // x^2 + 1 (already square-free for simplicity)
      expect(makeSquareFree(poly)).toEqual([1, 0, 1]);
    });

    test('makeSquareFree makes a polynomial square-free', () => {
      expect(makeSquareFree([-1, 3, -3, 1])).toEqual([-1, 1]); // (x-1)^3
    });

    test('makeSquareFree removes repeated roots into single roots', () => {
      // (x+1)x(x-1)^2(x-5.5) = 0 - 5.5 x + 6.5 x^2 + 4.5 x^3 - 6.5 x^4 + x^5
      // (x+1)x(x-1)(x-5.5) = 0 + 5.5x - x^2 - 5.5x^3 + x^4
      const polynomial = [0, -5.5, 6.5, 4.5, -6.5, 1];
      const squareFreePolynomial = [0, 5.5, -1, -5.5, 1];
      const result = makeSquareFree(polynomial);
      expect(squareFreePolynomial.length).toEqual(result.length);
      squareFreePolynomial.forEach((coefficient, index) => {
        expect(coefficient).toBeCloseTo(result[index], 6);
      })
    });
  });

  describe('polynomialDivision', () => {
    test('polynomialDivision divides one polynomial by another', () => {
      const dividend = [1, 0, -1]; // x^2 - 1
      const divisor = [1, 1];      // x + 1
      expect(polynomialDivision(dividend, divisor)).toEqual([[1, -1], [0]]); // Quotient: x - 1, Remainder: 0
      expect(polynomialDivision([2, 0, -3, 1], [-1, 1])).toEqual([[-2, -2, 1], [0]]);
      expect(polynomialDivision([5, 1, -3, 1], [-1, 1])).toEqual([[-1, -2, 1], [4]]);
      });

    test('handles division where divisor degree is higher than dividend, leaving the dividend as remainder', () => {
      expect(polynomialDivision([1, 2], [1, 0, -1])).toEqual([[0], [1, 2]]);
    });

    test('throws an error when attempting to divide by a zero polynomial', () => {
      expect(() => polynomialDivision([1, -3, 0, 2], [0])).toThrow("Attempted to divide by a zero polynomial.");
    });
    });
  });

  describe('polynomialGCD', () => {
    test('polynomialGCD finds the greatest common divisor of two polynomials', () => {
      const a = [2, 3, 1]; // 2 + 3x + x^2 = (x + 1)(x + 2)
      const b = [2, 1];   // 2 + x
      expect(polynomialGCD(a, b)).toEqual([2, 1]);
    });

    test('polynomialGCD finds the GCD between a polynomial and its derivative', () => {
      // (x+1)x(x-1)^2(x-5.5) = 0 - 5.5 x + 6.5 x^2 + 4.5 x^3 - 6.5 x^4 + x^5
      // d/dx (0 - 5.5 x + 6.5 x^2 + 4.5 x^3 - 6.5 x^4 + x^5) = -5.5 + 13x + 13.5x^2 - 26 x^3 + 5x^4
      // GCD = -1 + x
      const a = [0, -5.5, 6.5, 4.5, -6.5, 1];
      const b = [-5.5, 13, 13.5, -26, 5];
      const expectedGCD = [-1, 1];
      const result = polynomialGCD(a, b);
      expect(result).toHaveLength(expectedGCD.length);
      result.forEach((coefficient, index) => {
        expect(coefficient).toBeCloseTo(expectedGCD[index], 6);
      })
    });

    test('polynomialGCD handles coprime polynomials', () => {
      expect(polynomialGCD([1, 1], [2, 1, 1])).toEqual([1]);
      expect(polynomialGCD([4, 2, 2], [1, 1, 2])).toEqual([1]);
    })
  });
});
