/* ============================================================
   THE GOLDEN SPOON — game logic
   ============================================================ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const SVGNS = 'http://www.w3.org/2000/svg';

/* ---------------- content ---------------- */
const STEPS = [
  { key: 'greet', label: 'Greet' }, { key: 'table', label: 'Table' }, { key: 'order', label: 'Order' },
  { key: 'utensils', label: 'Utensils' }, { key: 'serve', label: 'Serve' }, { key: 'manners', label: 'Manners' },
  { key: 'plate', label: 'Plate' }, { key: 'goodbye', label: 'Goodbye' }
];

const GROUPS = [
  { name: 'Mrs. Rose and family', m: [['lady', 'Mrs. Rose', 'f'], ['gent', 'Mr. Rose', 'm'], ['girl', 'Amy', 'f'], ['boy', 'Sam', 'm']] },
  { name: 'Mr. and Mrs. Brown', m: [['gent', 'Mr. Brown', 'm'], ['lady', 'Mrs. Brown', 'f']] },
  { name: 'Grandpa Joe and friends', m: [['grandpa', 'Grandpa Joe', 'm'], ['grandma', 'Grandma Sue', 'f'], ['gent', 'Mr. Bell', 'm']] },
  { name: 'The Chen family', m: [['woman', 'Mrs. Chen', 'f'], ['man', 'Mr. Chen', 'm'], ['grandma', 'Grandma Chen', 'f'], ['girl', 'Mia', 'f'], ['boy', 'Leo', 'm']] },
  { name: 'Miss Lily and friends', m: [['woman', 'Miss Lily', 'f'], ['lady', 'Ms. Grace', 'f'], ['woman', 'Ms. Nora', 'f'], ['man', 'Mr. Jack', 'm'], ['gent', 'Mr. Owen', 'm'], ['lady', 'Ms. Ruby', 'f']] },
  { name: 'Dr. Kim and Mr. Park', m: [['woman', 'Dr. Kim', 'f'], ['gent', 'Mr. Park', 'm']] },
  { name: 'The Lopez family', m: [['man', 'Mr. Lopez', 'm'], ['lady', 'Mrs. Lopez', 'f'], ['boy', 'Ben', 'm'], ['girl', 'Ella', 'f']] },
  { name: 'Grandma Mei and the twins', m: [['grandma', 'Grandma Mei', 'f'], ['girl', 'Ann', 'f'], ['boy', 'Andy', 'm']] },
  { name: 'The Smith family', m: [['gent', 'Mr. Smith', 'm'], ['woman', 'Mrs. Smith', 'f'], ['grandpa', 'Grandpa Bob', 'm'], ['grandma', 'Grandma Pat', 'f'], ['girl', 'Zoe', 'f'], ['boy', 'Max', 'm']] },
  { name: 'Mr. Tom and his daughter', m: [['man', 'Mr. Tom', 'm'], ['girl', 'Lucy', 'f']] },
  { name: "Uncle Ben's birthday party", m: [['gent', 'Uncle Ben', 'm'], ['woman', 'Aunt Jen', 'f'], ['boy', 'Tim', 'm'], ['girl', 'Kate', 'f'], ['grandpa', 'Grandpa Lee', 'm']] },
  { name: 'Grandpa Sam and Grandma Lin', m: [['grandpa', 'Grandpa Sam', 'm'], ['grandma', 'Grandma Lin', 'f']] },
  { name: 'Ms. Wang and her students', m: [['lady', 'Ms. Wang', 'f'], ['boy', 'Eric', 'm'], ['girl', 'Ivy', 'f']] }
];
const VIPS = [
  { name: 'King Leo and the royal family', title: 'The King is here!', m: [['king', 'King Leo', 'm'], ['queen', 'Queen Rosa', 'f'], ['prince', 'Prince Max', 'm'], ['princess', 'Princess Ivy', 'f']] },
  { name: 'Movie star Stella Shine', title: 'A movie star is here!', m: [['star', 'Stella Shine', 'f'], ['gent', 'Mr. Lee', 'm'], ['woman', 'Ms. Kay', 'f']] },
  { name: 'Famous Chef Pierre', title: 'A famous chef is here!', m: [['chefvip', 'Chef Pierre', 'm'], ['lady', 'Madame Claire', 'f']] }
];
const CHEF = { kind: 'chef', name: 'Chef Marcel', skin: '#F6C9A0', hair: '#3b2414', outfit: '#fdfdfd', acc: '#d64545', pants: '#33334a', g: 'm' };

const POLITE = {
  napkin: { s: '{N} puts {his} napkin on {his} lap.', emo: '🍽️', svg: 'napkin', rule: 'Do put your napkin on your lap.' },
  please: { s: '{N} says “please” and “thank you.”', emo: '💬', bub: 'Please! Thank you!', rule: 'Do say “please” and “thank you.”' },
  chew: { s: '{N} chews with {his} mouth closed.', emo: '😊', face: 'chew', rule: 'Do chew with your mouth closed.' },
  wait: { s: '{N} waits until everyone has food.', emo: '⏳', rule: 'Do wait until everyone has food.' },
  excuse: { s: '{N} says “Excuse me” to call the waiter.', emo: '🙋', bub: 'Excuse me!', rule: 'Do say “Excuse me” to call the waiter.' },
  salt: { s: '{N} asks, “Please pass the salt.”', emo: '🧂', bub: 'Please pass the salt.', rule: 'Do ask, “Please pass the salt.”' },
  straight: { s: '{N} sits up straight.', emo: '🪑', rule: 'Do sit up straight.' }
};
const RUDE = {
  elbows: { s: '{N} puts {his} elbows on the table.', emo: '💪', rule: "Don't put your elbows on the table.", do: 'Do sit up straight.' },
  talkfood: { s: '{N} talks with food in {his} mouth.', emo: '🍝', face: 'funny', bub: 'Blah blah!', rule: "Don't talk with food in your mouth.", do: 'Do chew with your mouth closed.' },
  phone: { s: '{N} plays with a phone at the table.', emo: '📱', rule: "Don't play with your phone at the table.", do: 'Do talk with your family and friends.' },
  slurp: { s: '{N} slurps {his} soup loudly.', emo: '🍲', bub: 'SLUUURP!', rule: "Don't slurp your soup.", do: 'Do eat your soup quietly.' },
  reach: { s: '{N} reaches across the table.', emo: '🤚', bub: '↔', rule: "Don't reach across the table.", do: 'Do ask, “Please pass the salt.”' },
  early: { s: '{N} starts eating before everyone has food.', emo: '🍴', rule: "Don't start eating before everyone has food.", do: 'Do wait until everyone has food.' },
  knife: { s: '{N} waves {his} knife in the air.', emo: '🔪', rule: "Don't wave your knife in the air.", do: 'Do keep your knife on the plate.' },
  shout: { s: '{N} shouts, “Hey! Waiter!”', emo: '📢', bub: 'HEY! WAITER!', rule: "Don't shout “Hey! Waiter!”", do: 'Do say “Excuse me.”' }
};

const UTENSIL_INFO = {
  napkin: { name: 'napkin', hint: 'Hmm… the napkin goes on the left, next to the forks!', explain: 'The napkin goes on the left of the forks. The guest puts it on the lap!', none: '' },
  saladFork: { name: 'salad fork', hint: 'Hmm… forks go on the left! The salad fork goes outside.', explain: 'The salad fork goes on the left, outside the fork.', none: 'Hmm… no salad today. We don’t need a salad fork!' },
  fork: { name: 'fork', hint: 'Hmm… forks go on the left!', explain: 'The fork goes on the left, next to the plate.', none: 'Hmm… no steak or spaghetti today. We don’t need a fork!' },
  knife: { name: 'knife', hint: 'Hmm… the knife goes on the right, next to the plate!', explain: 'The knife goes on the right of the plate. The blade faces the plate.', none: 'Hmm… no steak today. We don’t need a knife!' },
  soupSpoon: { name: 'soup spoon', hint: 'Hmm… the soup spoon goes on the right, outside!', explain: 'The soup spoon goes on the right, outside the knife.', none: 'Hmm… no soup today. We don’t need a soup spoon!' },
  dessertSpoon: { name: 'dessert spoon', hint: 'Hmm… the dessert spoon goes above the plate!', explain: 'The dessert spoon goes above the plate.', none: 'Hmm… no cake today. We don’t need a dessert spoon!' },
  glass: { name: 'glass', hint: 'Hmm… the glass goes at the top, on the right!', explain: 'The glass goes at the top right, above the knife.', none: 'Hmm… no juice today. We don’t need a glass!' },
  chopsticks: { name: 'chopsticks', funny: 'Chopsticks? Ha ha! They are great, but not for this dinner!' },
  ladle: { name: 'ladle', funny: 'A ladle? Ha ha! That is for the chef’s big pot!' }
};
const SIGNALS = {
  pause: { e: '⏸️', name: 'PAUSE', sub: 'I am still eating.', explain: 'Fork and knife apart, tips together (an upside-down V) = PAUSE. The customer is still eating.' },
  finished: { e: '✅', name: 'FINISHED', sub: 'I am done.', explain: 'Fork and knife together, side by side, pointing to 4 o’clock = FINISHED.' },
  delicious: { e: '😋', name: 'DELICIOUS', sub: 'It was great!', explain: 'Fork and knife together, side by side, lying across the plate = DELICIOUS!' }
};

/* ---------------- settings ---------------- */
const S = { customers: 8, steps: [true, true, true, true, true, true, true, true], voice: true, music: true };
try { const sv = JSON.parse(localStorage.getItem('goldenSpoonSettings') || 'null'); if (sv) Object.assign(S, sv); } catch (e) { }
function saveSettings() { try { localStorage.setItem('goldenSpoonSettings', JSON.stringify(S)); } catch (e) { } }

/* ---------------- game state ---------------- */
const G = { idx: 0, step: 0, customers: [], total: 0, possible: 0, custStars: 0, running: false, practiced: { do: new Set(), dont: new Set() } };
let RUN = 0;
const CANCEL = { cancel: true };
function chk(t) { if (t !== RUN) throw CANCEL; }
function sleep(ms, t) { return new Promise(r => setTimeout(r, ms)).then(() => chk(t)); }
const cur = () => G.customers[G.idx];
const mult = () => (cur() && cur().vip ? 2 : 1);

/* ---------------- stage scaling + coordinates ---------------- */
const stage = $('#stage');
let SCALE = 1, OX = 0, OY = 0;
function fit() {
  const w = window.innerWidth, h = window.innerHeight;
  SCALE = Math.min(w / 1920, h / 1080);
  OX = (w - 1920 * SCALE) / 2; OY = (h - 1080 * SCALE) / 2;
  stage.style.transform = `translate(${OX}px,${OY}px) scale(${SCALE})`;
}
window.addEventListener('resize', fit); fit();
function toStage(e) { const r = stage.getBoundingClientRect(); return { x: (e.clientX - r.left) / SCALE, y: (e.clientY - r.top) / SCALE }; }
function elCenter(el) { const r = el.getBoundingClientRect(), s = stage.getBoundingClientRect(); return { x: (r.left + r.width / 2 - s.left) / SCALE, y: (r.top + r.height / 2 - s.top) / SCALE }; }
const SCENE_Y = 110;

/* ============================================================
   AUDIO: speech, sound effects, music
   ============================================================ */
let AC = null, MASTER = null, MUSIC_GAIN = null;
function audio() {
  if (!AC) {
    try {
      AC = new (window.AudioContext || window.webkitAudioContext)();
      MASTER = AC.createGain(); MASTER.gain.value = 0.9; MASTER.connect(AC.destination);
      MUSIC_GAIN = AC.createGain(); MUSIC_GAIN.gain.value = 0; MUSIC_GAIN.connect(MASTER);
    } catch (e) { AC = null; }
  }
  if (AC && AC.state === 'suspended') AC.resume();
  return AC;
}
function tone(freq, t0, dur, { type = 'sine', vol = 0.2, attack = 0.005, dest = null, slide = 0 } = {}) {
  if (!AC) return;
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(dest || MASTER); o.start(t0); o.stop(t0 + dur + 0.05);
}
const SFX = {
  ding() { if (!audio()) return; const t = AC.currentTime; tone(1318, t, .5, { vol: .22 }); tone(1975, t + .07, .6, { vol: .16 }); },
  bonk() { if (!audio()) return; const t = AC.currentTime; tone(260, t, .28, { type: 'triangle', vol: .3, slide: -120 }); tone(200, t + .12, .3, { type: 'triangle', vol: .22, slide: -80 }); },
  boing() { if (!audio()) return; const t = AC.currentTime; tone(180, t, .5, { type: 'sine', vol: .3, slide: 500 }); },
  bell() { if (!audio()) return; const t = AC.currentTime; [0, .45].forEach(d => { tone(2093, t + d, 1.4, { vol: .25 }); tone(4186, t + d, .8, { vol: .08 }); tone(3136, t + d, 1, { vol: .06 }); }); },
  sparkle() { if (!audio()) return; const t = AC.currentTime;[1568, 1976, 2349, 3136].forEach((f, k) => tone(f, t + k * .06, .35, { vol: .1 })); },
  star() { if (!audio()) return; const t = AC.currentTime; tone(1760, t, .25, { vol: .12 }); tone(2637, t + .05, .3, { vol: .08 }); },
  beep(hi) { if (!audio()) return; const t = AC.currentTime; tone(hi ? 988 : 660, t, hi ? .6 : .25, { type: 'square', vol: .08 }); },
  pop() { if (!audio()) return; const t = AC.currentTime; tone(600, t, .12, { vol: .15, slide: 400 }); },
  fanfare() { if (!audio()) return; const t = AC.currentTime;[[523, 0], [659, .15], [784, .3], [1047, .45], [784, .75], [1047, .9]].forEach(([f, d]) => { tone(f, t + d, .35, { type: 'sawtooth', vol: .07 }); tone(f * 2, t + d, .3, { vol: .04 }); }); },
  cheer() { if (!audio()) return; const t = AC.currentTime;[784, 988, 1175, 1568].forEach((f, k) => tone(f, t + k * .09, .5, { type: 'triangle', vol: .14 })); }
};

/* soft café waltz (accordion + piano), generated in code */
const MUS = { on: false, timer: null, next: 0, bar: 0 };
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
const CHORDS = { F: [53, 57, 60, 65], C7: [48, 52, 55, 58], Bb: [46, 50, 53, 58], Dm: [50, 53, 57, 62], Gm: [43, 50, 55, 58] };
const PROG = ['F', 'C7', 'F', 'Bb', 'F', 'C7', 'Dm', 'C7', 'Bb', 'F', 'C7', 'F', 'Bb', 'F', 'C7', 'F'];
const MEL = [
  [[69, 1], [72, 1], [77, 1]], [[76, 2], [74, 1]], [[72, 1], [69, 1], [72, 1]], [[74, 2], [70, 1]],
  [[69, 1], [72, 1], [77, 1]], [[79, 1], [77, 1], [76, 1]], [[77, 1], [74, 1], [69, 1]], [[70, 1], [69, 1], [67, 1]],
  [[74, 1], [77, 1], [74, 1]], [[72, 2], [69, 1]], [[70, 1], [67, 1], [64, 1]], [[65, 2], [69, 1]],
  [[74, 1], [70, 1], [74, 1]], [[72, 1], [69, 1], [65, 1]], [[67, 1], [70, 1], [76, 1]], [[77, 3]]
];
function accordion(notes, t0, dur, vol) {
  const g = AC.createGain(), f = AC.createBiquadFilter();
  f.type = 'lowpass'; f.frequency.value = 1300; f.Q.value = 0.7;
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.04);
  g.gain.setValueAtTime(vol, t0 + dur * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  const lfo = AC.createOscillator(), lg = AC.createGain(); lfo.frequency.value = 5.5; lg.gain.value = vol * 0.25; lfo.connect(lg); lg.connect(g.gain);
  lfo.start(t0); lfo.stop(t0 + dur + .05);
  notes.forEach(n => [-4, 4].forEach(det => { const o = AC.createOscillator(); o.type = 'sawtooth'; o.frequency.value = mtof(n); o.detune.value = det; o.connect(f); o.start(t0); o.stop(t0 + dur + .05); }));
  f.connect(g); g.connect(MUSIC_GAIN);
}
function musicTick() {
  if (!MUS.on || !AC) return;
  const beat = 60 / 138;
  while (MUS.next < AC.currentTime + 0.6) {
    const b = MUS.bar % 16, t = MUS.next, ch = CHORDS[PROG[b]];
    tone(mtof(ch[0] - 12), t, beat * 0.9, { type: 'triangle', vol: .22, dest: MUSIC_GAIN });
    accordion(ch.slice(1), t + beat, beat * 0.7, .05);
    accordion(ch.slice(1), t + beat * 2, beat * 0.7, .05);
    let mt = t;
    MEL[b].forEach(([n, d]) => { tone(mtof(n), mt, beat * d * 0.95, { type: 'triangle', vol: .12, dest: MUSIC_GAIN }); tone(mtof(n + 12), mt, beat * 0.4, { type: 'sine', vol: .03, dest: MUSIC_GAIN }); mt += beat * d; });
    MUS.next += beat * 3; MUS.bar++;
  }
}
function setMusic(on) {
  if (!audio()) return;
  MUS.on = on;
  MUSIC_GAIN.gain.cancelScheduledValues(AC.currentTime);
  MUSIC_GAIN.gain.setTargetAtTime(on ? 0.55 : 0, AC.currentTime, 0.4);
  if (on && !MUS.timer) { MUS.next = AC.currentTime + 0.1; MUS.timer = setInterval(musicTick, 200); }
  if (!on && MUS.timer) { setTimeout(() => { if (!MUS.on) { clearInterval(MUS.timer); MUS.timer = null; } }, 1500); }
}

/* speech synthesis — slow and clear US English */
let VOICE = null;
function pickVoice() {
  if (!window.speechSynthesis) return null;
  const vs = speechSynthesis.getVoices().filter(v => /en[-_]US/i.test(v.lang));
  const pref = ['Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Samantha', 'Microsoft Zira', 'Allison', 'Ava'];
  for (const p of pref) { const v = vs.find(v => v.name.includes(p)); if (v) return v; }
  return vs[0] || null;
}
if (window.speechSynthesis) { speechSynthesis.onvoiceschanged = () => { VOICE = pickVoice(); }; VOICE = pickVoice(); }
function speak(text, who) {
  if (!S.voice || !window.speechSynthesis || !text) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/…/g, ', ').replace(/[“”]/g, '').replace(/↔/g, ''));
    u.lang = 'en-US'; u.rate = 0.8;
    const k = who && who.kind;
    u.pitch = ['girl', 'princess'].includes(k) ? 1.35 : ['boy', 'prince'].includes(k) ? 1.25 : ['gent', 'man', 'grandpa', 'king', 'chef', 'chefvip'].includes(k) ? 0.85 : 1.08;
    if (!VOICE) VOICE = pickVoice();
    if (VOICE) u.voice = VOICE;
    speechSynthesis.speak(u);
  } catch (e) { }
}

/* ============================================================
   CUSTOMERS
   ============================================================ */
function makeMember([kind, name, g], used) {
  const elder = kind === 'grandpa' || kind === 'grandma';
  let outfit; do { outfit = pick(OUTFITS); } while (used.has(outfit) && used.size < OUTFITS.length); used.add(outfit);
  return {
    kind, name, g, skin: pick(SKINS), hair: elder ? pick(['#d9d9d9', '#eeeeee', '#bfbfbf']) : pick(HAIRS),
    outfit: kind === 'chefvip' ? '#fdfdfd' : outfit, acc: pick(['#d6283f', '#f2b134', '#7a3fb5', '#2f9e8f', '#e86aa8', '#3d6fd6']),
    glasses: elder || (kind === 'man' && Math.random() < .3), cap: Math.random() < .5,
    scale: ['girl', 'boy', 'prince', 'princess'].includes(kind) ? 0.8 : 1
  };
}
function orderText(list) {
  if (list.length === 1) return list[0];
  if (list.length === 2) return list[0] + ' and ' + list[1];
  return list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
}
function makeCustomers(n) {
  const vipN = n >= 8 ? 2 : 1;
  let best = null;
  for (let tries = 0; tries < 400; tries++) {
    const regs = shuffle(GROUPS).slice(0, n - vipN), vips = shuffle(VIPS).slice(0, vipN);
    const list = regs.map(g => ({ g, vip: false }));
    // VIPs never first, never next to each other
    const slots = shuffle(Array.from({ length: n - 1 }, (_, k) => k + 1));
    const chosen = [];
    for (const s of slots) { if (chosen.length === vipN) break; if (chosen.every(c => Math.abs(c - s) > 1)) chosen.push(s); }
    chosen.sort((a, b) => a - b).forEach((s, k) => list.splice(s, 0, { g: vips[k], vip: true }));
    let ok = true;
    for (let k = 1; k < list.length; k++) if (list[k].g.m.length === list[k - 1].g.m.length) ok = false;
    best = list; if (ok) break;
  }
  // unique orders
  const combos = [];
  const subsets = (arr, k, start = 0, acc = []) => { if (acc.length === k) { combos.push(acc.slice()); return; } for (let i = start; i < arr.length; i++) { acc.push(arr[i]); subsets(arr, k, i + 1, acc); acc.pop(); } };
  subsets(DISH_KEYS, 2); subsets(DISH_KEYS, 3);
  const seen = new Set();
  const signals = ['pause', 'finished', 'delicious'];
  let lastSig = null, rudeBag = [], lastRude = null;
  const out = best.map((it, idx) => {
    const used = new Set();
    const members = it.g.m.map(x => makeMember(x, used));
    let order, extra = null, key;
    for (let t = 0; t < 200; t++) {
      order = shuffle(pick(combos));
      extra = null;
      if (Math.random() < 0.5 && order.length < 4) { const left = DISH_KEYS.filter(d => !order.includes(d)); extra = pick(left); }
      key = order.concat(extra ? [extra] : []).sort().join('+');
      if (!seen.has(key)) break;
    }
    seen.add(key);
    order.sort((a, b) => DISH_KEYS.indexOf(a) - DISH_KEYS.indexOf(b));
    if (!rudeBag.length) rudeBag = shuffle(Object.keys(RUDE));
    let rude = rudeBag.pop();
    if (rude === lastRude && rudeBag.length) { rudeBag.unshift(rude); rude = rudeBag.pop(); }
    lastRude = rude;
    const polite = shuffle(Object.keys(POLITE).filter(p => !(rude === 'early' && p === 'wait'))).slice(0, 2);
    let sig; do { sig = pick(signals); } while (sig === lastSig);
    lastSig = sig;
    const sig2 = sig === 'pause' ? pick(['finished', 'delicious']) : null;
    const who = shuffle(members);
    return {
      name: it.g.name, vip: it.vip, vipTitle: it.g.title || '', members, order, extra, rude, polite, signal: sig, signal2: sig2,
      mannerWho: [who[0], who[1 % who.length], who[2 % who.length]], seats: null
    };
  });
  // make sure the game shows a PAUSE plate at least once
  if (!out.some(c => c.signal === 'pause') && out.length > 1) { const c = out[1]; c.signal2 = c.signal; c.signal = 'pause'; }
  return out;
}

/* ============================================================
   SCENE (dollhouse) — actors with depth sorting
   ============================================================ */
const house = $('#house');
$('#defsIn').innerHTML = globalDefs() + tdClipDef();
house.innerHTML = roomSVG();
$('#skyline').innerHTML = skylineSVG();
$('#stars').innerHTML = starsSVG();
const ACT = $('#actors');
const actors = [];
const peekG = $('#chefPeek .peekIn');
peekG.innerHTML = `<g><g transform="scale(1.05)">${headSVG(CHEF)}</g></g>`;

class Actor {
  constructor(html, i, j, opts = {}) {
    this.g = document.createElementNS(SVGNS, 'g');
    this.g.innerHTML = html;
    this.i = i; this.j = j; this.dz = opts.dz || 0; this.kind = opts.kind || '';
    if (opts.cls) this.g.setAttribute('class', opts.cls);
    ACT.appendChild(this.g); actors.push(this); this.place(); sortActors();
  }
  place() { const p = iso(this.i, this.j); this.g.setAttribute('transform', `translate(${p.x.toFixed(1)},${p.y.toFixed(1)})`); }
  get depth() { return this.i + this.j + this.dz; }
  remove() { this.g.remove(); const k = actors.indexOf(this); if (k >= 0) actors.splice(k, 1); }
  screen() { return iso(this.i, this.j); }
}
function sortActors() {
  const sorted = actors.slice().sort((a, b) => a.depth - b.depth);
  sorted.forEach((a, k) => { if (ACT.children[k] !== a.g) ACT.appendChild(a.g); });
  // ensure DOM order matches
  let ok = true; sorted.forEach((a, k) => { if (ACT.children[k] !== a.g) ok = false; });
  if (!ok) sorted.forEach(a => ACT.appendChild(a.g));
}
function clearActors() { actors.slice().forEach(a => a.remove()); }

function moveActor(a, pts, speed, t) {
  // speed: iso units per second
  return new Promise((res, rej) => {
    const path = [{ i: a.i, j: a.j }].concat(pts);
    const segs = []; let total = 0;
    for (let k = 1; k < path.length; k++) { const d = Math.hypot(path[k].i - path[k - 1].i, path[k].j - path[k - 1].j); segs.push(d); total += d; }
    const dur = Math.max(0.2, total / speed) * 1000, t0 = performance.now();
    a.g.classList.add('walking');
    const step = now => {
      if (t !== undefined && t !== RUN) { a.g.classList.remove('walking'); return rej(CANCEL); }
      let f = Math.min(1, (now - t0) / dur), dist = f * total, k = 0;
      while (k < segs.length - 1 && dist > segs[k]) { dist -= segs[k]; k++; }
      const q = segs[k] ? dist / segs[k] : 1;
      a.i = path[k].i + (path[k + 1].i - path[k].i) * q; a.j = path[k].j + (path[k + 1].j - path[k].j) * q;
      a.place(); sortActors();
      if (f < 1) requestAnimationFrame(step); else { a.g.classList.remove('walking'); res(); }
    };
    requestAnimationFrame(step);
  });
}

const personHTML = (m, seated) => `<g class="pw"><g class="react">${personSVG(m, { seated })}</g></g>`;
let tableActor = null, chefActor = null;
const SC = { cust: -1, phase: null, people: [], seats: [] };   // scene bookkeeping

function makeTable() {
  if (tableActor) tableActor.remove();
  tableActor = new Actor(tableSVG(), TABLE.i, TABLE.j, { dz: 0 });
}
function seatHTML(m) {
  return `${chairSVG(1)}${m ? `<g transform="translate(0,-34)">${personHTML(m, true)}</g>` : ''}`;
}
function foodOnTable(on) {
  const g = tableActor.g.querySelector('#tableFood');
  if (!on) { g.innerHTML = ''; return; }
  const c = cur(); const all = c.order.concat(c.extra ? [c.extra] : []);
  const pos = [[-44, -46], [40, -62], [-6, -36], [50, -40], [-50, -66]];
  g.innerHTML = all.map((d, k) => `<g transform="translate(${pos[k][0]},${pos[k][1]})"><ellipse rx="20" ry="9" fill="#fff" stroke="#d6a93f" stroke-width="2"/><text y="6" font-size="26" text-anchor="middle">${DISHES[d].emoji}</text></g>`).join('');
}
function defaultSeats(n) {
  const pref = { 2: [3, 7], 3: [1, 4, 6], 4: [1, 3, 5, 7], 5: [0, 2, 3, 5, 7], 6: [0, 1, 3, 4, 5, 7] };
  return pref[n] || [0, 1, 2, 3, 4, 5, 6, 7].slice(0, n);
}

/* build the scene for a phase (instant) */
function buildScene(phase) {
  const c = cur();
  clearActors(); tableActor = null; chefActor = null; SC.people = []; SC.seatActors = [];
  makeTable();
  $('#carpet').innerHTML = c.vip ? carpetSVG() : '';
  $('#seatSpots').classList.add('hidden'); $('#tableTarget').classList.add('hidden');
  $$('#seatSpots .seatSpot').forEach(s => s.classList.remove('taken'));
  $('#chefPeek').classList.remove('hidden');
  $('#kitDoor').classList.remove('open'); $('#entDoor').classList.remove('open');
  if (phase === 'arrive') {
    c.members.forEach((m, k) => { const a = new Actor(personHTML(m, false), ARRIVE_SPOTS[k].i, ARRIVE_SPOTS[k].j, { dz: .05 }); a.member = m; SC.people.push(a); });
  } else if (phase === 'seated' || phase === 'eating' || phase === 'eaten') {
    if (!c.seats) c.seats = defaultSeats(c.members.length);
    c.members.forEach((m, k) => { const sp = SEAT_SPOTS[c.seats[k]]; const a = new Actor(seatHTML(m), sp.i, sp.j, { dz: .1, cls: 'seatA' }); a.member = m; SC.seatActors.push(a); });
    foodOnTable(phase === 'eating');
    if (phase === 'eating') setEating(true);
  }
  SC.cust = G.idx; SC.phase = phase;
}
function carpetSVG() {
  const a = iso(0, 6.3), b = iso(3.2, 6.3), c2 = iso(3.2, 7.2), d = iso(0, 7.2);
  const pts = [a, b, c2, d].map(p => p.x + ',' + p.y).join(' ');
  return `<polygon points="${pts}" fill="#c2142e"/><polygon points="${pts}" fill="none" stroke="#ffd34d" stroke-width="4"/>
    ${[0.6, 1.4, 2.2, 3].map((i, k) => { const p = iso(i, 6.75); return `<text class="twinkle" style="animation-delay:${k * .3}s" x="${p.x}" y="${p.y + 8}" font-size="22" text-anchor="middle">✨</text>`; }).join('')}`;
}
function allPeopleEls() {
  const els = $$('#actors .pw');
  const td = $('#tdCust .pw'); if (td && $('#topdown').classList.contains('show')) els.push(td);
  return els;
}
function customerEls() {
  return SC.people.concat(SC.seatActors || []).map(a => a.g.querySelector('.pw')).filter(Boolean)
    .concat($('#topdown').classList.contains('show') && $('#tdCust .pw') ? [$('#tdCust .pw')] : []);
}
function setEating(on) { customerEls().forEach(e => e.classList.toggle('eating', on)); }
function headPositions() {
  const out = [];
  SC.people.forEach(a => { const p = a.screen(); out.push({ x: p.x, y: p.y - 140 * (a.member.scale || 1) }); });
  (SC.seatActors || []).forEach(a => { const p = a.screen(); out.push({ x: p.x, y: p.y - 150 * (a.member.scale || 1) }); });
  return out;
}

/* reactions */
function react(type, opts = {}) {
  const cls = { happy: 'r-big', dance: 'r-dance', confused: 'r-confused', funny: 'r-funny' }[type];
  customerEls().forEach(e => { e.classList.remove('r-big', 'r-dance', 'r-confused', 'r-funny'); e.getBoundingClientRect(); e.classList.add(cls); });
  clearTimeout(react.tm);
  react.tm = setTimeout(() => customerEls().forEach(e => e.classList.remove(cls)), type === 'dance' ? 2000 : 1700);
  const td = $('#topdown').classList.contains('show');
  const heads = td ? [{ x: 575, y: 40 }] : headPositions();
  if (type === 'dance' || (type === 'happy' && opts.hearts)) heads.forEach((h, k) => { for (let q = 0; q < (type === 'dance' ? 3 : 1); q++) setTimeout(() => fx('heart', h.x + rnd(-30, 30), h.y + 30, pick(['❤️', '💖', '💕', '💗'])), q * 260 + k * 90); });
  if (type === 'confused') heads.forEach((h, k) => setTimeout(() => fx('qmark', h.x + 20, h.y + 20, '?'), k * 80));
  if (type === 'funny') heads.forEach((h, k) => setTimeout(() => fx('heart', h.x, h.y + 20, pick(['😜', '🤪', '😝'])), k * 80));
}
function fx(cls, x, y, txt, life = 1900) {
  const d = document.createElement('div'); d.className = 'fx ' + cls; d.style.left = x + 'px'; d.style.top = y + 'px'; d.textContent = txt;
  $('#sceneFx').appendChild(d); setTimeout(() => d.remove(), life); return d;
}
function sparkleAt(x, y, n = 6) { for (let k = 0; k < n; k++) setTimeout(() => fx('sparkle', x + rnd(-50, 50), y + rnd(-50, 50), pick(['✨', '⭐', '✨', '💫']), 1000), k * 70); }

/* ============================================================
   PANEL UI helpers
   ============================================================ */
const area = $('#area'), actionBtn = $('#action');
let actionResolver = null, lastSpeech = { text: '', who: null };
function avatarSVG(m) { return `<svg viewBox="-34 -46 68 68" width="100" height="100" style="margin:4px 0 0 0">${headSVG(m)}</svg>`; }
function say(text, who, opts = {}) {
  const sp = $('#speech');
  who = who || (cur() && cur().members[0]);
  sp.classList.toggle('cust', !opts.plain);
  sp.querySelector('.av').innerHTML = who ? avatarSVG(who) : '';
  sp.querySelector('.who').textContent = opts.label || (who ? `${who.name} says:` : '');
  const tx = sp.querySelector('.txt'); tx.textContent = text;
  tx.style.fontSize = text.length > 95 ? '24px' : text.length > 70 ? '27px' : text.length > 40 ? '31px' : '';
  sp.classList.remove('pop'); void sp.offsetWidth; sp.classList.add('pop');
  lastSpeech = { text: opts.plain ? '' : text, who };
  if (!opts.silent && !opts.plain) speak(text, who);
}
$('#speak').addEventListener('click', () => { audio(); if (lastSpeech.text) { const was = S.voice; S.voice = true; speak(lastSpeech.text, lastSpeech.who); S.voice = was; } });
function instr(html, kind = '') {
  const el = $('#instr'); el.className = kind;
  const m = html.match(/^(<span class="emo">[^<]*<\/span>)\s*([\s\S]*)$/);
  el.innerHTML = m ? `${m[1]}<span>${m[2]}</span>` : `<span>${html}</span>`;
  void el.offsetWidth; el.classList.add('pop');
}
function waiterSay(text) {
  const w = $('#waiter'); w.querySelector('.wt').textContent = text; w.classList.remove('hidden', 'pop'); void w.offsetWidth; w.classList.add('pop');
}
function waiterHide() { $('#waiter').classList.add('hidden'); }
function setAction(label, enabled = true, glow = true) {
  actionBtn.innerHTML = label; actionBtn.classList.toggle('wait', !enabled); actionBtn.classList.toggle('glow', enabled && glow);
}
function waitAction(label, t, glow = true) {
  setAction(label, true, glow);
  return new Promise(res => { actionResolver = res; }).then(v => { chk(t); return v; });
}
function busy(label = 'Please wait…') { actionResolver = null; setAction(label, false); }
actionBtn.addEventListener('click', () => { audio(); if (actionResolver) { const r = actionResolver; actionResolver = null; setAction(actionBtn.innerHTML, false); r(); } });

function updatePills() {
  $('#pills').innerHTML = STEPS.map((s, k) => `<div class="pill ${!S.steps[k] ? 'off' : ''} ${G.running && k === G.step ? 'cur' : ''} ${G.running && k < G.step && S.steps[k] ? 'done' : ''}"><span class="n">${k + 1}</span>${s.label}</div>`).join('');
}
function updateStars(bump) {
  $('#starN').textContent = G.total;
  $('#vipx').classList.toggle('hidden', !(G.running && cur() && cur().vip));
  if (bump) { const b = $('#starbox'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
}
function updateCustCard() {
  const c = cur();
  $('#custCard').innerHTML = c ? `<span class="emo">🍽️</span><span class="cn">Customer ${G.idx + 1} of ${G.customers.length} · ${c.name}</span>${c.vip ? '<span class="vip">⭐ VIP ×2</span>' : ''}` : '';
}
/* stars: tries 1 => 2 stars, 2 => 1 star, 3 => 0 (shown answer) */
function award(tries, from) {
  const base = tries === 1 ? 2 : tries === 2 ? 1 : 0;
  const pts = base * mult();
  G.possible += 2 * mult();
  G.total += pts; G.custStars += pts;
  const target = elCenter($('#starbox'));
  const start = from || { x: 1530, y: 560 };
  for (let k = 0; k < pts; k++) {
    const s = document.createElement('div'); s.className = 'flyStar'; s.textContent = '⭐';
    s.style.left = start.x - 30 + 'px'; s.style.top = start.y - 30 + 'px';
    $('#fxLayer').appendChild(s);
    const dx = target.x - start.x, dy = target.y - start.y;
    s.animate([{ transform: 'translate(0,0) scale(.6)', opacity: 0 }, { transform: `translate(${rnd(-60, 60)}px,${rnd(-90, -40)}px) scale(1.4)`, opacity: 1, offset: .25 }, { transform: `translate(${dx}px,${dy}px) scale(.7)`, opacity: 1 }],
      { duration: 1000 + k * 130, easing: 'cubic-bezier(.5,0,.5,1)', fill: 'forwards' });
    setTimeout(() => { s.remove(); SFX.star(); updateStars(true); }, 1000 + k * 130);
  }
  if (!pts) updateStars(false);
  return pts;
}
/* generic tap wrapper that also wakes audio */
function onTap(el, fn) { el.addEventListener('click', e => { audio(); fn(e); }); }

/* ============================================================
   DRAG & DROP (pointer events: finger + mouse)
   ============================================================ */
function draggable(el, { ghost, onDrop, onTapItem, enabled = () => true }) {
  el.style.touchAction = 'none';
  el.addEventListener('pointerdown', e => {
    if (!enabled()) return;
    audio(); e.preventDefault();
    const id = e.pointerId; try { el.setPointerCapture(id); } catch (er) { }
    const start = toStage(e); let g = null;
    const move = ev => {
      if (ev.pointerId !== id) return;
      const p = toStage(ev);
      if (!g && Math.hypot(p.x - start.x, p.y - start.y) > 12) {
        g = document.createElement('div'); g.className = 'dragGhost'; g.innerHTML = ghost(); $('#dragLayer').appendChild(g); el.classList.add('dragging');
      }
      if (g) { g.style.left = p.x + 'px'; g.style.top = p.y + 'px'; }
    };
    const up = ev => {
      if (ev.pointerId !== id) return;
      el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
      el.classList.remove('dragging');
      if (!g) { if (ev.type === 'pointerup' && onTapItem) onTapItem(); return; }
      const p = toStage(ev);
      const ok = ev.type === 'pointerup' ? onDrop(p) : false;
      if (ok) { g.remove(); return; }
      const back = elCenter(el);
      g.animate([{ left: p.x + 'px', top: p.y + 'px' }, { left: back.x + 'px', top: back.y + 'px' }], { duration: 420, easing: 'cubic-bezier(.3,1.4,.5,1)', fill: 'forwards' });
      setTimeout(() => g.remove(), 430);
    };
    el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  });
}

/* ============================================================
   STEP RUNNER
   ============================================================ */
const PHASE_OF = ['outside', 'arrive', 'seated', 'seated', 'seated', 'eating', 'eating', 'eaten'];
function resetOverlays() {
  $('#sceneWrap').classList.remove('zoom');
  $('#topdown').classList.remove('show'); $('#topdown').innerHTML = '';
  $('#bigMsg').classList.add('hidden'); $('#vipBanner') && $('#vipBanner').remove();
  waiterHide(); $('#sceneFx').innerHTML = ''; area.innerHTML = ''; $('#dragLayer').innerHTML = '';
  $('#seatSpots').classList.add('hidden'); $('#tableTarget').classList.add('hidden');
  if (window.speechSynthesis) speechSynthesis.cancel();
}
function goStep(k, opts = {}) {
  RUN++; const t = RUN;
  while (k < 8 && !S.steps[k]) k++;
  if (k >= 8) { nextCustomer(); return; }
  G.step = k;
  G.snap = { total: G.total, possible: G.possible, cust: G.custStars };
  updatePills(); updateStars(); updateCustCard();
  resetOverlays();
  const phase = PHASE_OF[k];
  if (opts.force || SC.cust !== G.idx || SC.phase !== phase) {
    if (phase === 'outside') { buildScene('outside'); }
    else buildScene(phase);
  }
  busy();
  const fn = STEP_FN[STEPS[k].key];
  fn(t).then(() => { if (t === RUN) goStep(k + 1); }).catch(e => { if (e !== CANCEL) console.error(e); });
}
function nextCustomer() {
  if (G.idx + 1 < G.customers.length) { G.idx++; startCustomer(); }
  else showEnd();
}
function startCustomer() {
  G.custStars = 0; cur().vipShown = false; cur().seats = null;
  SC.cust = -1;
  goStep(0);
}
async function vipIntro(t) {
  const c = cur(); if (!c.vip || c.vipShown) return;
  c.vipShown = true;
  $('#carpet').innerHTML = carpetSVG();
  const b = document.createElement('div'); b.id = 'vipBanner';
  b.innerHTML = `⭐ VIP GUEST! ⭐<small>${c.vipTitle} ${c.name} · DOUBLE stars!</small>`;
  $('#scene').appendChild(b); SFX.fanfare();
  for (let k = 0; k < 14; k++) setTimeout(() => fx('sparkle', rnd(80, 1050), rnd(150, 800), pick(['✨', '⭐', '💫', '🌟']), 1000), k * 120);
  updateStars();
  await sleep(2600, t);
  b.remove();
}

/* ---------- STEP 1: GREET ---------- */
async function stepGreet(t) {
  const c = cur();
  instr('<span class="emo">👀</span> Look! New customers are coming…');
  say(c.vip ? c.vipTitle : 'Here come our customers!', c.members[0], { plain: true, label: 'The Golden Spoon' });
  $('#speech .txt').textContent = c.vip ? c.vipTitle : 'Here come our customers!';
  await vipIntro(t);
  $('#entDoor').classList.add('open'); SFX.pop();
  SC.people = [];
  const walks = c.members.map((m, k) => (async () => {
    await sleep(k * 420, t);
    const a = new Actor(personHTML(m, false), ENTRANCE.i, ENTRANCE.j, { dz: .05 }); a.member = m; SC.people.push(a);
    a.g.classList.add('fadeIn');
    await moveActor(a, [{ i: ENTRANCE.i + 0.8, j: ENTRANCE.j }, ARRIVE_SPOTS[k]], 1.6, t);
  })());
  await Promise.all(walks);
  SC.phase = 'arrive';
  $('#entDoor').classList.remove('open');
  // 3-2-1 countdown
  const bm = $('#bigMsg'); bm.classList.remove('hidden');
  for (const n of [3, 2, 1]) {
    bm.innerHTML = `<div class="t">Say it together!</div><div class="num go">${n}</div>`; SFX.beep(false);
    await sleep(900, t);
  }
  bm.innerHTML = `<div class="t" style="font-size:90px">GO!</div>`; SFX.beep(true);
  await sleep(500, t); bm.classList.add('hidden');
  waiterSay('Hello! How can I help you?');
  instr('<span class="emo">🗣️</span> Everyone, say it together!');
  react('happy');
  SC.people.forEach(a => a.g.querySelector('.pw').classList.add('waving'));
  await sleep(1400, t);
  SC.people.forEach(a => a.g.querySelector('.pw').classList.remove('waving'));
  await waitAction('Next ➜', t);
}

/* ---------- STEP 2: TABLE ---------- */
async function stepTable(t) {
  const c = cur(), n = c.members.length;
  say(`Hi, I would like a table for ${n} people.`, c.members[0]);
  instr('<span class="emo">🪑</span> Listen! Drag the right number of chairs to the table. Tap a chair to take it away.');
  $('#seatSpots').classList.remove('hidden');
  const placed = new Map();            // spot index -> actor
  area.innerHTML = `<div class="trayHead">Chair tray</div><div class="tray" style="top:40px;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(2,1fr)">${Array.from({ length: 8 }, (_, k) => `<div class="cell" data-k="${k}"><svg viewBox="-30 -92 60 100" width="110" height="170">${chairSVG(1)}</svg></div>`).join('')}</div>`;
  let locked = false;
  const cells = $$('.cell', area);
  const refreshTray = () => { const used = placed.size; cells.forEach((el, k) => el.classList.toggle('used', k >= 8 - used)); };
  const removeChair = k => { if (locked) return; const a = placed.get(k); if (!a) return; a.remove(); placed.delete(k); $(`.seatSpot[data-k="${k}"]`).classList.remove('taken'); SFX.pop(); refreshTray(); };
  const addChair = k => {
    const sp = SEAT_SPOTS[k];
    const a = new Actor(`<g class="chairActor fadeIn">${chairSVG(1)}</g>`, sp.i, sp.j, { dz: .1 });
    a.g.addEventListener('pointerdown', e => { e.stopPropagation(); removeChair(k); });
    placed.set(k, a); $(`.seatSpot[data-k="${k}"]`).classList.add('taken'); refreshTray();
  };
  cells.forEach(el => draggable(el, {
    enabled: () => !locked,
    ghost: () => `<svg viewBox="-30 -92 60 100" width="120" height="190">${chairSVG(1)}</svg>`,
    onDrop: p => {
      const sx = p.x, sy = p.y - SCENE_Y;
      let best = -1, bd = 1e9;
      SEAT_SPOTS.forEach((s, k) => { const q = iso(s.i, s.j); const d = Math.hypot(q.x - sx, q.y - 30 - sy); if (d < bd && !placed.has(k)) { bd = d; best = k; } });
      if (best < 0 || bd > 95) { instr('<span class="emo">👉</span> Drop the chair on a dotted spot by the table.'); return false; }
      addChair(best); SFX.ding(); const q = iso(SEAT_SPOTS[best].i, SEAT_SPOTS[best].j); sparkleAt(q.x, q.y - 40, 3);
      return true;
    }
  }));
  let tries = 0;
  while (true) {
    await waitAction('🪑 Seat the guests', t);
    if (placed.size === n) { tries++; break; }
    tries++;
    if (tries === 1) {
      SFX.bonk(); react('confused');
      say(placed.size < n ? `Hmm… we need more chairs. We are ${n} people!` : `Hmm… too many chairs! We are ${n} people.`, c.members[0]);
      instr(`<span class="emo">🤔</span> Try again! Count the people. ${placed.size < n ? 'Add' : 'Take away'} chairs.`, 'bad');
    } else {
      SFX.bonk(); react('confused');
      locked = true;
      // fix automatically
      while (placed.size > n) removeChairForce(placed);
      const want = defaultSeats(n);
      for (const k of want) { if (placed.size >= n) break; if (!placed.has(k)) addChair(k); }
      instr(`<span class="emo">💡</span> We need ${n} chairs for ${n} people.`, 'bad');
      tries = 3;
      await sleep(1800, t);
      break;
    }
  }
  locked = true;
  const pts = award(tries, elCenter(actionBtn));
  if (tries === 1) { SFX.cheer(); react('dance'); instr('<span class="emo">🎉</span> Perfect! ' + n + ' chairs for ' + n + ' people!', 'good'); }
  else if (tries === 2) { SFX.ding(); react('happy'); instr('<span class="emo">👍</span> Good job! ' + n + ' chairs!', 'good'); }
  area.innerHTML = '';
  $('#seatSpots').classList.add('hidden');
  c.seats = Array.from(placed.keys()).slice(0, n);
  await sleep(900, t);
  waiterSay('This way, please. Here is your table. Please have a seat. Here is your menu.');
  busy();
  // customers walk to their chairs and sit down
  const walks = c.members.map((m, k) => (async () => {
    const a = SC.people[k]; const sp = SEAT_SPOTS[c.seats[k]];
    await sleep(k * 250, t);
    await moveActor(a, [{ i: sp.i - 0.35, j: sp.j + 0.35 }], 1.8, t);
    a.remove();
    const chair = placed.get(c.seats[k]); if (chair) chair.remove();
    const s = new Actor(seatHTML(m), sp.i, sp.j, { dz: .1, cls: 'seatA' }); s.member = m; SC.seatActors[k] = s;
  })());
  SC.seatActors = [];
  await Promise.all(walks);
  SC.people = []; SC.phase = 'seated';
  await sleep(600, t);
  say('Thank you.', c.members[0]);
  react('happy');
  instr('<span class="emo">📜</span> The guests have their menus.');
  await waitAction('Next ➜', t);
}
function removeChairForce(placed) { const k = Array.from(placed.keys()).pop(); placed.get(k).remove(); placed.delete(k); $(`.seatSpot[data-k="${k}"]`).classList.remove('taken'); }

/* ---------- STEP 3: ORDER ---------- */
async function stepOrder(t) {
  const c = cur();
  waiterSay('Are you ready to order?');
  say('Hmm… let me look at the menu.', c.members[0], { plain: true, label: `${c.members[0].name} is reading the menu.` });
  instr('<span class="emo">🗣️</span> Waiters, ask the question!');
  await waitAction('Next ➜', t);
  waiterHide();
  const line = `Yes, I would like ${orderText(c.order)}, please.`;
  say(line, c.members[0]);
  area.innerHTML = `<div class="menuCard"><h3>Menu</h3><div class="menuGrid">${DISH_KEYS.map(d => `<div class="dish" data-d="${d}">${dishPlateSVG(d, 150)}<div class="lbl">${d}</div></div>`).join('')}</div></div>`;
  const dishes = $$('.dish', area);
  dishes.forEach(el => onTap(el, () => { el.classList.toggle('sel'); SFX.pop(); }));
  instr('<span class="emo">👂</span> Listen! Tap the food you heard. Then tap ✓.');
  await askDishes(t, c.order, line, c.order, false);
  waiterSay('Would you like anything else?');
  say('Hmm… let me think.', c.members[0], { plain: true, label: `${c.members[0].name} is thinking.` });
  instr('<span class="emo">🗣️</span> Waiters, ask the question!');
  await waitAction('Next ➜', t);
  waiterHide();
  if (c.extra) {
    const l2 = `Yes, I would like ${c.extra}, please.`;
    say(l2, c.members[0]);
    instr('<span class="emo">👂</span> Listen! Tap the NEW food. Then tap ✓.');
    dishes.forEach(el => { el.classList.remove('right'); el.classList.toggle('locked', el.classList.contains('sel')); });
    await askDishes(t, c.order.concat([c.extra]), l2, [c.extra], true);
    await sleep(800, t);
  }
  say('That will be all. Thank you.', c.members[0]);
  await sleep(2200, t);
  // chef rings the bell
  const p = rightWallPt(369, 70);
  fx('sparkle', p.x, p.y - 30, '🛎️', 2200).style.fontSize = '80px';
  SFX.bell();
  const bm = $('#bigMsg'); bm.classList.remove('hidden');
  bm.innerHTML = `<div class="t" style="font-size:110px"><span class="emo">🛎️</span> Order up!</div>`;
  instr('<span class="emo">📣</span> Everyone, shout: “Order up!”', 'good');
  await sleep(2200, t);
  bm.classList.add('hidden');
  waiterSay("Please wait. We'll serve it soon.");
  instr('<span class="emo">🗣️</span> Waiters, tell the customers!');
  await waitAction('Next ➜', t);
}
async function askDishes(t, want, line, newOnes, isExtra) {
  const c = cur(); let tries = 0;
  while (true) {
    await waitAction('✓ Check the order', t);
    const sel = $$('.dish.sel', area).map(e => e.dataset.d).sort();
    const ok = sel.join() === want.slice().sort().join();
    tries++;
    if (ok) break;
    SFX.bonk(); react('confused');
    if (tries === 1) {
      say(`Hmm… not quite! I said ${newOnes.length === 1 ? 'one thing' : newOnes.length + ' things'}. Listen again: ${orderText(newOnes)}.`, c.members[0]);
      instr('<span class="emo">🤔</span> Try again! Listen to the customer.', 'bad');
    } else {
      $$('.dish', area).forEach(e => { const d = e.dataset.d; e.classList.remove('sel'); if (want.includes(d)) e.classList.add('sel', 'right'); });
      instr(`<span class="emo">💡</span> ${c.members[0].g === 'f' ? 'She' : 'He'} would like ${orderText(newOnes)}.`, 'bad');
      tries = 3; await sleep(2600, t); break;
    }
  }
  award(tries, elCenter(actionBtn));
  if (tries === 1) { SFX.cheer(); react('dance'); instr('<span class="emo">🎉</span> Perfect order!', 'good'); }
  else if (tries === 2) { SFX.ding(); react('happy'); instr('<span class="emo">👍</span> Good listening!', 'good'); }
  $$('.dish', area).forEach(e => e.classList.add('locked'));
  if (tries < 3) await sleep(1200, t);
}

/* ---------- STEP 4: UTENSILS ---------- */
function neededUtensils(c) {
  const all = c.order.concat(c.extra ? [c.extra] : []);
  const need = new Set(['napkin']);
  if (all.includes('steak')) { need.add('fork'); need.add('knife'); }
  if (all.includes('spaghetti')) need.add('fork');
  if (all.includes('salad')) need.add('saladFork');
  if (all.includes('soup')) need.add('soupSpoon');
  if (all.includes('cake')) need.add('dessertSpoon');
  if (all.includes('juice')) need.add('glass');
  return need;
}
function zoomIn(html) {
  const td = $('#topdown'); td.innerHTML = html;
  $('#sceneWrap').classList.add('zoom');
  return new Promise(r => setTimeout(() => { td.classList.add('show'); r(); }, 550));
}
function zoomOut() {
  $('#topdown').classList.remove('show');
  return new Promise(r => setTimeout(() => { $('#sceneWrap').classList.remove('zoom'); setTimeout(r, 900); }, 450));
}
function tdLabel(key, txt, life) {
  const sp = TD.spots[key];
  const d = document.createElement('div'); d.className = 'tdLabel'; d.textContent = txt;
  d.style.left = sp.x + 'px'; d.style.top = (sp.y + sp.h / 2 + (key === 'saladFork' || key === 'soupSpoon' ? 62 : 8)) + 'px';
  if (key === 'dessertSpoon' || key === 'glass') d.style.top = (sp.y - sp.h / 2 - 50) + 'px';
  if (key === 'dessertSpoon') d.style.left = (sp.x - 160) + 'px';
  $('#topdown').appendChild(d);
  if (life) setTimeout(() => d.remove(), life);
  return d;
}
async function stepUtensils(t) {
  const c = cur(), lead = c.members[0];
  const need = neededUtensils(c);
  const funny = pick(['chopsticks', 'ladle']);
  const allFood = c.order.concat(c.extra ? [c.extra] : []);
  busy();
  instr('<span class="emo">🔍</span> Let’s look at the table up close…');
  const body = plateTopSVG(TD.plate.x, TD.plate.y, TD.plate.r) + Object.keys(TD.spots).map(tdSpotSVG).join('') + '<g id="tdPlaced"></g>';
  await zoomIn(topdownSVG(lead, { body }));
  chk(t);
  const chip = document.createElement('div'); chip.id = 'orderChip';
  chip.innerHTML = `<small>${lead.name}'s order:</small>${allFood.map(d => `<span class="emo">${DISHES[d].emoji}</span> ${d}`).join(' + ')}`;
  $('#topdown').appendChild(chip);
  say('Please set the table for me!', lead);
  instr('<span class="emo">🍴</span> Drag what the customer needs to the table. Tap a thing to hear its name.');
  const items = shuffle(['fork', 'knife', 'saladFork', 'soupSpoon', 'dessertSpoon', 'glass', 'napkin', funny]);
  const sc = { napkin: .62, glass: .8, chopsticks: .62, ladle: .6 };
  area.innerHTML = `<div class="tray" style="grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(2,1fr)">${items.map(k => `<div class="cell" data-k="${k}"><svg viewBox="-60 -140 120 280" width="72" height="168">${UT[UT_DRAW[k]](sc[k] ? sc[k] / .62 : 1)}</svg><div class="lbl">${UTENSIL_INFO[k].name}</div></div>`).join('')}</div>`;
  const tries = {}, done = new Set();
  let points = 0, firstAll = true;
  const placeIt = key => {
    done.add(key);
    $('#tdPlaced').insertAdjacentHTML('beforeend', placedUtensilSVG(key));
    $(`.cell[data-k="${key}"]`, area).classList.add('used');
    $(`.tdSpot[data-key="${key}"]`).classList.remove('point');
  };
  const nearestSpot = p => {
    const x = p.x, y = p.y - SCENE_Y; let best = null, bd = 1e9;
    for (const [k, s] of Object.entries(TD.spots)) {
      const dx = Math.max(0, Math.abs(x - s.x) - s.w / 2), dy = Math.max(0, Math.abs(y - s.y) - s.h / 2);
      const d = Math.hypot(dx, dy) + Math.hypot(x - s.x, y - s.y) * 0.01;
      if (d < bd) { bd = d; best = k; }
    }
    return bd < 50 ? best : null;
  };
  $$('.cell', area).forEach(el => {
    const key = el.dataset.k;
    draggable(el, {
      enabled: () => !done.has(key),
      ghost: () => `<svg viewBox="-60 -140 120 280" width="120" height="280">${UT[UT_DRAW[key]](1)}</svg>`,
      onTapItem: () => { speak(UTENSIL_INFO[key].name, CHEF); el.classList.remove('tapped'); void el.offsetWidth; el.classList.add('tapped'); },
      onDrop: p => {
        const spot = nearestSpot(p);
        if (!spot) { instr('<span class="emo">👉</span> Drop it on a dotted spot on the table.'); return false; }
        const info = UTENSIL_INFO[key];
        if (info.funny) { SFX.boing(); react('funny'); say(info.funny, lead); instr('<span class="emo">😜</span> Silly! That is not for this dinner.', 'bad'); return false; }
        if (!need.has(key)) { SFX.bonk(); react('confused'); say(info.none, lead); instr(`<span class="emo">🤔</span> Look at the order! Do we need a ${info.name}?`, 'bad'); return false; }
        if (spot === key) {
          tries[key] = (tries[key] || 0) + 1;
          placeIt(key); SFX.ding(); sparkleAt(TD.spots[key].x, TD.spots[key].y, 6);
          tdLabel(key, info.name, 1800);
          const p2 = award(tries[key], { x: TD.spots[key].x, y: TD.spots[key].y + SCENE_Y });
          if (tries[key] > 1) firstAll = false;
          points += p2; react('happy');
          instr(key === 'napkin' ? '<span class="emo">👍</span> Yes! The guest puts the napkin on the lap.' : `<span class="emo">👍</span> Yes! ${info.explain}`, 'good');
          return true;
        }
        tries[key] = (tries[key] || 0) + 1; firstAll = false;
        SFX.bonk(); react('confused');
        if (tries[key] >= 2) {
          placeIt(key); tdLabel(key, info.name, 2600); award(3);
          instr(`<span class="emo">💡</span> ${info.explain}`, 'bad'); say(info.explain, lead);
          return true;
        }
        say(info.hint, lead); instr('<span class="emo">🤔</span> Try again!', 'bad');
        return false;
      }
    });
  });
  while (true) {
    await waitAction('✅ Table ready!', t);
    const missing = Array.from(need).filter(k => !done.has(k));
    if (!missing.length) break;
    SFX.bonk(); react('confused');
    $$('.tdSpot').forEach(s => s.classList.remove('point'));
    missing.forEach(k => $(`.tdSpot[data-key="${k}"]`).classList.add('point'));
    const sp = TD.spots[missing[0]];
    fx('pointHand', sp.x - sp.w / 2 - 10, sp.y, '👉', 2600);
    say(`Excuse me… I need a ${UTENSIL_INFO[missing[0]].name} here!`, lead);
    instr(`<span class="emo">👉</span> Something is missing! Look at the red spot${missing.length > 1 ? 's' : ''}.`, 'bad');
  }
  busy();
  if (firstAll) { SFX.cheer(); react('dance'); }
  else { SFX.ding(); react('happy'); }
  $$('.tdSpot').forEach(s => { if (!done.has(s.dataset.key)) s.style.opacity = '.25'; });
  done.forEach(k => tdLabel(k, UTENSIL_INFO[k].name));
  area.innerHTML = '';
  say('What a beautiful table! Thank you.', lead);
  instr('<span class="emo">👀</span> Look at the table, everyone! Say the names together.', 'good');
  await sleep(5200, t);
  await zoomOut(); chk(t);
}

/* ---------- STEP 5: SERVE ---------- */
async function stepServe(t) {
  const c = cur(), lead = c.members[0];
  const all = c.order.concat(c.extra ? [c.extra] : []).sort((a, b) => DISHES[a].course - DISHES[b].course);
  instr('<span class="emo">👨‍🍳</span> The chef is coming with the food!');
  say('Here I come!', CHEF, { label: 'Chef Marcel says:' });
  $('#kitDoor').classList.add('open'); $('#chefPeek').classList.add('hidden');
  chefActor = new Actor(`<g class="pw">${personSVG(CHEF)}<g class="holdDish" transform="translate(0,-160)"></g></g>`, KITCHEN.i, KITCHEN.j, { dz: .05 });
  chefActor.member = CHEF;
  chefActor.g.classList.add('fadeIn');
  await moveActor(chefActor, [{ i: KITCHEN.i + 0.6, j: KITCHEN.j + 0.8 }, CHEF_SERVE], 1.5, t);
  $('#kitDoor').classList.remove('open');
  foodOnTable(false);
  const served = [];
  const courseBar = () => `<div class="courses">${all.map((d, k) => `<div class="course ${served.includes(d) ? 'done' : (served.length === k ? 'cur' : '')}">${k + 1}. ${DISHES[d].courseName}</div>`).join('<span>➜</span>')}</div>`;
  for (let k = 0; k < all.length; k++) {
    const d = all[k], D = DISHES[d];
    chefActor.g.querySelector('.holdDish').innerHTML = `<ellipse rx="24" ry="9" fill="#fff" stroke="#d6a93f" stroke-width="2"/><text y="2" font-size="34" text-anchor="middle">${D.emoji}</text>`;
    SFX.pop();
    say(k === 0 ? `${D.courseName === 'Drink' ? 'The drink comes first' : 'The starter comes first'}: ${d}!` : `Next, the ${D.courseName.toLowerCase()}: ${d}!`, CHEF, { label: 'Chef Marcel says:' });
    area.innerHTML = `<div class="serveBox">${courseBar()}<div class="dragDish">${dishPlateSVG(d, 210)}<div class="lbl">${d}</div></div><div class="note">Fine dining order: drink → starter → main dish → dessert</div></div>`;
    instr(`<span class="emo">🍽️</span> Course ${k + 1}: ${D.courseName}. Drag the ${d} to the table!`);
    $('#tableTarget').classList.remove('hidden');
    await new Promise(res => {
      draggable($('.dragDish', area), {
        ghost: () => dishPlateSVG(d, 220),
        onDrop: p => {
          const q = iso(TABLE.i, TABLE.j); const dx = (p.x - q.x) / 130, dy = (p.y - SCENE_Y - (q.y - 52)) / 95;
          if (dx * dx + dy * dy > 1) { instr('<span class="emo">👉</span> Drop it on the table!', 'bad'); SFX.bonk(); return false; }
          served.push(d); SFX.ding(); sparkleAt(q.x, q.y - 60, 5);
          chefActor.g.querySelector('.holdDish').innerHTML = '';
          const g = tableActor.g.querySelector('#tableFood');
          const pos = [[-44, -46], [40, -62], [-6, -36], [50, -40], [-50, -66]][k];
          g.insertAdjacentHTML('beforeend', `<g class="fadeIn" transform="translate(${pos[0]},${pos[1]})"><ellipse rx="20" ry="9" fill="#fff" stroke="#d6a93f" stroke-width="2"/><text y="6" font-size="26" text-anchor="middle">${D.emoji}</text></g>`);
          react('happy'); setTimeout(res, 50);
          return true;
        }
      });
    });
    chk(t);
    $('#tableTarget').classList.add('hidden');
    area.innerHTML = `<div class="serveBox">${courseBar()}</div>`;
    await sleep(700, t);
  }
  instr('<span class="emo">👨‍🍳</span> All the food is on the table!', 'good');
  $('#kitDoor').classList.add('open');
  await moveActor(chefActor, [{ i: KITCHEN.i + 0.6, j: KITCHEN.j + 0.8 }, KITCHEN], 1.8, t);
  chefActor.remove(); chefActor = null; $('#kitDoor').classList.remove('open'); $('#chefPeek').classList.remove('hidden');
  waiterSay('Here are your orders! Enjoy your meal.');
  instr('<span class="emo">🗣️</span> Waiters, say it together!');
  await waitAction('Next ➜', t);
  waiterHide();
  say('Thank you.', lead); react('happy');
  SC.phase = 'eating';
  await sleep(700, t);
  setEating(true);
  instr('<span class="emo">😋</span> The customers are eating. Yum!');
  await waitAction('Next ➜', t);
}

/* ---------- STEP 6: MANNERS ---------- */
function mannerPic(m, item, rude) {
  const face = item.face === 'funny' ? 'r-funny' : '';
  const mm = Object.assign({}, m, { scale: 1 });
  let extra = '';
  if (item.bub) extra += `<div style="position:absolute;right:8px;top:8px;background:#fff;border:3px solid ${rude ? '#c0392b' : '#2f8a4a'};border-radius:16px;padding:4px 10px;font-size:20px;font-weight:800;max-width:140px;line-height:1.1">${item.bub}</div>`;
  return `<svg viewBox="-60 -120 120 120" width="190" height="190" style="position:absolute;left:-6px;bottom:-18px"><g class="pw ${face}"><g class="react">${personSVG(mm, { seated: true })}</g></g></svg>
    <div style="position:absolute;left:0;right:0;bottom:0;height:34px;background:#fff;border-top:4px solid #e3d6bb"></div>
    ${item.svg ? `<svg viewBox="-60 -110 120 220" width="70" height="128" style="position:absolute;left:58px;bottom:6px;transform:rotate(-8deg)">${UT.napkin(1)}</svg>` : `<div class="emo" style="position:absolute;right:16px;bottom:26px;font-size:70px">${item.emo}</div>`}${extra}`;
}
async function stepManners(t) {
  const c = cur();
  const list = shuffle([{ type: 'rude', key: c.rude }, { type: 'polite', key: c.polite[0] }, { type: 'polite', key: c.polite[1] }]);
  list.forEach((it, k) => { it.who = c.mannerWho[k]; it.item = it.type === 'rude' ? RUDE[it.key] : POLITE[it.key]; });
  say('Mmm… this food is delicious!', c.members[0]);
  instr('<span class="emo">🔎</span> Look at the customers! Who is <b>RUDE</b>? Tap ONE card.');
  const his = w => (w.g === 'f' ? 'her' : 'his');
  area.innerHTML = `<div class="cards3">${list.map((it, k) => `<div class="mcard" data-k="${k}"><div class="pic">${mannerPic(it.who, it.item, it.type === 'rude')}</div>
     <div class="sent">${it.item.s.replace('{N}', it.who.name).replace(/\{his\}/g, his(it.who))}</div></div>`).join('')}</div>`;
  // little icons above the customers in the dollhouse
  const heads = headPositions();
  list.forEach((it, k) => { const idx = c.members.indexOf(it.who); const h = heads[idx]; if (h) fx('bubbleIcon', h.x, h.y + 10, it.item.emo, 60000); });
  busy('Tap a card');
  const k = await new Promise(res => $$('.mcard', area).forEach(el => onTap(el, () => res(+el.dataset.k))));
  chk(t);
  const right = list[k].type === 'rude';
  $$('.mcard', area).forEach((el, q) => { el.classList.add(list[q].type); el.style.pointerEvents = 'none'; el.insertAdjacentHTML('beforeend', `<div class="tag">${list[q].type === 'rude' ? '❌ RUDE' : '✅ POLITE'}</div>`); });
  $$('.mcard', area)[k].classList.add('picked');
  award(right ? 1 : 3, elCenter($$('.mcard', area)[k]));
  if (right) { SFX.cheer(); react('dance'); instr('<span class="emo">🎉</span> Yes! You found the rude one!', 'good'); }
  else { SFX.bonk(); react('confused'); instr('<span class="emo">💡</span> Oops! Look at the red card. That one is rude.', 'bad'); }
  const rd = RUDE[c.rude];
  G.practiced.dont.add(rd.rule); G.practiced.do.add(rd.do); c.polite.forEach(p => G.practiced.do.add(POLITE[p].rule));
  await sleep(1300, t);
  $('.cards3', area).style.bottom = '168px';
  $$('.mcard .pic', area).forEach(p => p.style.display = 'none');
  $$('.mcard .sent', area).forEach(s => { s.style.fontSize = '23px'; s.style.marginTop = '34px'; });
  area.insertAdjacentHTML('beforeend', `<div class="ruleCard"><div class="dont">❌ ${rd.rule}</div><div class="do">✅ ${rd.do}</div></div>`);
  say(rd.rule + ' ' + rd.do, CHEF, { label: 'Table manners rule:' });
  await waitAction('Next ➜', t);
}

/* ---------- STEP 7: PLATE SIGNAL ---------- */
async function stepPlate(t) {
  const c = cur(), lead = c.members[0];
  busy();
  instr('<span class="emo">🔍</span> Let’s look at a plate…');
  const draw = (sig, food) => signalPlateSVG(sig, 575, 600, 300, food);
  await zoomIn(topdownSVG(lead, { mat: false, body: `<g id="sigPlate">${draw(c.signal, c.signal === 'pause')}</g>` }));
  chk(t);
  setEating(c.signal === 'pause');
  const ask = async (sig) => {
    say('Look at my fork and knife!', lead, { plain: true, label: `${lead.name}'s plate:` });
    instr('<span class="emo">🍴</span> Look at the fork and knife. What does the customer mean? Pick ONE.');
    area.innerHTML = `<div class="choices">${Object.entries(SIGNALS).map(([k, v]) => `<button class="choice" data-k="${k}"><span class="e">${v.e}</span><div>${v.name}<small>${v.sub}</small></div></button>`).join('')}</div>`;
    busy('Pick one');
    const pickK = await new Promise(res => $$('.choice', area).forEach(el => onTap(el, () => res(el.dataset.k))));
    chk(t);
    const ok = pickK === sig;
    $$('.choice', area).forEach(el => { el.style.pointerEvents = 'none'; if (el.dataset.k === sig) el.classList.add('right'); else if (el.dataset.k === pickK) el.classList.add('wrong'); else el.classList.add('dim'); });
    award(ok ? 1 : 3, elCenter($(`.choice[data-k="${pickK}"]`, area)));
    if (ok) { SFX.cheer(); react('dance'); instr(`<span class="emo">🎉</span> Yes! ${SIGNALS[sig].explain}`, 'good'); }
    else { SFX.bonk(); react('confused'); instr(`<span class="emo">💡</span> ${SIGNALS[sig].explain}`, 'bad'); }
    await sleep(1500, t);
  };
  await ask(c.signal);
  let fin = c.signal;
  if (c.signal === 'pause') {
    waiterSay('Take your time.');
    await waitAction('Next ➜', t);
    waiterHide();
    busy();
    instr('<span class="emo">😋</span> The customer eats a little more…');
    setEating(true);
    const plate = $('#sigPlate');
    plate.animate([{ opacity: 1 }, { opacity: .2 }, { opacity: 1 }], { duration: 2600 });
    await sleep(1300, t);
    plate.innerHTML = draw(c.signal2, false);
    await sleep(1500, t);
    setEating(false);
    fin = c.signal2;
    await ask(fin);
  }
  setEating(false);
  waiterSay('May I take your plate?');
  instr('<span class="emo">🗣️</span> Waiters, ask the question!');
  await waitAction('Next ➜', t);
  waiterHide();
  say('Yes, please.', lead); react('happy');
  const plate = $('#sigPlate');
  plate.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: 'translate(0,700px)', opacity: 0 }], { duration: 900, easing: 'ease-in', fill: 'forwards' });
  await sleep(1300, t);
  await zoomOut(); chk(t);
  foodOnTable(false); setEating(false); SC.phase = 'eaten';
  instr('<span class="emo">✨</span> The table is clean.');
  await waitAction('Next ➜', t);
}

/* ---------- STEP 8: GOODBYE ---------- */
async function stepGoodbye(t) {
  const c = cur(), lead = c.members[0];
  const fin = c.signal === 'pause' ? c.signal2 : c.signal;
  busy();
  if (fin === 'delicious') {
    instr('<span class="emo">😋</span> They loved the food! The chef is coming out!');
    $('#kitDoor').classList.add('open'); $('#chefPeek').classList.add('hidden');
    chefActor = new Actor(`<g class="pw">${personSVG(CHEF)}</g>`, KITCHEN.i, KITCHEN.j, { dz: .05 }); chefActor.member = CHEF;
    await moveActor(chefActor, [{ i: KITCHEN.i + 0.6, j: KITCHEN.j + 0.8 }, CHEF_SERVE, CHEF_BYE], 1.6, t);
    $('#kitDoor').classList.remove('open');
    chefActor.g.querySelector('.pw').classList.add('waving');
    say("I'm so happy you liked it! Please come again!", CHEF, { label: 'Chef Marcel says:' });
    const p = chefActor.screen(); for (let k = 0; k < 4; k++) setTimeout(() => fx('heart', p.x + rnd(-30, 30), p.y - 150, pick(['❤️', '💖'])), k * 250);
  } else {
    waiterSay('Thank you for coming! Please come again!');
    instr('<span class="emo">🗣️</span> Waiters, say goodbye together!');
    say('Time to say goodbye!', lead, { plain: true, label: 'The meal is over.' });
  }
  await sleep(2600, t);
  // customers stand up, wave, and leave
  if (!c.seats) c.seats = defaultSeats(c.members.length);
  (SC.seatActors || []).forEach((a, k) => {
    a.g.innerHTML = chairSVG(1);
    const sp = SEAT_SPOTS[c.seats[k]];
    const p = new Actor(personHTML(c.members[k], false), sp.i - 0.35, sp.j + 0.35, { dz: .05 }); p.member = c.members[k]; SC.people.push(p);
  });
  SC.people.forEach(a => a.g.querySelector('.pw').classList.add('waving'));
  say('Thank you! Goodbye!', lead);
  await sleep(1600, t);
  SC.people.forEach(a => a.g.querySelector('.pw').classList.remove('waving'));
  $('#entDoor').classList.add('open');
  await Promise.all(SC.people.map((a, k) => (async () => {
    await sleep(k * 300, t);
    await moveActor(a, [{ i: 1.6, j: 6.6 }, { i: ENTRANCE.i + 0.6, j: ENTRANCE.j }, ENTRANCE], 1.9, t);
    a.g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
  })()));
  await sleep(300, t);
  $('#entDoor').classList.remove('open');
  if (chefActor) { chefActor.g.querySelector('.pw').classList.remove('waving'); }
  waiterHide();
  // stars for this customer
  const last = G.idx + 1 >= G.customers.length;
  area.innerHTML = `<div class="summary"><div class="sub">${c.name} gave you</div><div class="big"><span class="emo">⭐</span> ${G.custStars}</div>
    <div class="sub">${c.vip ? 'VIP double stars! ' : ''}${G.custStars >= 14 ? 'Wonderful waiters!' : G.custStars >= 8 ? 'Great job, waiters!' : 'Good work, waiters!'}</div></div>`;
  SFX.cheer();
  instr(`<span class="emo">🎉</span> Total for the class: ${G.total} stars!`, 'good');
  await waitAction(last ? '🏆 Read our review!' : 'Next customer ➜', t);
  if (chefActor) { chefActor.remove(); chefActor = null; $('#chefPeek').classList.remove('hidden'); }
}

const STEP_FN = { greet: stepGreet, table: stepTable, order: stepOrder, utensils: stepUtensils, serve: stepServe, manners: stepManners, plate: stepPlate, goodbye: stepGoodbye };

/* ============================================================
   SCREENS: start, guide, settings, end
   ============================================================ */
function startScreen() {
  const s = $('#start');
  const crowd = [makeMember(['lady', 'a', 'f'], new Set()), makeMember(['gent', 'b', 'm'], new Set()), makeMember(['girl', 'c', 'f'], new Set()), makeMember(['grandpa', 'd', 'm'], new Set())];
  s.innerHTML = `<div class="paper">
    <div class="tag">Welcome to</div>
    <div class="title">The Golden Spoon</div>
    <div class="tag">A fine-dining restaurant game · You are the waiters! <span class="emo">🤵</span></div>
    <ul>
      <li><span class="emo">👋</span> Customers come in. <b>Say the waiter lines</b> in the red bubble together.</li>
      <li><span class="emo">👂</span> Listen to the customer. <b>Drag</b> chairs, <b>tap</b> the food, and <b>set the table</b>.</li>
      <li><span class="emo">🙂</span> Find the <b>rude</b> table manners and read the <b>plate signals</b>.</li>
      <li><span class="emo">⭐</span> Right the first time = <b>2 stars</b>. Right the second time = <b>1 star</b>. VIP guests give <b>double stars!</b></li>
    </ul>
    <div class="row">
      <button class="bigBtn alt" id="bGuide"><span class="emo">📖</span> Learn the table</button>
      <button class="bigBtn alt" id="bSet"><span class="emo">⚙️</span> Settings</button>
      <button class="bigBtn" id="bOpen"><span class="emo">🍽️</span> Open the restaurant!</button>
    </div>
    <svg class="crowd" width="360" height="190" viewBox="-30 -170 360 190">${crowd.map((m, k) => `<g transform="translate(${k * 88 + 20},0) scale(1.15)"><g class="pw r-dance"><g class="react">${personSVG(m)}</g></g></g>`).join('')}</svg>
  </div>`;
  s.classList.remove('hidden');
  onTap($('#bGuide'), showGuide); onTap($('#bSet'), showSettings);
  onTap($('#bOpen'), () => { tryFullscreen(); startGame(); });
}
function tryFullscreen() { try { const d = document.documentElement; if (!document.fullscreenElement && d.requestFullscreen) d.requestFullscreen().catch(() => { }); } catch (e) { } }
function startGame() {
  audio(); setMusic(S.music);
  $('#start').classList.add('hidden'); $('#endScr').classList.add('hidden');
  G.customers = makeCustomers(S.customers); G.idx = 0; G.total = 0; G.possible = 0; G.running = true;
  G.practiced = { do: new Set(), dont: new Set() };
  updateStars(); startCustomer();
}

function showGuide() {
  const g = $('#guide');
  const all = Object.keys(TD.spots);
  const body = plateTopSVG(TD.plate.x, TD.plate.y, TD.plate.r) + all.map(placedUtensilSVG).join('');
  const lab = (key, txt) => { const sp = TD.spots[key]; let y = sp.y + sp.h / 2 + (key === 'saladFork' || key === 'soupSpoon' ? 92 : 38); let x = sp.x; if (key === 'dessertSpoon') { x = sp.x - 200; y = sp.y + 10; } if (key === 'glass') { x = sp.x + 120; y = sp.y + 10; } return `<g><rect x="${x - txt.length * 8 - 14}" y="${y - 30}" width="${txt.length * 16 + 28}" height="42" rx="14" fill="#ffe08a" stroke="#fff" stroke-width="3"/><text x="${x}" y="${y}" text-anchor="middle" font-size="26" font-weight="800" fill="#4f0f19">${txt}</text></g>`; };
  const labels = all.map(k => lab(k, UTENSIL_INFO[k].name)).join('');
  const sig = k => `<div><svg viewBox="0 0 300 300" width="150" height="150">${signalPlateSVG(k, 150, 150, 130, k === 'pause')}</svg><div>${SIGNALS[k].e} ${SIGNALS[k].name}</div></div>`;
  g.innerHTML = `<div class="paper"><button class="close" id="gClose">✕</button>
    <h2><span class="emo">📖</span> Learn the table</h2>
    <div class="gl"><svg viewBox="80 280 990 600" width="1180" height="715" style="border-radius:24px">
      <rect x="0" y="0" width="1150" height="970" fill="url(#pCloth)"/>${placematSVG()}${body}${labels}</svg>
      <div class="rulesTxt"><span>Forks ⬅ left</span><span>Knife & spoon ➡ right</span><span>Knife blade faces the plate</span><span>Dessert spoon ⬆ above</span><span>Glass ↗ top right</span><span>Napkin ➜ on your lap</span></div></div>
    <div class="gr">
      <div class="gbox"><h3>Plate signals</h3><div class="sigRow">${sig('pause')}${sig('finished')}${sig('delicious')}</div></div>
      <div class="gbox dd"><h3>Table manners</h3>
        ${Object.values(POLITE).map(p => `<div class="d">✅ ${p.rule}</div>`).join('')}
        ${Object.values(RUDE).map(p => `<div class="x">❌ ${p.rule}</div>`).join('')}</div>
    </div></div>`;
  g.classList.remove('hidden');
  onTap($('#gClose'), () => g.classList.add('hidden'));
}

function showSettings() {
  const s = $('#settings');
  const inGame = G.running;
  const render = () => {
    s.innerHTML = `<div class="paper"><button class="close" id="sClose">✕</button>
      <h2><span class="emo">⚙️</span> Teacher settings</h2>
      <div class="setRow"><div class="lab">Customers</div><div class="seg" id="segN">${[5, 8, 10].map(n => `<button class="${S.customers === n ? 'on' : ''}" data-n="${n}">${n}</button>`).join('')}</div>
        ${inGame ? '<span class="setNote">(starts with the next game)</span>' : ''}</div>
      <div class="setRow"><div class="lab">Steps</div><div class="seg" id="segS">${STEPS.map((st, k) => `<button class="${S.steps[k] ? 'on' : ''}" data-k="${k}">${k + 1}. ${st.label}</button>`).join('')}</div></div>
      <div class="setRow"><div class="lab">Voice read-aloud</div><button class="tog ${S.voice ? 'on' : 'offc'}" id="tV">${S.voice ? '🔊 On' : '🔇 Off'}</button></div>
      <div class="setRow"><div class="lab">Background music</div><button class="tog ${S.music ? 'on' : 'offc'}" id="tM">${S.music ? '🎵 On' : '🔇 Off'}</button>
        <button class="tog" id="tF" style="margin-left:auto">⛶ Full screen</button></div>
      <div class="setBtns">
        <button id="bSkip" ${inGame ? '' : 'disabled'}>⏭️ Skip step</button>
        <button id="bRedo" ${inGame ? '' : 'disabled'}>🔁 Redo step</button>
        <button id="bRestart" ${inGame ? '' : 'disabled'}>🏠 Restart game</button>
      </div></div>`;
    onTap($('#sClose'), () => s.classList.add('hidden'));
    $$('#segN button').forEach(b => onTap(b, () => { S.customers = +b.dataset.n; saveSettings(); render(); }));
    $$('#segS button').forEach(b => onTap(b, () => {
      const k = +b.dataset.k;
      if (S.steps[k] && S.steps.filter(Boolean).length === 1) return;
      S.steps[k] = !S.steps[k]; saveSettings(); render(); updatePills();
    }));
    onTap($('#tV'), () => { S.voice = !S.voice; saveSettings(); if (!S.voice && window.speechSynthesis) speechSynthesis.cancel(); render(); });
    onTap($('#tM'), () => { S.music = !S.music; saveSettings(); setMusic(S.music); render(); });
    onTap($('#tF'), () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => { }); else tryFullscreen(); });
    if (inGame) {
      onTap($('#bSkip'), () => { s.classList.add('hidden'); G.total = G.snap.total; G.possible = G.snap.possible; G.custStars = G.snap.cust; updateStars(); goStep(G.step + 1); });
      onTap($('#bRedo'), () => { s.classList.add('hidden'); G.total = G.snap.total; G.possible = G.snap.possible; G.custStars = G.snap.cust; updateStars(); if (G.step === 0) cur().vipShown = false; goStep(G.step, { force: true }); });
      onTap($('#bRestart'), () => { s.classList.add('hidden'); RUN++; resetOverlays(); clearActors(); G.running = false; G.total = 0; updateStars(); updatePills(); idleScene(); startScreen(); });
    }
  };
  render(); s.classList.remove('hidden');
}
onTap($('#gear'), showSettings);

function showEnd() {
  RUN++; G.running = false; resetOverlays(); updatePills();
  const ratio = G.possible ? G.total / G.possible : 1;
  const rating = ratio >= 0.9 ? 5 : ratio >= 0.75 ? 4 : ratio >= 0.55 ? 3 : ratio >= 0.35 ? 2 : 1;
  const heads = ['', 'A Good Start!', 'Nice Service!', 'Great Service!', 'Excellent Service!', 'The Best in Paris!'];
  const words = ['', 'The waiters are learning fast. Practice more, and The Golden Spoon will shine!', 'The waiters were kind and polite. The food came to the table, and the guests smiled.',
    'The waiters listened well and set the tables nicely. The guests were very happy!', 'Wonderful waiters! They knew the forks, knives and spoons. The guests loved every course.',
    'Magnifique! Perfect tables, perfect manners, perfect service. Everyone must visit The Golden Spoon!'];
  const d = new Date();
  const recapDo = Array.from(G.practiced.do), recapDont = Array.from(G.practiced.dont);
  const e = $('#endScr');
  e.innerHTML = `<div class="paper">
    <div class="news"><div class="mast">The Bistro Times</div>
      <div class="date"><span>${d.toDateString()}</span><span>Restaurant Review</span><span>Paris Edition</span></div>
      <div class="head">The Golden Spoon: ${heads[rating]}</div>
      <div class="rstars">${'⭐'.repeat(rating)}${'☆'.repeat(5 - rating)}</div>
      <div class="cols"><p><b>Our critic visited The Golden Spoon</b> this evening. ${words[rating]}</p>
        <p>The waiters served <b>${G.customers.length} tables</b>${G.customers.some(c => c.vip) ? ', and even some <b>VIP guests</b>' : ''}. They earned <b>${G.total} stars</b> out of ${G.possible}.</p>
        <p>“Hello! How can I help you?” they said with a big smile. “Here are your orders! Enjoy your meal.”</p>
        <p>The chef says: “Please come again!” <span class="emo">👨‍🍳</span></p></div>
      <div style="margin-top:14px;border:3px solid #3a2a20;background:linear-gradient(180deg,#f3d9c0,#e9c3a8);height:270px;position:relative;overflow:hidden">
        <svg viewBox="-40 -170 760 190" width="100%" height="230" preserveAspectRatio="xMidYMax meet" style="position:absolute;bottom:34px;left:0">
          ${[CHEF].concat(G.customers.slice(0, 5).map(c => c.members[0])).map((m, k) => `<g transform="translate(${k * 120 + 20},0) scale(1.25)"><g class="pw r-dance"><g class="react">${personSVG(Object.assign({}, m, { scale: 1 }))}</g></g></g>`).join('')}</svg>
        <div style="position:absolute;bottom:0;left:0;right:0;text-align:center;font-size:21px;background:#fbf7ec;border-top:2px solid #3a2a20;padding:3px">Happy guests and our chef at The Golden Spoon</div></div>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="cert"><div style="font-size:26px;font-weight:700;color:#8a5a3a">Certificate</div><h2>Best Waiters</h2>
        <div style="font-size:28px;font-weight:700">This award goes to <b>our whole class</b> for excellent service at The Golden Spoon!</div>
        <div style="font-size:44px;font-weight:800;margin-top:6px;color:#7a1f2b"><span class="emo">🏅⭐</span> ${G.total} stars <span class="emo">⭐🏅</span></div>
        <div style="display:flex;justify-content:space-between;font-size:22px;margin-top:6px"><span>${d.toLocaleDateString('en-US')}</span><span><i>Chef Marcel</i></span></div></div>
      <div class="gbox" style="flex:1;overflow:hidden"><h3>Table manners we practiced</h3>
        <div class="recap">${recapDo.map(x => `<div style="color:#2f8a4a">✅ ${x}</div>`).join('')}${recapDont.map(x => `<div style="color:#c0392b">❌ ${x}</div>`).join('')}
        ${!recapDo.length && !recapDont.length ? Object.values(POLITE).slice(0, 4).map(p => `<div style="color:#2f8a4a">✅ ${p.rule}</div>`).join('') : ''}</div></div>
      <div style="display:flex;gap:16px;justify-content:center"><button class="bigBtn" id="bAgain"><span class="emo">🔁</span> Play again</button></div>
    </div></div>`;
  e.classList.remove('hidden'); SFX.fanfare();
  onTap($('#bAgain'), () => { e.classList.add('hidden'); startGame(); });
}

/* idle scene behind the start screen */
function idleScene() {
  G.customers = makeCustomers(5); G.idx = 0;
  clearActors(); makeTable(); SC.cust = -2; SC.phase = 'idle'; SC.people = []; SC.seatActors = [];
  const c = G.customers[0]; c.seats = defaultSeats(c.members.length);
  c.members.forEach((m, k) => { const sp = SEAT_SPOTS[c.seats[k]]; const a = new Actor(seatHTML(m), sp.i, sp.j, { dz: .1 }); a.member = m; SC.seatActors.push(a); });
  foodOnTable(true); setEating(true);
  $('#carpet').innerHTML = '';
  say('Welcome to The Golden Spoon!', CHEF, { plain: true, label: 'Chef Marcel says:' });
  instr('<span class="emo">🌇</span> Good evening! Tap “Open the restaurant!” to start.');
  setAction('Open the restaurant! 🍽️', true);
  actionResolver = () => { tryFullscreen(); $('#start').classList.add('hidden'); startGame(); };
  $('#custCard').innerHTML = '<span class="emo">🍽️</span> The Golden Spoon · Paris';
  updatePills(); updateStars();
}

idleScene();
startScreen();
document.addEventListener('contextmenu', e => e.preventDefault());
