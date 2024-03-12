let currentSlide = 0;
const slidesContainer = document.querySelector('.slides');
const slideWidth = slidesContainer.querySelector('.slide').clientWidth; // Get width of each slide
let totalSlides = document.querySelectorAll('.slide').length;

function cloneAndAppendSlides() {
    const slides = document.querySelectorAll('.slide');
    const firstSlide = slides[0];
    const lastSlide = slides[totalSlides - 1];

    // Clone the first slide and append it to the end
    const cloneFirstSlide = firstSlide.cloneNode(true);
    slidesContainer.appendChild(cloneFirstSlide);

    // Clone the last slide and prepend it to the beginning
    const cloneLastSlide = lastSlide.cloneNode(true);
    slidesContainer.insertBefore(cloneLastSlide, firstSlide);

    // Update totalSlides count
    totalSlides += 1;
}

function nextSlide() {
    currentSlide++; // Increment current slide index

    // Calculate the new transition offset based on the current slide
    const offset = -currentSlide * slideWidth;

    // Update the transition transform
    slidesContainer.style.transition = 'transform 0.5s ease';
    slidesContainer.style.transform = `translateX(${offset}px)`;

    // Reset to the first slide when reaching the last cloned slide
    if (currentSlide === totalSlides - 1) {
        setTimeout(() => {
            currentSlide = 0;
            slidesContainer.style.transition = 'none'; // Disable transition for instant reset
            slidesContainer.style.transform = `translateX(0px)`; // Move back to the first slide instantly
        }, 500); // Timeout should match transition duration
    }
}

// Append initial set of slides
cloneAndAppendSlides();

// Automatically switch to the next slide every 3 seconds
setInterval(nextSlide, 4000);

// Load tasks from localStorage or initialize an empty array
var tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function addTask() {
    var taskInput = document.getElementById("taskInput");
    var taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    var task = {
        text: taskText,
        completed: false,
        id: Date.now()
    };

    tasks.push(task);
    saveTasks(); // Save tasks to localStorage
    taskInput.value = "";
    renderTasks();
}

function toggleComplete(id) {
    var taskIndex = tasks.findIndex(task => task.id === id);
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    saveTasks(); // Save tasks to localStorage
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks(); // Save tasks to localStorage
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    var pendingTasksList = document.getElementById("pendingTasks");
    var completedTasksList = document.getElementById("completedTasks");
    pendingTasksList.innerHTML = "";
    completedTasksList.innerHTML = "";

    // Check if there are any pending tasks
    if (tasks.some(task => !task.completed)) {
        tasks.forEach(task => {
            if (!task.completed) {
                var li = document.createElement("li");
                li.textContent = task.text;
                var toggleButton = document.createElement("button");
                toggleButton.innerHTML = '<i class="fas fa-check" style="color: beige;"></i>';
                toggleButton.style.backgroundColor = "#1F3150";
                toggleButton.onclick = function () {
                    toggleComplete(task.id);
                };
                var deleteButton = document.createElement("button");
                deleteButton.innerHTML = '<i class="fas fa-trash-alt" style="color: beige;"></i>';
                deleteButton.style.backgroundColor = "#1F3150";
                deleteButton.onclick = function () {
                    deleteTask(task.id);
                };


                var buttonsDiv = document.createElement("div");
                buttonsDiv.classList.add("buttons");
                buttonsDiv.appendChild(toggleButton);
                buttonsDiv.appendChild(deleteButton);
                li.appendChild(buttonsDiv);
                pendingTasksList.appendChild(li);
            }
        });
    } else {
        document.getElementById("pendingTasks").style.textAlign = "center";
        var noPendingTasks = document.createElement("li");
        noPendingTasks.textContent = "You're all done. Result!";
        noPendingTasks.classList.add("no-border");
        pendingTasksList.appendChild(noPendingTasks);
        var allDoneContainer = document.createElement("div");
        allDoneContainer.classList.add("all-done-container");
        var image = document.createElement("img");
        image.src = "images/cartoon.png";
        image.alt = "All done image";
        image.classList.add("all-done-image");
        allDoneContainer.appendChild(image);
        pendingTasksList.appendChild(allDoneContainer);
    }

    if (tasks.some(task => task.completed)) {
        tasks.forEach(task => {
            if (task.completed) {
                var li = document.createElement("li");
                li.textContent = task.text;
                li.classList.add("completed");
                var deleteButton = document.createElement("button");
                deleteButton.innerHTML = '<i class="fas fa-trash-alt" style="color: beige;"></i>';
                deleteButton.style.backgroundColor = "#1F3150";
                deleteButton.onclick = function () {
                    deleteTask(task.id);
                };
                li.appendChild(deleteButton);
                completedTasksList.appendChild(li);

            }
        });
    } else {
        var noCompletedTasks = document.createElement("li");
        noCompletedTasks.textContent = "no completed tasks!";
        completedTasksList.appendChild(noCompletedTasks);
    }
}

renderTasks();
const create = document.getElementById("taskInput");
create.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        addTask();
    }
})