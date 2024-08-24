import { Polynomial } from "../../src/lib/polynomial/types";
import { evaluatePolynomial } from "../../src/lib/polynomial/evaluation";

describe('PolynomialEvaluation', () => {
    it('should evaluate a polynomial correctly', () => {
    const poly: Polynomial = [1, 2, 3]; // 1 + 2x + 3x^2
    expect(evaluatePolynomial(poly, 0)).toBe(1);
    expect(evaluatePolynomial(poly, 1)).toBe(6);
    expect(evaluatePolynomial(poly, 2)).toBe(17);
    expect(evaluatePolynomial(poly, -1)).toBe(2);
  });
})