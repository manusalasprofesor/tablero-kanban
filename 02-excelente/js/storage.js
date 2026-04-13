const KEY = 'kanban_tasks';

export const loadTasks = () => JSON.parse(localStorage.getItem(KEY)) || [];
export const saveTasks = (tasks) => localStorage.setItem(KEY, JSON.stringify(tasks));