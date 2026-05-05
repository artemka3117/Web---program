// Отримуємо елементи з DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');

// Завантажуємо задачи з localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Функція для відображення всіх задач
function renderTasks() {
    taskList.innerHTML = '';
    let completed = 0;

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(index));

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Видалити';
        deleteBtn.addEventListener('click', () => deleteTask(index));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);

        if (task.completed) completed++;
    });

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completed;
}

// Функція додавання задачи
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Введіть задачу!');
        return;
    }

    tasks.push({ text: taskText, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskInput.value = '';
    renderTasks();
}

// Функція видалення задачи
function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Функція позначення задачи як виконана
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Початкове відображення
renderTasks();