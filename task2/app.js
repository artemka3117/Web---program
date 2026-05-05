// Отримуємо елементи з DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const totalTasks = document.getElementById('totalTasks');
const activeTasks = document.getElementById('activeTasks');
const completedTasks = document.getElementById('completedTasks');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('editModal');
const editInput = document.getElementById('editInput');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const closeBtn = document.querySelector('.close');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let editingIndex = -1;

// Функція для відображення всіх задач
function renderTasks() {
    taskList.innerHTML = '';
    let active = 0;
    let completed = 0;

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        // Фільтрування
        if (currentFilter === 'active' && task.completed) {
            li.classList.add('hidden');
        } else if (currentFilter === 'completed' && !task.completed) {
            li.classList.add('hidden');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(index));

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;

        const taskButtons = document.createElement('div');
        taskButtons.className = 'task-buttons';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Редагувати';
        editBtn.addEventListener('click', () => openEditModal(index));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Видалити';
        deleteBtn.addEventListener('click', () => deleteTask(index));

        taskButtons.appendChild(editBtn);
        taskButtons.appendChild(deleteBtn);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(taskButtons);
        taskList.appendChild(li);

        if (task.completed) completed++;
        else active++;
    });

    totalTasks.textContent = tasks.length;
    activeTasks.textContent = active;
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
    if (confirm('Видалити цю задачу?')) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
}

// Функція позначення задачи як виконана
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Функція відкриття модального вікна редагування
function openEditModal(index) {
    editingIndex = index;
    editInput.value = tasks[index].text;
    modal.classList.add('show');
    editInput.focus();
}

// Функція закриття модального вікна
function closeEditModal() {
    modal.classList.remove('show');
    editingIndex = -1;
}

// Функція збереження редагованої задачи
function saveEditedTask() {
    const newText = editInput.value.trim();
    
    if (newText === '') {
        alert('Введіть текст задачи!');
        return;
    }

    tasks[editingIndex].text = newText;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    closeEditModal();
    renderTasks();
}

// Фільтрування задач
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

saveBtn.addEventListener('click', saveEditedTask);
cancelBtn.addEventListener('click', closeEditModal);
closeBtn.addEventListener('click', closeEditModal);
editInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveEditedTask();
});

// Закриття модального вікна при кліку поза ним
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeEditModal();
    }
});

// Початкове відображення
renderTasks();