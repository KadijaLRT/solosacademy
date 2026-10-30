/* Solo's Academy: original vector icon set (no emoji, no outside art). 64x64, thick ink outline, flat bright fills.
   Use SA.ic('name') for markup. SA.topicIc(unit) and SA.faceIc(id) pick the right one. */
(function () {
  'use strict';
  window.SA = window.SA || {};
  const INK = '#2b2d5b';
  const Y = '#ffd23f'; const R = '#ff7a7a'; const B = '#8ee0ff'; const P = '#ff9fb2'; const G = '#6bd66b'; const W = '#ffffff'; const O = '#ffb347';
  const face = (fill, inner) => '<circle cx="32" cy="32" r="24" fill="' + fill + '"/>' + inner;
  const dot = (x, y, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 3) + '" fill="' + INK + '" stroke="none"/>';
  const star = (cx, cy, r, fill) => { let p = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5; const rr = i % 2 ? r * 0.45 : r; p += (cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1) + ' '; } return '<polygon points="' + p + '" fill="' + fill + '"/>'; };
  const cal = (top, body) => '<rect x="9" y="12" width="46" height="44" rx="6" fill="' + W + '"/><path d="M9 26V18a6 6 0 0 1 6-6h34a6 6 0 0 1 6 6v8Z" fill="' + top + '"/><path d="M20 8v8M44 8v8"/>' + body;
  const t = (x, y, s, txt) => '<text x="' + x + '" y="' + y + '" font-size="' + s + '" font-weight="900" text-anchor="middle" fill="' + INK + '" stroke="none" font-family="Arial Rounded MT Bold,Arial,sans-serif">' + txt + '</text>';
  const I = {
    home: '<polygon points="6,32 32,9 58,32" fill="' + R + '"/><rect x="13" y="31" width="38" height="25" fill="' + Y + '"/><rect x="26" y="40" width="12" height="16" fill="' + B + '"/>',
    learn: '<path d="M7 14Q20 9 32 16Q44 9 57 14V50Q44 45 32 52Q20 45 7 50Z" fill="' + W + '"/><path d="M32 16V52"/><path d="M14 22Q20 21 26 24M14 30Q20 29 26 32" stroke="' + B + '"/><path d="M38 24Q44 21 50 22M38 32Q44 29 50 30" stroke="' + P + '"/>',
    games: '<ellipse cx="32" cy="25" rx="16" ry="19" fill="' + P + '"/><polygon points="28,45 36,45 32,50" fill="' + R + '"/><path d="M32 50Q25 55 32 60"/><path d="M24 17Q26 12 31 11" stroke="' + W + '"/>',
    school: '<polygon points="5,28 32,9 59,28" fill="' + R + '"/><rect x="10" y="27" width="44" height="29" fill="' + Y + '"/><rect x="26" y="38" width="12" height="18" fill="' + B + '"/><rect x="15" y="33" width="8" height="8" fill="' + B + '"/><rect x="41" y="33" width="8" height="8" fill="' + B + '"/><path d="M32 9V2"/><polygon points="32,2 42,5 32,8" fill="' + P + '"/>',
    grow: '<path d="M32 5C45 15 45 35 41 46H23C19 35 19 15 32 5Z" fill="' + W + '"/><circle cx="32" cy="24" r="6" fill="' + B + '"/><polygon points="24,36 13,50 24,46" fill="' + R + '"/><polygon points="40,36 51,50 40,46" fill="' + R + '"/><polygon points="27,47 37,47 32,59" fill="' + Y + '"/>',
    activities: '<path d="M19 6L30 28M45 6L34 28"/><circle cx="32" cy="40" r="17" fill="' + Y + '"/>' + star(32, 40, 10, R),
    heart: '<path d="M32 56C10 40 6 26 12 17C18 9 28 11 32 19C36 11 46 9 52 17C58 26 54 40 32 56Z" fill="' + P + '"/><path d="M18 20Q22 16 27 18" stroke="' + W + '"/>',
    letters: '<rect x="6" y="8" width="52" height="48" rx="10" fill="' + Y + '"/>' + t(32, 42, 28, 'Aa'),
    numbers: '<rect x="6" y="8" width="52" height="48" rx="10" fill="' + B + '"/>' + t(32, 41, 26, '123'),
    colors: '<path d="M32 8C16 8 6 19 6 31C6 44 17 56 31 56C38 56 40 50 36 46C32 42 36 38 41 38H48C54 38 58 34 58 28C58 16 47 8 32 8Z" fill="' + Y + '"/><circle cx="20" cy="26" r="5" fill="' + R + '"/><circle cx="32" cy="19" r="5" fill="' + B + '"/><circle cx="45" cy="25" r="5" fill="' + G + '"/><circle cx="20" cy="41" r="5" fill="' + P + '"/>',
    shapes: '<polygon points="20,8 4,36 36,36" fill="' + R + '"/><circle cx="46" cy="22" r="14" fill="' + B + '"/><rect x="26" y="38" width="26" height="20" rx="3" fill="' + Y + '"/>',
    cards: '<rect x="10" y="12" width="36" height="44" rx="6" fill="' + B + '" transform="rotate(-8 28 34)"/><rect x="20" y="8" width="36" height="44" rx="6" fill="' + W + '"/>' + star(38, 30, 12, Y),
    music: '<path d="M24 46V12L50 8V42"/><circle cx="17" cy="46" r="8" fill="' + P + '"/><circle cx="43" cy="42" r="8" fill="' + B + '"/><path d="M24 20L50 16" stroke-width="5"/>',
    story: '<path d="M7 16Q20 11 32 18Q44 11 57 16V52Q44 47 32 54Q20 47 7 52Z" fill="' + W + '"/><path d="M32 18V54"/>' + star(46, 30, 8, Y) + '<path d="M13 28Q19 26 25 29M13 36Q19 34 25 37" stroke="' + P + '"/>',
    words: '<path d="M8 12H56V42H34L22 54V42H8Z" fill="' + W + '"/><path d="M18 22H46M18 31H38" stroke="' + B + '"/>',
    movie: '<rect x="8" y="24" width="48" height="32" rx="4" fill="' + W + '"/><path d="M8 24l4-14 40 4-4 14" fill="' + INK + '"/><path d="M18 12l-3 11M30 14l-3 11M42 16l-3 11" stroke="' + W + '"/>' + star(32, 41, 8, Y),
    plane: '<path d="M6 34L24 30L36 8H44L38 30L54 28Q60 29 56 34Q60 38 54 38L38 36L44 58H36L24 38L6 36Z" fill="' + W + '"/><circle cx="31" cy="33" r="2.5" fill="' + B + '" stroke="none"/>',
    check: '<circle cx="32" cy="32" r="25" fill="' + G + '"/><path d="M19 33L28 42L46 22" stroke="' + W + '" stroke-width="6"/>',
    chart: '<rect x="8" y="8" width="48" height="48" rx="8" fill="' + W + '"/><rect x="16" y="34" width="8" height="14" fill="' + B + '"/><rect x="28" y="24" width="8" height="24" fill="' + Y + '"/><rect x="40" y="16" width="8" height="32" fill="' + P + '"/>',
    map: '<path d="M6 14L22 8L42 14L58 8V50L42 56L22 50L6 56Z" fill="' + Y + '"/><path d="M22 8V50M42 14V56"/><path d="M28 28L36 36M36 28L28 36" stroke="' + R + '"/>',
    sprout: '<path d="M32 58V30"/><path d="M32 34C32 20 20 14 8 16C8 30 18 36 32 34Z" fill="' + G + '"/><path d="M32 28C32 16 42 8 56 10C56 24 46 30 32 28Z" fill="' + G + '"/><ellipse cx="32" cy="58" rx="14" ry="3" fill="' + O + '"/>',
    /* topics */
    days: cal(R, t(32, 50, 24, '7')),
    months: cal(B, '<circle cx="22" cy="36" r="3" fill="' + INK + '"/><circle cx="32" cy="36" r="3" fill="' + INK + '"/><circle cx="42" cy="36" r="3" fill="' + INK + '"/><circle cx="22" cy="46" r="3" fill="' + INK + '"/><circle cx="32" cy="46" r="3" fill="' + R + '"/><circle cx="42" cy="46" r="3" fill="' + INK + '"/>'),
    seasons: '<circle cx="24" cy="24" r="12" fill="' + Y + '"/><path d="M24 4v5M24 39v5M4 24h5M39 24h5M10 10l4 4M38 10l-4 4"/><path d="M22 54a10 10 0 0 1 2-20a14 14 0 0 1 26 4a8 8 0 0 1 2 16Z" fill="' + W + '"/>',
    space: '<circle cx="32" cy="32" r="16" fill="' + O + '"/><path d="M20 28Q32 24 44 30M19 38Q32 34 45 40" stroke="' + R + '"/><ellipse cx="32" cy="34" rx="29" ry="8" fill="none" transform="rotate(-18 32 34)" stroke="' + INK + '"/><circle cx="12" cy="12" r="2" fill="' + INK + '" stroke="none"/><circle cx="54" cy="10" r="2" fill="' + INK + '" stroke="none"/>',
    body: '<circle cx="32" cy="14" r="9" fill="' + Y + '"/><path d="M20 28Q32 24 44 28L48 46H40L38 58H26L24 46H16Z" fill="' + B + '"/>',
    animals: '<circle cx="32" cy="32" r="26" fill="' + O + '"/><circle cx="32" cy="34" r="17" fill="' + Y + '"/>' + dot(25, 30, 3) + dot(39, 30, 3) + '<path d="M28 40Q32 44 36 40M32 36V40"/><path d="M26 36L32 38L38 36" stroke="none"/>',
    trees: '<rect x="27" y="36" width="10" height="22" fill="#b5651d"/><circle cx="32" cy="22" r="17" fill="' + G + '"/><circle cx="22" cy="30" r="10" fill="' + G + '"/><circle cx="42" cy="30" r="10" fill="' + G + '"/>',
    water: '<path d="M32 6C42 20 52 28 52 40A20 20 0 0 1 12 40C12 28 22 20 32 6Z" fill="#5cc8ff"/><path d="M22 40Q22 48 30 50" stroke="' + W + '"/>',
    helpers: '<path d="M10 40A22 22 0 0 1 54 40Z" fill="' + R + '"/><rect x="6" y="40" width="52" height="8" rx="3" fill="' + Y + '"/><rect x="28" y="12" width="8" height="12" fill="' + Y + '"/>',
    moving: '<path d="M6 40V32L16 22H44L54 32V40Z" fill="' + R + '"/><path d="M18 32L24 25H34V32ZM38 32V25H42L48 32Z" fill="' + B + '"/><circle cx="18" cy="42" r="8" fill="' + INK + '"/><circle cx="46" cy="42" r="8" fill="' + INK + '"/><circle cx="18" cy="42" r="3" fill="' + W + '" stroke="none"/><circle cx="46" cy="42" r="3" fill="' + W + '" stroke="none"/>',
    buildings: '<rect x="8" y="22" width="22" height="34" fill="' + B + '"/><rect x="30" y="8" width="26" height="48" fill="' + Y + '"/><path d="M14 30h4M14 38h4M14 46h4M37 16h4M47 16h4M37 26h4M47 26h4M37 36h4M47 36h4" stroke-width="4"/><rect x="38" y="46" width="10" height="10" fill="' + R + '"/>',
    /* feelings */
    happy: face(Y, dot(24, 27, 3.5) + dot(40, 27, 3.5) + '<path d="M20 38Q32 52 44 38" fill="' + W + '"/>'),
    sad: face(B, dot(24, 28, 3.5) + dot(40, 28, 3.5) + '<path d="M22 46Q32 36 42 46"/><path d="M24 34Q21 40 24 42Q27 40 24 34Z" fill="#5cc8ff" stroke-width="2"/>'),
    mad: face(R, '<path d="M17 21L29 27M47 21L35 27"/>' + dot(25, 32, 3) + dot(39, 32, 3) + '<path d="M23 46Q32 38 41 46"/>'),
    scared: face('#d9c8ff', '<circle cx="24" cy="26" r="7" fill="' + W + '"/><circle cx="40" cy="26" r="7" fill="' + W + '"/>' + dot(24, 27, 2.5) + dot(40, 27, 2.5) + '<ellipse cx="32" cy="46" rx="6" ry="7" fill="' + INK + '"/>'),
    tired: face('#c9d6ff', '<path d="M18 28Q24 33 30 28M34 28Q40 33 46 28"/><path d="M26 44Q32 40 38 44"/>' + t(52, 14, 14, 'z')),
    stuck: face('#ffd9a0', dot(24, 27, 3.5) + dot(40, 27, 3.5) + '<path d="M20 42Q26 36 32 42Q38 48 44 42"/><path d="M50 12Q53 17 50 20Q47 17 50 12Z" fill="#5cc8ff" stroke-width="2"/>'),
    excited: face(Y, star(24, 26, 7, R) + star(40, 26, 7, R) + '<path d="M18 38Q32 56 46 38Z" fill="' + W + '"/>'),
    proud: face(O, '<path d="M18 28Q24 22 30 28M34 28Q40 22 46 28"/><path d="M20 38Q32 50 44 38" fill="' + W + '"/><circle cx="16" cy="38" r="4" fill="' + P + '" stroke="none"/><circle cx="48" cy="38" r="4" fill="' + P + '" stroke="none"/>')
  };
  const FACE = { angry: 'mad', frustrated: 'stuck' };
  SA.icons = I;
  SA.ic = function (name, cls) {
    const body = I[name]; if (!body) return '';
    return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><g stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" fill="none">' + body + '</g></svg>';
  };
  SA.faceIc = (id) => SA.ic(FACE[id] || id);
  SA.topicIc = (u) => (I[u.id] ? SA.ic(u.id) : (u.emoji || ''));
})();
