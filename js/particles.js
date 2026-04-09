// ── HERO PARTICLES ──
(function () {
  const cv = document.getElementById('particles');
  const cx = cv.getContext('2d');
  const COLORS = ['#E8419A', '#6B8CFF', '#E8419A', '#E8419A', 'rgba(0,0,0,.2)'];
  let pts = [];

  function resize() { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; }

  function mkPt() {
    return {
      x: Math.random() * cv.width,
      y: Math.random() * cv.height,
      r: Math.random() * 1.8 + .4,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      a: Math.random() * .45 + .08
    };
  }

  resize();
  pts = Array.from({ length: 130 }, mkPt);
  window.addEventListener('resize', resize);

  (function tick() {
    cx.clearRect(0, 0, cv.width, cv.height);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = cv.width;
      if (p.x > cv.width) p.x = 0;
      if (p.y < 0) p.y = cv.height;
      if (p.y > cv.height) p.y = 0;
      cx.beginPath();
      cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      cx.fillStyle = p.c;
      cx.globalAlpha = p.a;
      cx.fill();
    });
    cx.globalAlpha = 1;
    requestAnimationFrame(tick);
  })();
})();
