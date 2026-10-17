// --- ANIMAÇÃO DE FUNDO (PARTÍCULAS MODERNAS) ---
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1'; // Mantém o fundo estritamente atrás do conteúdo
canvas.style.pointerEvents = 'none'; // Garante que não atrapalhe cliques nos botões
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
        this.size = Math.random() * 2 + 0.8; // Tamanho discreto
        this.speedX = (Math.random() - 0.5) * 0.3; // Movimento suave e lento
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.4 + 0.1; // Transparência sutil
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
        // Usa a cor azulada/neon para combinar com o design moderno
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