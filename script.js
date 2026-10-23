/* Happy Birthday Indu — a big heart made of birthday wishes in 100+ languages. */
(() => {
  'use strict';

  // ---------- Settings you may want to change ----------
  const NAME = 'Indu';

  // "Happy Birthday" in many languages. NAME is added after each one.
  // To add a language, just add a line:  'your greeting',
  const GREETINGS = [
    // Europe
    'Happy Birthday', 'Feliz cumpleaños', 'Joyeux anniversaire', 'Alles Gute zum Geburtstag', 'Buon compleanno',
    'Feliz aniversário', 'Gefeliciteerd met je verjaardag', 'Gëzuar ditëlindjen', 'Zorionak', 'З днём нараджэння',
    'Sretan rođendan', 'Честит рожден ден', 'Per molts anys', 'Všechno nejlepší k narozeninám',
    'Tillykke med fødselsdagen', 'Palju õnne sünnipäevaks', 'Hyvää syntymäpäivää', 'Feliz aniversario',
    'Χρόνια πολλά', 'Boldog születésnapot', 'Til hamingju með afmælið', 'Lá breithe sona duit',
    'Daudz laimes dzimšanas dienā', 'Su gimtadieniu', 'Alles Guddes zum Gebuertsdag', 'Среќен роденден',
    'Gratulerer med dagen', 'Wszystkiego najlepszego', 'La mulți ani', 'С днём рождения',
    'Co-latha breith sona dhut', 'Срећан рођендан', 'Všetko najlepšie k narodeninám',
    'Vse najboljše za rojstni dan', 'Grattis på födelsedagen', 'З днем народження', 'Penblwydd hapus',
    'Lokwinske mei dyn jierdei', 'Tillukku við føðingardegnum', 'Feliĉan naskiĝtagon', 'Felix dies natalis',
    // Middle East & Central Asia
    'عيد ميلاد سعيد', 'יום הולדת שמח', 'تولدت مبارک', 'سالگرہ مبارک', 'جنم ڏينهن مبارڪ', 'Rojbûna te pîroz be',
    'Doğum günün kutlu olsun', 'Ad günün mübarək', 'Շնորհավոր ծնունդ', 'გილოცავ დაბადების დღეს',
    'Туған күніңмен', 'Туулган күнүң менен', "Tug'ilgan kuningiz bilan", 'Зодрӯзатон муборак',
    'Doglan gün gutly bolsun', 'Төрсөн өдрийн мэнд хүргэе',
    // South Asia
    'जन्मदिन मुबारक हो', 'শুভ জন্মদিন', 'పుట్టినరోజు శుభాకాంక్షలు', 'பிறந்தநாள் வாழ்த்துக்கள்',
    'ಹುಟ್ಟುಹಬ್ಬದ ಶುಭಾಶಯಗಳು', 'ജന്മദിനാശംസകൾ', 'वाढदिवसाच्या शुभेच्छा', 'જન્મદિવસની શુભેચ્છાઓ',
    'ਜਨਮ ਦਿਨ ਮੁਬਾਰਕ', 'ଜନ୍ମଦିନର ଶୁଭେଚ୍ଛା', 'জন্মদিনৰ শুভেচ্ছা', 'जन्मदिनको शुभकामना',
    'ඉපදුම් දිනයට සුබ පැතුම්', 'जन्मदिनस्य शुभकामनाः',
    // East & South-East Asia
    '生日快乐', '生日快樂', 'お誕生日おめでとう', '생일 축하해', 'สุขสันต์วันเกิด', 'ສຸກສັນວັນເກີດ',
    'រីករាយថ្ងៃកំណើត', 'မွေးနေ့မှာ ပျော်ရွှင်ပါစေ', 'Chúc mừng sinh nhật', 'Selamat ulang tahun',
    'Selamat hari lahir', 'Maligayang kaarawan', 'Malipayong adlawng natawhan', 'Sugeng tanggap warsa',
    // Africa
    'Heri ya siku ya kuzaliwa', 'Geluk met jou verjaarsdag', 'Usuku lokuzalwa oluhle', 'Imini yokuzalwa emnandi',
    'መልካም ልደት', 'Dhalasho wanaagsan', 'Barka da ranar haihuwa', 'Ẹ kú ọjọ́ ìbí', 'Arahaba tratry ny taona',
    'Isabukuru nziza',
    // Pacific & Americas
    'Hauʻoli lā hānau', 'Rā whānau koa', 'Manuia le aso fanau', 'Bòn fèt'
  ];

  // Short fillers that pack the gaps between the big words
  const FILLERS = [
    'Happy Birthday ' + NAME, 'Happy Birthday ' + NAME, "Happy B'day " + NAME, 'HBD ' + NAME,
    NAME + ' 🎂', NAME + ' 🎉', NAME + ' 💖', 'Happy Birthday', NAME
  ];

  const REVEAL_SECONDS = 18;   // how long the heart takes to build
  const SEED = 11;             // same layout every time
  const ZOOM = 2.6;            // how much the zoom button enlarges the heart
  // ------------------------------------------------------

  const FONT = '"Segoe UI","Nirmala UI","Leelawadee UI","Ebrima","Myanmar Text","Gadugi","Noto Sans",' +
               '"Noto Sans Telugu","Noto Sans Tamil","Noto Sans Devanagari","Noto Sans CJK JP","Hiragino Sans",' +
               '"Yu Gothic","Malgun Gothic","Microsoft YaHei","Apple Color Emoji","Segoe UI Emoji",sans-serif';

  // Fixed "logical" drawing size: the layout is computed once, then scaled to any screen.
  const LW = 1600, LH = 1500;
  const BW = 2400, BH = Math.round(BW * LH / LW);   // backing-store size (sharp when zoomed)

  const view = document.getElementById('view');
  const scene = document.getElementById('scene');
  const tilt = document.getElementById('tilt');
  const canvas = document.getElementById('stage');          // front layer (big words)
  const back = document.getElementById('back');             // back layer (small words)
  const ctx = canvas.getContext('2d');
  const bctx = back.getContext('2d');
  const startEl = document.getElementById('start');
  const startBtn = document.getElementById('startBtn');
  const muteBtn = document.getElementById('mute');
  const zoomBtn = document.getElementById('zoom');
  const caption = document.getElementById('caption');
  const bgm = document.getElementById('bgm');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rng(seed) {                                   // mulberry32
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const heartXY = a => ({
    x: 16 * Math.pow(Math.sin(a), 3),
    y: 13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)
  });

  let items = [], total = REVEAL_SECONDS, elapsed = 0, started = false, last = 0, zoomed = false, finished = false;

  function layout() {
    const SC = 1500 / 32;
    const cx = LW / 2, cy = LH / 2 - 2.5 * SC;
    const toScreen = (x, y) => [cx + x * SC, cy - y * SC];

    // Rasterise the heart once; "is this point inside?" becomes one array lookup
    const mc = document.createElement('canvas');
    mc.width = LW; mc.height = LH;
    const mx = mc.getContext('2d');
    mx.beginPath();
    for (let i = 0; i < 360; i++) {
      const p = heartXY((i / 360) * Math.PI * 2);
      const [x, y] = toScreen(p.x, p.y);
      i ? mx.lineTo(x, y) : mx.moveTo(x, y);
    }
    mx.closePath(); mx.fill();
    const mask = mx.getImageData(0, 0, LW, LH).data;
    const inside = (x, y) => {
      const ix = Math.round(x), iy = Math.round(y);
      return ix >= 0 && iy >= 0 && ix < LW && iy < LH && mask[(iy * LW + ix) * 4 + 3] > 128;
    };

    const rand = rng(SEED);
    const placed = [];
    const pad = 3;

    // Measure each phrase once at 100px; widths scale linearly (measureText in a hot loop is very slow)
    const phraseOf = g => g + ' ' + NAME;
    const base = {};
    ctx.font = `bold 100px ${FONT}`;
    for (const ph of new Set([...GREETINGS.map(phraseOf), ...FILLERS])) base[ph] = ctx.measureText(ph).width / 100;

    function fits(x, y, w, h) {
      const l = x - w / 2, r = x + w / 2, t = y - h / 2, b = y + h / 2;
      if (!inside(l, t) || !inside(r, t) || !inside(l, b) || !inside(r, b) || !inside(x, t) || !inside(x, b)) return false;
      for (const q of placed) {
        if (l < q.r + pad && r > q.l - pad && t < q.b + pad && b > q.t - pad) return false;
      }
      return true;
    }
    function tryPlace(phrase, size, tries) {
      const w = base[phrase] * size, h = size * 1.15;
      for (let n = 0; n < tries; n++) {
        const x = cx + (rand() * 2 - 1) * 16.2 * SC;
        const y = cy - (-17.2 + rand() * 29.4) * SC;
        if (fits(x, y, w, h)) {
          placed.push({ l: x - w / 2, r: x + w / 2, t: y - h / 2, b: y + h / 2, x, y, phrase, size, front: size >= 18,
                        font: `bold ${size}px ${FONT}`,
                        hue: Math.floor(rand() * 10), light: 52 + Math.floor(rand() * 14) });
          return true;
        }
      }
      return false;
    }

    // 1) a few big English lines
    for (let i = 0; i < 10; i++) tryPlace('Happy Birthday ' + NAME, 40 * (0.9 + rand() * 0.2), 600);

    // 2) every language at least once (shuffled order, shrink the size until it fits)
    const gs = GREETINGS.map(phraseOf);
    for (let i = gs.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [gs[i], gs[j]] = [gs[j], gs[i]]; }
    for (const ph of gs) {
      for (const size of [26, 22, 19, 16, 14, 12, 10.5, 9, 8, 7, 6]) {
        if (tryPlace(ph, size * (0.95 + rand() * 0.1), 350)) break;
      }
    }

    // 3) fill the remaining gaps with short words, big to small
    for (let size = 22; size >= 6; size -= 1.1) {
      for (let n = 0; n < 2500; n++) tryPlace(FILLERS[Math.floor(rand() * FILLERS.length)], size, 1);
    }

    // reveal order: scattered, like the original
    for (let i = placed.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [placed[i], placed[j]] = [placed[j], placed[i]]; }
    total = reduceMotion ? 1 : REVEAL_SECONDS;
    placed.forEach((it, i) => { it.at = (i / placed.length) * total; });
    items = placed;
    window.__heart = { words: placed.length, languages: GREETINGS.length,
                       languagesPlaced: gs.filter(g => placed.some(p => p.phrase === g)).length };
  }

  // ---------- sizing, zoom, 3D tilt, main loop ----------
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const ease3 = p => 1 - Math.pow(1 - p, 3);
  const inOut = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const calcFit = () => Math.min(window.innerWidth / LW, (window.innerHeight * 0.9) / LH);

  let curF = 0, tween = null;
  function applySize(f) {
    curF = f;
    const w = LW * f, p = w * 1.3, z = w * 0.035;
    scene.style.width = Math.round(w) + 'px';
    scene.style.height = Math.round(LH * f) + 'px';
    scene.style.setProperty('--p', p + 'px');
    scene.style.setProperty('--z', z + 'px');
    scene.style.setProperty('--sf', (p - z) / p);   // cancel perspective so both layers line up at rest
    scene.style.setProperty('--sb', (p + z) / p);
  }
  const sizeCanvas = () => applySize(calcFit() * (zoomed ? ZOOM : 1));

  function draw() {
    const k = BW / LW;
    for (const c of [ctx, bctx]) {
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, BW, BH);
      c.textAlign = 'center';
      c.textBaseline = 'middle';
    }
    for (const it of items) {
      const age = elapsed - it.at;
      if (age <= 0) continue;
      const e = ease3(Math.min(1, age / 1.1));          // smooth ease-out
      const sc = 0.8 + 0.2 * e;                          // words bloom in from slightly smaller
      const c = it.front ? ctx : bctx;
      c.setTransform(k * sc, 0, 0, k * sc, k * it.x * (1 - sc), k * it.y * (1 - sc));
      c.globalAlpha = e;
      c.fillStyle = `hsl(${it.hue}, 92%, ${it.light}%)`;
      c.font = it.font;
      c.fillText(it.phrase, it.x, it.y);
    }
    ctx.globalAlpha = 1; bctx.globalAlpha = 1;
  }

  // pointer / phone-tilt -> smooth 3D rotation
  let px = 0, py = 0, curX = 0, curY = 0, lastMove = -1e9, beatT = 0;
  window.addEventListener('pointermove', e => {
    px = (e.clientX / window.innerWidth - 0.5) * 2;
    py = (e.clientY / window.innerHeight - 0.5) * 2;
    lastMove = performance.now();
  }, { passive: true });
  window.addEventListener('deviceorientation', e => {
    if (e.gamma == null) return;
    px = clamp(e.gamma / 22, -1, 1);
    py = clamp(((e.beta || 0) - 50) / 22, -1, 1);
    lastMove = performance.now();
  }, { passive: true });

  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;

    if (started && !finished) {
      elapsed += dt;
      draw();
      if (elapsed > total + 1.2) {
        finished = true;                      // everything is drawn; stop redrawing the text
        draw();
        caption.classList.add('show');
      }
    }
    if (finished) beatT += dt;

    // smooth zoom tween (keeps whatever you're looking at centred)
    if (tween) {
      const p = Math.min(1, (now - tween.t0) / tween.dur);
      const rx = (view.scrollLeft + view.clientWidth / 2) / view.scrollWidth;
      const ry = (view.scrollTop + view.clientHeight / 2) / view.scrollHeight;
      applySize(tween.from + (tween.to - tween.from) * inOut(p));
      view.scrollLeft = rx * view.scrollWidth - view.clientWidth / 2;
      view.scrollTop = ry * view.scrollHeight - view.clientHeight / 2;
      if (p >= 1) tween = null;
    }

    // 3D tilt: follows the pointer/phone, otherwise sways gently on its own
    const t = now / 1000;
    const active = now - lastMove < 2500;
    const aimX = zoomed ? 0 : (active ? px : 0) + Math.sin(t * 0.45) * (active ? 0.12 : 0.38);
    const aimY = zoomed ? 0 : (active ? py : 0) + Math.cos(t * 0.35) * (active ? 0.1 : 0.26);
    const k = 1 - Math.exp(-dt * 5);
    curX += (aimX - curX) * k;
    curY += (aimY - curY) * k;
    let pulse = 0;
    if (finished && !reduceMotion && !zoomed) {
      const ph = beatT % 1.6;
      pulse = 0.014 * Math.max(0, Math.sin((ph / 1.6) * Math.PI * 4)) * Math.exp(-ph * 1.8);
    }
    const mv = reduceMotion ? 0 : 1;
    tilt.style.transform = `rotateY(${curX * 10 * mv}deg) rotateX(${-curY * 7 * mv}deg) scale(${1 + pulse})`;
    if (window.Bg) window.Bg.setParallax(curX * mv, curY * mv);

    requestAnimationFrame(frame);
  }

  zoomBtn.addEventListener('click', () => {
    zoomed = !zoomed;
    document.body.classList.toggle('zoomed', zoomed);
    zoomBtn.setAttribute('aria-label', zoomed ? 'Show the whole heart' : 'Zoom in to read the words');
    tween = { from: curF, to: calcFit() * (zoomed ? ZOOM : 1), t0: performance.now(), dur: reduceMotion ? 1 : 750 };
  });

  // ---------- Music ----------
  // 1) Plays assets/music.mp3 if you put one there.
  // 2) Otherwise falls back to a built-in synthesized "Happy Birthday" tune.
  let fileMissing = false, synth = null, muted = false;
  bgm.addEventListener('error', () => { fileMissing = true; if (started) startSynth(); });

  function startSynth() {
    if (synth) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ac = new AC();
    const master = ac.createGain();
    master.gain.value = muted ? 0 : 0.22;
    master.connect(ac.destination);
    const f = n => 440 * Math.pow(2, (n - 69) / 12);       // MIDI -> Hz
    const G4 = 67, A4 = 69, B4 = 71, C5 = 72, D5 = 74, E5 = 76, F5 = 77, G5 = 79;
    const tune = [
      [G4, .75], [G4, .25], [A4, 1], [G4, 1], [C5, 1], [B4, 2],
      [G4, .75], [G4, .25], [A4, 1], [G4, 1], [D5, 1], [C5, 2],
      [G4, .75], [G4, .25], [G5, 1], [E5, 1], [C5, 1], [B4, 1], [A4, 1],
      [F5, .75], [F5, .25], [E5, 1], [C5, 1], [D5, 1], [C5, 2]
    ];
    const beat = 0.5; // seconds per beat
    const length = tune.reduce((s, n) => s + n[1], 0) * beat + 2;

    function play(t0) {
      let t = t0;
      for (const [note, beats] of tune) {
        const d = beats * beat;
        [[1, 1], [2, 0.25]].forEach(([mult, vol]) => {       // soft bell: fundamental + octave
          const o = ac.createOscillator(), g = ac.createGain();
          o.type = 'sine'; o.frequency.value = f(note) * mult;
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(vol, t + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0008, t + d * 0.95);
          o.connect(g); g.connect(master);
          o.start(t); o.stop(t + d);
        });
        t += d;
      }
    }
    let next = ac.currentTime + 0.1;
    play(next);
    const timer = setInterval(() => {
      if (ac.currentTime > next + length - 1) { next += length; play(next); }
    }, 250);
    synth = { ac, master, timer };
  }

  function startMusic() {
    if (fileMissing) { startSynth(); return; }
    const p = bgm.play();
    if (p && p.catch) p.catch(() => startSynth());
  }

  function setMuted(m) {
    muted = m;
    bgm.muted = m;
    if (synth) synth.master.gain.value = m ? 0 : 0.22;
    muteBtn.classList.toggle('muted', m);
    muteBtn.setAttribute('aria-label', m ? 'Unmute music' : 'Mute music');
  }
  muteBtn.addEventListener('click', () => setMuted(!muted));

  // ---------- Start ----------
  startBtn.addEventListener('click', () => {
    if (started) return;
    started = true;
    elapsed = 0;
    startEl.classList.add('gone');
    muteBtn.hidden = false;
    zoomBtn.hidden = false;
    document.body.classList.add('started');
    if (window.Bg) window.Bg.setIntensity(1);
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().catch(() => {});
    }
    startMusic();
  });

  window.addEventListener('resize', sizeCanvas);

  canvas.width = BW; canvas.height = BH;
  back.width = BW; back.height = BH;
  layout();
  sizeCanvas();
  requestAnimationFrame(t => { last = t; frame(t); });
})();
