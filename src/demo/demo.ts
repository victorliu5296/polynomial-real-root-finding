import { Polynomial } from '../lib';
import { findAllRealRoots } from '../lib/rootFinding/rootFinding';

// HTML elements
const coefficientsInput = document.getElementById('coefficients') as HTMLInputElement;
const findRootsButton = document.getElementById('findRoots') as HTMLButtonElement;
const resultDiv = document.getElementById('result') as HTMLDivElement;
const precisionInput = document.getElementById('precision') as HTMLInputElement;

// Event listeners
findRootsButton.addEventListener('click', runDemo);

// Helper functions
function parsePolynomial(input: string): Polynomial {
  // Remove all spaces from the input to avoid errors in parsing
  const cleanedInput = input.replace(/\s+/g, '');

  // Match terms with coefficients (including decimals and scientific notation), optional 'x', and optional power
  const terms = cleanedInput.match(/([-+]?\d*\.?\d*(?:e[+-]?\d+)?x\^\d+)|([-+]?\d*\.?\d*(?:e[+-]?\d+)?x)|([-+]?[\d\.]+(?:e[+-]?\d+)?)/gi) || [];
  const coefficients: Polynomial = [];

  terms.forEach(term => {
    // Normalize terms: converts 'x' and '-x' to '1x' and '-1x', '+x' to '1x', also covers cases with powers
    const normalizedTerm = term.replace(/(^[\+-]?)x\^/, '$11x^').replace(/(^[\+-]?)x$/, '$11x');
    // Match the coefficient, 'x', and the power if any
    const match = normalizedTerm.match(/^([-+]?\d*\.?\d*(?:e[+-]?\d+)?)(x\^(\d+)|x)?$/);

    if (match) {
      const coeff = match[1] ? parseFloat(match[1]) : 1;  // Default coefficient to 1 if missing
      const power = match[3] ? parseInt(match[3], 10) : (match[2] ? 1 : 0);  // Default power to 1 if 'x' is present without a power
      coefficients[power] = coeff;  // Assign the coefficient to the correct power in the array
    }
  });

  // Fill missing coefficients with 0 up to the highest power
  for (let i = 0; i <= Math.max(...Object.keys(coefficients).map(Number)); i++) {
    coefficients[i] = coefficients[i] || 0;
  }

  return coefficients;
}

function runDemo(): void {
  console.log('Button clicked');
  const input = coefficientsInput.value;
  console.log('Input:', input);

  const polynomial: Polynomial = parsePolynomial(input);
  console.log('Parsed polynomial coefficients:', polynomial);

  const precision = Number(precisionInput.value) ? Number(precisionInput.value) : 1e-5;
  const roots = findAllRealRoots(polynomial, precision);
  console.log('Roots:', roots);

  resultDiv.textContent = `Real roots: ${roots.length > 0 ? roots.join(', ') : 'none'}`;
  console.log('Result displayed');
}