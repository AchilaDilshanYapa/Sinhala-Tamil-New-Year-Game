const canvas = document.getElementById('fireCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');
const timeElement = document.getElementById('timeValue');
const newYearMessage = document.getElementById('newYearMessage');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let score = 0;
let timeLeft = 60;
let gameActive = true;

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 2;
        this.speedY = Math.random() * -3 - 2;
        this.speedX = Math.random() * 2 - 1;
        this.color = `hsl(${Math.random() * 50 + 20}, 100%, 50%)`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticles(x, y) {
    const particleCount = 5;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y));
    }
}

function handleParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].size <= 0.1) {
            particles.splice(i, 1);
        }
    }
}

function updateScore() {
    score++;
    scoreElement.textContent = score;
}

function updateTimer() {
    if (timeLeft > 0 && gameActive) {
        timeLeft--;
        timeElement.textContent = timeLeft;
        if (timeLeft === 0) {
            gameOver();
        }
    }
}

function gameOver() {
    gameActive = false;
    newYearMessage.style.display = 'block';
}

function animate() {
    if (!gameActive) return;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    handleParticles();
    requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', (e) => {
    if (gameActive) {
        createParticles(e.x, e.y);
        updateScore();
    }
});

canvas.addEventListener('touchmove', (e) => {
    if (gameActive) {
        e.preventDefault();
        const touch = e.touches[0];
        createParticles(touch.clientX, touch.clientY);
        updateScore();
    }
}, { passive: false });

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

setInterval(updateTimer, 1000);
animate();