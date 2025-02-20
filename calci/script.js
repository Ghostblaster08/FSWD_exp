const calculator = {
    displayExpression: document.querySelector('#expression'),
    displayValue: document.querySelector('#result'),
    firstOperand: null,
    expression: '',
    
    updateDisplay() {
        this.displayValue.value = this.expression || '0';
    },
    
    clearDisplay() {
        this.expression = '';
        this.displayExpression.value = '';
        this.updateDisplay();
    },
    
    handleDigit(digit) {
        this.expression += digit;
        this.updateDisplay();
    },
    
    handleOperator(operator) {
        this.expression += operator;
        this.updateDisplay();
    },
    
    handleDecimal() {
        if (!this.expression.includes('.')) {
            this.expression += '.';
            this.updateDisplay();
        }
    },
    
    handleBackspace() {
        this.expression = this.expression.slice(0, -1);
        this.updateDisplay();
    },
    
    calculate() {
        try {
            const result = eval(this.expression);
            this.displayExpression.value = this.expression;
            this.expression = String(result);
            this.updateDisplay();
        } catch (error) {
            this.displayExpression.value = 'Error';
            this.expression = '';
            this.updateDisplay();
        }
    }
};

document.querySelector('.calculator-keys').addEventListener('click', event => {
    const { target } = event;
    if (!target.matches('button')) return;

    if (target.classList.contains('operator')) {
        calculator.handleOperator(target.value);
        return;
    }
    
    if (target.classList.contains('all-clear')) {
        calculator.clearDisplay();
        return;
    }
    
    if (target.value === 'backspace') {
        calculator.handleBackspace();
        return;
    }
    
    if (target.classList.contains('equal-sign')) {
        calculator.calculate();
        return;
    }
    
    if (target.value === '.') {
        calculator.handleDecimal();
        return;
    }

    calculator.handleDigit(target.value);
});