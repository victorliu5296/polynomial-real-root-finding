// bisection.test.ts
import { refineRootIntervalBisection, refineRootIntervalBisectionBounds } from '../../src/lib/interval/bisection';

describe('PolynomialBisectionTests', () => {
  test.each([
    [-0.9, 0.9, 0], // Simple root at 0 for x^3 - x
    [-2, -0.01, -1], // Negative root for x^3 - x, demonstrating tolerance
    [0.1, 2, 1], // Positive root for x^3 - x, demonstrating tolerance
    [0, 0, 0] // Equal bounds
  ])('RefineIntervalBisection_WithRootInInterval_FindsRoot',
    (leftBound: number, rightBound: number, expectedRoot: number) => {
      const tolerance = 0.0001;
      const func = (x: number) => Math.pow(x, 3) - x; // This function represents x^3 - x
      const foundRoot = refineRootIntervalBisection(func, [leftBound, rightBound], tolerance);
      expect(foundRoot).toBeDefined(); // Assert not null
      if(foundRoot !== undefined) {
        expect(Math.abs(foundRoot - expectedRoot)).toBeLessThanOrEqual(tolerance);
      }
  });

  test('RefineIntervalBisection_WithNoRootInInterval_ThrowsArgumentException', () => {
    const func = (x: number) => Math.pow(x, 3) + 1; // This function represents x^3 + 1
    // There is no real root between -0.5 and 1 (real root at x=-1)
    expect(() => refineRootIntervalBisection(func, [-0.5, 1])).toThrow();
  });

  test('RefineIntervalBisection_MaxIterationsReached_ReturnsNull', () => {
    const func = (x: number) => Math.pow(x, 2) - 1; // This function represents x^2 - 1
    // Roots are x= -1 and x=1
    const maxIterations = 3; // Low number to force termination before convergence
    const result = refineRootIntervalBisection(func, [-0.5, 2], 1e-5, maxIterations);
    expect(result).toBeNaN(); // Expect NaN due to max iterations without converging
  });
});
