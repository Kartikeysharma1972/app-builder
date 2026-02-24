# SimpleTodoApp

**SimpleTodoApp** is a lightweight, web‑based todo list manager. It runs entirely in the browser using only HTML, CSS, and vanilla JavaScript. The app lets users add, edit, delete, toggle completion, filter tasks, and clear completed items, with data persisted in `localStorage`.

---

## Tech Stack
- **HTML5** – Structure of the UI.
- **CSS3** – Styling and responsive layout (no external frameworks).
- **JavaScript (ES6)** – Core application logic, DOM manipulation, and persistence.

---

## Features
- ✅ **Add tasks** – Enter a description and press **Add** or `Enter`.
- ✅ **Edit tasks** – Click **Edit** on a task to modify its text.
- ✅ **Delete tasks** – Remove a task with the **Delete** button.
- ✅ **Toggle completion** – Check/uncheck the checkbox to mark a task as completed.
- ✅ **Filter view** – Show **All**, **Active**, or **Completed** tasks.
- ✅ **Clear completed** – Remove all completed tasks with a single button.
- ✅ **Persisted data** – Tasks are saved in `localStorage` and restored on page load.
- ✅ **Responsive design** – Works on desktop and mobile browsers.

---

## Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/simpletodoapp.git
   cd simpletodoapp
   ```
2. **Open the application**
   - Open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari, etc.). No build steps or server are required.

---

## Usage Guide
### Adding a Task
1. Type the task description into the **"What needs to be done?"** input field.
2. Click the **Add** button or press **Enter**.
3. The new task appears in the list.

### Editing a Task
- Click the **Edit** button next to a task.
- A prompt appears; modify the text and confirm.
- The list updates with the edited description.

### Deleting a Task
- Click the **Delete** button next to the task you wish to remove.

### Toggling Completion
- Click the checkbox on a task to mark it as completed or active.
- Completed tasks are displayed with a line‑through style.

### Filtering Tasks
- Use the **All**, **Active**, and **Completed** buttons at the bottom to change the visible subset.
- The active filter button is highlighted.

### Clearing Completed Tasks
- Press the **Clear Completed** button to permanently remove all tasks that are marked completed.

---

## Code Structure
| File | Purpose |
|------|---------|
| `index.html` | The main HTML page. It defines the layout, includes the stylesheet (`styles.css`), and loads the JavaScript logic (`app.js`). |
| `styles.css` (or `style.css`) | Contains all styling rules, CSS variables, and responsive breakpoints for the app. The page links to `styles.css`.
| `app.js` | Implements the core functionality:
- **Data model** (`TodoItem`) and persistence layer (`TodoStore`).
- **Rendering** (`renderTasks`) that builds the task list DOM based on the current filter.
- Event handlers for adding, editing, deleting, toggling, filtering, and clearing tasks.
- Initialization on `DOMContentLoaded` that loads saved tasks from `localStorage` and wires up UI events.
| `README.md` | Project documentation (this file).

The JavaScript module attaches most functions to `window` for easy debugging, but the UI interactions are driven entirely by event listeners defined in the initialization block.

---

## Persistence (localStorage)
- All tasks are stored under the key **`todos`** in the browser's `localStorage` as a JSON string.
- On page load, `app.js` reads this key, parses the data, and reconstructs `TodoItem` objects.
- Every change (add, edit, delete, toggle, clear) triggers `TodoStore.save`, which overwrites the stored JSON.
- Because `localStorage` is scoped to the origin, data remains available across page reloads and browser restarts **as long as the same domain/file path is used**.

---

## Screenshots
*(Replace the placeholders with actual screenshots when available.)*

![App Overview](./screenshots/overview.png)

---

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug‑fix.
3. Ensure the UI remains accessible and the existing functionality is not broken.
4. Open a pull request with a clear description of your changes.

---

## License
This project is licensed under the **MIT License** – see the `LICENSE` file for details.
