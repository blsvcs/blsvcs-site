(() => {
  const lines = [
    "THE NAME IS INCOMPLETE.",
    "SO IS THE STORY.",
    "SOMETHING IS TAKING SHAPE.",
    "BUILT QUIETLY. MEANT TO MOVE LOUDLY.",
    "NOT ANNOUNCED. NOT EXPLAINED. NOT YET.",
    "YOU'LL KNOW WHEN IT BEGINS."
  ];
  const cycleMs = 7000;
  const line = document.querySelector("#line");
  const counter = document.querySelector("#counter");
  const surge = document.querySelector("#surge");
  const noticed = document.querySelector("#noticed");
  const button = document.querySelector("#signalButton");
  const deep = document.querySelector(".parallax-deep");
  const mid = document.querySelector(".parallax-mid");
  const near = document.querySelector(".parallax-near");
  const word = document.querySelector(".parallax-word");
  let index = 0;

  const playLine = () => {
    line.classList.remove("play");
    void line.offsetWidth;
    line.classList.add("play");
  };

  const triggerSurge = () => {
    surge.classList.remove("active");
    void surge.offsetWidth;
    surge.classList.add("active");
    window.setTimeout(() => surge.classList.remove("active"), 4700);
  };

  playLine();
  window.setInterval(() => {
    index = (index + 1) % lines.length;
    line.textContent = lines[index];
    counter.textContent = `${String(index + 1).padStart(2, "0")} / 06`;
    playLine();
    if (index === 0) triggerSurge();
  }, cycleMs);

  button.addEventListener("click", () => {
    noticed.classList.add("visible");
    triggerSurge();
  });

  let targetX = 0;
  let targetY = 0;
  let x = 0;
  let y = 0;
  window.addEventListener("pointermove", (event) => {
    targetX = (event.clientX / window.innerWidth - .5) * 2;
    targetY = (event.clientY / window.innerHeight - .5) * 2;
  }, { passive: true });

  const parallax = () => {
    x += (targetX - x) * .06;
    y += (targetY - y) * .06;
    deep.style.transform = `translate3d(${x * -14}px, ${y * -10}px, 0)`;
    mid.style.transform = `translate3d(${x * -26}px, ${y * -18}px, 0)`;
    near.style.transform = `translate3d(calc(-50% + ${x * 10}px), calc(-50% + ${y * 8}px), 0)`;
    word.style.translate = `${x * -6}px ${y * -4}px`;
    requestAnimationFrame(parallax);
  };
  requestAnimationFrame(parallax);

  const canvas = document.querySelector("#particles");
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: -9999, y: -9999 };
  let width = 0;
  let height = 0;
  let particles = [];

  const build = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(120, Math.max(40, width * height / 16000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - .5) * .09,
      vy: -.03 - Math.random() * .07,
      radius: .4 + Math.random() * 1.3,
      alpha: .08 + Math.random() * .32
    }));
  };

  window.addEventListener("resize", build);
  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  }, { passive: true });
  window.addEventListener("pointerleave", () => { pointer.x = -9999; pointer.y = -9999; });
  build();

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      if (!reduce) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const distance = dx * dx + dy * dy;
        if (distance < 26000) {
          const force = (1 - distance / 26000) * .05;
          p.x += dx * force;
          p.y += dy * force;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -8) p.y = height + 8;
        if (p.x < -8) p.x = width + 8;
        if (p.x > width + 8) p.x = -8;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(226,232,240,${p.alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
})();
