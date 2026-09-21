let tasks = [];
let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearBtn = document.getElementById("clearBtn");
const filterButtons = document.querySelectorAll(".filter");


// Load saved tasks
function loadTasks() {
    const savedTasks = localStorage.getItem("thiranexTasks");

    if (savedTasks) {
        try {
            tasks = JSON.parse(savedTasks);
        } catch (error) {
            tasks = [];
        }
    }

    renderTasks();
}


// Save tasks
function saveTasks() {
    localStorage.setItem("thiranexTasks", JSON.stringify(tasks));
}


// Add task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}


// Render tasks
function renderTasks() {

    taskList.innerHTML = "";

    let visibleTasks = tasks;

    if (currentFilter === "active") {
        visibleTasks = tasks.filter(function(task) {
            return !task.completed;
        });
    }

    if (currentFilter === "completed") {
        visibleTasks = tasks.filter(function(task) {
            return task.completed;
        });
    }

    if (visibleTasks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No tasks found.";
        emptyMessage.style.textAlign = "center";
        emptyMessage.style.color = "#94a3b8";
        emptyMessage.style.padding = "20px";

        taskList.appendChild(emptyMessage);
    }

    visibleTasks.forEach(function(task) {

        const taskDiv = document.createElement("div");
        taskDiv.className = "task";

        if (task.completed) {
            taskDiv.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {
            toggleTask(task.id);
        });


        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;


        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.addEventListener("click", function() {
            editTask(task.id);
        });


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            deleteTask(task.id);
        });


        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(taskText);
        taskDiv.appendChild(editButton);
        taskDiv.appendChild(deleteButton);

        taskList.appendChild(taskDiv);
    });

    updateCount();
}


// Complete / uncomplete task
function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {
            return {
                id: task.id,
                text: task.text,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}


// Edit task
function editTask(id) {

    const task = tasks.find(function(item) {
        return item.id === id;
    });

    if (!task) {
        return;
    }

    const newText = prompt("Edit task:", task.text);

    if (newText !== null && newText.trim() !== "") {

        task.text = newText.trim();

        saveTasks();
        renderTasks();
    }
}


// Delete task
function deleteTask(id) {

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();
    renderTasks();
}


// Clear completed tasks
function clearCompletedTasks() {

    tasks = tasks.filter(function(task) {
        return !task.completed;
    });

    saveTasks();
    renderTasks();
}


// Update task count
function updateCount() {

    const remaining = tasks.filter(function(task) {
        return !task.completed;
    }).length;

    if (remaining === 1) {
        taskCount.textContent = "1 task left";
    } else {
        taskCount.textContent = remaining + " tasks left";
    }
}


// Filter buttons
filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});


// Add button
addBtn.addEventListener("click", addTask);


// Enter key
taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


// Clear completed
clearBtn.addEventListener("click", clearCompletedTasks);


// Start application
loadTasks();
