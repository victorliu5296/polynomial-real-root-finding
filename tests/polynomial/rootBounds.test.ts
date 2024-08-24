import { lmqPositiveLowerBound, lmqPositiveUpperBound } from '../../src/lib/polynomial/rootBounds';
import { Polynomial } from '../../src/lib/polynomial/types';

describe('LMQ Upper Bound Calculator', () => {
  test.each([
    [[-0.077418, 4.38858, -26.752, 43.6964, -14.7546, 1], 29.5092],
    [[-1, -100, 100, 1], 2],
    [[-6, 11, -6, 1], 12],
    [[1, -4, -1, 2, 3], 1.74716093],
  ])('should return the correct upper bound for valid coefficients %p', (coeffs, expectedBound) => {
    // Arrange
    const polynomial: Polynomial = coeffs;

    // Act
    const upperBound = lmqPositiveUpperBound(polynomial);

    // Assert
    expect(upperBound).toBeCloseTo(expectedBound, 4);
  });
});

describe('LMQ Lower Bound Calculator', () => {
  test.each([
    [[1, 100, -100, -1], 1 / 2, 1],
    [[1, -6, 11, -6], 1 / 12, 0.333333],
    [[3, 2, -1, -4, 1], 1 / 1.74716093, 1.1137],
  ])('should return the correct lower bound for valid coefficients %p', (coeffs, expectedBound, smallestPositiveRoot) => {
    // Arrange
    const polynomial: Polynomial = coeffs;

    // Act
    const lowerBound = lmqPositiveLowerBound(polynomial);

    // Assert
    expect(lowerBound).toBeLessThan(smallestPositiveRoot);
    expect(lowerBound).toBeCloseTo(expectedBound, 4);
  });
});