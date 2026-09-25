const STORAGE_KEY = "todos";
const THEME_KEY = "theme";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const footer = document.getElementById("todo-footer");
const count = document.getElementById("todo-count");
const clearCompletedBtn = document.getElementById("clear-completed");
const themeToggle = document.getElementById("theme-toggle");

let todos = loadTodos();

function loadTodos() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function render() {
  list.innerHTML = "";

  for (const todo of todos) {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.setAttribute("aria-label", "Mark as done");
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "×";
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    li.append(checkbox, text, deleteBtn);
    list.appendChild(li);
  }

  const remaining = todos.filter((t) => !t.done).length;
  count.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} left`;

  emptyState.hidden = todos.length > 0;
  footer.hidden = todos.length === 0;
}

function addTodo(text) {
  todos.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2), text, done: false });
  saveTodos();
  render();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    saveTodos();
    render();
  }
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

function clearAll() {
  todos = [];
  saveTodos();
  render();
}

function setPinkMode(on) {
  document.body.classList.toggle("pink", on);
  themeToggle.setAttribute("aria-pressed", String(on));
  themeToggle.textContent = on ? "Default mode" : "Pink mode";
  localStorage.setItem(THEME_KEY, on ? "pink" : "default");
}

clearCompletedBtn.addEventListener("click", clearAll);

themeToggle.addEventListener("click", () => {
  setPinkMode(!document.body.classList.contains("pink"));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTodo(text);
  input.value = "";
  input.focus();
});

setPinkMode(localStorage.getItem(THEME_KEY) === "pink");
render();
