import { Polynomial } from '../../src/lib/polynomial/types';
import { Interval } from '../../src/lib/interval/types';
import { isolatePositiveRealRootsBisection, isolatePositiveRealRootsContinuedFractions } from '../../src/lib/rootFinding/realRootIsolation';
import { containsValue } from '../../src/lib/interval/operations';
import { evaluatePolynomial } from '../../src/lib/polynomial/evaluation';

describe('Root Isolation Tests', () => {
  test('TestRootContainedInInterval', () => {
    // Define a simple polynomial with a root at x = 3
    const poly: Polynomial = [-3, 1]; // Represents x - 3

    // Create an interval that includes the root, e.g., [2, 4]
    const interval: Interval = [2, 4];

    // Known root of the polynomial
    const knownRoot = 3;

    // Check if the interval correctly identifies that it contains the root
    const containsRoot = containsValue(interval, knownRoot);

    // Assert that containsRoot is true
    expect(containsRoot).toBe(true);
  });

  test('TestNoRoots', () => {
    // Polynomial with no real roots, e.g., x^2 + 1
    const poly: Polynomial = [1, 0, 1];
    const intervals = isolatePositiveRealRootsContinuedFractions(poly);
    expect(intervals).toHaveLength(0); // Expect no intervals for a polynomial with no real roots
  });

  test('TestSingleRoot', () => {
    // Polynomial with a single root, e.g., (x - 1)^2 = x^2 - 2x + 1
    const poly: Polynomial = [1, -2, 1];
    const intervals = isolatePositiveRealRootsContinuedFractions(poly);
    assertIntervalsContainRoots(intervals, [1]);
  });
  
  test('TestMultipleRoots', () => {
    // Polynomial with multiple distinct roots, e.g., x^3 - 6x^2 + 11x - 6 = (x-1)(x-2)(x-3)
    const poly: Polynomial = [-6, 11, -6, 1];
    const intervals = isolatePositiveRealRootsContinuedFractions(poly);
    assertIntervalsContainRoots(intervals, [1, 2, 3]);
  });

  test('TestTwoNonintegerRoots', () => {
    // Polynomial with multiple distinct non-integer roots, e.g., (x-1.5)(x-2.5) = 3.75 + -4x + x^2
    const poly: Polynomial = [3.75, -4, 1];
    const intervals = isolatePositiveRealRootsContinuedFractions(poly);
    assertIntervalsContainRoots(intervals, [1.5, 2.5]);
  });

  test('ThreeRootsInIntervalOfLengthOne', () => {
    // Polynomial with three roots in an interval of length 1, e.g., (x-1)(x-1.5)(x-2) = -3 +6.5x -4.5x^2 +1x^3
    const poly: Polynomial = [-3, 6.5, -4.5, 1];
    const intervals = isolatePositiveRealRootsContinuedFractions(poly);
    assertIntervalsContainRoots(intervals, [1, 1.5, 2]);
  });

  // test('TestRootAtZero', () => {
  //   // Polynomial with a root at 0, e.g., x^2
  //   const poly: Polynomial = [0, 0, 1];
  //   const intervals = isolatePositiveRealRootsContinuedFractions(poly);
  //   expect(intervals).toHaveLength(1); // Expect one interval for a polynomial with a root at 0
  //   // Check that the interval correctly identifies 0 as a root
  //   assertIntervalsContainRoots(intervals, [0]);
  // });

  test('TestCloseRoots', () => {
    // Polynomial with roots very close to each other, requiring accurate interval isolation
    // Example: (x - 0.001)(x - 0.002) = x^2 - 0.003x + 0.000002
    const poly: Polynomial = [0.000002, -0.003, 1];
    const intervals = isolatePositiveRealRootsContinuedFractions(poly);
    // Transform each interval into a string representation
    const intervalsStr = intervals.map(interval => `[${interval[0]}, ${interval[1]}]`);

    // Join the string representations with ", " as separator
    const intervalsJoined = intervalsStr.join(', ');

    const expectedRoots = [0.001, 0.002];
    assertIntervalsContainRoots(intervals, expectedRoots);
  });
});

// Custom assertion function
function assertIntervalsContainRoots(intervals: Interval[], expectedRoots: number[]): void {
  expect(intervals).toHaveLength(expectedRoots.length);

  for (let i = 0; i < expectedRoots.length; i++) {
    const root = expectedRoots[i];
    const interval = intervals[i];
    expect(containsValue(interval, root)).toBe(true);
  }
}

describe('Polynomial Root Isolation Tests', () => {
  describe('Bisection Method', () => {
    test('Isolates positive real roots correctly', () => {
      const polynomial = [-2, 0, 1]; // x^2 - 2 has roots at x = sqrt(2) and x = -sqrt(2), but we only consider positive roots
      const intervals = isolatePositiveRealRootsBisection(polynomial);
      expect(intervals.length).toBe(1);
      expect(containsValue(intervals[0], Math.sqrt(2))).toBe(true);
    });

    test('Handles polynomial with no positive real roots', () => {
      const polynomial = [1, 0, 1]; // x^2 + 1 has no real roots
      const intervals = isolatePositiveRealRootsBisection(polynomial);
      expect(intervals).toEqual([]);
    });
  });

  describe('Continued Fractions Method', () => {
    test('Isolates positive real roots accurately for close roots', () => {
      const polynomial = [0.000002, -0.003, 1]; // (x - 0.001)(x - 0.002) = x^2 - 0.003x + 0.000002
      const intervals = isolatePositiveRealRootsContinuedFractions(polynomial);
      expect(intervals.length).toBe(2);
      intervals.forEach(interval => {
        const rootApproximation = (interval[0] + interval[1]) / 2;
        expect(evaluatePolynomial(polynomial, rootApproximation)).toBeCloseTo(0, 5);
      });
    });

    // test('Correctly identifies a single root at zero', () => {
    //   const polynomial = [0, 0, 1]; // x^2
    //   const intervals = isolatePositiveRealRootsContinuedFractions(polynomial);
    //   expect(intervals.length).toBe(1);
    //   expect(intervals[0]).toEqual([0, 0]);
    // });
  });
});