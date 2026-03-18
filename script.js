/* Intro screen */
window.addEventListener("load", () => {
  const intro = document.getElementById("intro-screen");

  if (intro) {
    setTimeout(() => {
      intro.classList.add("hide");
    }, 2000);

    setTimeout(() => {
      intro.style.display = "none";
    }, 3000);
  }

  setTimeout(() => {
    if (typeof launchFirework === "function") {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => launchFirework(), i * 280);
      }
    }
  }, 700);
});

/* Typing effect */
const typingText = document.getElementById("typing-text");
const text = "17岁快乐，Evan！愿你在英文辩论中自信发声，在足球场上尽情奔跑，在热爱的切尔西蓝里继续闪闪发光。";
let typeIndex = 0;

function typeWriter() {
  if (!typingText) return;
  if (typeIndex < text.length) {
    typingText.textContent += text.charAt(typeIndex);
    typeIndex++;
    setTimeout(typeWriter, 70);
  }
}
typeWriter();

/* Debate lines */
const debateLines = [
  "Ladies and gentlemen...",
  "This house believes that Evan is unstoppable.",
  "Point of information!",
  "On today's motion: Evan deserves the happiest birthday.",
  "Sharp logic. Strong voice. Brilliant future.",
  "Evan is ready to take the floor."
];

const debateLineEl = document.getElementById("debateLine");
let debateIndex = 0;

if (debateLineEl) {
  setInterval(() => {
    debateIndex = (debateIndex + 1) % debateLines.length;
    debateLineEl.style.opacity = 0;
    setTimeout(() => {
      debateLineEl.textContent = debateLines[debateIndex];
      debateLineEl.style.opacity = 1;
    }, 250);
  }, 2600);
}

/* Number animation */
function animateNumber(id, target, duration = 1800) {
  const el = document.getElementById(id);
  if (!el) return;

  let start = 0;
  const increment = Math.max(1, Math.ceil(target / 60));
  const stepTime = Math.max(Math.floor(duration / 60), 20);

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = start;
  }, stepTime);
}

animateNumber("days", 117);
animateNumber("stars", 1700);
animateNumber("wishes", 9999);

/* Music */
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
let isPlaying = false;

if (musicBtn && bgMusic) {
  musicBtn.addEventListener("click", async () => {
    try {
      if (isPlaying) {
        bgMusic.pause();
        musicBtn.textContent = "播放音乐 🎵";
        isPlaying = false;
      } else {
        await bgMusic.play();
        musicBtn.textContent = "暂停音乐 ⏸";
        isPlaying = true;
      }
    } catch (error) {
      alert("Browser blocked autoplay. Please click again to play music.");
    }
  });
}

/* Canvas setup */
const canvas = document.getElementById("particle-canvas");
const fireCanvas = document.getElementById("firework-canvas");

const ctx = canvas ? canvas.getContext("2d") : null;
const fireCtx = fireCanvas ? fireCanvas.getContext("2d") : null;

let particles = [];
let particleCount = window.innerWidth < 768 ? 35 : 70;
let fireworks = [];
let sparks = [];

function resizeCanvas() {
  if (canvas && ctx) {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  if (fireCanvas && fireCtx) {
    fireCanvas.width = window.innerWidth * devicePixelRatio;
    fireCanvas.height = window.innerHeight * devicePixelRatio;
    fireCanvas.style.width = window.innerWidth + "px";
    fireCanvas.style.height = window.innerHeight + "px";
    fireCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  particleCount = window.innerWidth < 768 ? 35 : 70;
  initParticles();
}

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2.2 + 0.6,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5
    });
  }
}

function drawParticles() {
  if (!ctx) return;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > window.innerWidth) p.dx *= -1;
    if (p.y < 0 || p.y > window.innerHeight) p.dy *= -1;

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dist = Math.hypot(p.x - q.x, p.y - q.y);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(124,199,255,${0.12 - dist / 1000})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawParticles);
}

/* Fireworks */
class Firework {
  constructor(x, y, targetX, targetY, color) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.color = color;
    this.angle = Math.atan2(targetY - y, targetX - x);
    this.speed = 5;
    this.distanceToTarget = Math.hypot(targetX - x, targetY - y);
    this.traveled = 0;
  }

  update() {
    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.x += vx;
    this.y += vy;
    this.traveled += Math.hypot(vx, vy);

    if (this.traveled >= this.distanceToTarget) {
      this.explode();
      return true;
    }
    return false;
  }

  draw() {
    if (!fireCtx) return;
    fireCtx.beginPath();
    fireCtx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    fireCtx.fillStyle = this.color;
    fireCtx.shadowBlur = 14;
    fireCtx.shadowColor = this.color;
    fireCtx.fill();
  }

  explode() {
    for (let i = 0; i < 60; i++) {
      sparks.push(new Spark(this.targetX, this.targetY, this.color));
    }
  }
}

class Spark {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 4 + 1;
    this.radius = Math.random() * 2 + 1;
    this.alpha = 1;
    this.decay = Math.random() * 0.018 + 0.01;
    this.gravity = 0.03;
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
  }

  update() {
    this.vx *= 0.99;
    this.vy *= 0.99;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
    return this.alpha <= 0;
  }

  draw() {
    if (!fireCtx) return;
    fireCtx.save();
    fireCtx.globalAlpha = this.alpha;
    fireCtx.beginPath();
    fireCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    fireCtx.fillStyle = this.color;
    fireCtx.shadowBlur = 16;
    fireCtx.shadowColor = this.color;
    fireCtx.fill();
    fireCtx.restore();
  }
}

function randomColor() {
  const colors = ["#034694", "#00d4ff", "#ffd166", "#ffffff", "#7cc7ff"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function launchFirework(
  x = Math.random() * window.innerWidth,
  y = Math.random() * window.innerHeight * 0.5 + 60
) {
  const startX = window.innerWidth / 2;
  const startY = window.innerHeight;
  fireworks.push(new Firework(startX, startY, x, y, randomColor()));
}

function animateFireworks() {
  if (!fireCtx) return;

  fireCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  fireworks = fireworks.filter(fw => {
    fw.draw();
    return !fw.update();
  });

  sparks = sparks.filter(sp => {
    sp.draw();
    return !sp.update();
  });

  requestAnimationFrame(animateFireworks);
}

const celebrateBtn = document.getElementById("celebrateBtn");
if (celebrateBtn) {
  celebrateBtn.addEventListener("click", () => {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => launchFirework(), i * 220);
    }
  });
}

window.addEventListener("click", (e) => {
  if (!["musicBtn", "celebrateBtn", "kickBtn"].includes(e.target.id)) {
    launchFirework(e.clientX, e.clientY);
  }
});

/* Goal game */
const kickBtn = document.getElementById("kickBtn");
const football = document.getElementById("football");
const goalText = document.getElementById("goalText");
const goalkeeper = document.querySelector(".goalkeeper");

if (kickBtn && football && goalText && goalkeeper) {
  kickBtn.addEventListener("click", () => {
    const directions = ["kick-left", "kick-center", "kick-right"];
    const randomDir = directions[Math.floor(Math.random() * directions.length)];
    const keeperPositions = ["35%", "50%", "65%"];
    const randomKeeper = keeperPositions[Math.floor(Math.random() * keeperPositions.length)];

    goalkeeper.style.left = randomKeeper;

    football.classList.remove("kick-left", "kick-center", "kick-right");
    void football.offsetWidth;
    football.classList.add(randomDir);

    const isGoal = Math.random() > 0.25;

    setTimeout(() => {
      if (isGoal) {
        goalText.textContent = "GOAL! 这一球献给 Evan！⚽💙";
        for (let i = 0; i < 4; i++) {
          setTimeout(() => launchFirework(), i * 180);
        }
      } else {
        goalText.textContent = "差一点！再来一脚，为 Evan 进球！";
      }
    }, 850);

    setTimeout(() => {
      football.classList.remove("kick-left", "kick-center", "kick-right");
    }, 1400);
  });
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
initParticles();
drawParticles();
animateFireworks();
