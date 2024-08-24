import { mapUnitIntervalToPositiveReals, taylorShiftBy1, reversed, 
         transformedForLowerInterval, scaleInput, taylorShift,
         scaleInputInReverseOrder } from '../../src/lib/polynomial/transformations'; // replace 'path_to_transformation' with the actual path

describe('Polynomial Transformations', () => {
  it('correctly maps unit interval to positive reals', () => {
    // Let P(x) = 1 - x^2 based on [1, 0, -1]
    // Apply P(x) := (x+1)^2 * P(1/(x+1))
    // Same as composing P(x):=x^n * P(1/x) which is simply reversing the coefficient list
    // and x:=x+1 which is a Taylor shift, needs to be expanded

    // x^n * P(1/x) := -1 + x^2 based on [-1, 0, 1]
    // Now applying x:=x+1 we get -1 + (x+1)^2 = -1 + (1 + 2x + x^2) = 2x + x^2
    const input = [1, 0, -1];
    const expected = [0, 2, 1];
    expect(mapUnitIntervalToPositiveReals(input)).toEqual(expected);
  });

  // P(x) := (x+1)^n * P(s/(x+1)) is very similar, we just scale first before everything
  // Let's take the same as the previous example, start with 1 - (0.5x)^2 = 1 - 0.25x^2
  // Then apply x:=2x, giving 1 - x^2 so the same thing.
  it('correctly applies transformation for lower intervals', () => {
    const input = [1, 0, -0.25];
    const scaleFactor = 2;
    const expected = [0, 2, 1];
    expect(transformedForLowerInterval(input, scaleFactor)).toEqual(expected);
  });

  it('correctly applies transformation p(x) := p(x + 1)', () => {
    // (x+1)^2 = 1 + 2x + x^2
    // (x+1+1)^2 = (x+2)^2 = 4 + 4x + x^2
    const input = [1, 2, 1];
    const expected = [4, 4, 1];
    expect(taylorShiftBy1(input)).toEqual(expected);
    expect(taylorShiftBy1([4, -4, 1])).toEqual([1, -2, 1]);
  });

  it('correctly applies transformation p(x) := p(x+shift) with positive shift', () => {
    // (x+1)^2 = 1 + 2x + x^2
    // (x+1+2)^2 = (x+3)^2 = 9 + 6x + x^2
    const input = [1, 2, 1];
    const shift = 2;
    const expected = [9, 6, 1];
    expect(taylorShift(input, shift)).toEqual(expected);
  });

  it('correctly applies transformation p(x) := p(x+shift) with negative shift', () => {
    // (x+1)^2 = 1 + 2x + x^2
    // (x+1-3)^2 = (x-2)^2 = 4 + -4x + x^2
    const input = [1, 2, 1];
    const shift = -3;
    const expected = [4, -4, 1];
    expect(taylorShift(input, shift)).toEqual(expected);
  });

  it('correctly reverses polynomial', () => {
    const input = [1, 2, 3];
    const expected = [3, 2, 1];
    expect(reversed(input)).toEqual(expected);
  });
  
  it('correctly scales input', () => {
    // 1 + 2x + 3x^2
    // 1 + 2(2x) + 3(2x)^2 = 1 + 4x + 12x^2
    const input = [1, 2, 3];
    const scaleFactor = 2;
    const expected = [1, 4, 12];
    expect(scaleInput(input, scaleFactor)).toEqual(expected);
  });

  it('correctly scales input in reverse order', () => {
    // 1 + 2x + 3x^2
    // Reverse coefficients
    // 1x^2 + 2x + 3
    // 1(2x)^2 + 2(2x) + 3 = 4x^2 + 4x + 3
    // Unreverse coefficients
    // 4 + 4x + 3x^2 giving [4, 4, 3]
    const input = [1, 2, 3];
    const scaleFactor = 2;
    const expected = [4, 4, 3];
    expect(scaleInputInReverseOrder(input, scaleFactor)).toEqual(expected);
  });
});
