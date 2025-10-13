document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) window.location.href = 'login.html';

    const list = document.querySelector('.task-list');
    const addForm = document.getElementById('add');
    const searchInput = document.getElementById('search');
    const searchBtn = document.getElementById('searchBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const logoutBtn = document.getElementById('logoutBtn');

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        darkModeToggle.innerHTML = document.body.classList.contains('dark') ? '☀️' : '🌙';
    });

    const getUserData = () => {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if(!users[loggedInUser]) users[loggedInUser] = {password:'', tasks:[]};
        return users[loggedInUser];
    }

    const saveUserData = (userData) => {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        users[loggedInUser] = userData;
        localStorage.setItem('users', JSON.stringify(users));
    }

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    });

    function createTaskElement(name, priority, dueDate, completed){
        const li = document.createElement('li');
        li.classList.add(priority);
        if(completed) li.classList.add('completed');

        const nameSpan = document.createElement('span');
        nameSpan.textContent = name;
        nameSpan.classList.add('name');

        const dueSpan = document.createElement('span');
        dueSpan.textContent = dueDate ? `Due: ${dueDate}` : '';

        const actions = document.createElement('div');
        actions.classList.add('actions');
        ['edit','complete','delete'].forEach(a=>{
            const span = document.createElement('span');
            span.classList.add(a);
            span.textContent = a;
            actions.appendChild(span);
        });

        li.appendChild(nameSpan);
        li.appendChild(dueSpan);
        li.appendChild(actions);
        list.appendChild(li);

        highlightOverdue(li,dueDate);
        updateStats();
    }

    function highlightOverdue(li,dueDate){
        if(!dueDate) return;
        const today = new Date().toISOString().split('T')[0];
        if(dueDate < today && !li.classList.contains('completed')) li.classList.add('overdue');
    }

    function saveTasks(){
        const tasks = [];
        document.querySelectorAll('.task-list li').forEach(li=>{
            const dueDateText = li.querySelector('span:nth-child(2)').textContent.replace('Due: ','');
            highlightOverdue(li,dueDateText);
            tasks.push({
                name: li.querySelector('.name').textContent,
                priority: li.classList.contains('low')?'low':li.classList.contains('medium')?'medium':'high',
                dueDate: dueDateText,
                completed: li.classList.contains('completed')
            });
        });
        const userData = getUserData();
        userData.tasks = tasks;
        saveUserData(userData);
        updateStats();
    }

    function loadTasks(){
        list.innerHTML='';
        const tasks = getUserData().tasks;
        if(tasks) tasks.forEach(t=>createTaskElement(t.name,t.priority,t.dueDate,t.completed));
    }

    function updateStats(){
        const total = document.querySelectorAll('.task-list li').length;
        const completed = document.querySelectorAll('.task-list li.completed').length;
        document.querySelector('.tasks-stats').textContent = `Total: ${total} | Completed: ${completed} | Pending: ${total - completed}`;
    }

    addForm.addEventListener('submit', e=>{
        e.preventDefault();
        const taskName = document.getElementById('task').value.trim();
        const priority = document.getElementById('priority').value;
        const dueDate = document.getElementById('dueDate').value;
        if(taskName){
            createTaskElement(taskName,priority,dueDate,false);
            addForm.reset();
            saveTasks();
        }
    });

    searchBtn.addEventListener('click',()=>{
        const term = searchInput.value.toLowerCase();
        document.querySelectorAll('.task-list li').forEach(li=>{
            li.style.display = li.querySelector('.name').textContent.toLowerCase().includes(term)?'':'none';
        });
    });

    list.addEventListener('click', e=>{
        const li = e.target.closest('li');
        if(!li) return;
        if(e.target.classList.contains('delete')) li.remove();
        if(e.target.classList.contains('edit')){
            const newName = prompt('Edit task',li.querySelector('.name').textContent);
            if(newName) li.querySelector('.name').textContent=newName;
        }
        if(e.target.classList.contains('complete')) li.classList.toggle('completed');
        saveTasks();
    });

    loadTasks();
});
