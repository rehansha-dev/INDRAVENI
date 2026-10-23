/* Black background with a drifting blue mist, soft blue flowers and falling petals. */
(() => {
  'use strict';
  const c = document.getElementById('bg');
  const g = c.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const S = 0.6;                         // render scale: the mist is soft, so half-ish resolution looks identical
  let W = 0, H = 0, par = { x: 0, y: 0 }, inten = 0.55, intenTarget = 0.55, last = performance.now();

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rand = rng(7);

  // ---- pre-rendered, softly blurred flower sprites (cheap to draw every frame) ----
  function flower(petals, R, rgb, inner) {
    const size = Math.ceil(R * 2.6), o = document.createElement('canvas');
    o.width = o.height = size;
    const x = o.getContext('2d');
    x.translate(size / 2, size / 2);
    if ('filter' in x) x.filter = `blur(${Math.max(1, R * 0.025)}px)`;
    const ring = (n, r, rot, a) => {
      for (let i = 0; i < n; i++) {
        x.save();
        x.rotate(rot + (i * Math.PI * 2) / n);
        const gr = x.createRadialGradient(0, -r * 0.55, 0, 0, -r * 0.55, r * 0.55);
        gr.addColorStop(0, `rgba(${rgb},${0.6 * a})`);
        gr.addColorStop(0.65, `rgba(${rgb},${0.24 * a})`);
        gr.addColorStop(1, `rgba(${rgb},0)`);
        x.fillStyle = gr;
        x.beginPath();
        x.ellipse(0, -r * 0.55, r * 0.25, r * 0.5, 0, 0, Math.PI * 2);
        x.fill();
        x.restore();
      }
    };
    ring(petals, R, 0, 1);
    if (inner) ring(petals, R * 0.62, Math.PI / petals, 0.9);
    const cg = x.createRadialGradient(0, 0, 0, 0, 0, R * 0.2);
    cg.addColorStop(0, 'rgba(200,225,255,0.55)');
    cg.addColorStop(1, 'rgba(200,225,255,0)');
    x.fillStyle = cg;
    x.beginPath(); x.arc(0, 0, R * 0.2, 0, Math.PI * 2); x.fill();
    return o;
  }
  const sprites = [
    flower(6, 150, '70,140,255', true),
    flower(8, 150, '40,100,235', true),
    flower(5, 150, '120,180,255', false),
    flower(7, 150, '50,80,210', true)
  ];
  const petalSprite = flower(1, 40, '150,200,255', false);

  const blooms = Array.from({ length: 12 }, () => {
    const z = 0.35 + rand() * 0.65;
    return { sx: rand() * 1.1 - 0.05, sy: rand() * 1.1 - 0.05, z, size: (200 + rand() * 300) * z,
             rot0: rand() * 6.28, rotSp: (rand() - 0.5) * 0.06, sp: Math.floor(rand() * sprites.length),
             ph: rand() * 6.28, amp: 12 + rand() * 24 };
  });
  const petals = Array.from({ length: 34 }, () => {
    const z = 0.4 + rand() * 0.9;
    return { x0: rand(), y0: rand(), z, speed: 10 + rand() * 22, sway: 14 + rand() * 30,
             ph: rand() * 6.28, spin: (rand() - 0.5) * 0.8, size: 16 + rand() * 20 };
  });
  const mist = [
    { col: '40,100,255', a: 0.20, r: 0.62, fx: 0.031, fy: 0.023, ph: 0.0 },
    { col: '70,150,255', a: 0.13, r: 0.5,  fx: 0.027, fy: 0.035, ph: 1.7 },
    { col: '30,60,200',  a: 0.22, r: 0.7,  fx: 0.019, fy: 0.029, ph: 3.1 },
    { col: '90,170,255', a: 0.10, r: 0.42, fx: 0.041, fy: 0.021, ph: 4.4 },
    { col: '50,90,230',  a: 0.16, r: 0.58, fx: 0.023, fy: 0.037, ph: 5.2 },
    { col: '20,50,160',  a: 0.20, r: 0.66, fx: 0.033, fy: 0.017, ph: 2.3 }
  ];

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    c.width = Math.round(W * S); c.height = Math.round(H * S);
  }

  function render(t, dt) {
    inten += (intenTarget - inten) * (1 - Math.exp(-dt * 1.4));
    g.setTransform(S, 0, 0, S, 0, 0);
    g.globalCompositeOperation = 'source-over';
    g.globalAlpha = 1;
    g.fillStyle = '#000';
    g.fillRect(0, 0, W, H);

    // mist
    g.globalCompositeOperation = 'lighter';
    const R = Math.max(W, H);
    for (const m of mist) {
      const x = W * (0.5 + 0.42 * Math.sin(t * m.fx * 6.28 + m.ph)) + par.x * 40;
      const y = H * (0.5 + 0.40 * Math.cos(t * m.fy * 6.28 + m.ph * 1.3)) + par.y * 30;
      const rad = R * m.r;
      const gr = g.createRadialGradient(x, y, 0, x, y, rad);
      gr.addColorStop(0, `rgba(${m.col},${m.a * inten})`);
      gr.addColorStop(0.5, `rgba(${m.col},${m.a * inten * 0.35})`);
      gr.addColorStop(1, `rgba(${m.col},0)`);
      g.fillStyle = gr;
      g.fillRect(0, 0, W, H);
    }
    // faint warm glow behind the heart so red and blue blend
    const hx = W / 2, hy = H * 0.47, hr = Math.min(W, H) * 0.55;
    const hg = g.createRadialGradient(hx, hy, 0, hx, hy, hr);
    hg.addColorStop(0, `rgba(255,50,100,${0.07 * inten})`);
    hg.addColorStop(1, 'rgba(255,50,100,0)');
    g.fillStyle = hg; g.fillRect(0, 0, W, H);

    // flowers
    for (const b of blooms) {
      const x = b.sx * W + par.x * 70 * b.z + Math.sin(t * 0.07 + b.ph) * b.amp;
      const y = b.sy * H + par.y * 50 * b.z + Math.cos(t * 0.055 + b.ph) * b.amp;
      g.save();
      g.translate(x, y);
      g.rotate(b.rot0 + b.rotSp * t);
      g.globalAlpha = Math.min(1, (0.3 + 0.35 * b.z) * inten * 1.2);
      g.drawImage(sprites[b.sp], -b.size / 2, -b.size / 2, b.size, b.size);
      g.restore();
    }
    // falling petals
    for (const p of petals) {
      const span = H + 80;
      const y = ((p.y0 * span + t * p.speed * p.z) % span) - 40;
      const x = p.x0 * W + Math.sin(t * 0.6 + p.ph) * p.sway + par.x * 50 * p.z;
      g.save();
      g.translate(x, y);
      g.rotate(p.ph + t * p.spin);
      g.globalAlpha = Math.min(1, (0.25 + 0.3 * p.z) * inten * 1.3);
      const s = p.size * p.z;
      g.drawImage(petalSprite, -s, -s, s * 2, s * 2);
      g.restore();
    }

    // vignette keeps the edges properly black
    g.globalCompositeOperation = 'source-over';
    g.globalAlpha = 1;
    const vg = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, R * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,0.65)');
    g.fillStyle = vg; g.fillRect(0, 0, W, H);
  }

  function loop(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (!document.hidden) render(now / 1000, dt);
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); if (reduce) render(10, 0); });
  resize();
  if (reduce) render(10, 0); else requestAnimationFrame(loop);

  window.Bg = {
    setParallax(x, y) { par.x = x; par.y = y; },
    setIntensity(v) { intenTarget = v; if (reduce) { inten = v; render(10, 0); } }
  };
})();
