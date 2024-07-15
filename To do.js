document.addEventListener('DOMContentLoaded', function () {
    const list = document.querySelector('.body ul');
    const forms = document.forms;

    // Load tasks from local storage
    loadTasks();

    list.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            const li = e.target.parentElement;
            li.parentNode.removeChild(li);
            saveTasks();
        } else if (e.target.classList.contains('edit')) {
            const li = e.target.parentElement;
            const span = li.querySelector('.name');
            const taskName = span.textContent;
            const newTaskName = prompt("Edit task", taskName);
            if (newTaskName !== null && newTaskName.trim() !== "") {
                span.textContent = newTaskName;
                saveTasks();
            }
        } else if (e.target.classList.contains('complete')) {
            const li = e.target.parentElement;
            li.classList.toggle('completed');
            saveTasks();
        }
    });

    const addForm = forms['add'];
    addForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const value = addForm.querySelector('input[type="text"]').value;
        if (value.trim() !== "") {
            createTaskElement(value, false);
            addForm.reset();
            saveTasks();
        }
    });

    function createTaskElement(taskName, isCompleted) {
        const li = document.createElement('li');
        const taskNameSpan = document.createElement('span');
        const deleteBtn = document.createElement('span');
        const editBtn = document.createElement('span');
        const completeBtn = document.createElement('span');

        taskNameSpan.textContent = taskName;
        deleteBtn.textContent = 'delete';
        editBtn.textContent = 'edit';
        completeBtn.textContent = 'complete';

        taskNameSpan.classList.add('name');
        deleteBtn.classList.add('delete');
        editBtn.classList.add('edit');
        completeBtn.classList.add('complete');

        if (isCompleted) {
            li.classList.add('completed');
        }

        li.appendChild(taskNameSpan);
        li.appendChild(editBtn);
        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.body ul li').forEach(li => {
            tasks.push({
                name: li.querySelector('.name').textContent,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach(task => {
                createTaskElement(task.name, task.completed);
            });
        }
    }
});
