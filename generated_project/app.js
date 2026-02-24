// SimpleTodoApp core logic
// Step 1: Data model and persistence layer

/**
 * Represents a single todo item.
 * @param {string} id - Unique identifier (UUID or timestamp string).
 * @param {string} text - The task description.
 * @param {boolean} [completed=false] - Completion state.
 */
function TodoItem(id, text, completed = false) {
  this.id = id;
  this.text = text;
  this.completed = completed;
}

// expose globally
window.TodoItem = TodoItem;

/**
 * Persistence helper using localStorage.
 */
class TodoStore {
  /**
   * Load todos from localStorage.
   * @returns {TodoItem[]}
   */
  static load() {
    try {
      const raw = localStorage.getItem('todos');
      if (!raw) return [];
      const arr = JSON.parse(raw);
      // Ensure each entry becomes a TodoItem instance
      return arr.map(obj => new TodoItem(obj.id, obj.text, obj.completed));
    } catch (e) {
      console.error('Failed to load todos:', e);
      return [];
    }
  }

  /**
   * Save an array of TodoItem objects to localStorage.
   * @param {TodoItem[]} todos
   */
  static save(todos) {
    try {
      const plain = todos.map(t => ({ id: t.id, text: t.text, completed: t.completed }));
      localStorage.setItem('todos', JSON.stringify(plain));
    } catch (e) {
      console.error('Failed to save todos:', e);
    }
  }
}

window.TodoStore = TodoStore;

// Utility: escape HTML to avoid XSS when rendering user‑provided text.
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
window.escapeHtml = escapeHtml;

// Step 2: UI rendering utilities
/**
 * Render the list of tasks.
 * @param {TodoItem[]} todos - Array of todo items.
 * @param {string} [filter='all'] - One of 'all', 'active', 'completed'.
 */
function renderTasks(todos, filter = 'all') {
  const listEl = document.getElementById('task-list');
  if (!listEl) return;
  // Clear existing content
  listEl.innerHTML = '';

  const filtered = todos.filter(item => {
    if (filter === 'active') return !item.completed;
    if (filter === 'completed') return item.completed;
    return true; // all
  });

  filtered.forEach(item => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = item.id;
    if (item.completed) li.classList.add('completed');

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    if (item.completed) checkbox.checked = true;

    // Text span
    const span = document.createElement('span');
    span.className = 'task-text';
    span.innerHTML = escapeHtml(item.text);

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';

    // Assemble
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    listEl.appendChild(li);
  });
}
window.renderTasks = renderTasks;

// ---------------------------------------------------------------------------
// Module‑level state (will be initialised on DOMContentLoaded)
let todos = [];
let currentFilter = 'all';

// Step 3: Add new task handling
function addTask() {
  const input = document.getElementById('new-task-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return; // ignore empty input

  const id = Date.now().toString(); // simple unique id
  const newItem = new TodoItem(id, text, false);
  todos.push(newItem);
  TodoStore.save(todos);
  renderTasks(todos, currentFilter);
  input.value = '';
}

// Step 4: Delegated edit / delete / toggle handling
function handleTaskListClick(event) {
  const target = event.target;
  const li = target.closest('li.task-item');
  if (!li) return;
  const id = li.dataset.id;
  const itemIndex = todos.findIndex(t => t.id === id);
  if (itemIndex === -1) return;

  if (target.classList.contains('edit-btn')) {
    const newText = prompt('Edit task', todos[itemIndex].text);
    if (newText !== null) {
      todos[itemIndex].text = newText.trim();
      TodoStore.save(todos);
      renderTasks(todos, currentFilter);
    }
  } else if (target.classList.contains('delete-btn')) {
    todos.splice(itemIndex, 1);
    TodoStore.save(todos);
    renderTasks(todos, currentFilter);
  } else if (target.classList.contains('task-checkbox')) {
    todos[itemIndex].completed = target.checked;
    TodoStore.save(todos);
    // Instead of full re‑render we could toggle class, but keep it simple
    renderTasks(todos, currentFilter);
  }
}

// Step 5: Filtering view
function setFilter(filter) {
  currentFilter = filter;
  renderTasks(todos, currentFilter);
  // Update ARIA pressed state / visual active class on buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const isActive = btn.dataset.filter === filter;
    btn.setAttribute('aria-pressed', isActive);
    btn.classList.toggle('active', isActive);
  });
}

function handleFilterClick(event) {
  const btn = event.target.closest('.filter-btn');
  if (!btn) return;
  const filter = btn.dataset.filter;
  setFilter(filter);
}

// Step 6: Clear completed tasks
function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  TodoStore.save(todos);
  renderTasks(todos, currentFilter);
}

// Step 7: Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Load persisted todos
  todos = TodoStore.load();
  currentFilter = 'all';
  renderTasks(todos, currentFilter);

  // Add task listeners
  const addBtn = document.getElementById('add-task-btn');
  const input = document.getElementById('new-task-input');
  if (addBtn) addBtn.addEventListener('click', addTask);
  if (input) input.addEventListener('keypress', e => {
    if (e.key === 'Enter') addTask();
  });

  // Delegated task list actions
  const taskList = document.getElementById('task-list');
  if (taskList) taskList.addEventListener('click', handleTaskListClick);

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', handleFilterClick);
  });

  // Clear completed button
  const clearBtn = document.getElementById('clear-completed-btn');
  if (clearBtn) clearBtn.addEventListener('click', clearCompleted);
});

// Export key functions for potential external use (testing, etc.)
window.addTask = addTask;
window.clearCompleted = clearCompleted;
window.setFilter = setFilter;
