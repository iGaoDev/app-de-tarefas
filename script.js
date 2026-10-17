// --- 1. LÓGICA DO APP DE TAREFAS ---
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const subtitleText = document.getElementById('subtitleText');
const progressPercentage = document.getElementById('progressPercentage');
const progressSubText = document.getElementById('progressSubText');
const taskCountBadge = document.getElementById('taskCountBadge');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [
    { text: 'Revisar proposta comercial', tag: 'Trabalho', priority: 'Prioridade alta', completed: false },
    { text: 'Comprar itens para o jantar', tag: 'Pessoal', priority: '', completed: false },
    { text: 'Preparar apresentação semanal', tag: 'Trabalho', priority: 'Prioridade alta', completed: false },
    { text: 'Agendar consulta médica', tag: 'Saúde', priority: '', completed: false }
];

function renderTasks() {
    taskList.innerHTML = '';

    let completedCount = 0;
    let totalTasks = tasks.length;

    tasks.forEach((task, index) => {
        if (task.completed) {
            completedCount++;
        }

        const li = document.createElement('li');
        if (task.completed) {
            li.classList.add('completed');
        }

        const taskMain = document.createElement('div');
        taskMain.className = 'task-main';

        const checkbox = document.createElement('div');
        checkbox.className = 'task-checkbox';
        checkbox.onclick = () => toggleTask(index);

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;
        span.onclick = () => toggleTask(index);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '✕';
        deleteBtn.onclick = () => deleteTask(index);

        taskMain.appendChild(checkbox);
        taskMain.appendChild(span);
        taskMain.appendChild(deleteBtn);
        li.appendChild(taskMain);

        if (task.tag || task.priority) {
            const taskFooter = document.createElement('div');
            taskFooter.className = 'task-footer';

            if (task.tag) {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'task-tag';
                tagSpan.textContent = task.tag;
                taskFooter.appendChild(tagSpan);
            }

            if (task.priority) {
                const prioritySpan = document.createElement('span');
                prioritySpan.className = 'task-priority';
                prioritySpan.textContent = task.priority;
                taskFooter.appendChild(prioritySpan);
            }

            li.appendChild(taskFooter);
        }

        taskList.appendChild(li);
    });

    let pendingCount = totalTasks - completedCount;
    let percentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    if (subtitleText) subtitleText.textContent = `Tens ${pendingCount} tarefas para concluir hoje.`;
    if (progressPercentage) progressPercentage.textContent = `${percentage}%`;
    if (progressSubText) progressSubText.textContent = `${completedCount} de ${totalTasks} concluídas`;
    if (taskCountBadge) taskCountBadge.textContent = pendingCount;
}

function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    tasks.push({ text: text, tag: 'Geral', priority: '', completed: false });
    taskInput.value = '';
    saveAndRender();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveAndRender();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

if (addBtn) addBtn.onclick = addTask;
if (taskInput) {
    taskInput.onkeypress = (e) => {
        if (e.key === 'Enter') addTask();
    };
}

renderTasks();


// --- 2. ANIMAÇÃO DE FUNDO (PARTÍCULAS) ---
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let particlesArray = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }
    draw() {
        ctx.fillStyle = `rgba(59, 130, 246, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}
initParticles();

function animateBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animateBackground);
}
animateBackground();