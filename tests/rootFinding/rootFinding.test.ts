import { Polynomial } from '../../src/lib/polynomial/types';
import { createPolynomial } from '../../src/lib/polynomial/utils';
import { findAllRealRoots } from '../../src/lib/rootFinding/rootFinding';

describe('findAllRealRoots', () => {
  // Format: [testName, polynomial, expectedRoots]
  const testCases: [string, Polynomial, number[]][] = [
    ['polynomial with no real roots', [1, 0, 1], []],
    ['polynomial with no real roots', [2, 0, 4, 0, 2.5], []],
    ['squarefree polynomial with integer positive roots', [2, 3, 1], [-2, -1]],
    ['squarefree polynomial with integer negative roots', [2, -3, 1], [1, 2]],
    ['squarefree polynomial with two integer roots', [-1, 0, 1], [-1, 1]],
    ['squarefree polynomial with many integer roots', [56, -22, -33, -2, 1], [-4, -2, 1, 7]],
    ['squarefree polynomial with 2 non-integer roots', [2, -3, -1], [-3.56155281280883, 0.561552812808830]],
    // (x+sqrt(2))(x+1)(x-1.5)(x-2.7)(x-3.8) = -21.7647 - 8.85633 x + 21.6047 x^2 + 2.11051 x^3 - 5.58579 x^4 + x^5
    // ['squarefree polynomial with multiple distinct non-integer roots', [-21.7647, -8.85633, 21.6047, 2.11051, -5.58579, 1], [-1.4142, -1, 1.5, 2.7, 3.8]],
    ['squarefree polynomial with a root at 0', [0, -1.5, -0.5, 1], [-1, 0, 1.5]],
    ['square polynomial with integer roots', [1, -2, 1], [1]],
    // ((x+3.5)(x-1.5))^2 = 27.5625 - 21 x - 6.5 x^2 + 4 x^3 + x^4
    ['square polynomial with 2 non-integer roots', [27.5625, -21, -6.5, 4, 1], [-3.5, 1.5]],
    // (x+1)x(x-1)^2(x-5.5) = 0 - 5.5 x + 6.5 x^2 + 4.5 x^3 - 6.5 x^4 + x^5
    // ['polynomial with double root and with a root at 0', [0, -5.5, 6.5, 4.5, -6.5, 1], [-1, 0, 1, 5.5]],
    // (x+0.0025)x(x-0.005) = 0 - 0.0000125 x - 0.0025 x^2 + 1 x^3
    ['polynomial with close roots', [0, -0.0000125, -0.0025, 1], [-0.0025, 0, 0.005]],
    // (x+2000)(x+100)(x-255) = -51000000 - 335500 x + 1845 x^2 + x^3
    ['polynomial with spaced roots', [-51000000, -335500, 1845, 1], [-2000, -100, 255]],
  ];

  test.each(testCases)('should find all real roots of a %s', (_, poly: Polynomial, expectedRoots: number[]) => {
    const roots = findAllRealRoots(poly, 1e-6);
    expect(roots).toHaveLength(expectedRoots.length);
    roots.forEach((root, index) => {
      expect(root).toBeCloseTo(expectedRoots[index], 5);
    });
  });

  it ('should find all the real roots of a square polynomial with root at zero', () => {
    const polynomial = createPolynomial([0, 0, 1]);
    const expectedRoots = [0];
    const roots = findAllRealRoots(polynomial, 1e-6);
    
    expect(roots).toHaveLength(expectedRoots.length);
    roots.forEach((root, index) => {
      expect(root).toBeCloseTo(expectedRoots[index], 5);
    })
  });

  it ('should find all the real roots of a squarefree polynomial with multiple distinct non-integer roots', () => {
    const polynomial = createPolynomial([-21.7647, -8.85633, 21.6047, 2.11051, -5.58579, 1]);
    const expectedRoots = [-1.4142, -1, 1.5, 2.7, 3.8];
    const roots = findAllRealRoots(polynomial, 1e-6);

    expect(roots).toHaveLength(expectedRoots.length);
    roots.forEach((root, index) => {
      expect(root).toBeCloseTo(expectedRoots[index], 4);
    })
  })

  it ('should find all the real roots of a polynomial with double root and with a root at 0', () => {
    // (x+1)x(x-1)^2(x-5.5) = 0 - 5.5 x + 6.5 x^2 + 4.5 x^3 - 6.5 x^4 + x^5
    const polynomial = createPolynomial([0, -5.5, 6.5, 4.5, -6.5, 1]);
    const expectedRoots = [-1, 0, 1, 5.5];
    const roots = findAllRealRoots(polynomial, 1e-6);

    expect(roots).toHaveLength(expectedRoots.length);
    roots.forEach((root, index) => {
      expect(root).toBeCloseTo(expectedRoots[index], 5);
    })
  });

  it ('should find all the real roots of a polynomial with spaced roots', () => {
    const polynomial = createPolynomial([-51000000, -335500, 1845, 1]);
    const expectedRoots = [-2000, -100, 255];
    const roots = findAllRealRoots(polynomial, 1e-6);

    expect(roots).toHaveLength(expectedRoots.length);
    roots.forEach((root, index) => {
      expect(root).toBeCloseTo(expectedRoots[index], 5);
    });
  })

  it ('should throw an error when trying to find real roots of an empty polynomial', () => {
    expect(() => findAllRealRoots([])).toThrow();
  })
});