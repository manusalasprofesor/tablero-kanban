// --- 1. ESTADO INICIAL (ARRAY VACÍO, SIN LOCALSTORAGE) ---
let tasks = []; 

const board = document.querySelector('#main-board');
const inputTask = document.querySelector('#task-input');
const btnAdd = document.querySelector('#add-btn');

// --- 2. FUNCIÓN DE VALIDACIÓN (REGEXP) ---
function isTitleValid(text) {
    // Entre 3 y 30 carácteres, letras, números y espacios
    const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]{3,30}$/;
    return regex.test(text);
}

// --- 3. RENDERIZADO ---
function renderBoard() {
    document.querySelectorAll('.list').forEach(l => l.innerHTML = '');
    
    tasks.forEach(task => {
        const card = document.createElement('li'); // Usamos li para semántica
        card.className = 'task-card';
        card.setAttribute('data-id', task.id);
        
        card.innerHTML = `
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

    renderBoard();
});

// --- 5. CREACIÓN CON VALIDACIÓN ---
function addNewTask() {
    const text = inputTask.value.trim();

    // Validación antes de añadir
    if (!isTitleValid(text)) {
        alert("Error: El título debe tener entre 3 y 30 carácteres (solo letras, números y espacios).");
        return;
    }

    tasks.push({
        id: Date.now(),
        title: text,
        status: document.querySelector('#column-select').value
    });

    renderBoard();
    inputTask.value = '';
    inputTask.focus();
}

btnAdd.addEventListener('click', addNewTask);
inputTask.addEventListener('keypress', (e) => { if(e.key === 'Enter') addNewTask(); });

window.onload = renderBoard;