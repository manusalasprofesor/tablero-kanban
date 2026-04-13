export function renderBoard(tasks, container) {
    container.querySelectorAll('.list').forEach(l => l.innerHTML = '');
  
    tasks.forEach(task => {
        const card = document.createElement('li');
        card.className = `task-card ${task.priority ? 'priority' : ''}`;
        card.setAttribute('data-id', task.id);
      
        card.innerHTML = `
            <article>
                <time class="task-date">${task.createdAt} ${task.priority ? '🔥' : ''}</time>
                <h3 class="task-title">${task.title}</h3>
                <footer class="actions">
                    <div class="move-btns">
                        <button data-action="prev" aria-label="Anterior">⬅️</button>
                        <button data-action="next" aria-label="Siguiente">➡️</button>
                    </div>
                    <button class="btn-delete" data-action="delete">Borrar</button>
                </footer>
            </article>
        `;
        container.querySelector(`#${task.status} .list`).appendChild(card);
    });
}