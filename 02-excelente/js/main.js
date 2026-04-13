import { loadTasks, saveTasks } from './storage.js';
import { createTask, moveTaskLogic, isTitleValid } from './taskService.js';
import { renderBoard } from './ui.js';

let tasks = loadTasks();
const board = document.querySelector('#main-board');
const inputTask = document.querySelector('#task-input');
const btnAdd = document.querySelector('#add-btn');
const searchInput = document.querySelector('#search-input');

// Función de sincronización: Datos -> Guardar -> Renderizar
const sync = (filteredTasks = tasks) => {
    saveTasks(tasks);
    renderBoard(filteredTasks, board);
    // --- EL CONSOLE.LOG CLAVE ---
    console.clear(); // Limpia la consola para no acumular basura
    console.log("📊 Estado actualizado del array de tareas:");
    console.table(tasks); // console.table lo muestra mucho más elegante que .log
};

// --- FILTRO EN TIEMPO REAL ---
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = tasks.filter(t => t.title.toLowerCase().includes(term));
    sync(filtered);
});

// --- EDICIÓN IN-PLACE (Doble Click) ---
board.addEventListener('dblclick', (e) => {
    if (e.target.classList.contains('task-title')) {
        const span = e.target;
        const card = span.closest('.task-card');
        const task = tasks.find(t => t.id === parseInt(card.dataset.id));
        
        span.contentEditable = true;
        span.focus();

        const finishEdit = () => {
            span.contentEditable = false;
            const newText = span.innerText.trim();
            if (isTitleValid(newText)) {
                task.title = newText;
            } else {
                alert("Título inválido (3-30 caracteres).");
                span.innerText = task.title;
            }
            sync();
        };

        span.addEventListener('blur', finishEdit, { once: true });
        span.addEventListener('keydown', (en) => { if (en.key === 'Enter') { en.preventDefault(); span.blur(); } });
    }
});

// --- CLICKS (Botones, Borrar y Limpiar Columna) ---
board.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    // Limpiar columna
    if (btn.classList.contains('btn-clear')) {
        const col = btn.dataset.col;
        if (confirm(`¿Vaciar columna ${col}?`)) {
            tasks = tasks.filter(t => t.status !== col);
            sync();
        }
        return;
    }

    const card = btn.closest('.task-card');
    if (!card) return;
    const id = parseInt(card.dataset.id);
    const action = btn.dataset.action;

    if (action === 'delete') {
        tasks = tasks.filter(t => t.id !== id);
    } else if (action === 'next' || action === 'prev') {
        moveTaskLogic(tasks.find(t => t.id === id), action);
    }
    sync();
});

// --- CLICK DERECHO (Prioridad) ---
board.addEventListener('contextmenu', (e) => {
    const card = e.target.closest('.task-card');
    if (!card) return;
    e.preventDefault();
    const task = tasks.find(t => t.id === parseInt(card.dataset.id));
    task.priority = !task.priority;
    sync();
});

// --- AÑADIR TAREA ---
const handleAdd = () => {
    const text = inputTask.value.trim();
    if (isTitleValid(text)) {
        tasks.push(createTask(text, document.querySelector('#column-select').value));
        inputTask.value = '';
        sync();
    } else {
        alert("Título no válido.");
    }
};

btnAdd.addEventListener('click', handleAdd);
inputTask.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleAdd(); });

renderBoard(tasks, board);