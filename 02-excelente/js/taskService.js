export const isTitleValid = (title) => {
    const taskRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]{3,30}$/;
    return taskRegex.test(title.trim());
};

export const createTask = (title, status) => ({
    id: Date.now(),
    title,
    status,
    priority: false,
    createdAt: new Date().toLocaleString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    })
});

export const moveTaskLogic = (task, action) => {
    const cols = ['todo', 'doing', 'done'];
    let idx = cols.indexOf(task.status) + (action === 'next' ? 1 : -1);
    if (idx >= 0 && idx < cols.length) {
        task.status = cols[idx];
    }
};