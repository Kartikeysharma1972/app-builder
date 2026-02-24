// script.js
// Calculator core logic and UI interaction

/**
 * Calculator class encapsulates the state and behavior of a simple arithmetic calculator.
 * It manages the current input string, evaluates expressions safely, and updates the UI.
 */
class Calculator {
  /**
   * @param {HTMLElement} displayElement - The input element that shows the calculator output.
   */
  constructor(displayElement) {
    this.displayElement = displayElement;
    this.currentInput = '';
    this.result = '';
    this._error = false; // internal flag for error state
    this.updateDisplay();
  }

  /**
   * Append a character (digit, decimal point or operator) to the current input.
   * Performs basic validation to avoid malformed expressions.
   * @param {string} char
   */
  appendCharacter(char) {
    if (this._error) {
      // Reset on new input after an error
      this.currentInput = '';
      this._error = false;
    }
    const operators = '+-*/';
    const digits = '0123456789';
    if (digits.includes(char)) {
      this.currentInput += char;
    } else if (char === '.') {
      // Allow a decimal point only if the current number segment doesn't already contain one
      const lastNumber = this._getLastNumberSegment();
      if (!lastNumber.includes('.')) {
        // If starting a new number with a dot, prepend a zero for clarity
        if (lastNumber === '' && (this.currentInput === '' || operators.includes(this.currentInput.slice(-1)))) {
          this.currentInput += '0';
        }
        this.currentInput += '.';
      }
    } else if (operators.includes(char)) {
      // Prevent two operators in a row (except allowing '-' for negative numbers at start)
      if (this.currentInput === '' && char !== '-') {
        // Do not allow starting with +, *, /
        return;
      }
      const lastChar = this.currentInput.slice(-1);
      if (operators.includes(lastChar)) {
        // Replace the previous operator with the new one (except when the previous is '-' and new is also '-')
        this.currentInput = this.currentInput.slice(0, -1) + char;
      } else {
        this.currentInput += char;
      }
    }
    this.updateDisplay();
  }

  /**
   * Clear the current input and reset the display.
   */
  clear() {
    this.currentInput = '';
    this.result = '';
    this._error = false;
    this.updateDisplay();
  }

  /**
   * Remove the last character from the current input.
   */
  backspace() {
    if (this._error) {
      // If an error is shown, clear it entirely.
      this.clear();
      return;
    }
    this.currentInput = this.currentInput.slice(0, -1);
    this.updateDisplay();
  }

  /**
   * Evaluate the arithmetic expression stored in currentInput.
   * Uses Function constructor for sandboxed evaluation.
   * Handles division by zero and syntax errors.
   */
  evaluate() {
    if (this.currentInput.trim() === '') {
      return;
    }
    // Replace any trailing operator which would cause a syntax error
    const cleanedExpr = this.currentInput.replace(/[+\-*/]$/g, '');
    try {
      // eslint-disable-next-line no-new-func
      const evalResult = Function('return ' + cleanedExpr)();
      if (typeof evalResult === 'number' && !isFinite(evalResult)) {
        // Division by zero or overflow
        this._setError('Error: Division by zero');
        return;
      }
      // Round results to a reasonable number of decimal places to avoid floating point noise
      const rounded = Number.isInteger(evalResult) ? evalResult : parseFloat(evalResult.toFixed(10));
      this.result = String(rounded);
      this.currentInput = this.result;
      this._error = false;
    } catch (e) {
      this._setError('Error: Invalid expression');
    }
    this.updateDisplay();
  }

  /**
   * Update the display element with the current input or error state.
   */
  updateDisplay() {
    const value = this.currentInput === '' ? '0' : this.currentInput;
    this.displayElement.value = value;
    if (this._error) {
      this.displayElement.classList.add('error');
    } else {
      this.displayElement.classList.remove('error');
    }
  }

  /**
   * Internal helper to set an error message and flag.
   * @param {string} msg
   */
  _setError(msg) {
    this.currentInput = msg;
    this._error = true;
  }

  /**
   * Retrieve the numeric segment at the end of the current input (used for decimal validation).
   * @returns {string}
   */
  _getLastNumberSegment() {
    const match = this.currentInput.match(/([0-9]*\.?[0-9]*)$/);
    return match ? match[0] : '';
  }
}

// Expose Calculator globally for potential external use
window.Calculator = Calculator;

// Instantiate the calculator once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const displayEl = document.getElementById('display');
  if (!displayEl) {
    console.error('Calculator display element not found');
    return;
  }
  const calc = new Calculator(displayEl);

  // Button click handling
  const buttons = document.querySelectorAll('.calc-button');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const value = btn.dataset.value;
      switch (action) {
        case 'digit':
          calc.appendCharacter(value);
          break;
        case 'decimal':
          calc.appendCharacter('.');
          break;
        case 'operator':
          calc.appendCharacter(value);
          break;
        case 'equals':
          calc.evaluate();
          break;
        case 'clear':
          calc.clear();
          break;
        case 'backspace':
          calc.backspace();
          break;
        default:
          // No-op for unknown actions
          break;
      }
    });
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    // Ignore key events when focus is on the display input to prevent double handling
    if (e.target === displayEl) {
      return;
    }
    const key = e.key;
    if (/^[0-9]$/.test(key)) {
      calc.appendCharacter(key);
      e.preventDefault();
    } else if (key === '.' || key === ',') {
      // Allow both period and comma as decimal (comma will be treated as period)
      calc.appendCharacter('.');
      e.preventDefault();
    } else if (['+', '-', '*', '/'].includes(key)) {
      calc.appendCharacter(key);
      e.preventDefault();
    } else if (key === 'Enter' || key === '=') {
      calc.evaluate();
      e.preventDefault();
    } else if (key === 'Backspace') {
      calc.backspace();
      e.preventDefault();
    } else if (key === 'Delete' || key === 'Escape') {
      calc.clear();
      e.preventDefault();
    }
  });
});
