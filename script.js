class Calculator {
  constructor(previousOperandElement, currentOperandElement) {
    this.previousOperandElement = previousOperandElement;
    this.currentOperandElement = currentOperandElement;
    this.clear();
  }

  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
    this.shouldResetScreen = false;
    this.updateDisplay();
  }

  delete() {
    if (this.currentOperand === "0") return;
    if (this.currentOperand.length === 1) {
      this.currentOperand = "0";
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
    this.updateDisplay();
  }

  appendNumber(number) {
    if (number === "." && this.currentOperand.includes(".")) return;
    if (this.shouldResetScreen) {
      this.currentOperand = "";
      this.shouldResetScreen = false;
    }
    if (this.currentOperand === "0" && number !== ".") {
      this.currentOperand = number;
    } else {
      this.currentOperand += number;
    }
    this.updateDisplay();
  }

  chooseOperation(operation) {
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
    this.updateDisplay();
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "/":
        if (current === 0) {
          this.showError("Division par zéro impossible");
          return;
        }
        computation = prev / current;
        break;
      case "%":
        computation = (prev * current) / 100;
        break;
      default:
        return;
    }

    this.currentOperand = this.roundResult(computation).toString();
    this.operation = undefined;
    this.previousOperand = "";
    this.shouldResetScreen = true;
    this.updateDisplay();

    // Animation de validation
    this.animateResult();
  }

  roundResult(number) {
    return Math.round(number * 1000000) / 1000000;
  }

  percentage() {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;
    this.currentOperand = (current / 100).toString();
    this.updateDisplay();
  }

  updateDisplay() {
    this.currentOperandElement.textContent = this.getDisplayNumber(
      this.currentOperand,
    );
    if (this.operation != null) {
      this.previousOperandElement.textContent = `${this.getDisplayNumber(this.previousOperand)} ${this.getOperatorSymbol(this.operation)}`;
    } else {
      this.previousOperandElement.textContent = "";
    }
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];

    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "0";
    } else {
      integerDisplay = integerDigits.toLocaleString("fr", {
        maximumFractionDigits: 0,
      });
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  getOperatorSymbol(operation) {
    const symbols = {
      "+": "+",
      "-": "−",
      "*": "×",
      "/": "÷",
      "%": "%",
    };
    return symbols[operation] || operation;
  }

  showError(message) {
    this.currentOperandElement.textContent = "Erreur";
    this.currentOperandElement.classList.add("error-shake");
    setTimeout(() => {
      this.currentOperandElement.classList.remove("error-shake");
      this.clear();
    }, 1000);
  }

  animateResult() {
    this.currentOperandElement.style.transform = "scale(1.05)";
    setTimeout(() => {
      this.currentOperandElement.style.transform = "scale(1)";
    }, 200);
  }
}

// Initialisation
const previousOperandElement = document.getElementById("previousOperand");
const currentOperandElement = document.getElementById("currentOperand");
const calculator = new Calculator(
  previousOperandElement,
  currentOperandElement,
);

// Gestion des événements
document.querySelectorAll("[data-number]").forEach((button) => {
  button.addEventListener("click", () => {
    const number = button.dataset.number;
    calculator.appendNumber(number);
    addButtonAnimation(button);
  });
});

document.querySelectorAll("[data-operator]").forEach((button) => {
  button.addEventListener("click", () => {
    const operator = button.dataset.operator;
    calculator.chooseOperation(operator);
    addButtonAnimation(button);
  });
});

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    switch (action) {
      case "clear":
        calculator.clear();
        break;
      case "delete":
        calculator.delete();
        break;
      case "equals":
        calculator.compute();
        break;
      case "percent":
        calculator.percentage();
        break;
    }
    addButtonAnimation(button);
  });
});

// Animation des boutons
function addButtonAnimation(button) {
  button.classList.add("btn-pop");
  setTimeout(() => {
    button.classList.remove("btn-pop");
  }, 200);
}

// Support clavier
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") {
    calculator.appendNumber(e.key);
  } else if (e.key === ".") {
    calculator.appendNumber(".");
  } else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
    let operator = e.key;
    if (operator === "*") operator = "*";
    if (operator === "/") operator = "/";
    calculator.chooseOperation(operator);
  } else if (e.key === "Enter" || e.key === "=") {
    calculator.compute();
  } else if (e.key === "Backspace") {
    calculator.delete();
  } else if (e.key === "Escape" || e.key === "c" || e.key === "C") {
    calculator.clear();
  } else if (e.key === "%") {
    calculator.percentage();
  }
});

// Mode sombre / clair
const modeToggle = document.getElementById("modeToggle");
modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const icon = modeToggle.textContent;
  modeToggle.textContent = icon === "🌙" ? "☀️" : "🌙";
  addButtonAnimation(modeToggle);
});

// Ajout d'un effet de survol moderne
const buttons = document.querySelectorAll(".btn");
buttons.forEach((btn) => {
  btn.addEventListener("mouseenter", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btn.style.setProperty("--mouse-x", `${x}px`);
    btn.style.setProperty("--mouse-y", `${y}px`);
  });
});

// Message de bienvenue dans la console
console.log(
  "%c✨ Calculatrice Avancée Chargée avec Succès! ✨",
  "color: #667eea; font-size: 16px; font-weight: bold;",
);
console.log(
  "%c🎯 Fonctionnalités: Calculs, Pourcentage, Mode Sombre, Support Clavier",
  "color: #764ba2; font-size: 12px;",
);
