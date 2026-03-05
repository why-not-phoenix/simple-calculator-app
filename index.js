const toggle = document.getElementById('theme-toggle');
const displayText = document.getElementById('calculator__display-text');
const keypad = document.getElementById('keypad');
const body = document.querySelector('body');

// Calculator Functionality
const keys = [
    "7", "8", "9", "DEL",
    "4", "5", "6", "+",
    "1", "2", "3", "-",
    ".", "0", "/", "x",
    "RESET", "="
];

keys.forEach(key => {
    if(key === "RESET") {
        keypad.innerHTML += `<button id="key-${key}" class="calc-btn btn btn--bg-1 btn--large text-white font-bold">${key}</button>`;
    } else if(key === "DEL") {
        keypad.innerHTML += `<button id="key-${key}" class="calc-btn btn btn--bg-1 text-white font-bold">${key}</button>`;
    } else if (key === "=") {
        keypad.innerHTML += `<button id="key-${key}" class="calc-btn btn btn--large btn--bg-2 text-white font-bold">${key}</button>`;
    } else {
        keypad.innerHTML += `<button id="key-${key}" class="calc-btn btn btn--bg-3 text-1 font-bold">${key}</button>`;   
    }
});

const savedTheme = localStorage.getItem("theme");
const currentTheme = toggle.getAttribute("value");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if(savedTheme) {
    if(savedTheme !== currentTheme) {
        toggle.setAttribute("value", savedTheme);
        changeTheme(currentTheme, savedTheme);
    }
} else if(prefersDark) {
    toggle.setAttribute("value", "3");
    changeTheme(currentTheme, "3");
}

const calcBtns = document.querySelectorAll('.calc-btn');
let answer = ``;

[...calcBtns].forEach(calcBtn => {
    calcBtn.addEventListener("click", () => {
        calculatorFunctionality(calcBtn.textContent);
    })
})

document.addEventListener("keydown", (e) => {
    let key = e.key;
    key = key === "*" ? "x" : key;
    key = key === "Enter" ? "=" : key;
    key = key === "Backspace" ? "DEL" : key;
    if(keys.includes(key)) {
        calculatorFunctionality(key);
    }
});

const calculatorFunctionality = (key) => {
    if(key === "RESET") {
        displayText.textContent = 0;
        answer = ``;
    } else if(key === "DEL") {
        handleDelete();
    } else if(key === "+") {
        handleOperation("+");
    } else if(key === "-") {
        handleOperation("-");
    } else if(key === "x") {
        handleOperation("*");
    } else if(key === "/") {
        handleOperation("/");
    } else if(key === "=") {
        if(answer === ``) {
            answer = `0+`;
        } else {
            displayText.textContent = equate();
            answer = `0+`;
        }
    } else if(key === ".") {
        if(!displayText.textContent.includes(".")) {
            displayText.textContent += key;
        }
    }     else {
        if(displayText.textContent === "0" || answer === `0+`) {
            displayText.textContent = key;
        } else {
            displayText.textContent += key;
        }
    }

    if (displayText.textContent.length >= 20) {
        setTimeout(() => {
            displayText.textContent = 0;
        }, 1500);
        displayText.textContent = "Error";
        answer = ``;
        return;
    }
}

const handleDelete = () => {
    if(displayText.textContent.length > 1) {
        const currentDisplay = displayText.textContent;
        displayText.textContent = currentDisplay.slice(0, -1);
    } else {
        displayText.textContent = 0;
    }
}

const handleOperation = (operator) => {
    if(answer === `` || answer === `0+`) {
        answer = `${displayText.textContent}${operator}`;
        displayText.textContent = 0;
    } else {
        displayText.textContent = equate();
        answer = `${displayText.textContent}${operator}`;
    }
}

const equate = () => {
    const operator = answer.slice(-1);
    const num1 = Number(answer.slice(0, -1));
    let result;

    if (operator === "+") result = num1 + Number(displayText.textContent);
    if (operator === "-") result = num1 - Number(displayText.textContent);
    if (operator === "*" || operator === "x") result = num1 * Number(displayText.textContent);
    if (operator === "/") {
        if(displayText.textContent === "0") {
            setTimeout(() => {
                displayText.textContent = 0;
            }, 1500);
            answer = ``;
            return "Cannot divide by zero";
        }
        result = num1 / Number(displayText.textContent);
    }
    if (result.toString().length > 10) {
        setTimeout(() => {
            displayText.textContent = 0;
        }, 1500);
        answer = ``;
        return "Error";
    } else {
        return result;
    }
}

// Theme Toggle Functionality
toggle.addEventListener("click", () => {
    toggle.setAttribute("aria-pressed", "true");
    const theme = toggle.getAttribute("value");
    selectTheme(theme);
})

const selectTheme = (theme) => {
    if(theme === "1") {
        toggle.setAttribute("value", "2");
        changeTheme(theme, "2")
        localStorage.setItem("theme", "2");
    } else if(theme === "2") {
        toggle.setAttribute("value", "3");
        changeTheme(theme, "3");
        localStorage.setItem("theme", "3");
    } else {
        toggle.setAttribute("value", "1");
        changeTheme(theme, "1");
        localStorage.setItem("theme", "1");
    }
}

function changeTheme(themeOld, themeNew) {
    body.classList.remove(`theme-${themeOld}`);
    body.classList.add(`theme-${themeNew}`);

    const equalBtn = document.getElementById("key-=");

    // displayText
    if(themeNew === "1") {
        displayText.classList.remove("text-2");
        displayText.classList.add("text-white");
    } else {
        displayText.classList.remove("text-white");
        displayText.classList.add("text-2");
    }

    // equalBtn
    if(themeNew === "3") {
        equalBtn.classList.remove("text-white");
        equalBtn.classList.add("text-3");
    } else {
        equalBtn.classList.remove("text-3");
        equalBtn.classList.add("text-white");
    }

};
