// Отримуємо елементи з DOM
const passwordOutput = document.getElementById('passwordOutput');
const copyBtn = document.getElementById('copyBtn');
const generateBtn = document.getElementById('generateBtn');
const passwordLength = document.getElementById('passwordLength');
const lengthValue = document.getElementById('lengthValue');
const uppercase = document.getElementById('uppercase');
const lowercase = document.getElementById('lowercase');
const numbers = document.getElementById('numbers');
const symbols = document.getElementById('symbols');
const strengthIndicator = document.getElementById('strengthIndicator');
const strengthText = document.getElementById('strengthText');
const passwordHistory = document.getElementById('passwordHistory');

// Набори символів
const charsets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

let generatedPasswords = JSON.parse(localStorage.getItem('passwordHistory')) || [];

// Оновлення значення довжини при зміні слайдера
passwordLength.addEventListener('input', () => {
    lengthValue.textContent = passwordLength.value;
});

// Функція генерації пароля
function generatePassword() {
    let availableChars = '';
    
    if (uppercase.checked) availableChars += charsets.uppercase;
    if (lowercase.checked) availableChars += charsets.lowercase;
    if (numbers.checked) availableChars += charsets.numbers;
    if (symbols.checked) availableChars += charsets.symbols;

    if (availableChars === '') {
        alert('Виберіть хоча б один тип символів!');
        return;
    }

    let password = '';
    const length = parseInt(passwordLength.value);

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * availableChars.length);
        password += availableChars[randomIndex];
    }

    passwordOutput.value = password;
    updatePasswordStrength(password);
    addToHistory(password);
}

// Функція оцінки міцності пароля
function updatePasswordStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 15;
    if (password.length >= 16) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) strength += 10;

    let strengthLevel = '';
    let strengthClass = '';

    if (strength < 40) {
        strengthLevel = 'Слабка';
        strengthClass = 'weak';
    } else if (strength < 70) {
        strengthLevel = 'Середня';
        strengthClass = 'medium';
    } else {
        strengthLevel = 'Міцна';
        strengthClass = 'strong';
    }

    strengthIndicator.className = `strength-fill ${strengthClass}`;
    strengthText.textContent = strengthLevel;
}

// Функція додавання пароля до історії
function addToHistory(password) {
    if (!generatedPasswords.includes(password)) {
        generatedPasswords.unshift(password);
        if (generatedPasswords.length > 10) {
            generatedPasswords.pop();
        }
        localStorage.setItem('passwordHistory', JSON.stringify(generatedPasswords));
    }
    renderHistory();
}

// Функція відображення історії
function renderHistory() {
    passwordHistory.innerHTML = '';

    generatedPasswords.forEach(password => {
        const li = document.createElement('li');
        li.className = 'history-item';

        const span = document.createElement('span');
        span.className = 'history-password';
        span.textContent = password;

        const copyHistoryBtn = document.createElement('button');
        copyHistoryBtn.className = 'history-copy-btn';
        copyHistoryBtn.textContent = 'Копіювати';
        copyHistoryBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(password);
            copyHistoryBtn.textContent = 'Скопійовано!';
            setTimeout(() => {
                copyHistoryBtn.textContent = 'Копіювати';
            }, 2000);
        });

        li.appendChild(span);
        li.appendChild(copyHistoryBtn);
        passwordHistory.appendChild(li);
    });
}

// Event Listeners
generateBtn.addEventListener('click', generatePassword);

copyBtn.addEventListener('click', () => {
    if (passwordOutput.value) {
        navigator.clipboard.writeText(passwordOutput.value);
        copyBtn.textContent = 'Скопійовано!';
        setTimeout(() => {
            copyBtn.textContent = 'Копіювати';
        }, 2000);
    }
});

// Генерація при завантаженні
generatePassword();
renderHistory();