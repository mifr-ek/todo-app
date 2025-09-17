let tasks = [];
let idCounter = 0;

// Hent tasks fra localStorage ved load
window.onload = function () {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
    idCounter = tasks.length ? tasks[tasks.length - 1].id + 1 : 0;
  }
  renderTasks();
};

// Tilføj task
function addTask(taskString, amount) {
  if (!taskString || taskString.trim() === "") return;

  const newTask = {
    id: idCounter++,
    task: taskString.trim(),
    amount: Number(amount) || 1,
    done: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

// Skift status (done <-> todo)
function toggleDone(id) {
  const task = tasks.find((t) => t.id === Number(id));
  if (!task) return;

  task.done = !task.done;
  saveTasks();
  renderTasks();
}

// Slet task
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== Number(id));
  saveTasks();
  renderTasks();
}

// Gem i localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render lister
function renderTasks() {
  const todoList = document.getElementById("todo-list");
  const doneList = document.getElementById("done-list");

  todoList.innerHTML = "";
  doneList.innerHTML = "";

  tasks.forEach((t) => {
    const li = document.createElement("li");
    li.dataset.id = t.id;
    li.classList.add("new");

    // Tekst og streg hvis done
    const span = document.createElement("span");
    span.textContent = `${t.task} (x${t.amount})`;
    if (t.done) span.style.textDecoration = "line-through";
    li.appendChild(span);

    // Knapper
    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "buttons";

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Slet";
    btnDelete.className = "action delete";
    btnDelete.onclick = () => deleteTask(t.id);

    if (t.done) {
      const btnUndo = document.createElement("button");
      btnUndo.textContent = "Fortryd";
      btnUndo.className = "action undo";
      btnUndo.onclick = () => toggleDone(t.id);

      buttonsDiv.appendChild(btnUndo);
      buttonsDiv.appendChild(btnDelete);
      li.appendChild(buttonsDiv);
      doneList.appendChild(li);
    } else {
      const btnDone = document.createElement("button");
      btnDone.textContent = "Færdig";
      btnDone.className = "action done";
      btnDone.onclick = () => toggleDone(t.id);

      buttonsDiv.appendChild(btnDone);
      buttonsDiv.appendChild(btnDelete);
      li.appendChild(buttonsDiv);
      todoList.appendChild(li);
    }
  });
}

// Knap: tilføj task
const taskInput = document.getElementById("task-input");
const taskAmount = document.getElementById("task-amount");

document.getElementById("add-task").addEventListener("click", () => {
  if (taskInput.value.trim() === "") {
    alert("Du skal skrive noget, før du kan tilføje!");
    return;
  }

  addTask(taskInput.value, taskAmount.value);
  taskInput.value = "";
  taskAmount.value = "";
});

// Enter key tilføjer task
[taskInput, taskAmount].forEach((input) => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (taskInput.value.trim() === "") {
        alert("Du skal skrive noget, før du kan tilføje!");
        return;
      }

      addTask(taskInput.value, taskAmount.value);
      taskInput.value = "";
      taskAmount.value = "";
    }
  });
});
