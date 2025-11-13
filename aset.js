// Task management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// DOM Elements
const taskNameInput = document.getElementById('task-name');
const taskDeadlineInput = document.getElementById('task-deadline');
const addTaskBtn = document.getElementById('add-task-btn');
const goToTasksBtn = document.getElementById('go-to-tasks');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');

document.addEventListener('DOMContentLoaded', function() {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    taskDeadlineInput.min = localDateTime;

    addTaskBtn.addEventListener('click', addTask);
    goToTasksBtn.addEventListener('click', () => showPage('tasks'));
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showPage(link.dataset.page);
        });
    });

    displayTasks();
});

// Fungsi navigasi
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(`${pageId}-page`).classList.add('active');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) link.classList.add('active');
    });

    if (pageId === 'tasks') displayTasks();
}

// Fungsi tugas
function addTask() {
    const taskName = taskNameInput.value.trim();
    const taskDeadline = taskDeadlineInput.value;

    if (!taskName || !taskDeadline) {
        alert('Harap isi nama dan tenggat waktu tugas!');
        return;
    }

    const task = {
        id: Date.now(),
        name: taskName,
        deadline: new Date(taskDeadline).toLocaleString(),
        completed: false,
        timestamp: new Date().toISOString()
    };

    tasks.push(task);
    saveTasks();
    addTaskToDOM(task);
    emptyState.style.display = 'none';
    clearForm();
}

function deleteTask(id) {
    if (confirm('Apakah kamu yakin ingin menghapus tugas ini?')) {
        const taskElement = document.getElementById(`task-${id}`);
        taskElement.classList.add('slide-out');
        setTimeout(() => {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            taskElement.remove();
            if (tasks.length === 0) emptyState.style.display = 'block';
        }, 300);
    }
}

function toggleComplete(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        updateTaskInDOM(task);
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskElement.id = `task-${task.id}`;
    taskElement.innerHTML = `
        <div class="task-info">
            <span class="task-name">${task.name}</span>
            <span class="task-deadline">⏰ Deadline: ${task.deadline}</span>
        </div>
        <div class="task-actions">
            <button class="action-button complete-button" onclick="toggleComplete(${task.id})">
                ${task.completed ? 'Undo' : 'Complete'}
            </button>
            <button class="action-button delete-button" onclick="deleteTask(${task.id})">
                Delete
            </button>
        </div>
    `;
    return taskElement;
}

function addTaskToDOM(task) {
    const taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
}

function updateTaskInDOM(task) {
    const taskElement = document.getElementById(`task-${task.id}`);
    if (taskElement) {
        if (task.completed) {
            taskElement.classList.add('completed');
        } else {
            taskElement.classList.remove('completed');
        }
        taskElement.querySelector('.complete-button').textContent = task.completed ? 'Undo' : 'Complete';
    }
}

function displayTasks() {
    document.querySelectorAll('.task-item').forEach(t => t.remove());
    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';
    tasks.forEach(addTaskToDOM);
}

function clearForm() {
    taskNameInput.value = '';
    taskDeadlineInput.value = '';
    taskNameInput.focus();
}