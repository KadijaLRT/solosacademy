/* Solo's Academy: original word pictures (animals, body, space). Keyed by the English word. Falls back to emoji when a word has no drawing.
   SA.pic(emoji, en) returns markup for a picture. */
(function () {
  'use strict';
  const SA = (window.SA = window.SA || {});
  const K = '#2b2d5b'; const W = '#fff'; const Y = '#ffd23f'; const R = '#ff7a7a'; const B = '#8ee0ff'; const P = '#ff9fb2'; const G = '#6bd66b'; const O = '#ffb347'; const BR = '#b5753d'; const GR = '#b8c0cc'; const PU = '#b39bff'; const BL = '#5cc8ff';
  const e2 = (x1, x2, y, r) => '<circle cx="' + x1 + '" cy="' + y + '" r="' + (r || 3) + '" fill="' + K + '" stroke="none"/><circle cx="' + x2 + '" cy="' + y + '" r="' + (r || 3) + '" fill="' + K + '" stroke="none"/>';
  const c = (x, y, r, f) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"/>';
  const el = (x, y, rx, ry, f, extra) => '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '"' + (extra || '') + '/>';
  const pg = (pts, f) => '<polygon points="' + pts + '" fill="' + f + '"/>';
  const star = (cx, cy, r, f) => { let p = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5; const rr = i % 2 ? r * 0.45 : r; p += (cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1) + ' '; } return pg(p, f); };
  const planet = (f, band) => c(32, 32, 20, f) + (band || '');
  const D = {
    /* animals */
    cow: el(12, 22, 8, 5, W) + el(52, 22, 8, 5, W) + '<path d="M18 12L14 4M46 12L50 4"/>' + el(32, 32, 19, 22, W) + c(23, 24, 6, K) + el(40, 22, 5, 4, K) + el(32, 46, 13, 9, P) + '<circle cx="27" cy="46" r="2" fill="' + K + '" stroke="none"/><circle cx="37" cy="46" r="2" fill="' + K + '" stroke="none"/>' + e2(25, 39, 31, 3),
    pig: pg('14,20 20,6 30,14', P) + pg('50,20 44,6 34,14', P) + c(32, 34, 23, P) + el(32, 40, 11, 8, '#ff7a9a') + '<circle cx="28" cy="40" r="2" fill="' + K + '" stroke="none"/><circle cx="36" cy="40" r="2" fill="' + K + '" stroke="none"/>' + e2(22, 42, 28, 3),
    horse: pg('20,14 22,2 30,12', BR) + pg('44,14 42,2 34,12', BR) + '<path d="M32 6Q44 10 44 28Q44 42 40 54H24Q20 42 20 28Q20 10 32 6Z" fill="' + BR + '"/><path d="M32 8V24" stroke="' + K + '" stroke-width="5"/>' + el(32, 48, 9, 8, '#e0a96d') + '<circle cx="28" cy="48" r="1.8" fill="' + K + '" stroke="none"/><circle cx="36" cy="48" r="1.8" fill="' + K + '" stroke="none"/>' + e2(25, 39, 28, 2.8),
    sheep: c(14, 30, 10, W) + c(50, 30, 10, W) + c(22, 16, 11, W) + c(42, 16, 11, W) + c(32, 14, 11, W) + el(32, 38, 14, 17, K) + el(32, 38, 12, 15, '#4a4a6b', ' stroke="none"') + '<circle cx="26" cy="35" r="3" fill="' + W + '" stroke="none"/><circle cx="38" cy="35" r="3" fill="' + W + '" stroke="none"/>' + '<path d="M28 46Q32 49 36 46" stroke="' + W + '"/>',
    chicken: '<path d="M26 14Q32 4 38 10Q44 4 46 14" fill="' + R + '"/>' + c(32, 34, 22, W) + pg('26,32 38,32 32,42', O) + '<circle cx="24" cy="26" r="3" fill="' + K + '" stroke="none"/><circle cx="40" cy="26" r="3" fill="' + K + '" stroke="none"/>' + el(32, 50, 6, 5, R),
    duck: c(32, 28, 20, Y) + el(32, 36, 14, 6, O) + '<circle cx="24" cy="24" r="3" fill="' + K + '" stroke="none"/><circle cx="40" cy="24" r="3" fill="' + K + '" stroke="none"/><path d="M8 56Q20 50 32 56T56 56" stroke="' + BL + '"/>',
    lion: c(32, 32, 28, O) + c(32, 34, 18, Y) + e2(25, 39, 30, 3) + '<path d="M28 40Q32 44 36 40M32 36V40"/>' + pg('28,34 36,34 32,38', BR),
    elephant: el(10, 30, 10, 14, GR) + el(54, 30, 10, 14, GR) + c(32, 28, 20, GR) + '<path d="M28 38Q22 50 28 58Q32 60 34 56Q30 50 34 42Z" fill="' + GR + '"/>' + pg('24,40 20,48 28,44', W) + pg('40,40 44,48 36,44', W) + e2(24, 40, 24, 3),
    giraffe: pg('22,10 24,2 28,10', BR) + pg('36,10 40,2 42,10', BR) + '<rect x="24" y="30" width="20" height="30" fill="' + Y + '"/>' + el(34, 20, 14, 12, Y) + el(34, 28, 10, 6, '#ffe9a8') + c(30, 40, 3, BR) + c(38, 48, 3, BR) + c(30, 54, 3, BR) + e2(28, 40, 18, 2.8),
    monkey: c(10, 30, 7, BR) + c(54, 30, 7, BR) + c(32, 30, 22, BR) + el(32, 36, 15, 13, '#f2c999') + e2(26, 38, 30, 3) + '<path d="M26 42Q32 48 38 42"/>',
    zebra: pg('18,16 20,4 28,12', W) + pg('46,16 44,4 36,12', W) + '<path d="M32 6Q46 10 46 28Q46 42 42 54H22Q18 42 18 28Q18 10 32 6Z" fill="' + W + '"/><path d="M20 20H26M38 20H44M19 30H27M37 30H45M20 40H26M38 40H44M30 8V16" stroke-width="4"/>' + el(32, 48, 10, 8, '#6a6a8a') + e2(25, 39, 24, 2.8),
    bear: c(14, 14, 8, BR) + c(50, 14, 8, BR) + c(32, 34, 24, BR) + el(32, 42, 12, 10, '#e0b98a') + pg('28,38 36,38 32,43', K) + e2(23, 41, 28, 3) + '<path d="M32 43V47M28 49Q32 52 36 49"/>',
    fish: pg('46,32 60,18 60,46', O) + el(28, 32, 22, 16, BL) + pg('22,18 32,8 34,18', O) + '<circle cx="16" cy="28" r="3" fill="' + K + '" stroke="none"/><path d="M26 40Q32 36 38 40"/>',
    whale: '<path d="M4 38Q4 18 28 18Q50 18 52 36L60 26L60 46L50 42Q44 56 24 54Q4 52 4 38Z" fill="' + BL + '"/>' + el(24, 46, 14, 5, '#d9f3ff', ' stroke="none"') + '<circle cx="14" cy="32" r="3" fill="' + K + '" stroke="none"/><path d="M26 18Q22 8 16 6M26 18Q30 8 36 6" stroke="' + B + '"/>',
    octopus: '<path d="M12 30Q12 8 32 8Q52 8 52 30V36Q56 46 50 56M12 36Q8 46 14 56M24 36Q20 50 26 58M40 36Q44 50 38 58" fill="' + PU + '"/><path d="M12 30Q12 8 32 8Q52 8 52 30V38H12Z" fill="' + PU + '"/>' + e2(24, 40, 28, 4) + '<path d="M26 36Q32 41 38 36"/>',
    shark: '<path d="M2 40Q16 22 44 24L58 12L56 34L60 52L44 44Q22 54 2 40Z" fill="' + GR + '"/><path d="M26 22L32 6L40 24Z" fill="' + GR + '"/>' + '<path d="M2 40Q22 46 44 40" stroke="' + W + '"/><circle cx="14" cy="34" r="2.6" fill="' + K + '" stroke="none"/><path d="M8 42l3 4 3-3 3 4" stroke="' + W + '" stroke-width="2.5"/>',
    turtle: el(32, 36, 22, 16, G) + '<path d="M16 36Q32 14 48 36" fill="#4fb84f"/><path d="M24 30L28 38M40 30L36 38M32 24V36" stroke-width="2"/>' + c(54, 36, 7, '#9be09b') + c(14, 50, 5, '#9be09b') + c(50, 50, 5, '#9be09b') + '<circle cx="56" cy="34" r="1.8" fill="' + K + '" stroke="none"/>',
    dolphin: '<path d="M6 40Q8 18 34 16Q44 16 50 22L60 20L54 30Q54 46 36 52Q18 56 6 40Z" fill="' + BL + '"/><path d="M26 16L34 6L38 18Z" fill="' + BL + '"/>' + '<path d="M10 42Q26 46 44 40" stroke="' + B + '"/><circle cx="46" cy="26" r="2.6" fill="' + K + '" stroke="none"/><path d="M6 40L2 42" />',
    /* body */
    eye: '<path d="M4 32Q32 6 60 32Q32 58 4 32Z" fill="' + W + '"/>' + c(32, 32, 12, BL) + c(32, 32, 6, K) + '<circle cx="28" cy="28" r="2.5" fill="' + W + '" stroke="none"/>',
    ear: '<path d="M32 6C46 6 52 18 48 30C46 38 40 40 40 48C40 56 30 58 26 52" fill="#f2c999"/><path d="M32 16C40 16 42 24 38 30M32 22C36 22 36 26 34 30" stroke-width="2.5"/>',
    nose: '<path d="M32 8Q40 8 40 20Q40 30 50 40Q54 52 42 54Q36 52 32 54Q28 52 22 54Q10 52 14 40Q24 30 24 20Q24 8 32 8Z" fill="#f2c999"/><ellipse cx="25" cy="46" rx="3" ry="2.5" fill="' + K + '" stroke="none"/><ellipse cx="39" cy="46" rx="3" ry="2.5" fill="' + K + '" stroke="none"/>',
    mouth: '<path d="M6 30Q32 8 58 30Q32 56 6 30Z" fill="' + R + '"/><path d="M12 31Q32 40 52 31Q32 20 12 31Z" fill="' + W + '"/><path d="M24 38Q32 46 40 38" fill="' + P + '"/>',
    tooth: '<path d="M14 14Q22 8 32 14Q42 8 50 14Q56 26 48 36Q46 52 40 56Q34 56 32 44Q30 56 24 56Q18 52 16 36Q8 26 14 14Z" fill="' + W + '"/><path d="M22 18Q26 16 28 18" stroke="' + B + '"/>',
    tongue: '<path d="M8 22Q32 6 56 22Q56 34 50 38L46 46Q32 62 18 46L14 38Q8 34 8 22Z" fill="' + R + '"/><path d="M32 22V42" stroke-width="3"/>' + '<path d="M8 22Q32 6 56 22" fill="none"/>',
    hand: '<path d="M14 34V18Q14 12 19 12Q24 12 24 18V28V10Q24 4 29 4Q34 4 34 10V28V12Q34 6 39 6Q44 6 44 12V30V20Q44 15 49 15Q54 15 54 20V40Q54 58 36 58Q18 58 14 44Z" fill="#f2c999"/>',
    foot: '<path d="M22 6Q34 4 38 14Q42 30 46 38Q56 42 54 52Q50 58 30 58Q14 58 14 48Q16 34 18 20Q18 8 22 6Z" fill="#f2c999"/>' + c(48, 34, 4, '#f2c999') + c(40, 28, 3.5, '#f2c999'),
    leg: '<path d="M22 4H38V34Q38 40 42 44L50 48Q58 52 52 58H26Q20 58 22 50Z" fill="#f2c999"/><path d="M22 34Q30 38 38 34" stroke-width="2"/>',
    arm: '<path d="M6 40Q10 20 30 16L44 12Q50 12 52 18Q52 24 46 26L36 30Q40 42 30 52Q16 58 6 40Z" fill="#f2c999"/><path d="M26 28Q32 34 30 42" stroke-width="2"/>',
    hair: c(32, 32, 26, '#6b4423') + el(32, 36, 16, 18, '#f2c999') + '<path d="M16 28Q24 14 32 22Q40 14 48 28Q44 12 32 10Q20 12 16 28Z" fill="#6b4423"/>' + e2(26, 38, 36, 2.8) + '<path d="M28 44Q32 48 36 44"/>',
    brain: '<path d="M32 10C22 4 10 10 10 22C4 26 6 38 14 40C14 52 28 56 32 50C36 56 50 52 50 40C58 38 60 26 54 22C54 10 42 4 32 10Z" fill="' + P + '"/><path d="M32 10V50M20 24Q26 28 22 36M44 24Q38 28 42 36" stroke-width="2.5"/>',
    heart: '<path d="M32 58C8 42 4 26 12 16C20 8 29 11 32 20C35 11 44 8 52 16C60 26 56 42 32 58Z" fill="' + R + '"/><path d="M16 20Q20 16 26 18" stroke="' + W + '"/>',
    bone: '<path d="M16 14A8 8 0 1 1 24 22L42 40A8 8 0 1 1 50 50A8 8 0 1 1 40 42L22 24A8 8 0 1 1 16 14Z" fill="' + W + '"/>',
    /* space */
    sun: c(32, 32, 14, Y) + '<path d="M32 4V12M32 52V60M4 32H12M52 32H60M12 12L18 18M46 46L52 52M52 12L46 18M18 46L12 52"/>' + e2(27, 37, 30, 2) + '<path d="M27 37Q32 42 37 37"/>',
    moon: '<path d="M44 8A26 26 0 1 0 56 44A20 20 0 0 1 44 8Z" fill="' + Y + '"/><circle cx="26" cy="38" r="3" fill="#e6b800" stroke-width="2"/><circle cx="36" cy="50" r="2" fill="#e6b800" stroke-width="2"/>',
    star: star(32, 33, 28, Y),
    night: '<rect x="4" y="4" width="56" height="56" rx="10" fill="#2f3a7a"/><path d="M40 14A14 14 0 1 0 48 38A11 11 0 0 1 40 14Z" fill="' + Y + '" stroke="none"/>' + star(16, 16, 5, W) + star(50, 22, 4, W) + star(20, 50, 4, W) + star(52, 48, 5, W),
    galaxy: '<rect x="4" y="4" width="56" height="56" rx="10" fill="#2f3a7a"/>' + '<path d="M32 32Q22 22 30 14Q44 14 44 28Q44 46 28 48Q10 46 12 28" fill="none" stroke="' + PU + '" stroke-width="4"/>' + c(32, 32, 4, Y) + star(50, 14, 4, W) + star(12, 50, 3, W) + star(52, 50, 3, W),
    comet: '<path d="M44 20L8 56M40 26L18 56M48 24L30 56" stroke="' + O + '" stroke-width="4"/>' + c(46, 18, 12, BL) + '<circle cx="42" cy="14" r="3" fill="' + W + '" stroke="none"/>',
    rocket: '<path d="M32 4C46 14 46 36 42 46H22C18 36 18 14 32 4Z" fill="' + W + '"/>' + c(32, 24, 7, B) + pg('22,34 10,50 22,46', R) + pg('42,34 54,50 42,46', R) + pg('26,47 38,47 32,60', Y),
    astronaut: el(32, 24, 17, 16, W) + el(32, 26, 11, 9, '#4a6fa5') + '<circle cx="28" cy="23" r="2.5" fill="' + W + '" stroke="none"/>' + '<rect x="18" y="38" width="28" height="20" rx="8" fill="' + W + '"/><rect x="26" y="44" width="12" height="7" rx="2" fill="' + R + '"/>',
    telescope: '<path d="M6 30L40 14L46 28L12 44Z" fill="' + BL + '"/><path d="M40 14L48 12L54 26L46 28" fill="' + Y + '"/><path d="M26 36L18 58M30 34L40 58" stroke-width="3.5"/>',
    satellite: '<rect x="22" y="22" width="20" height="20" rx="3" fill="' + GR + '" transform="rotate(45 32 32)"/>' + '<rect x="2" y="26" width="16" height="12" fill="' + BL + '"/><rect x="46" y="26" width="16" height="12" fill="' + BL + '"/><path d="M18 32H24M40 32H46M32 14V6" /><circle cx="32" cy="5" r="2.5" fill="' + R + '"/>',
    Earth: c(32, 32, 24, BL) + '<path d="M18 22Q28 14 34 24Q28 30 32 36Q22 40 16 32Z" fill="' + G + '"/><path d="M40 38Q50 32 52 42Q46 52 38 48Z" fill="' + G + '"/>',
    Mars: c(32, 32, 24, '#e2573c') + '<circle cx="24" cy="26" r="4" fill="#b33f2a" stroke-width="2"/><circle cx="40" cy="40" r="5" fill="#b33f2a" stroke-width="2"/><circle cx="42" cy="22" r="2.5" fill="#b33f2a" stroke-width="2"/>',
    Jupiter: c(32, 32, 24, O) + '<path d="M9 24Q32 18 55 24M8 34Q32 40 56 34M12 44Q32 48 52 44" stroke="#c97a2b" stroke-width="3.5"/>' + '<ellipse cx="40" cy="32" rx="6" ry="4" fill="#e2573c" stroke-width="2"/>',
    Saturn: '<ellipse cx="32" cy="34" rx="29" ry="9" fill="none" transform="rotate(-18 32 34)" stroke="' + K + '" stroke-width="5"/>' + c(32, 32, 16, '#f2d27a') + '<path d="M6 40Q20 50 40 44Q56 38 58 28" fill="none" stroke="' + Y + '" stroke-width="3" transform="rotate(0)"/>',
    Venus: c(32, 32, 24, '#f6df8a') + '<path d="M12 26Q24 20 34 26T54 24M10 38Q24 32 36 38T56 38" stroke="#d9b84a" stroke-width="3"/>',
    Neptune: c(32, 32, 24, '#4f7cff') + '<path d="M10 28Q24 22 36 28T56 26M9 40Q24 34 36 40T56 40" stroke="#2f55c7" stroke-width="3"/>' + c(42, 24, 4, '#9bb5ff')
  };
  SA.wordIcons = D;
  SA.picSvg = function (en) {
    const b = D[en]; if (!b) return '';
    return '<svg class="ic wic" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><g stroke="' + K + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" fill="none">' + b + '</g></svg>';
  };
  SA.pic = function (emoji, en) { return SA.picSvg(en) || emoji; };
})();
