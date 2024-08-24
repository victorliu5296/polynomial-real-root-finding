import { Polynomial } from '../../src/lib/polynomial/types';
import { createPolynomial, polynomialToString, trimLeadingZeroes } from '../../src/lib/polynomial/utils';
import { addPolynomials } from '../../src/lib/polynomial/operations';

describe('Polynomial', () => {
  it('should add two polynomials correctly', () => {
    const poly1: Polynomial = [1, 2, 3]; // 1 + 2x + 3x^2
    const poly2: Polynomial = [4, 5]; // 4 + 5x
    const expected: Polynomial = [5, 7, 3]; // 5 + 7x + 3x^2
    expect(addPolynomials(poly1, poly2)).toEqual(expected);
  });

  it('should handle adding polynomials of different lengths', () => {
    const poly1: Polynomial = [1, 2, 3]; // 1 + 2x + 3x^2
    const poly2: Polynomial = [4]; // 4
    const expected: Polynomial = [5, 2, 3]; // 5 + 2x + 3x^2
    expect(addPolynomials(poly1, poly2)).toEqual(expected);
  });

  it('should convert a polynomial to a string correctly', () => {
    const poly1: Polynomial = [1, 2, 3]; // 1 + 2x + 3x^2
    expect(polynomialToString(poly1)).toBe('1 + 2x^1 + 3x^2');

    const poly2: Polynomial = [-1, 0, 4]; // -1 + 0x + 4x^2
    expect(polynomialToString(poly2)).toBe('- 1 + 4x^2');

    const poly3: Polynomial = [0, -3, 0, 2]; // 0 - 3x + 0x^2 + 2x^3
    expect(polynomialToString(poly3)).toBe('- 3x^1 + 2x^3');

    const poly4: Polynomial = [-1.0, -2.5, -3.25, -4]; // - 1 - 2.5x^1 - 3.25x^2 - 4x^3
    expect(polynomialToString(poly4)).toBe('- 1 - 2.5x^1 - 3.25x^2 - 4x^3');
  });

  describe('trimLeadingZeroes', () => {
    it('removes leading zeroes from a polynomial', () => {
      const input = [1, 2, 3, 0, 0];
      const expected = [1, 2, 3];
      expect(trimLeadingZeroes(input)).toEqual(expected);
    });

    it('returns an array with a single zero when all coefficients are zero', () => {
      const input = [0, 0, 0, 0];
      const expected = [0];
      expect(trimLeadingZeroes(input)).toEqual(expected);
    });

    it('does nothing to a polynomial without leading zeroes', () => {
      const input = [0, 0, 1, 2, 3];
      const expected = [0, 0, 1, 2, 3]; // No trimming needed here; example shows "mathematical" leading zeros being preserved deliberately
      expect(trimLeadingZeroes(input)).toEqual(expected);
    });

    it('returns the original polynomial if it contains only one non-zero coefficient', () => {
      const input = [5];
      const expected = [5];
      expect(trimLeadingZeroes(input)).toEqual(expected);
    });

    it('handles an empty array correctly by returning a single zero', () => {
      const input: number[] = [];
      const expected = [0];
      expect(trimLeadingZeroes(input)).toEqual(expected);
    });

    it('removes leading (mathematically) zeroes while preserving trailing zeroes', () => {
      const input = [0, 0, 1, 0];
      const expected = [0, 0, 1];
      expect(trimLeadingZeroes(input)).toEqual(expected);
    });
  });
});