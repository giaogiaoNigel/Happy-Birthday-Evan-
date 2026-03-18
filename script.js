/* 开场动画 */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("intro-screen").classList.add("hide");
  }, 2600);

  setTimeout(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => launchFirework(), i * 280);
    }
  }, 700);
});

/* 打字效果 */
const text = "17岁快乐，Evan！愿你在英文辩论中自信发声，在足球场上尽情奔跑，在热爱的切尔西蓝里继续闪闪发光。";
const typingText = document.getElementById("typing-text");
let typeIndex = 0;

function typeWriter() {
  if (typeIndex < text.length) {
    typingText.textContent += text.charAt(typeIndex);
    typeIndex++;
    setTimeout(typeWriter, 70);
  }
}
typeWriter();

/* 英文辩论台词轮播 */
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

setInterval(() => {
  debateIndex = (debateIndex + 1) % debateLines.length;
  debateLineEl.style.opacity = 0;
  setTimeout(() => {
    debateLineEl.textContent = debateLines[debateIndex];
    debateLineEl.style.opacity = 1;
  }, 250);
}, 2600);

/* 数字动画 */
function animateNumber(id, target, duration = 1800) {
  const el = document.getElementById(id);
  let start = 0;
  const stepTime = Math.max(Math.floor(duration / target), 20);

  const timer = setInterval(() => {
    start += Math.ceil(target / 60);
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

/* 音乐 */
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
let isPlaying = false;

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
    alert("浏览器阻止了自动播放，请点击按钮播放音乐。");
  }
});

/* 粒子背景 */
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
const fireCanvas = document.getElementById("firework-canvas");
const fireCtx = fireCanvas.getContext("2d");

let particles = [];
let particleCount = window.innerWidth < 768 ? 35 : 70;
let fireworks = [];
let sparks = [];

function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  fireCanvas.width = window.innerWidth * devicePixelRatio;
  fireCanvas.height = window.innerHeight * devicePixelRatio;
  fireCanvas.style.width = window.innerWidth + "px";
  fireCanvas.style.height = window.innerHeight + "px";
  fireCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

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

/* 烟花 */
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

function launchFirework(x = Math.random() * window.innerWidth, y = Math.random() * window.innerHeight * 0.5 + 60) {
  const startX = window.innerWidth / 2;
  const startY = window.innerHeight;
  fireworks.push(new Firework(startX, startY, x, y, randomColor()));
}

function animateFireworks() {
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

document.getElementById("celebrateBtn").addEventListener("click", () => {
  for (let i = 0; i < 8; i++) {
    setTimeout(() => launchFirework(), i * 220);
  }
});

window.addEventListener("click", (e) => {
  if (!["musicBtn", "celebrateBtn", "kickBtn"].includes(e.target.id)) {
    launchFirework(e.clientX, e.clientY);
  }
});

/* 足球进球动画 */
const kickBtn = document.getElementById("kickBtn");
const football = document.getElementById("football");
const goalText = document.getElementById("goalText");
const goalkeeper = document.querySelector(".goalkeeper");

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

window.add0.88);
  text-align: center;
}

/* 纯CSS蛋糕 */
.cake-css {
  width: 240px;
  margin: 0 auto;
  position: relative;
  padding-top: 60px;
}

.candles {
  position: absolute;
  top: 0;
  left: 50%;
  width: 140px;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-around;
}

.candle {
  width: 14px;
  height: 50px;
  border-radius: 8px;
  background: linear-gradient(to bottom, #fff, #ff9ecf);
  position: relative;
  box-shadow: 0 0 12px rgba(255,255,255,0.25);
}

.flame {
  position: absolute;
  top: -18px;
  left: 50%;
  width: 14px;
  height: 18px;
  transform: translateX(-50%);
  background: radial-gradient(circle at 50% 60%, #fff6b7 0%, #ffd166 40%, #ff7b00 100%);
  border-radius: 50% 50% 50% 50%;
  animation: flicker 0.9s infinite ease-in-out;
  box-shadow: 0 0 18px rgba(255, 209, 102, 0.85);
}

@keyframes flicker {
  0%,100% { transform: translateX(-50%) scale(1) rotate(0deg); opacity: 1; }
  50% { transform: translateX(-50%) scale(1.12) rotate(4deg); opacity: 0.9; }
}

.cake-layer {
  height: 42px;
  border-radius: 16px;
  margin: 8px auto;
  position: relative;
}

.cake-layer.top {
  width: 120px;
  background: linear-gradient(to bottom, #ffccf2, #ff8fcf);
}

.cake-layer.middle {
  width: 170px;
  background: linear-gradient(to bottom, #bde0fe, #8ecae6);
}

.cake-layer.bottom {
  width: 220px;
  background: linear-gradient(to bottom, #ffd6a5, #ffb703);
}

.cake-base {
  width: 240px;
  height: 12px;
  margin: 10px auto 0;
  border-radius: 12px;
  background: rgba(255,255,255,0.8);
}

.message-section p {
  font-size: 1.08rem;
  line-height: 1.9;
  color: rgba(255,255,255,0.9);
  margin-bottom: 12px;
}

.gradient-text {
  background: linear-gradient(90deg, var(--gold), #fff, var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.numbers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 18px;
}

.num-box {
  padding: 24px 12px;
  text-align: center;
  border-radius: 20px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.14);
}

.num-box span {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  display: block;
  margin-bottom: 6px;
  color: var(--secondary);
}

.num-box small {
  color: rgba(255,255,255,0.8);
  font-size: 0.95rem;
}

.footer {
  text-align: center;
  color: rgba(255,255,255,0.75);
}

.floating-lights {
  position: fixed;
  inset: 0;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
}

.floating-lights span {
  position: absolute;
  bottom: -80px;
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0.1));
  animation: rise 16s linear infinite;
  opacity: 0.5;
}

.floating-lights span:nth-child(1) { left: 8%; width: 12px; height: 12px; animation-duration: 14s; }
.floating-lights span:nth-child(2) { left: 22%; width: 20px; height: 20px; animation-duration: 18s; animation-delay: 2s; }
.floating-lights span:nth-child(3) { left: 48%; width: 14px; height: 14px; animation-duration: 16s; animation-delay: 4s; }
.floating-lights span:nth-child(4) { left: 66%; width: 24px; height: 24px; animation-duration: 20s; animation-delay: 1s; }
.floating-lights span:nth-child(5) { left: 82%; width: 16px; height: 16px; animation-duration: 15s; animation-delay: 3s; }
.floating-lights span:nth-child(6) { left: 92%; width: 10px; height: 10px; animation-duration: 13s; animation-delay: 5s; }

@keyframes rise {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.45;
  }
  100% {
    transform: translateY(-120vh) scale(1.4);
    opacity: 0;
  }
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 28px;
    min-height: auto;
  }

  .hero-text {
    order: 2;
    text-align: center;
  }

  .hero-photo {
    order: 1;
  }

  .btn-group {
    justify-content: center;
  }

  .typing {
    min-height: 80px;
  }

  .numbers,
  .cake-wrap {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .container {
    width: 94%;
    padding-top: 20px;
  }

  .hero,
  .cake-section,
  .message-section,
  .count-section,
  .footer {
    border-radius: 20px;
  }

  .hero {
    padding: 22px 18px 26px;
  }

  .cake-section,
  .message-section,
  .count-section,
  .footer {
    padding: 20px 16px;
  }

  .small-title {
    font-size: 0.8rem;
  }

  .typing,
  .message-section p,
  .cake-text {
    font-size: 0.98rem;
  }

  .btn {
    width: 100%;
  }

  .cake-css {
    transform: scale(0.92);
  }
}
