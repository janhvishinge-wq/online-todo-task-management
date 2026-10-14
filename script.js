
const taskForm = document.getElementById("taskForm");
const tasksContainer = document.getElementById("tasksContainer");
const filter = document.getElementById("filter");

let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];

function saveTasks() {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}

function updateStats() {
    document.getElementById("total").textContent = tasks.length;

    document.getElementById("pending").textContent =
        tasks.filter(task => !task.completed).length;

    document.getElementById("completed").textContent =
        tasks.filter(task => task.completed).length;
}

function renderTasks() {
    tasksContainer.innerHTML = "";

    const selectedFilter = filter.value;

    const filteredTasks = tasks.filter(task => {
        if (selectedFilter === "Pending") {
            return !task.completed;
        }

        if (selectedFilter === "Completed") {
            return task.completed;
        }

        return true;
    });

    document.getElementById("emptyMessage").style.display =
        filteredTasks.length === 0 ? "block" : "none";

    filteredTasks.forEach(task => {
        const taskElement = document.createElement("div");

        taskElement.className = "task" +
            (task.completed ? " done" : "");

        const info = document.createElement("div");
        info.className = "task-info";

        const title = document.createElement("h3");
        title.textContent = task.title;

        const description = document.createElement("p");
        description.textContent =
            task.description || "No description";

        const priority = document.createElement("span");
        priority.className = "priority " + task.priority;
        priority.textContent = task.priority + " Priority";

        const date = document.createElement("p");
        date.textContent = task.dueDate
            ? "Due: " + task.dueDate
            : "No due date";

        info.append(title, description, priority, date);

        const actions = document.createElement("div");
        actions.className = "actions";

        const completeButton = document.createElement("button");
        completeButton.className = "complete-btn";
        completeButton.textContent =
            task.completed ? "Undo" : "Complete";

        completeButton.addEventListener("click", () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        });

        actions.append(completeButton, deleteButton);
        taskElement.append(info, actions);
        tasksContainer.appendChild(taskElement);
    });

    updateStats();
}

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("taskTitle").value.trim();
    const description =
        document.getElementById("taskDescription").value.trim();
    const priority = document.getElementById("priority").value;
    const dueDate = document.getElementById("dueDate").value;

    if (!title) return;

    const newTask = {
        id: Date.now(),
        title: title,
        description: description,
        priority: priority,
        dueDate: dueDate,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskForm.reset();
});

filter.addEventListener("change", renderTasks);

renderTasks();
