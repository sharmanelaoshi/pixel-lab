/* ============================================================
   THE GOLDEN SPOON — art module (all SVG drawings, built in code)
   ============================================================ */
'use strict';

/* ---------- isometric helpers ---------- */
const ISO = { cx: 560, cy: 310, tw: 50, th: 29, N: 8, WH: 280 };
const UX = 0.865, UY = 0.502, WL = 462;           // wall direction & length
function iso(i, j) { return { x: ISO.cx + (i - j) * ISO.tw, y: ISO.cy + (i + j) * ISO.th }; }
const LEFT_WALL = 'matrix(0.865,-0.502,0,1,160,262)';  // u: front-left corner -> back corner
const RIGHT_WALL = 'matrix(0.865,0.502,0,1,560,30)';   // u: back corner -> front-right corner
function leftWallPt(u, v) { return { x: 160 + UX * u, y: 262 - UY * u + v }; }
function rightWallPt(u, v) { return { x: 560 + UX * u, y: 30 + UY * u + v }; }

const TABLE = { i: 4.5, j: 4.5 };
const SEAT_R = 1.95;
const SEAT_SPOTS = [];
for (let k = 0; k < 8; k++) {
  const a = (k * 45 + 22.5) * Math.PI / 180;
  SEAT_SPOTS.push({ i: TABLE.i + SEAT_R * Math.cos(a), j: TABLE.j + SEAT_R * Math.sin(a) });
}
const ENTRANCE = { i: 0.25, j: 6.75 };
const ARRIVE_SPOTS = [
  { i: 1.1, j: 7.3 }, { i: 2.0, j: 7.4 }, { i: 1.2, j: 6.2 },
  { i: 2.9, j: 7.45 }, { i: 2.1, j: 6.35 }, { i: 1.3, j: 5.1 }
];
const KITCHEN = { i: 6.4, j: 0.45 };
const CHEF_SERVE = { i: 7.25, j: 3.1 };
const CHEF_BYE = { i: 7.2, j: 5.9 };

/* ---------- tiny utils ---------- */
function rnd(a, b) { return a + Math.random() * (b - a); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function seeded(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
  r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/* ---------- global defs (gradients/patterns shared by every SVG) ---------- */
function globalDefs() {
  return `
  <linearGradient id="gMetal" x1="0" x2="1" y1="0" y2="0">
    <stop offset="0" stop-color="#8e98a3"/><stop offset=".35" stop-color="#f4f7fa"/>
    <stop offset=".55" stop-color="#c9d1d9"/><stop offset="1" stop-color="#7c8792"/></linearGradient>
  <linearGradient id="gMetalV" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#eef2f5"/><stop offset="1" stop-color="#9aa4ae"/></linearGradient>
  <linearGradient id="gGold" x1="0" x2="1" y1="0" y2="1">
    <stop offset="0" stop-color="#fff1b3"/><stop offset=".45" stop-color="#e3b448"/><stop offset="1" stop-color="#a8761c"/></linearGradient>
  <linearGradient id="gWood" x1="0" x2="1">
    <stop offset="0" stop-color="#8a5a32"/><stop offset=".5" stop-color="#a8703f"/><stop offset="1" stop-color="#7a4c27"/></linearGradient>
  <linearGradient id="gWoodDark" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#6e4122"/><stop offset="1" stop-color="#4a2a14"/></linearGradient>
  <linearGradient id="gJuice" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#ffcf4a"/><stop offset="1" stop-color="#ff8f1f"/></linearGradient>
  <linearGradient id="gWine" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#8e2635"/><stop offset="1" stop-color="#5e1520"/></linearGradient>
  <linearGradient id="gWinSky" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#5b3f8f"/><stop offset=".38" stop-color="#d9628e"/>
    <stop offset=".7" stop-color="#ff9466"/><stop offset="1" stop-color="#ffd59a"/></linearGradient>
  <radialGradient id="gGlow"><stop offset="0" stop-color="#fff3c4" stop-opacity=".95"/>
    <stop offset=".4" stop-color="#ffd877" stop-opacity=".45"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
  <radialGradient id="gPool"><stop offset="0" stop-color="#ffe7a6" stop-opacity=".55"/>
    <stop offset="1" stop-color="#ffcf70" stop-opacity="0"/></radialGradient>
  <radialGradient id="gPorthole"><stop offset="0" stop-color="#fff6cf"/><stop offset=".7" stop-color="#ffd27a"/><stop offset="1" stop-color="#f2a43a"/></radialGradient>
  <radialGradient id="gPlate" cx=".45" cy=".4"><stop offset="0" stop-color="#ffffff"/><stop offset=".8" stop-color="#f4f1ea"/><stop offset="1" stop-color="#e2ddd2"/></radialGradient>
  <radialGradient id="gCloth" cx=".5" cy=".35"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ece6da"/></radialGradient>
  <pattern id="pWall" width="34" height="34" patternUnits="userSpaceOnUse">
    <rect width="34" height="34" fill="#f7ecd3"/>
    <path d="M17 3 L31 17 L17 31 L3 17Z" fill="none" stroke="#d8b25a" stroke-width="1.6" opacity=".8"/>
    <circle cx="17" cy="17" r="2" fill="#d8b25a" opacity=".8"/>
    <circle cx="0" cy="0" r="1.6" fill="#e6c77d"/><circle cx="34" cy="0" r="1.6" fill="#e6c77d"/>
    <circle cx="0" cy="34" r="1.6" fill="#e6c77d"/><circle cx="34" cy="34" r="1.6" fill="#e6c77d"/>
  </pattern>
  <pattern id="pCloth" width="60" height="60" patternUnits="userSpaceOnUse">
    <rect width="60" height="60" fill="#fbf8f2"/>
    <path d="M0 30 H60 M30 0 V60" stroke="#efe8da" stroke-width="2"/>
  </pattern>
  <filter id="fGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
  <filter id="fSoft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="fShadow" x="-20%" y="-20%" width="140%" height="150%">
    <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#3b1020" flood-opacity=".35"/></filter>`;
}

/* ============================================================
   PEOPLE
   ============================================================ */
const SKINS = ['#FFE0C2', '#F6C9A0', '#E3A878', '#C68650', '#8F5A35', '#6B3F24'];
const HAIRS = ['#3b2414', '#1f1712', '#7a4a22', '#d9a441', '#b5542b', '#2c2c3a'];
const OUTFITS = ['#3d5a9e', '#2f7d6d', '#8a3b7a', '#c2414f', '#e08a2e', '#5a4a9a', '#2b6c99', '#9c5b2e', '#d4577a', '#4a8a3a'];

function eyes(cy, glasses, kind) {
  let s = `<g class="eyes">
    <ellipse cx="-7" cy="${cy}" rx="2.6" ry="3.4" fill="#2a1a14"/><ellipse cx="7" cy="${cy}" rx="2.6" ry="3.4" fill="#2a1a14"/>
    <circle cx="-6.2" cy="${cy - 1.3}" r="1" fill="#fff"/><circle cx="7.8" cy="${cy - 1.3}" r="1" fill="#fff"/></g>`;
  if (kind === 'star') {
    s = `<g><rect x="-17" y="${cy - 5}" width="14" height="9" rx="4" fill="#1e1e2e"/><rect x="3" y="${cy - 5}" width="14" height="9" rx="4" fill="#1e1e2e"/>
      <path d="M-3 ${cy - 2} H3" stroke="#1e1e2e" stroke-width="2"/><path d="M-14 ${cy - 3} l4 0" stroke="#fff" stroke-width="1.5" opacity=".7"/></g>`;
  }
  if (glasses) s += `<g fill="none" stroke="#5a3b22" stroke-width="1.6"><circle cx="-7" cy="${cy}" r="5.5"/><circle cx="7" cy="${cy}" r="5.5"/><path d="M-1.5 ${cy} H1.5"/></g>`;
  return s;
}
function mouths(cy) {
  return `<g class="m-smile"><path d="M-6 ${cy} Q0 ${cy + 6} 6 ${cy}" stroke="#7a2e2a" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>
  <g class="m-big"><path d="M-7 ${cy - 1} Q0 ${cy + 10} 7 ${cy - 1}Z" fill="#7a2e2a"/><path d="M-4 ${cy + 3} Q0 ${cy + 6} 4 ${cy + 3}" fill="#e46a74"/></g>
  <g class="m-o"><ellipse cx="2" cy="${cy + 2}" rx="3" ry="3.6" fill="#7a2e2a"/></g>
  <g class="m-funny"><path d="M-7 ${cy} Q-3 ${cy - 3} 0 ${cy} T7 ${cy}" stroke="#7a2e2a" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M1 ${cy + 1} q3 7 6 0" fill="#e46a74"/></g>
  <g class="m-chew"><path d="M-4 ${cy + 1} H4" stroke="#7a2e2a" stroke-width="2.4" stroke-linecap="round"/></g>`;
}

/* Draw the head (centered at 0,0, radius 20) for a member */
function headSVG(m) {
  const sk = m.skin, hr = m.hair, k = m.kind;
  let back = '', front = '', top = '', extra = '';
  if (['lady', 'woman', 'queen', 'star', 'princess', 'girl'].includes(k)) {
    back = `<path d="M-22 -4 Q-24 -24 0 -24 Q24 -24 22 -4 L23 ${k === 'girl' ? 6 : 16} Q14 20 12 6 L-12 6 Q-14 20 -23 ${k === 'girl' ? 6 : 16}Z" fill="${hr}"/>`;
    front = `<path d="M-19 -6 Q-16 -21 0 -21 Q16 -21 19 -6 Q10 -14 2 -12 Q-8 -16 -19 -6Z" fill="${hr}"/>`;
  } else if (k === 'grandma') {
    back = `<circle cx="0" cy="-22" r="9" fill="${hr}"/>`;
    front = `<path d="M-19 -4 Q-18 -21 0 -21 Q18 -21 19 -4 Q10 -13 0 -12 Q-10 -13 -19 -4Z" fill="${hr}"/>`;
  } else if (k === 'grandpa') {
    front = `<path d="M-20 -2 Q-21 -12 -15 -14 Q-12 -6 -17 4Z M20 -2 Q21 -12 15 -14 Q12 -6 17 4Z" fill="${hr}"/>`;
  } else if (k !== 'chef' && k !== 'chefvip') {
    front = `<path d="M-20 -4 Q-20 -23 0 -22 Q20 -23 20 -4 Q14 -14 4 -15 Q-6 -12 -20 -4Z" fill="${hr}"/>`;
  }
  // accessories on top
  if (k === 'lady') {
    top = `<ellipse cx="0" cy="-17" rx="33" ry="7" fill="${m.acc}"/><path d="M-17 -18 Q-17 -38 0 -38 Q17 -38 17 -18Z" fill="${m.acc}"/>
      <rect x="-17" y="-25" width="34" height="5" fill="${shade(m.acc, -40)}"/>
      <circle cx="12" cy="-27" r="6" fill="#ff8fb1"/><circle cx="12" cy="-27" r="2.4" fill="#ffd34d"/>
      <path d="M15 -30 Q30 -48 22 -26" fill="#fff2d6" stroke="#e8c98f" stroke-width="1"/>`;
  } else if (k === 'girl' || k === 'princess') {
    if (k === 'girl') top = `<g transform="translate(0,-21)"><path d="M0 0 L-14 -8 L-14 8Z M0 0 L14 -8 L14 8Z" fill="${m.acc}"/><circle r="4" fill="${shade(m.acc, -30)}"/></g>`;
    back += `<circle cx="-22" cy="4" r="7" fill="${hr}"/><circle cx="22" cy="4" r="7" fill="${hr}"/>`;
  } else if (k === 'boy' || k === 'prince') {
    if (k === 'boy' && m.cap) top = `<path d="M-19 -10 Q-19 -27 0 -27 Q19 -27 19 -10Z" fill="${m.acc}"/><path d="M8 -11 Q22 -13 28 -9 L19 -9Z" fill="${shade(m.acc, -30)}"/>`;
  }
  if (k === 'king' || k === 'prince') {
    const s = k === 'king' ? 1 : 0.75;
    top = `<g transform="translate(0,-21) scale(${s})"><path d="M-16 0 L-18 -20 L-8 -10 L0 -24 L8 -10 L18 -20 L16 0Z" fill="url(#gGold)" stroke="#a8761c" stroke-width="1"/>
      <circle cx="0" cy="-6" r="3" fill="#e0314b"/><circle cx="-10" cy="-5" r="2.2" fill="#3a7bd5"/><circle cx="10" cy="-5" r="2.2" fill="#3fbf6f"/>
      <circle cx="0" cy="-24" r="2.4" fill="#fff4b8"/></g>`;
  }
  if (k === 'queen' || k === 'princess') {
    top = `<g transform="translate(0,-20)"><path d="M-13 2 Q-12 -9 -6 -6 Q-3 -15 0 -16 Q3 -15 6 -6 Q12 -9 13 2Z" fill="url(#gGold)" stroke="#a8761c"/>
      <circle cx="0" cy="-9" r="2.6" fill="#d23aa0"/></g>`;
  }
  if (k === 'chef' || k === 'chefvip') {
    top = `<g transform="translate(0,-18)"><rect x="-14" y="-6" width="28" height="9" fill="#fff" stroke="#ddd"/>
      <circle cx="-10" cy="-14" r="9" fill="#fff"/><circle cx="10" cy="-14" r="9" fill="#fff"/><circle cx="0" cy="-20" r="11" fill="#fff"/>
      <path d="M-14 -6 Q-19 -12 -15 -17 M14 -6 Q19 -12 15 -17" stroke="#e6e6e6" fill="none"/></g>`;
    front = `<path d="M-20 -6 Q-20 -14 -14 -16 L-14 -6Z M20 -6 Q20 -14 14 -16 L14 -6Z" fill="${hr}"/>`;
  }
  if (k === 'star') extra = `<path d="M17 -17 l2 5 5 .5 -4 3.4 1.3 5 -4.3 -2.8 -4.3 2.8 1.3 -5 -4 -3.4 5 -.5Z" fill="#ffd94a" stroke="#c99a1b" stroke-width=".8"/>`;
  const mustache = (['gent', 'grandpa', 'chef', 'chefvip', 'king'].includes(k))
    ? `<path d="M0 6 Q-6 2 -12 6 Q-15 9 -18 5 Q-15 13 -6 10 Q-2 9 0 8 Q2 9 6 10 Q15 13 18 5 Q15 9 12 6 Q6 2 0 6Z" fill="${k === 'grandpa' ? '#e8e8e8' : (k === 'king' ? '#8a5a2b' : '#3a2414')}"/>` : '';
  const beard = k === 'king' ? `<path d="M-14 6 Q-14 24 0 26 Q14 24 14 6 Q8 14 0 14 Q-8 14 -14 6Z" fill="#8a5a2b"/>` : '';
  return `${back}<circle r="20" fill="${sk}"/>
    <ellipse cx="-20" cy="2" rx="3.5" ry="5" fill="${shade(sk, -15)}"/><ellipse cx="20" cy="2" rx="3.5" ry="5" fill="${shade(sk, -15)}"/>
    ${front}${eyes(-1, m.glasses, k)}
    <circle cx="-12" cy="7" r="4.2" fill="#ff8f9a" opacity=".55"/><circle cx="12" cy="7" r="4.2" fill="#ff8f9a" opacity=".55"/>
    <g class="mouth">${mouths(9)}</g>${beard}${mustache}${top}${extra}`;
}

/* Torso + arms (hip at y=0, shoulders at y=-36). Returns string. */
function torsoSVG(m) {
  const c = m.outfit, k = m.kind, sk = m.skin;
  const dress = ['lady', 'woman', 'queen', 'star', 'princess', 'girl', 'grandma'].includes(k);
  let body;
  if (dress) {
    body = `<path d="M-13 -36 Q0 -40 13 -36 L16 -14 Q24 4 22 8 L-22 8 Q-24 4 -16 -14Z" fill="${c}"/>
      <path d="M-16 -14 Q0 -10 16 -14" stroke="${shade(c, -35)}" stroke-width="3" fill="none"/>`;
    if (k === 'star') body += `<g fill="#fff" opacity=".85"><circle cx="-8" cy="-4" r="1.4"/><circle cx="6" cy="-20" r="1.2"/><circle cx="10" cy="2" r="1.4"/><circle cx="-4" cy="-26" r="1"/><circle cx="-12" cy="4" r="1"/></g>`;
    if (k === 'grandma' || k === 'woman' || k === 'queen') body += `<g fill="#fffaf0">${[-8, -4, 0, 4, 8].map((x, i) => `<circle cx="${x}" cy="${-33 + Math.abs(x) * -0.15 + (i === 2 ? 3 : 2)}" r="1.8"/>`).join('')}</g>`;
  } else {
    body = `<path d="M-14 -36 Q0 -40 14 -36 L15 0 L-15 0Z" fill="${c}"/>`;
    if (k === 'gent' || k === 'man' || k === 'grandpa') {
      body += `<path d="M-5 -37 L0 -18 L5 -37Z" fill="#fff"/><path d="M-14 -36 L-3 -36 L0 -14 L-4 0" stroke="${shade(c, -30)}" stroke-width="2" fill="none"/>
        <path d="M14 -36 L3 -36 L0 -14 L4 0" stroke="${shade(c, -30)}" stroke-width="2" fill="none"/>`;
      if (k === 'gent') body += `<path d="M0 -34 L-8 -38 L-8 -30Z M0 -34 L8 -38 L8 -30Z" fill="${m.acc}"/><circle cy="-34" r="2.2" fill="${shade(m.acc, -30)}"/>`;
      if (k === 'man') body += `<path d="M0 -35 L-3 -31 L0 -16 L3 -31Z" fill="${m.acc}"/>`;
      if (k === 'grandpa') body += `<circle cx="0" cy="-10" r="1.6" fill="#ead9b0"/><circle cx="0" cy="-4" r="1.6" fill="#ead9b0"/>`;
    }
    if (k === 'boy') body += `<path d="M-8 -37 L-8 0 M8 -37 L8 0" stroke="${m.acc}" stroke-width="3"/><path d="M0 -35 L-5 -38 L-5 -32Z M0 -35 L5 -38 L5 -32Z" fill="${m.acc}"/>`;
    if (k === 'chef' || k === 'chefvip') body += `<circle cx="-5" cy="-24" r="1.8" fill="#bbb"/><circle cx="5" cy="-24" r="1.8" fill="#bbb"/><circle cx="-5" cy="-14" r="1.8" fill="#bbb"/><circle cx="5" cy="-14" r="1.8" fill="#bbb"/>
      <path d="M-9 -37 Q0 -30 9 -37 L5 -32 Q0 -29 -5 -32Z" fill="${k === 'chef' ? '#d64545' : '#2f6fd6'}"/>`;
    if (k === 'king' || k === 'prince') body += `<rect x="-15" y="-8" width="30" height="5" fill="url(#gGold)"/>`;
  }
  let cape = '';
  if (k === 'king' || k === 'queen') cape = `<path d="M-14 -36 Q-26 -10 -25 8 L25 8 Q26 -10 14 -36Z" fill="#b3203a"/>
    <path d="M-16 -38 Q0 -30 16 -38 Q14 -32 0 -30 Q-14 -32 -16 -38Z" fill="#fff" stroke="#ddd"/><g fill="#222"><circle cx="-8" cy="-34" r="1"/><circle cx="6" cy="-34" r="1"/></g>`;
  const sleeve = dress ? shade(c, -10) : shade(c, -15);
  const hand = `<circle cx="0" cy="26" r="5" fill="${sk}"/>`;
  const arms = `<g class="armL" transform="translate(-14,-34)"><g class="armLin"><path d="M0 0 Q-7 12 -3 24 L3 24 Q2 12 5 2Z" fill="${sleeve}"/><g transform="translate(0,0)">${hand}</g></g></g>
    <g class="armR" transform="translate(14,-34)"><g class="armRin"><path d="M0 0 Q7 12 3 24 L-3 24 Q-2 12 -5 2Z" fill="${sleeve}"/>${hand}</g></g>`;
  return cape + body + arms;
}

/* Full person. Standing: feet at (0,0). Seated: seat at y=0 (place group at seat height). */
function personSVG(m, opts = {}) {
  const sc = m.scale || 1;
  const seated = !!opts.seated;
  const c = m.outfit;
  const dress = ['lady', 'woman', 'queen', 'star', 'princess', 'girl', 'grandma'].includes(m.kind);
  const pants = m.pants || shade(c, -45);
  const shoe = '#3a2418';
  let legs;
  if (!seated) {
    legs = dress
      ? `<g class="legs"><rect x="-10" y="-34" width="7" height="32" fill="${m.skin}"/><rect x="3" y="-34" width="7" height="32" fill="${m.skin}"/>
         <ellipse cx="-7" cy="-2" rx="7" ry="4" fill="${shoe}"/><ellipse cx="7" cy="-2" rx="7" ry="4" fill="${shoe}"/></g>`
      : `<g class="legs"><g class="legL"><rect x="-12" y="-38" width="10" height="36" rx="3" fill="${pants}"/><ellipse cx="-7" cy="-2" rx="8" ry="4" fill="${shoe}"/></g>
         <g class="legR"><rect x="2" y="-38" width="10" height="36" rx="3" fill="${pants}"/><ellipse cx="7" cy="-2" rx="8" ry="4" fill="${shoe}"/></g></g>`;
  } else {
    legs = `<g class="legs"><rect x="-12" y="-6" width="10" height="${dress ? 10 : 12}" rx="4" fill="${dress ? m.skin : pants}"/><rect x="2" y="-6" width="10" height="${dress ? 10 : 12}" rx="4" fill="${dress ? m.skin : pants}"/>
      <rect x="-12" y="4" width="9" height="24" fill="${dress ? m.skin : pants}"/><rect x="3" y="4" width="9" height="24" fill="${dress ? m.skin : pants}"/>
      <ellipse cx="-8" cy="28" rx="7" ry="4" fill="${shoe}"/><ellipse cx="8" cy="28" rx="7" ry="4" fill="${shoe}"/></g>`;
  }
  const hipY = seated ? -2 : -36;
  return `<g class="person" transform="scale(${sc})">
    <ellipse class="shadow" cx="0" cy="${seated ? 30 : 0}" rx="20" ry="6" fill="#3b1020" opacity=".22"/>
    <g class="bodyAll">${legs}
      <g transform="translate(0,${hipY})">${torsoSVG(m)}
        <g class="headG" transform="translate(0,-58)"><g class="headIn">${headSVG(m)}</g></g>
      </g></g></g>`;
}

/* ============================================================
   FURNITURE
   ============================================================ */
function chairSVG(scale = 1, ghost = false) {
  return `<g class="chair" transform="scale(${scale})" ${ghost ? 'opacity=".6"' : ''}>
    <ellipse cx="0" cy="2" rx="22" ry="7" fill="#3b1020" opacity=".2"/>
    <path d="M-15 -30 Q-17 -12 -18 0 M15 -30 Q17 -12 18 0 M-8 -28 L-7 2 M8 -28 L7 2" stroke="#6b3f1f" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    <ellipse cx="0" cy="-14" rx="16" ry="5" fill="none" stroke="#6b3f1f" stroke-width="2.2"/>
    <path d="M-16 -32 L-17 -70 Q0 -84 17 -70 L16 -32" stroke="#7a4824" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M-12 -40 Q0 -50 12 -40 M-13 -52 Q0 -62 13 -52" stroke="#8a5530" stroke-width="2.5" fill="none"/>
    <ellipse cx="0" cy="-32" rx="20" ry="8" fill="#5a3418"/>
    <ellipse cx="0" cy="-34" rx="18" ry="7" fill="#9c2236"/><ellipse cx="-4" cy="-36" rx="9" ry="3" fill="#c23a50" opacity=".7"/>
  </g>`;
}

function tableSVG() {
  // round table with white cloth, candles and a rose
  return `<g class="tableG">
    <ellipse cx="0" cy="4" rx="80" ry="40" fill="#3b1020" opacity=".25"/>
    <path d="M-80 -52 Q-84 -20 -78 -2 Q-66 6 -54 0 Q-40 8 -26 2 Q-13 9 0 3 Q13 9 26 2 Q40 8 54 0 Q66 6 78 -2 Q84 -20 80 -52Z" fill="url(#gCloth)" stroke="#e2dacb" stroke-width="1.5"/>
    <path d="M-54 -46 Q-56 -20 -54 0 M-26 -42 Q-27 -18 -26 2 M26 -42 Q27 -18 26 2 M54 -46 Q56 -20 54 0" stroke="#e7e0d2" stroke-width="2" fill="none"/>
    <ellipse cx="0" cy="-52" rx="80" ry="46" fill="url(#pCloth)" stroke="#e2dacb" stroke-width="1.5"/>
    <ellipse cx="0" cy="-52" rx="80" ry="46" fill="url(#gCloth)" opacity=".55"/>
    <g id="tableFood"></g>
    <g transform="translate(0,-60)">
      <ellipse cx="0" cy="6" rx="10" ry="4" fill="#3b1020" opacity=".2"/>
      <path d="M-5 4 Q-7 -8 -3 -14 L3 -14 Q7 -8 5 4Z" fill="#cfe7f5" opacity=".85" stroke="#9cc2d8"/>
      <path d="M0 -14 Q-1 -24 1 -30" stroke="#3f8a3a" stroke-width="2" fill="none"/>
      <circle cx="1" cy="-33" r="6" fill="#d2283f"/><path d="M-2 -34 Q1 -38 4 -34 Q1 -31 -2 -34Z" fill="#a01528"/>
    </g>
    ${[[-30, -66], [30, -48]].map(([x, y]) => `<g transform="translate(${x},${y})">
      <ellipse cx="0" cy="2" rx="7" ry="3" fill="url(#gGold)"/><rect x="-2" y="-10" width="4" height="12" fill="url(#gGold)"/>
      <rect x="-3.5" y="-30" width="7" height="20" rx="1.5" fill="#fff8e8" stroke="#eadfc4"/>
      <circle cx="0" cy="-38" r="12" fill="url(#gGlow)" class="candleGlow"/>
      <path class="flame" d="M0 -44 Q4 -37 0 -32 Q-4 -37 0 -44Z" fill="#ffb02e"/><path d="M0 -40 Q2 -36 0 -34 Q-2 -36 0 -40Z" fill="#fff3b0"/></g>`).join('')}
  </g>`;
}

/* ============================================================
   THE DOLLHOUSE ROOM
   ============================================================ */
function floorSVG() {
  let s = '';
  const n = 16, st = 8 / n;
  for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
    const p = [iso(a * st, b * st), iso((a + 1) * st, b * st), iso((a + 1) * st, (b + 1) * st), iso(a * st, (b + 1) * st)];
    s += `<polygon points="${p.map(q => q.x + ',' + q.y).join(' ')}" fill="${(a + b) % 2 ? '#bcd3e8' : '#fbf4e4'}"/>`;
  }
  const A = iso(0, 8), B = iso(8, 8), C = iso(8, 0);
  // slab front faces
  s += `<polygon points="${A.x},${A.y} ${B.x},${B.y} ${B.x},${B.y + 24} ${A.x},${A.y + 24}" fill="#7b4a2a"/>
    <polygon points="${B.x},${B.y} ${C.x},${C.y} ${C.x},${C.y + 24} ${B.x},${B.y + 24}" fill="#5c3419"/>
    <polyline points="${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}" fill="none" stroke="#e3b448" stroke-width="4"/>
    <polyline points="${A.x},${A.y + 24} ${B.x},${B.y + 24} ${C.x},${C.y + 24}" fill="none" stroke="#3e220f" stroke-width="2"/>`;
  return s;
}

function fairyLights(id) {
  let s = `<path d="M0 12 ${Array.from({ length: 6 }, (_, k) => `Q${k * 77 + 38} 30 ${(k + 1) * 77} 12`).join(' ')}" stroke="#4a3a22" stroke-width="1.4" fill="none"/>`;
  const cols = ['#ffe28a', '#ffb86b', '#ff94a8', '#fff4c2', '#a8e6ff'];
  for (let k = 0; k < 6; k++) for (let t = 1; t <= 4; t++) {
    const tt = t / 5, x = k * 77 + 77 * tt, y = 12 + 2 * (1 - tt) * tt * 18 * 2 * 0.5 * 2;
    const c = cols[(k * 4 + t) % cols.length];
    s += `<g class="twinkle" style="animation-delay:${((k * 4 + t) * 0.37) % 3}s"><circle cx="${x}" cy="${y + 4}" r="7" fill="${c}" opacity=".5" filter="url(#fGlow)"/><circle cx="${x}" cy="${y + 4}" r="3.4" fill="${c}"/></g>`;
  }
  return `<g id="${id}">${s}</g>`;
}

function wainscot() {
  let s = `<rect x="0" y="185" width="${WL}" height="95" fill="url(#gWine)"/>`;
  for (let x = 10; x < WL - 40; x += 74) s += `<rect x="${x}" y="200" width="62" height="62" rx="3" fill="none" stroke="#e3b448" stroke-width="2" opacity=".85"/><rect x="${x + 6}" y="206" width="50" height="50" rx="2" fill="#6d1a26" opacity=".5"/>`;
  s += `<rect x="0" y="180" width="${WL}" height="8" fill="url(#gGold)"/><rect x="0" y="268" width="${WL}" height="12" fill="#4a1018"/><rect x="0" y="266" width="${WL}" height="3" fill="#e3b448"/>`;
  return s;
}

function leftWallSVG() {
  // window with Eiffel Tower sunset
  const win = `<g transform="translate(165,38)">
    <rect x="-8" y="-8" width="151" height="148" rx="6" fill="url(#gGold)"/>
    <rect x="0" y="0" width="135" height="132" fill="url(#gWinSky)"/>
    <circle cx="96" cy="96" r="18" fill="#ffe7a1" opacity=".95"/>
    <g fill="#3c2850" opacity=".85">
      <path d="M0 132 V108 h14 v-8 h10 v8 h12 v-14 l8 -6 8 6 v14 h14 V132Z"/>
      <path d="M78 132 v-20 h10 v-6 h12 v6 h10 v-10 h12 V132Z"/>
    </g>
    <g transform="translate(48,0)" fill="#2e1f3d">
      <path d="M0 132 L10 92 L14 60 L16 30 L17 12 L18 30 L20 60 L24 92 L34 132 L28 132 Q17 108 6 132Z"/>
      <rect x="8" y="90" width="18" height="4"/><rect x="12" y="58" width="10" height="3"/><rect x="16.2" y="4" width="1.6" height="9"/>
    </g>
    <path d="M67.5 0 V132 M0 66 H135" stroke="#fff6df" stroke-width="5"/>
    <path d="M-12 -10 Q10 40 -2 136 L-16 136Z" fill="#9c2236"/><path d="M147 -10 Q125 40 137 136 L151 136Z" fill="#9c2236"/>
    <path d="M-14 -14 H149 V2 Q134 12 118 2 Q100 12 84 2 Q67 12 50 2 Q34 12 17 2 Q0 12 -14 2Z" fill="#b3283f" stroke="#e3b448" stroke-width="2"/>
    <rect x="-10" y="138" width="155" height="8" rx="2" fill="url(#gGold)"/>
  </g>`;
  const door = `<g transform="translate(22,58)">
    <rect x="-8" y="-10" width="106" height="232" rx="4" fill="url(#gGold)"/>
    <rect x="0" y="0" width="90" height="222" fill="#2b1a2e"/>
    <rect x="0" y="0" width="90" height="222" fill="url(#gWinSky)" opacity=".35"/>
    <g id="entDoor" class="doorPanel"><rect x="0" y="0" width="90" height="222" fill="url(#gWood)" stroke="#5a3418" stroke-width="2"/>
      <rect x="12" y="12" width="66" height="92" rx="30" fill="#fbe2a8" stroke="#e3b448" stroke-width="3" opacity=".9"/>
      <path d="M45 14 V102 M14 60 H76" stroke="#e3b448" stroke-width="2"/>
      <rect x="12" y="120" width="66" height="88" rx="3" fill="none" stroke="#5a3418" stroke-width="2"/>
      <circle cx="76" cy="118" r="5" fill="url(#gGold)"/></g>
    <rect x="16" y="-34" width="58" height="20" rx="4" fill="#2f7d4a" stroke="#e3b448" stroke-width="2"/>
    <text x="45" y="-19" text-anchor="middle" font-size="14" font-weight="800" fill="#fff6d8">OPEN</text>
  </g>`;
  const painting = `<g transform="translate(345,62)">
    <rect x="-8" y="-8" width="96" height="96" rx="4" fill="url(#gGold)"/><rect x="0" y="0" width="80" height="80" fill="#2e4d6b"/>
    <g transform="translate(40,40) rotate(-30)"><ellipse cy="-18" rx="10" ry="14" fill="url(#gGold)"/><rect x="-3" y="-6" width="6" height="36" rx="3" fill="url(#gGold)"/></g>
    <g fill="#fff4b8"><circle cx="14" cy="14" r="1.6"/><circle cx="64" cy="20" r="1.6"/><circle cx="60" cy="64" r="1.2"/><circle cx="18" cy="60" r="1.4"/></g>
  </g>`;
  const sconce = (x) => `<g transform="translate(${x},70)"><circle r="18" fill="url(#gGlow)" class="candleGlow"/><path d="M-6 6 Q0 16 6 6Z" fill="url(#gGold)"/><rect x="-4" y="-12" width="8" height="16" rx="2" fill="#fff3d0"/></g>`;
  return `<g transform="${LEFT_WALL}">
    <rect x="0" y="0" width="${WL}" height="280" fill="url(#pWall)"/>
    <rect x="0" y="0" width="${WL}" height="280" fill="#7a3a12" opacity=".06"/>
    ${wainscot()}${win}${door}${painting}${sconce(326)}${sconce(446)}
    <rect x="0" y="0" width="${WL}" height="8" fill="url(#gGold)"/>
    ${fairyLights('lightsL')}
  </g>`;
}

function rightWallSVG() {
  const sign = `<g transform="translate(40,26)">
    <rect x="0" y="0" width="215" height="58" rx="10" fill="url(#gWoodDark)" stroke="url(#gGold)" stroke-width="5"/>
    <text x="107" y="40" text-anchor="middle" font-size="31" font-weight="700" font-style="italic" fill="#ffe08a">Bon appétit</text>
  </g>`;
  const menu = `<g transform="translate(66,96)">
    <rect x="-6" y="-6" width="174" height="82" rx="4" fill="url(#gWood)"/><rect x="0" y="0" width="162" height="70" fill="#2c3a33"/>
    <text x="81" y="17" text-anchor="middle" font-size="13" fill="#fdf6e0" font-weight="700">MENU</text>
    <text x="81" y="40" text-anchor="middle" font-size="18">🍲 🥗 🥩</text><text x="81" y="63" text-anchor="middle" font-size="18">🍝 🍰 🧃</text>
  </g>`;
  const kdoor = `<g transform="translate(318,70)">
    <rect x="-8" y="-8" width="118" height="218" rx="4" fill="url(#gGold)"/>
    <g id="kitDoor" class="doorPanel"><rect x="0" y="0" width="102" height="210" fill="url(#gWood)" stroke="#5a3418" stroke-width="2"/>
      <circle cx="51" cy="70" r="30" fill="url(#gGold)"/><circle cx="51" cy="70" r="25" fill="url(#gPorthole)"/>
      <rect x="12" y="120" width="78" height="78" rx="3" fill="none" stroke="#5a3418" stroke-width="2"/>
      <rect x="84" y="108" width="6" height="22" rx="2" fill="url(#gGold)"/></g>
    <rect x="16" y="-34" width="70" height="20" rx="4" fill="#fff6df" stroke="#e3b448" stroke-width="2"/>
    <text x="51" y="-19" text-anchor="middle" font-size="13" font-weight="800" fill="#7a1f2b">KITCHEN</text>
  </g>`;
  const plant = `<g transform="translate(268,262)"><path d="M-14 0 L-18 -26 H18 L14 0Z" fill="#b3283f" stroke="#e3b448" stroke-width="2"/>
    <g fill="#3f8a3a"><ellipse cx="-10" cy="-40" rx="7" ry="16" transform="rotate(-25 -10 -40)"/><ellipse cx="10" cy="-42" rx="7" ry="16" transform="rotate(25 10 -42)"/><ellipse cx="0" cy="-50" rx="7" ry="18"/></g></g>`;
  return `<g transform="${RIGHT_WALL}">
    <rect x="0" y="0" width="${WL}" height="280" fill="url(#pWall)"/>
    <rect x="0" y="0" width="${WL}" height="280" fill="#3a1a52" opacity=".07"/>
    ${wainscot()}${sign}${menu}${kdoor}${plant}
    <rect x="0" y="0" width="${WL}" height="8" fill="url(#gGold)"/>
    ${fairyLights('lightsR')}
  </g>`;
}

function wallCaps() {
  const A = iso(0, 8), O = iso(0, 0), C = iso(8, 0);
  const h = ISO.WH, t = 13, tv = 7.5;
  return `
    <polygon points="${A.x},${A.y} ${A.x},${A.y - h} ${A.x - t},${A.y - h - tv} ${A.x - t},${A.y - tv}" fill="#e9d6ad"/>
    <polygon points="${A.x},${A.y - h} ${O.x},${O.y - h} ${O.x},${O.y - h - tv * 2} ${A.x - t},${A.y - h - tv}" fill="#c99a3c"/>
    <polygon points="${O.x},${O.y - h} ${C.x},${C.y - h} ${C.x + t},${C.y - h - tv} ${O.x},${O.y - h - tv * 2}" fill="#dcb04f"/>
    <polygon points="${C.x},${C.y} ${C.x},${C.y - h} ${C.x + t},${C.y - h - tv} ${C.x + t},${C.y - tv}" fill="#d8c398"/>
    <polygon points="${A.x},${A.y} ${A.x - t},${A.y - tv} ${A.x - t},${A.y - tv + 24} ${A.x},${A.y + 24}" fill="#5c3419"/>
    <polygon points="${C.x},${C.y} ${C.x + t},${C.y - tv} ${C.x + t},${C.y - tv + 24} ${C.x},${C.y + 24}" fill="#4a2a14"/>`;
}

function rugSVG() {
  const c = iso(TABLE.i, TABLE.j);
  const rx = 2.75 * ISO.tw * 1.414, ry = 2.75 * ISO.th * 1.414;
  return `<g transform="translate(${c.x},${c.y})">
    <ellipse rx="${rx}" ry="${ry}" fill="#7a1f2b"/>
    <ellipse rx="${rx - 8}" ry="${ry - 5}" fill="none" stroke="#e3b448" stroke-width="3"/>
    <ellipse rx="${rx - 22}" ry="${ry - 13}" fill="#8e2635"/>
    <ellipse rx="${rx - 30}" ry="${ry - 18}" fill="none" stroke="#e3b448" stroke-width="1.5" stroke-dasharray="6 6"/>
    <ellipse rx="${rx * 0.5}" ry="${ry * 0.5}" fill="none" stroke="#c9793a" stroke-width="2" opacity=".7"/>
    <ellipse rx="${rx}" ry="${ry}" fill="url(#gPool)"/>
  </g>`;
}

function chandelierSVG() {
  const c = iso(TABLE.i, TABLE.j);
  const y0 = 260;
  return `<g id="chandelier" transform="translate(${c.x},0)">
    <path d="M0 -10 V${y0 - 40}" stroke="#a8761c" stroke-width="3"/>
    <circle cx="0" cy="${y0 + 8}" r="120" fill="url(#gGlow)" opacity=".55" class="chGlow"/>
    <g transform="translate(0,${y0})">
      <path d="M-70 -6 Q-50 24 0 24 Q50 24 70 -6" stroke="url(#gGold)" stroke-width="6" fill="none"/>
      <path d="M-40 -16 Q-28 12 0 12 Q28 12 40 -16" stroke="url(#gGold)" stroke-width="5" fill="none"/>
      <ellipse cx="0" cy="-30" rx="14" ry="22" fill="url(#gGold)"/><circle cx="0" cy="32" r="8" fill="url(#gGold)"/>
      <path d="M0 40 l-5 10 h10Z" fill="#f2d27a"/>
      ${[-70, -40, 0, 40, 70].map((x, k) => {
        const y = [-6, -16, -54, -16, -6][k];
        return `<g transform="translate(${x},${y})"><ellipse cx="0" cy="0" rx="9" ry="4" fill="url(#gGold)"/>
        <rect x="-3" y="-16" width="6" height="16" fill="#fff8e8"/><circle cx="0" cy="-22" r="14" fill="url(#gGlow)" class="candleGlow"/>
        <path d="M0 -28 Q4 -22 0 -17 Q-4 -22 0 -28Z" fill="#ffc94a" class="flame"/></g>`;
      }).join('')}
      <g fill="#fff6d0" opacity=".9">${[-55, -20, 20, 55].map(x => `<path d="M${x} 18 l3 8 -3 6 -3 -6Z"/>`).join('')}</g>
    </g>
  </g>`;
}

function roomSVG() {
  const spots = SEAT_SPOTS.map((p, k) => { const q = iso(p.i, p.j); return `<g class="seatSpot" data-k="${k}" transform="translate(${q.x},${q.y})"><ellipse rx="30" ry="17" fill="#fff8e0" fill-opacity=".55" stroke="#c9952b" stroke-width="3" stroke-dasharray="7 6"/></g>`; }).join('');
  const porthole = rightWallPt(318 + 51, 70 + 70);
  return `
  <g id="room">
    ${leftWallSVG()}${rightWallSVG()}${wallCaps()}
    <g id="floor">${floorSVG()}</g>
    <g id="carpet"></g>
    ${rugSVG()}
    <g id="seatSpots" class="hidden">${spots}</g>
    <g id="tableTarget" class="hidden" transform="translate(${iso(TABLE.i, TABLE.j).x},${iso(TABLE.i, TABLE.j).y - 52})"><ellipse rx="100" ry="62" fill="#fff3c0" fill-opacity=".35" stroke="#e3b448" stroke-width="5" stroke-dasharray="12 8"/></g>
    <g id="chefPeek" style="clip-path:url(#porthClip)"><g class="peekIn" transform="translate(${porthole.x},${porthole.y + 12})"></g></g>
    <g id="actors"></g>
    ${chandelierSVG()}
    <g id="sceneFxSvg"></g>
  </g>
  <clipPath id="porthClip"><circle cx="51" cy="70" r="25" transform="${RIGHT_WALL} translate(318,70)"/></clipPath>`;
}

/* ============================================================
   SKY + PARIS SKYLINE
   ============================================================ */
function eiffelSVG(x, base, h, col, lit) {
  const w = h * 0.36;
  const p = (fx, fy) => `${x + fx * w},${base - fy * h}`;
  let s = `<g class="eiffel">`;
  const legL = `M${p(-0.5, 0)} Q${p(-0.3, 0.12)} ${p(-0.17, 0.32)} L${p(-0.1, 0.55)} L${p(-0.035, 0.92)} L${p(0, 1)}`;
  const legR = `M${p(0.5, 0)} Q${p(0.3, 0.12)} ${p(0.17, 0.32)} L${p(0.1, 0.55)} L${p(0.035, 0.92)} L${p(0, 1)}`;
  s += `<path d="${legL} ${legR.replace('M', 'L')}" fill="none"/>`;
  // solid silhouette (slim)
  s += `<path d="M${p(-0.5, 0)} Q${p(-0.3, 0.12)} ${p(-0.17, 0.32)} L${p(-0.1, 0.55)} L${p(-0.035, 0.92)} L${p(0, 1.0)} L${p(0.035, 0.92)} L${p(0.1, 0.55)} L${p(0.17, 0.32)} Q${p(0.3, 0.12)} ${p(0.5, 0)} L${p(0.36, 0)} Q${p(0.2, 0.16)} ${p(0, 0.17)} Q${p(-0.2, 0.16)} ${p(-0.36, 0)}Z" fill="${col}"/>`;
  // lattice: crossing lines inside each leg band
  let lat = '';
  const rows = 22;
  for (let r = 0; r < rows; r++) {
    const f0 = r / rows, f1 = (r + 1) / rows;
    const half = f => (f < 0.32 ? 0.5 - (0.5 - 0.17) * (f / 0.32) : f < 0.55 ? 0.17 - 0.07 * ((f - 0.32) / 0.23) : 0.1 - 0.065 * ((f - 0.55) / 0.37));
    const a0 = half(f0) * w, a1 = half(f1) * w;
    const y0 = base - f0 * h * 0.92, y1 = base - f1 * h * 0.92;
    lat += `M${x - a0} ${y0} L${x - a1 * 0.4} ${y1} M${x - a0 * 0.4} ${y0} L${x - a1} ${y1} M${x + a0} ${y0} L${x + a1 * 0.4} ${y1} M${x + a0 * 0.4} ${y0} L${x + a1} ${y1} `;
  }
  s += `<path d="${lat}" stroke="${shade(col, 40)}" stroke-width="${Math.max(0.6, h / 400)}" fill="none" opacity=".55"/>`;
  // platforms
  s += `<rect x="${x - w * 0.24}" y="${base - h * 0.33}" width="${w * 0.48}" height="${h * 0.022}" fill="${shade(col, -15)}"/>
        <rect x="${x - w * 0.13}" y="${base - h * 0.57}" width="${w * 0.26}" height="${h * 0.018}" fill="${shade(col, -15)}"/>
        <rect x="${x - w * 0.045}" y="${base - h * 0.9}" width="${w * 0.09}" height="${h * 0.02}" fill="${shade(col, -15)}"/>
        <rect x="${x - 1}" y="${base - h * 1.05}" width="2" height="${h * 0.06}" fill="${col}"/>`;
  if (lit) s += `<circle cx="${x}" cy="${base - h * 1.05}" r="4" fill="#ffe9a3" class="beacon"/>`;
  return s + '</g>';
}

function buildingSVG(x, w, base, h, col, rand, lit) {
  let s = '';
  const roofH = 22 + rand() * 12;
  const top = base - h;
  // body
  s += `<rect x="${x}" y="${top}" width="${w}" height="${h}" fill="${col}"/>`;
  // mansard roof (sloped)
  const rc = shade(col, -28);
  s += `<path d="M${x - 3} ${top} L${x + 8} ${top - roofH} L${x + w - 8} ${top - roofH} L${x + w + 3} ${top}Z" fill="${rc}"/>`;
  s += `<rect x="${x - 4}" y="${top - 3}" width="${w + 8}" height="4" fill="${shade(col, 18)}"/>`;
  // chimneys
  const nc = 1 + Math.floor(rand() * 3);
  for (let c = 0; c < nc; c++) {
    const cx = x + 12 + rand() * (w - 30);
    s += `<rect x="${cx}" y="${top - roofH - 12}" width="9" height="14" fill="${shade(col, -18)}"/><rect x="${cx - 1.5}" y="${top - roofH - 14}" width="12" height="3" fill="${shade(col, -35)}"/>`;
    s += `<rect x="${cx + 1}" y="${top - roofH - 17}" width="3" height="3" fill="${shade(col, -40)}"/><rect x="${cx + 5}" y="${top - roofH - 17}" width="3" height="3" fill="${shade(col, -40)}"/>`;
  }
  // dormer windows
  const cols = Math.max(2, Math.floor((w - 10) / 22));
  const gap = (w - 10) / cols;
  for (let c = 0; c < cols; c++) {
    const dx = x + 5 + c * gap + gap / 2;
    if (rand() < 0.7) {
      const on = lit && rand() < 0.35;
      s += `<path d="M${dx - 6} ${top - 4} V${top - roofH * 0.55} L${dx} ${top - roofH * 0.8} L${dx + 6} ${top - roofH * 0.55} V${top - 4}Z" fill="${shade(col, 8)}"/>
            <rect x="${dx - 3.5}" y="${top - roofH * 0.55}" width="7" height="${roofH * 0.42}" fill="${on ? '#ffd77a' : shade(col, -40)}"/>`;
    }
  }
  // window rows with balconies
  const floors = Math.max(2, Math.floor((h - 14) / 30));
  for (let f = 0; f < floors; f++) {
    const wy = top + 10 + f * 30;
    for (let c = 0; c < cols; c++) {
      const wx = x + 5 + c * gap + gap / 2 - 5;
      const on = lit && rand() < 0.3;
      s += `<rect x="${wx}" y="${wy}" width="10" height="17" rx="${f === 0 ? 5 : 1}" fill="${on ? '#ffd77a' : shade(col, -38)}"/>`;
      if (on) s += `<rect x="${wx - 2}" y="${wy - 2}" width="14" height="21" fill="#ffcf6b" opacity=".25"/>`;
    }
    if (f === 1 || (f === floors - 1 && floors > 3)) {
      s += `<rect x="${x + 2}" y="${wy + 17}" width="${w - 4}" height="2.5" fill="${shade(col, -45)}"/>`;
      let rail = '';
      for (let r = x + 4; r < x + w - 3; r += 4) rail += `M${r} ${wy + 11} V${wy + 17} `;
      s += `<path d="${rail}M${x + 3} ${wy + 11} H${x + w - 3}" stroke="${shade(col, -45)}" stroke-width="1.1"/>`;
    }
  }
  // ground floor shop
  if (rand() < 0.5) s += `<rect x="${x + 4}" y="${base - 20}" width="${w - 8}" height="20" fill="${shade(col, -30)}"/>` +
    `<path d="M${x + 2} ${base - 22} h${w - 4} l-4 8 h-${w - 12}Z" fill="${pick(['#b3283f', '#2f7d6d', '#3d5a9e'])}" opacity=".9"/>` +
    (lit ? `<rect x="${x + 8}" y="${base - 12}" width="${w - 16}" height="10" fill="#ffd77a" opacity=".8"/>` : '');
  return s;
}

function domeSVG(x, base, s, col, lit) {
  return `<g transform="translate(${x},${base}) scale(${s})">
    <rect x="-60" y="-60" width="120" height="60" fill="${col}"/>
    <g fill="${shade(col, -30)}">${[-48, -32, -16, 0, 16, 32].map(c => `<rect x="${c + 3}" y="-50" width="8" height="40" rx="4"/>`).join('')}</g>
    <rect x="-40" y="-100" width="80" height="40" fill="${shade(col, 6)}"/>
    <g fill="${shade(col, -30)}">${[-34, -18, -2, 14, 30].map(c => `<rect x="${c - 1}" y="-94" width="6" height="28" rx="3"/>`).join('')}</g>
    <path d="M-44 -100 Q-44 -170 0 -176 Q44 -170 44 -100Z" fill="${shade(col, -10)}"/>
    <path d="M-30 -104 Q-28 -160 0 -170 M30 -104 Q28 -160 0 -170 M-14 -104 Q-12 -166 0 -172 M14 -104 Q12 -166 0 -172" stroke="${shade(col, 18)}" stroke-width="2" fill="none"/>
    <rect x="-8" y="-198" width="16" height="24" fill="${col}"/><path d="M-10 -198 Q0 -214 10 -198Z" fill="${shade(col, -10)}"/>
    <rect x="-1.5" y="-226" width="3" height="16" fill="${col}"/><rect x="-6" y="-220" width="12" height="3" fill="${col}"/>
    ${[-80, 80].map(t => `<rect x="${t - 14}" y="-110" width="28" height="110" fill="${shade(col, -4)}"/><path d="M${t - 16} -110 Q${t} -146 ${t + 16} -110Z" fill="${shade(col, -12)}"/><rect x="${t - 1}" y="-152" width="2" height="10" fill="${col}"/>`).join('')}
    ${lit ? `<rect x="-6" y="-48" width="12" height="36" rx="6" fill="#ffd77a"/>` : ''}
  </g>`;
}

function treeSVG(x, base, r, col) {
  return `<g><rect x="${x - 3}" y="${base - r * 1.2}" width="6" height="${r * 1.2}" fill="#3a2430"/>
    <circle cx="${x}" cy="${base - r * 1.5}" r="${r}" fill="${col}"/><circle cx="${x - r * 0.55}" cy="${base - r * 1.2}" r="${r * 0.7}" fill="${col}"/>
    <circle cx="${x + r * 0.55}" cy="${base - r * 1.25}" r="${r * 0.72}" fill="${shade(col, -8)}"/>
    <circle cx="${x - r * 0.25}" cy="${base - r * 1.8}" r="${r * 0.35}" fill="${shade(col, 14)}" opacity=".6"/></g>`;
}
function lampSVG(x, base, h) {
  return `<g><rect x="${x - 2}" y="${base - h}" width="4" height="${h}" fill="#2a1c2e"/>
    <path d="M${x - 8} ${base - h} h16 l-3 -12 h-10Z" fill="#2a1c2e"/>
    <circle cx="${x}" cy="${base - h - 5}" r="26" fill="url(#gGlow)" class="lampGlow"/>
    <rect x="${x - 5}" y="${base - h - 11}" width="10" height="9" fill="#ffe7a0"/>
    <path d="M${x - 9} ${base - h - 12} h18 l-9 -8Z" fill="#2a1c2e"/></g>`;
}

function skylineSVG() {
  const W = 1920, H = 380, B = H;
  const r = seeded(77);
  let back = '', front = '';
  // back row (lighter)
  let x = -20;
  while (x < W) {
    const w = 70 + r() * 60, h = 110 + r() * 80;
    back += buildingSVG(x, w, B - 40, h, '#9a6a9e', r, false);
    x += w + 2 + r() * 6;
  }
  back += domeSVG(1410, B - 40, 0.95, '#a7779f', false);
  back += eiffelSVG(1745, B - 60, 330, '#7b4e83', true);
  back += eiffelSVG(92, B - 30, 360, '#6c3f73', true);
  // front row (darker)
  x = -10;
  while (x < W) {
    const w = 80 + r() * 70, h = 70 + r() * 70;
    front += buildingSVG(x, w, B, h, '#4b2a4f', r, true);
    x += w + r() * 4;
  }
  let trees = '';
  for (let tx = 30; tx < W; tx += 90 + r() * 70) trees += treeSVG(tx, B, 16 + r() * 8, r() < 0.5 ? '#2f3a3a' : '#35422f');
  let lamps = '';
  for (let lx = 70; lx < W; lx += 160) lamps += lampSVG(lx + r() * 20, B, 60);
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="none">
    <rect x="0" y="${B - 70}" width="${W}" height="70" fill="#6b3b62" opacity=".35"/>
    <g opacity=".95">${back}</g>
    <rect x="0" y="${B - 130}" width="${W}" height="130" fill="#ff9a7a" opacity=".12"/>
    <g>${front}</g>${trees}${lamps}
  </svg>`;
}

function starsSVG() {
  const r = seeded(9);
  let s = '';
  for (let k = 0; k < 46; k++) {
    const x = r() * 1920, y = r() * 360, rr = 0.8 + r() * 1.8;
    s += `<circle class="twinkle" style="animation-delay:${(r() * 4).toFixed(2)}s" cx="${x}" cy="${y}" r="${rr}" fill="#fff7e0"/>`;
  }
  s += `<g fill="#fff7e0" opacity=".9"><path class="twinkle" d="M300 60 l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3Z"/><path class="twinkle" style="animation-delay:1.3s" d="M1080 290 l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3Z"/></g>`;
  s += `<circle cx="1075" cy="190" r="26" fill="#fff4d6" opacity=".9"/><circle cx="1087" cy="182" r="24" fill="#7d4a8e" opacity=".6"/>`;
  return `<svg viewBox="0 0 1920 400" width="1920" height="400">${s}</svg>`;
}

/* ============================================================
   UTENSILS (vertical, centered at 0,0; tip up)
   ============================================================ */
const UT = {
  fork(sc = 1) {
    return `<g transform="scale(${sc})" filter="url(#fShadow)"><path d="M-17 -115 h6 v42 h3 v-42 h6 v42 h3 v-42 h6 v42 h3 v-42 h6 v50 Q17 -50 5 -40 L4 18 Q9 60 9 104 Q9 118 0 118 Q-9 118 -9 104 Q-9 60 -4 18 L-5 -40 Q-17 -50 -17 -65Z" fill="url(#gMetal)" stroke="#6f7a85" stroke-width="1.5"/>
      <path d="M-1 30 Q-3 70 -3 104" stroke="#fff" stroke-width="2" opacity=".6"/></g>`;
  },
  saladFork(sc = 1) {
    return `<g transform="scale(${sc * 0.8})" filter="url(#fShadow)"><path d="M-19 -115 h9 v42 h3 v-42 h5 v42 h3 v-42 h5 v42 h3 v-42 h6 v50 Q17 -50 5 -40 L4 18 Q9 60 9 104 Q9 118 0 118 Q-9 118 -9 104 Q-9 60 -4 18 L-5 -40 Q-19 -50 -19 -65Z" fill="url(#gMetal)" stroke="#6f7a85" stroke-width="1.8"/>
      <path d="M-19 -115 l-2 10 4 4" fill="none" stroke="#6f7a85" stroke-width="1.5"/><path d="M-1 30 Q-3 70 -3 104" stroke="#fff" stroke-width="2" opacity=".6"/></g>`;
  },
  knife(sc = 1) {
    return `<g transform="scale(${sc})" filter="url(#fShadow)"><path d="M7 -122 Q-14 -106 -13 -70 L-12 14 L8 14Z" fill="url(#gMetal)" stroke="#6f7a85" stroke-width="1.5"/>
      <path d="M-12 -60 l-2 6 M-12 -44 l-2 6 M-12 -28 l-2 6 M-12 -12 l-2 6" stroke="#6f7a85" stroke-width="1.4"/>
      <path d="M3 -110 L3 6" stroke="#fff" stroke-width="2" opacity=".55"/>
      <rect x="-10" y="12" width="20" height="108" rx="9" fill="url(#gMetal)" stroke="#6f7a85" stroke-width="1.5"/>
      <circle cy="40" r="2.6" fill="#8e98a3"/><circle cy="80" r="2.6" fill="#8e98a3"/></g>`;
  },
  soupSpoon(sc = 1) {
    return `<g transform="scale(${sc})" filter="url(#fShadow)"><ellipse cx="0" cy="-78" rx="27" ry="34" fill="url(#gMetal)" stroke="#6f7a85" stroke-width="1.5"/>
      <ellipse cx="-4" cy="-82" rx="15" ry="20" fill="#fff" opacity=".35"/>
      <path d="M-5 -46 Q-4 -20 -6 30 Q-9 80 -9 100 Q-9 114 0 114 Q9 114 9 100 Q9 80 6 30 Q4 -20 5 -46Z" fill="url(#gMetal)" stroke="#6f7a85" stroke-width="1.5"/></g>`;
  },
  dessertSpoon(sc = 1) {
    return `<g transform="scale(${sc * 0.75})" filter="url(#fShadow)"><ellipse cx="0" cy="-80" rx="18" ry="30" fill="url(#gMetal)" stroke="#6f7a85" stroke-width="2"/>
      <ellipse cx="-3" cy="-84" rx="8" ry="16" fill="#fff" opacity=".35"/>
      <path d="M-4 -52 Q-3 -20 -5 30 Q-8 80 -8 100 Q-8 112 0 112 Q8 112 8 100 Q8 80 5 30 Q3 -20 4 -52Z" fill="url(#gMetal)" stroke="#6f7a85" stroke-width="2"/></g>`;
  },
  glass(sc = 1) {
    return `<g transform="scale(${sc})" filter="url(#fShadow)">
      <path d="M-34 -70 Q-36 -10 0 0 Q36 -10 34 -70Z" fill="#e8f6ff" opacity=".7" stroke="#9cc2d8" stroke-width="2"/>
      <path d="M-31 -44 Q-28 -8 0 -3 Q28 -8 31 -44Z" fill="url(#gJuice)"/>
      <ellipse cx="0" cy="-44" rx="31" ry="6" fill="#ffd25a"/>
      <ellipse cx="0" cy="-70" rx="34" ry="8" fill="none" stroke="#9cc2d8" stroke-width="2.5"/>
      <rect x="-3.5" y="0" width="7" height="44" fill="#e8f6ff" stroke="#9cc2d8" stroke-width="1.5"/>
      <ellipse cx="0" cy="48" rx="26" ry="7" fill="#e8f6ff" stroke="#9cc2d8" stroke-width="2"/>
      <path d="M-24 -64 Q-26 -30 -14 -14" stroke="#fff" stroke-width="4" fill="none" opacity=".8"/></g>`;
  },
  napkin(sc = 1) {
    return `<g transform="scale(${sc})" filter="url(#fShadow)">
      <rect x="-40" y="-100" width="80" height="200" rx="5" fill="#fffdf7" stroke="#d9cfba" stroke-width="2"/>
      <rect x="-40" y="-100" width="40" height="200" fill="#f1eadc"/>
      <path d="M-40 -84 H40 M-40 84 H40" stroke="#c9952b" stroke-width="3"/>
      <path d="M0 -100 V100" stroke="#d9cfba" stroke-width="1.5"/>
      <circle cx="20" cy="0" r="9" fill="none" stroke="#c9952b" stroke-width="2"/><path d="M16 4 Q20 -6 24 4" stroke="#c9952b" stroke-width="1.6" fill="none"/></g>`;
  },
  chopsticks(sc = 1) {
    return `<g transform="scale(${sc})" filter="url(#fShadow)">
      <path d="M-14 -120 L-7 -120 L1 120 L-9 120Z" fill="#c98b4a" stroke="#7a4824" stroke-width="1.5"/>
      <path d="M8 -120 L15 -120 L10 120 L0 120Z" fill="#d79b58" stroke="#7a4824" stroke-width="1.5"/>
      <path d="M-9 80 h11 M0 80 h11" stroke="#b3283f" stroke-width="6"/></g>`;
  },
  ladle(sc = 1) {
    return `<g transform="scale(${sc})" filter="url(#fShadow)">
      <path d="M-4 -120 Q-12 -128 -6 -134 Q4 -138 6 -126 L6 40 L-4 40Z" fill="url(#gMetal)" stroke="#6f7a85" stroke-width="1.5"/>
      <path d="M-42 50 Q-44 112 0 116 Q44 112 42 50Z" fill="url(#gMetal)" stroke="#6f7a85" stroke-width="2"/>
      <ellipse cx="0" cy="50" rx="42" ry="10" fill="#c9d1d9" stroke="#6f7a85" stroke-width="2"/>
      <path d="M1 40 V50" stroke="#6f7a85" stroke-width="10"/></g>`;
  }
};

/* ============================================================
   TOP-DOWN PLACE SETTING
   ============================================================ */
// spot centers in the 1150x970 close-up
const TD = {
  plate: { x: 575, y: 585, r: 148 },
  spots: {
    napkin: { x: 168, y: 585, w: 104, h: 230, rot: 0 },
    saladFork: { x: 296, y: 585, w: 62, h: 220, rot: 0 },
    fork: { x: 386, y: 585, w: 62, h: 250, rot: 0 },
    knife: { x: 764, y: 585, w: 58, h: 260, rot: 0 },
    soupSpoon: { x: 862, y: 585, w: 76, h: 248, rot: 0 },
    dessertSpoon: { x: 575, y: 392, w: 210, h: 70, rot: -90 },
    glass: { x: 790, y: 372, w: 104, h: 150, rot: 0 }
  }
};
const UT_DRAW = { napkin: 'napkin', saladFork: 'saladFork', fork: 'fork', knife: 'knife', soupSpoon: 'soupSpoon', dessertSpoon: 'dessertSpoon', glass: 'glass', chopsticks: 'chopsticks', ladle: 'ladle' };
const UT_SCALE_TD = { napkin: 1.05, saladFork: 1, fork: 1, knife: 1, soupSpoon: 1, dessertSpoon: 0.95, glass: 1.1, chopsticks: 1, ladle: 1 };

function placedUtensilSVG(key) {
  const sp = TD.spots[key];
  return `<g class="placed" data-key="${key}" transform="translate(${sp.x},${sp.y}) rotate(${sp.rot})">${UT[UT_DRAW[key]](UT_SCALE_TD[key])}</g>`;
}

function tdSpotSVG(key) {
  const sp = TD.spots[key];
  const w = sp.w, h = sp.h;
  return `<g class="tdSpot" data-key="${key}"><rect x="${sp.x - w / 2}" y="${sp.y - h / 2}" width="${w}" height="${h}" rx="18" fill="#fff7dc" fill-opacity=".14" stroke="#ffe7a3" stroke-width="4" stroke-dasharray="12 9"/></g>`;
}

function plateTopSVG(cx, cy, r) {
  return `<g><circle cx="${cx}" cy="${cy + 8}" r="${r + 4}" fill="#2a0a12" opacity=".35"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#gPlate)" stroke="#d8cbb0" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 8}" fill="none" stroke="#d6a93f" stroke-width="5"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 15}" fill="none" stroke="#e8c879" stroke-width="1.5"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.62}" fill="#fffdf8" stroke="#eee6d6" stroke-width="2"/></g>`;
}

function placematSVG() {
  return `<rect x="96" y="298" width="958" height="560" rx="34" fill="#7a1f2b" stroke="url(#gGold)" stroke-width="8" filter="url(#fShadow)"/>
    <rect x="116" y="318" width="918" height="520" rx="24" fill="none" stroke="#e3b448" stroke-width="2" stroke-dasharray="2 8"/>`;
}

function topdownSVG(member, opts = {}) {
  // Customer at the top, facing the class
  const m = Object.assign({}, member, { scale: 1 });
  const cust = `<g id="tdCust" transform="translate(575,262) scale(3.1)"><g class="pw"><g class="react">${personSVG(m, { seated: true })}</g></g></g>`;
  return `<svg viewBox="0 0 1150 970" width="1150" height="970">
    <rect width="1150" height="970" fill="#3a1424"/>
    <rect x="0" y="0" width="1150" height="970" fill="url(#pCloth)" opacity=".96"/>
    <ellipse cx="575" cy="560" rx="700" ry="520" fill="#fff" opacity=".35"/>
    <g clip-path="url(#tdClipTop)">${cust}</g>
    <rect x="0" y="236" width="1150" height="14" fill="#e9e1d1" opacity=".9"/>
    ${opts.mat === false ? '' : placematSVG()}
    <g id="tdBody">${opts.body || ''}</g>
    <g id="tdFx"></g>
  </svg>`;
}
function tdClipDef() { return `<clipPath id="tdClipTop"><rect x="0" y="0" width="1150" height="244"/></clipPath>`; }

/* ---------- plate signals (big plate, top-down) ---------- */
function signalPlateSVG(kind, cx, cy, r, withFood) {
  let ut = '';
  const F = (x, y, rot, s) => `<g transform="translate(${cx + x},${cy + y}) rotate(${rot})">${UT.fork(s)}</g>`;
  const K = (x, y, rot, s) => `<g transform="translate(${cx + x},${cy + y}) rotate(${rot})">${UT.knife(s)}</g>`;
  const s = r / 230 * 1.05;
  const u = r / 230;
  if (kind === 'pause') {
    // apart, tips together near the top (upside-down V); knife blade faces the fork
    ut = F(-78 * u, 12 * u, 28, s) + K(78 * u, 12 * u, -28, s);
  } else if (kind === 'finished') {
    // together, side by side on the 10-4 o'clock line, handles at 4 o'clock
    const cx0 = 26 * u, cy0 = 16 * u, d = 24 * u;
    ut = F(cx0 - 0.5 * d, cy0 + 0.866 * d, -60, s) + K(cx0 + 0.5 * d, cy0 - 0.866 * d, -60, s);
  } else {
    // together, side by side, lying horizontally across the plate
    ut = K(0, -26 * u, -90, s) + F(0, 26 * u, -90, s);
  }
  const food = withFood
    ? `<text x="${cx - r * 0.18}" y="${cy + r * 0.32}" font-size="${r * 0.42}" text-anchor="middle">🥩</text><text x="${cx + r * 0.28}" y="${cy - r * 0.08}" font-size="${r * 0.25}" text-anchor="middle">🥔</text>`
    : `<path d="M${cx - r * 0.3} ${cy + r * 0.25} q${r * 0.2} -${r * 0.12} ${r * 0.42} -${r * 0.02} q-${r * 0.1} ${r * 0.1} -${r * 0.3} ${r * 0.1}Z" fill="#b5542b" opacity=".35"/><circle cx="${cx + r * 0.2}" cy="${cy + r * 0.3}" r="${r * 0.03}" fill="#8a4a24" opacity=".5"/><circle cx="${cx - r * 0.35}" cy="${cy - r * 0.1}" r="${r * 0.025}" fill="#8a4a24" opacity=".5"/>`;
  const clock = `<g font-size="${r * 0.09}" fill="#c9a24a" font-weight="700" text-anchor="middle" opacity=".9">
      ${[12, 3, 6, 9].map((h, k) => { const a = k * Math.PI / 2; return `<text x="${cx + Math.sin(a) * (r - r * 0.1)}" y="${cy - Math.cos(a) * (r - r * 0.1) + r * 0.03}">${h}</text>`; }).join('')}</g>`;
  return `<g>${plateTopSVG(cx, cy, r)}${clock}${food}${ut}</g>`;
}

/* ---------- dishes ---------- */
const DISHES = {
  soup: { name: 'soup', emoji: '🍲', course: 1, courseName: 'Starter' },
  salad: { name: 'salad', emoji: '🥗', course: 1, courseName: 'Starter' },
  steak: { name: 'steak', emoji: '🥩', course: 2, courseName: 'Main dish' },
  spaghetti: { name: 'spaghetti', emoji: '🍝', course: 2, courseName: 'Main dish' },
  cake: { name: 'cake', emoji: '🍰', course: 3, courseName: 'Dessert' },
  juice: { name: 'juice', emoji: '🧃', course: 0, courseName: 'Drink' }
};
const DISH_KEYS = ['soup', 'salad', 'steak', 'spaghetti', 'cake', 'juice'];

function dishPlateSVG(key, size = 160) {
  const d = DISHES[key];
  return `<svg viewBox="-100 -100 200 200" width="${size}" height="${size}">
    <ellipse cx="0" cy="40" rx="84" ry="30" fill="#3b1020" opacity=".18"/>
    <ellipse cx="0" cy="22" rx="86" ry="44" fill="url(#gPlate)" stroke="#d8cbb0" stroke-width="2"/>
    <ellipse cx="0" cy="22" rx="74" ry="36" fill="none" stroke="#d6a93f" stroke-width="4"/>
    <text x="0" y="40" font-size="96" text-anchor="middle">${d.emoji}</text></svg>`;
}
