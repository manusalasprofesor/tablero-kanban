// --- 1. ESTADO CON PERSISTENCIA  ---
let tasks = JSON.parse(localStorage.getItem('kanban_tasks')) || [];

const save = () => localStorage.setItem('kanban_tasks', JSON.stringify(tasks));

const board = document.querySelector('#main-board');
const inputTask = document.querySelector('#task-input');
const btnAdd = document.querySelector('#add-btn');

// --- 2. VALIDACIÓN (REGEXP) ---
function isTitleValid(text) {
    const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]{3,30}$/;
    return regex.test(text);
}

// --- 3. RENDERIZADO CON FECHA  ---
function renderBoard() {
    document.querySelectorAll('.list').forEach(l => l.innerHTML = '');
    
    tasks.forEach(task => {
        const card = document.createElement('li');
        card.className = 'task-card';
        card.setAttribute('data-id', task.id);
        
        card.innerHTML = `
            <time class="task-date">${task.createdAt}</time>
            <span class="task-title">${task.title}</span>
            <div class="actions">
                <div>
                    <button class="btn-prev" data-action="prev">⬅️</button>
                    <button class="btn-next" data-action="next">➡️</button>
                </div>
                <button class="btn-delete" data-action="delete">Borrar</button>
            </div>
        `;
        
        document.querySelector(`#${task.status} .list`).appendChild(card);
    });
    console.clear(); // Limpia la consola para no acumular basura
    console.log(`✅ Acción completada. Total tareas: ${tasks.length}`);
    console.table(tasks);
}

// --- 4. EVENTOS (DELEGACIÓN) ---
board.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const card = btn.closest('.task-card');
    const id = parseInt(card.dataset.id);
    const action = btn.dataset.action;

    if (action === 'delete') {
        tasks = tasks.filter(t => t.id !== id);
    } else if (action === 'next' || action === 'prev') {
        const task = tasks.find(t => t.id === id);
        const cols = ['todo', 'doing', 'done'];
        let idx = cols.indexOf(task.status) + (action === 'next' ? 1 : -1);
        if (idx >= 0 && idx < cols.length) task.status = cols[idx];
    }

    save();
    renderBoard();
});

// 4.1 DOBLE CLICK PARA EDITAR
board.addEventListener('dblclick', (e) => {
    const card = e.target.closest('.task-card');
    if (!card) return;

    const id = parseInt(card.dataset.id);
    const task = tasks.find(t => t.id === id);
    
    const newTitle = prompt("Editar tarea (3-30 carácteres):", task.title);
    
    if (newTitle !== null) {
        const trimmed = newTitle.trim();
        if (isTitleValid(trimmed)) {
            task.title = trimmed;
            save();
            renderBoard();
        } else {
            alert("Título no válido. Se mantienen los cambios anteriores.");
        }
    }
});

// --- 5. CREACIÓN CON FECHA ---
function addNewTask() {
    const text = inputTask.value.trim();

    if (!isTitleValid(text)) {
        alert("Error: El título debe tener entre 3 y 30 carácteres.");
        return;
    }

    // Creamos fecha legible
    const now = new Date();
    const dateStr = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    tasks.push({
        id: Date.now(),
        title: text,
        status: document.querySelector('#column-select').value,
        createdAt: dateStr // Guardamos la fecha
    });

    save();
    renderBoard();
    inputTask.value = '';
    inputTask.focus();
}

btnAdd.addEventListener('click', addNewTask);
inputTask.addEventListener('keypress', (e) => { if(e.key === 'Enter') addNewTask(); });

window.onload = renderBoard;