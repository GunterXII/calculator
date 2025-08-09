// Selezioni gli elementi del DOM
const display = document.getElementById('display');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const backspaceButton = document.getElementById('backspace');
const decimalButton = document.querySelector('.btn.number:last-of-type'); // l'ultimo pulsante number è "."

// Variabili di stato
let firstOperand = '';        // il primo numero inserito (come stringa)
let secondOperand = '';       // il secondo numero (stringa)
let currentOperator = null;   // l'operatore selezionato (+, -, *, /)
let shouldResetScreen = false;// flag per sapere se resettare lo schermo prima di un nuovo inserimento

// 1) Funzioni matematiche di base
function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}
function multiply(a, b) {
  return a * b;
}
function divide(a, b) {
  // Gestione divisione per zero
  if (b === 0) return 'Errore';
  return a / b;
}

// 2) operate: chiama la funzione corretta in base all'operatore
function operate(operator, a, b) {
  a = parseFloat(a);
  b = parseFloat(b);
  switch (operator) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '*':
      return multiply(a, b);
    case '/':
      return divide(a, b);
    default:
      return null;
  }
}

// 3) Funzione per aggiornare il display
function updateDisplay(content) {
  display.textContent = content;
}

// 4) Aggiunge una cifra (o cifra successiva) al display
function appendNumber(number) {
  // Se dobbiamo resettare lo schermo (dopo un =), lo svuotiamo prima
  if (shouldResetScreen) {
    updateDisplay('');
    shouldResetScreen = false;
  }
  // Non lasciare più di un carattere "0" iniziale
  if (display.textContent === '0' && number === '0') return;
  // Se il display contiene solo "0", lo sostituiamo
  if (display.textContent === '0') {
    updateDisplay(number);
  } else {
    updateDisplay(display.textContent + number);
  }
}

// 5) Aggiunge il punto decimale, impedendo più di uno
function appendDecimal() {
  if (shouldResetScreen) {
    updateDisplay('0');
    shouldResetScreen = false;
  }
  if (display.textContent.includes('.')) return;
  updateDisplay(display.textContent + '.');
}

// 6) Svuota completamente lo stato e il display
function clearAll() {
  firstOperand = '';
  secondOperand = '';
  currentOperator = null;
  shouldResetScreen = false;
  updateDisplay('0');
}

// 7) Cancella l'ultimo carattere digitato
function deleteDigit() {
  if (shouldResetScreen) return;
  if (display.textContent.length === 1) {
    updateDisplay('0');
  } else {
    updateDisplay(display.textContent.slice(0, -1));
  }
}

// 8) Gestisce la selezione di un operatore
function chooseOperator(operator) {
  // Se è già stato selezionato un operatore e inserito un secondo operando, valutiamo prima
  if (currentOperator !== null && !shouldResetScreen) {
    evaluate();
  }
  firstOperand = display.textContent;
  currentOperator = operator;
  shouldResetScreen = true; // al prossimo numero, svuota display
}

// 9) Valuta l'espressione corrente
function evaluate() {
  if (currentOperator === null || shouldResetScreen) return;
  secondOperand = display.textContent;
  const result = operate(currentOperator, firstOperand, secondOperand);
  // Gestione risultato lungo o errore
  if (result === 'Errore') {
    updateDisplay('Impossibile');
  } else {
    // Arrotondiamo a 8 cifre decimali al massimo
    updateDisplay(Math.round(result * 1e8) / 1e8);
  }
  currentOperator = null;
  shouldResetScreen = true; // successivo numero inizia nuovo calcolo
}

// 10) Event listener per i numeri
numberButtons.forEach((button) =>
  button.addEventListener('click', () => appendNumber(button.textContent))
);

// 11) Listener per il punto decimale
decimalButton.addEventListener('click', appendDecimal);

// 12) Listener per gli operatori
operatorButtons.forEach((button) =>
  button.addEventListener('click', () => chooseOperator(button.textContent))
);

// 13) Listener per "="
equalsButton.addEventListener('click', evaluate);

// 14) Listener per "C" (clear)
clearButton.addEventListener('click', clearAll);

// 15) Listener per backspace
backspaceButton.addEventListener('click', deleteDigit);

// Inizializziamo il display a "0"
clearAll();
