/* Solo's Academy: Games tab for Solana. Original games in the style of toddler learning apps:
   pop the balloon you hear, drag pieces to match, build a word, count into a basket, sing and clap,
   and fill a rainbow. Positive reinforcement only: a wrong try wobbles, says what she picked, then asks her to try again. Nothing is lost.
   Sections: Letters, Numbers, Colors, Shapes (English, or Spanish when her focus language is Spanish) and
   Unit words (English or her focus language). Runs fully offline. */
(function () {
  'use strict';
  const SA = window.SA;
  const G = (SA.games = {});
  const F = () => SA.fun;
  const BALLOON = ['#e5322d', '#1f6feb', '#ffd21f', '#27ae3a', '#7b4dff', '#0fa3b1'];
  const BANDS = ['#ff3b30', '#ff9500', '#ffd60a', '#34c759', '#0a84ff', '#5e5ce6', '#bf5af2'];
  const ALPHA = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const POP_ROUNDS = 5;
  const INK = '#2b2250';
  const GAME_DEF = { pop: ['🎈', 'Pop it!'], drag: ['🧩', 'Match it!'], build: ['🔨', 'Build a word'], count: ['🧺', 'Count it!'], sing: ['🎵', 'Sing it!'], sound: ['👂', 'Sound it!'], add: ['➕', 'Add it!'] };
  const SEC_GAMES = { letters: ['pop', 'drag', 'build'], numbers: ['pop', 'drag', 'count', 'sing'], colors: ['pop', 'drag'], shapes: ['pop', 'drag'], words: ['pop', 'drag', 'build', 'sing'] };
  /* Higher levels unlock more games (Sound it and Add it start at level 2). */
  function gamesFor(ctx, sec) {
    const l = LV(ctx, sec); const base = SEC_GAMES[sec].slice();
    if (sec === 'letters' && l >= 2) base.splice(2, 0, 'sound');
    if (sec === 'numbers' && l >= 2) base.splice(3, 0, 'add');
    return base;
  }
  const SUFFIX = { letters: 'L', words: 'W', numbers: 'N', colors: 'C', shapes: 'S' };

  const lvl = (ctx) => SA.stage.level(ctx.state);
  /* Level for one section: her starting level plus the levels she has earned there. */
  function LV(ctx, sec) { return Math.min(4, lvl(ctx) + (((ctx.state.adapt || {})[sec]) || 0)); }
  function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = b[i]; b[i] = b[j]; b[j] = t; } return b; }
  /* Pick n items; pictures stay different from each other when the items have emoji. */
  function pick(a, n) {
    const sh = shuffle(a); const out = []; const seen = {};
    sh.forEach((x) => { if (out.length >= n) return; const k = x && typeof x === 'object' && typeof x.e === 'string' ? x.e : null; if (k && seen[k]) return; if (k) seen[k] = 1; out.push(x); });
    sh.forEach((x) => { if (out.length < n && out.indexOf(x) < 0) out.push(x); });
    return out;
  }
  function GS(ctx) {
    if (!ctx.ui.games) ctx.ui.games = { sec: 'letters', game: null, screen: 'hub', preview: false, lang: 'en', easy: true, range: '5', letter: 0, tok: 0, lock: false, sel: null, pop: null, board: null, sing: null, told: {} };
    return ctx.ui.games;
  }
  /* Grown-up settings for how she plays. Saved in state.gameCfg and read by Solana's games. */
  const SECS = ['letters', 'numbers', 'colors', 'shapes', 'words'];
  function cfg(ctx) {
    const st = ctx.state; const c = (st.gameCfg = st.gameCfg || {});
    c.secs = c.secs || {}; SECS.forEach((k) => { if (c.secs[k] === undefined) c.secs[k] = true; });
    if (!SECS.some((k) => c.secs[k])) c.secs.letters = true;
    if (c.lang !== 'tl') c.lang = 'en';
    if (['5', '10', '20'].indexOf(c.range) < 0) c.range = 'auto';
    if (c.easy !== '1' && c.easy !== '0') c.easy = 'auto';
    if (!st.adaptSet) { c.boost = '0'; st.adaptSet = true; } /* start at her age; sections move up as she masters them */
    if (c.boost !== '1' && c.boost !== '2') c.boost = '0';
    c.practice = !!c.practice;
    return c;
  }
  function sync(ctx, g) {
    const c = cfg(ctx); g.lang = c.lang; g.range = c.range; g.easy = easyOn(ctx, g.sec); g.practice = c.practice;
    if (!c.secs[g.sec]) g.sec = SECS.filter((k) => c.secs[k])[0];
  }
  const RANGE_BY_LEVEL = [5, 10, 20, 20, 20];
  function rangeMax(ctx) { const r = cfg(ctx).range; return r === 'auto' ? RANGE_BY_LEVEL[LV(ctx, 'numbers')] : +r; }
  function easyOn(ctx, sec) { const e = cfg(ctx).easy; return e === 'auto' ? LV(ctx, sec || 'letters') < 3 : e === '1'; }
  const previewing = (ctx) => !ctx.isChild() && !!GS(ctx).preview;

  /* ---------- sound effects (tiny synth, no files) ---------- */
  let ac = null;
  function audio() { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); return ac; }
  function beep(f1, f2, dur) {
    try {
      const a = audio(); const o = a.createOscillator(); const gn = a.createGain(); const t = a.currentTime;
      o.type = 'sine'; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur);
      gn.gain.setValueAtTime(0.22, t); gn.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(gn); gn.connect(a.destination); o.start(t); o.stop(t + dur);
    } catch (e) { /* sound is optional */ }
  }
  const sPop = () => beep(750, 180, 0.13);
  const sYay = () => { beep(523, 880, 0.2); setTimeout(() => beep(660, 1040, 0.22), 160); };
  const sNo = () => beep(220, 180, 0.12);
  function sClap() {
    try {
      const a = audio(); const len = Math.floor(a.sampleRate * 0.09); const buf = a.createBuffer(1, len, a.sampleRate); const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      const src = a.createBufferSource(); const gn = a.createGain(); src.buffer = buf; gn.gain.value = 0.6; src.connect(gn); gn.connect(a.destination); src.start();
    } catch (e) { /* sound is optional */ }
  }

  /* ---------- items per section ---------- */
  const focus = (ctx) => ctx.state.focusLang || 'es';
  /* Spanish is used for numbers, colors, and shapes only when her focus language is Spanish. */
  function esOn(ctx, g) { return (g.sec === 'numbers' || g.sec === 'colors' || g.sec === 'shapes') && g.lang === 'tl' && focus(ctx) === 'es'; }
  function wordItems(ctx) {
    const f = F(); const u = f.unitOf(ctx);
    const seen = {};
    return f.wordsOf(ctx, u).filter((w) => { const k = String(w.en).toLowerCase(); if (seen[k]) return false; seen[k] = 1; return true; })
      .map((w) => ({ id: w.en, e: SA.pic(w.emoji, w.pic || w.en), en: w.en, sp: f.H(ctx, w.spidey || ''), spEs: f.H(ctx, w.spideyEs || ''), tl: f.tlFor(ctx, w) }));
  }
  function letterItems() { return SA.letters.map((x) => ({ id: x.l, l: x.l, lo: x.l.toLowerCase(), w: x.w, e: x.e, end: !!x.end })); }
  function numItems(ctx) { const max = rangeMax(ctx); return SA.numbers.filter((x) => x.n <= max).map((x) => ({ id: String(x.n), n: x.n, en: x.en, es: x.es })); }
  const COLORS_BY_LEVEL = [6, 9, 11, 11, 11];
  const SHAPES_BY_LEVEL = [4, 6, 8, 10, 10];
  const colorItems = (ctx) => SA.colors.slice(0, COLORS_BY_LEVEL[LV(ctx, 'colors')]).map((x) => ({ id: x.id, en: x.en, es: x.es, c: x.c }));
  const shapeItems = (ctx) => SA.shapes.slice(0, SHAPES_BY_LEVEL[LV(ctx, 'shapes')]).map((x) => ({ id: x.id, en: x.en, es: x.es, g: x.g || 'm', c: x.c, svg: x.svg }));
  function itemsFor(ctx, g) {
    switch (g.sec) { case 'letters': return letterItems(); case 'numbers': return numItems(ctx); case 'colors': return colorItems(ctx); case 'shapes': return shapeItems(ctx); default: return wordItems(ctx); }
  }
  function letterPhrase(it) { return it.end ? it.l + ' is for ' + it.w + '. ' + it.w + ' ends with ' + it.l + '.' : 'Letter ' + it.l + '. ' + it.l + ' is for ' + it.w + '.'; }
  function itemName(ctx, g, it) {
    if (g.sec === 'letters') return it.l;
    if (g.sec === 'words') return g.lang === 'tl' ? it.tl.text : it.en;
    return esOn(ctx, g) ? it.es : it.en;
  }
  /* Speak an item in the section's language. */
  function sayItem(ctx, g, it, lead) {
    const f = F();
    if (g.sec === 'letters') return f.say(ctx, (lead || '') + 'Letter ' + it.l + '.', 'en-US', false, true);
    if (g.sec === 'words') {
      if (g.lang === 'tl') { if (!f.say(ctx, it.tl.text, it.tl.tag)) ctx.toast('No ' + it.tl.name + ' voice on this device.'); return true; }
      return f.say(ctx, (lead || '') + it.en + '.', 'en-US');
    }
    const es = esOn(ctx, g);
    return f.say(ctx, (es ? '' : (lead || '')) + (es ? it.es : it.en) + '.', es ? ctx.LBY.es.tts : 'en-US');
  }
  /* Praise on every right answer, always in English, varied so it never feels the same.
     In Spanish mode the Spanish word is spoken first, then the English praise. */
  const PRAISE_EN = ['Great job!', 'You got it!', 'Awesome!', 'Super!', 'Nice work!', 'Amazing!', 'That is right!', 'Yay, you did it!', 'Fantastic!'];
  const SHORT_EN = ['Yes!', 'Good!', 'Nice!', 'Great!'];
  let lastPraise = '';
  const langEs = (ctx, g) => g.sec !== 'letters' && g.lang === 'tl' && focus(ctx) === 'es';
  function praise(ctx, g, short) {
    const pool = short ? SHORT_EN : PRAISE_EN; let t;
    do { t = pool[Math.floor(Math.random() * pool.length)]; } while (t === lastPraise && pool.length > 1);
    lastPraise = t; return t;
  }
  /* Speak `text` in another language, then the English praise right after it. */
  function thenPraise(ctx, text, tag, p, plain, wait) {
    const f = F(); let called = false;
    const go = () => { if (called) return; called = true; f.say(ctx, p, 'en-US', false, true); };
    const ok = f.say(ctx, text, tag, false, !!plain, go);
    setTimeout(go, ok ? (wait || 2800) : 100); return true;
  }
  /* Say what she got right, then praise her in English (also shown on screen). */
  /* Level 2 and up: after the word, a short Spanish sentence so she hears the word used. */
  function esSentence(ctx, g, it) {
    if (LV(ctx, g.sec) < 2) return '';
    if (g.sec === 'colors') return ' Es ' + it.es + '.';
    if (g.sec === 'numbers') return ' Es el número ' + it.es + '.';
    if (g.sec === 'shapes') return ' Es ' + (it.g === 'f' ? 'una ' : 'un ') + it.es + '.';
    if (g.sec === 'words' && focus(ctx) === 'es') return ' Veo ' + it.tl.text + '.';
    return '';
  }
  function sayRight(ctx, g, it) {
    const f = F(); const p = praise(ctx, g, false); ctx.toast(p);
    if (g.game === 'add' && g.pop) {
      const q = g.pop; const A = SA.numbers[q.a - 1]; const B = SA.numbers[q.b - 1]; const R = SA.numbers[q.sub ? q.a - q.b - 1 : q.a + q.b - 1];
      if (esOn(ctx, g)) return thenPraise(ctx, A.es + (q.sub ? ' menos ' : ' más ') + B.es + (R.n === 1 ? ' es ' : ' son ') + R.es + '.', ctx.LBY.es.tts, p, true, 5000);
      return f.say(ctx, A.en + (q.sub ? ' take away ' : ' plus ') + B.en + ' is ' + R.en + '! ' + p, 'en-US', false, true);
    }
    if (g.sec === 'letters') return f.say(ctx, 'Letter ' + it.l + '! ' + p, 'en-US', false, true);
    if (g.sec === 'words') {
      if (g.lang === 'tl') return thenPraise(ctx, it.tl.text + '.' + esSentence(ctx, g, it), it.tl.tag, p, false, 5000);
      return f.say(ctx, it.en + '! ' + p, 'en-US');
    }
    if (esOn(ctx, g)) return thenPraise(ctx, it.es + '.' + esSentence(ctx, g, it), ctx.LBY.es.tts, p, false, 5000);
    return f.say(ctx, it.en + '! ' + p, 'en-US');
  }
  /* Wrong try: say what she picked, then ask her to try again. */
  function sayWrong(ctx, g, it) {
    const f = F(); let text; let tag = 'en-US';
    if (g.sec === 'letters') text = 'That is the letter ' + it.l.toUpperCase() + '. Try again!';
    else if (g.sec === 'words') {
      if (g.lang === 'tl') return thenPraise(ctx, it.tl.text + '.', it.tl.tag, 'Try again!', false, 2200);
      text = 'That is the ' + it.en + '. Try again!';
    } else if (esOn(ctx, g)) return thenPraise(ctx, it.es + '.', ctx.LBY.es.tts, 'Try again!', false, 2200);
    else if (g.sec === 'shapes') text = 'That is a ' + it.en + '. Try again!';
    else text = 'That is ' + it.en + '. Try again!';
    return f.say(ctx, text, tag, false, g.sec === 'letters');
  }
  function numWord(ctx, g, k) { const x = SA.numbers[k - 1]; return esOn(ctx, g) ? x.es : x.en; }

  /* ---------- pictures ---------- */
  function shapeSvg(sh, fill, shadow) {
    return '<svg class="shp' + (shadow ? ' shadow' : '') + '" viewBox="0 0 100 100" aria-hidden="true" fill="' + fill + '"' + (shadow ? '' : ' stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"') + '>' + sh.svg + '</svg>';
  }
  const swatch = (c, hollow) => '<i class="sw' + (hollow ? ' hollow' : '') + '" style="' + (hollow ? 'border-color:' : 'background:') + c + '"></i>';
  const group = (n, e) => '<span class="grp">' + new Array(n + 1).join(e) + '</span>';
  function balloonFace(g, o) {
    switch (g.sec) {
      case 'letters': return '<b>' + o.l + '</b><small>' + o.lo + '</small>';
      case 'numbers': return '<b>' + o.n + '</b>';
      case 'colors': return '';
      case 'shapes': return shapeSvg(o, o.c);
      default: return '<b class="em">' + o.e + '</b>';
    }
  }

  /* ---------- rewards ---------- */
  function reward(ctx) {
    if (previewing(ctx)) return false;
    const st = ctx.state; st.gameStars = (st.gameStars || 0) + 1; st.rbBands = (st.rbBands || 0) + 1; let full = false;
    if (st.rbBands >= 7) { st.rbBands = 0; st.rainbows = (st.rainbows || 0) + 1; st.gameStars += 2; full = true; }
    ctx.save(); return full;
  }
  /* Right answers are counted per letter, number, color, shape, and unit word. Three right answers = mastered. */
  function winKey(ctx, sec, id) { return sec === 'words' ? 'words:' + F().pickIds(ctx).join('+') + ':' + id : sec + ':' + id; }
  function winsOf(ctx, sec, id) {
    const st = ctx.state;
    return sec === 'letters' ? ((st.letterWins || {})[id] || 0) : ((st.gameWins || {})[winKey(ctx, sec, id)] || 0);
  }
  function win(ctx, sec, id) {
    if (previewing(ctx)) return;
    const st = ctx.state; const was = winsOf(ctx, sec, id);
    if (sec === 'letters') { st.letterWins = st.letterWins || {}; st.letterWins[id] = was + 1; }
    else { st.gameWins = st.gameWins || {}; st.gameWins[winKey(ctx, sec, id)] = was + 1; }
    ctx.save();
    if (was + 1 === 3) ctx.toast(sec === 'letters' ? '🌈 You know the letter ' + id + '!' : '🌈 You know ' + id + '!');
    if (was + 1 === 3) checkLevelUp(ctx, sec);
  }
  /* She moves up in a section when she has mastered most of what that level asks. */
  const LETTERS_TO_LEVEL = [5, 10, 16, 22];
  function secNeeded(ctx, sec) {
    if (sec === 'letters') return { items: letterItems(), need: LETTERS_TO_LEVEL[Math.min(3, LV(ctx, 'letters'))] };
    const items = itemsFor(ctx, { sec, lang: 'en', range: cfg(ctx).range });
    return { items, need: Math.max(3, Math.ceil(items.length * 0.8)) };
  }
  function checkLevelUp(ctx, sec) {
    const st = ctx.state; if (LV(ctx, sec) >= 4) return;
    const r = secNeeded(ctx, sec); const got = r.items.filter((x) => winsOf(ctx, sec, x.id) >= 3).length;
    if (got < r.need) return;
    st.adapt = st.adapt || {}; st.adapt[sec] = (st.adapt[sec] || 0) + 1;
    st.levelLog = st.levelLog || []; st.levelLog.unshift({ date: ctx.dkey(), sec, level: LV(ctx, sec) }); st.levelLog = st.levelLog.slice(0, 20);
    ctx.save(); ctx.toast('⬆️ New level!');
    setTimeout(() => F().say(ctx, 'You are growing! New games for you!', 'en-US', false, true), 1800);
  }
  /* Practice mode: aim at what she has not mastered yet (fewer than 3 right answers). */
  function needyOf(ctx, g, items) {
    if (!g.practice) return items;
    const n = items.filter((x) => winsOf(ctx, g.sec, x.id) < 3);
    return n.length ? n : items;
  }
  function pickNeedy(ctx, g, all, k) {
    let items = pick(needyOf(ctx, g, all), k);
    if (items.length < k) items = items.concat(pick(all.filter((x) => items.indexOf(x) < 0), k - items.length));
    return items;
  }
  function rainbow(bands, small) {
    let h = '<div class="rb' + (small ? ' sm' : '') + '" role="img" aria-label="Rainbow, ' + bands + ' of 7 colors">';
    for (let k = 0; k < 7; k++) { const w = small ? 132 - k * 14 : 220 - k * 24; h += '<i style="width:' + w + 'px;height:' + (w / 2) + 'px;border-color:' + (k < bands ? BANDS[k] : (k % 2 ? 'rgba(120,120,150,.32)' : 'rgba(120,120,150,.16)')) + '"></i>'; }
    return h + '</div>';
  }
  function chips(ctx, items, cur, act, key) {
    return '<div class="chips">' + items.map((t) => '<button class="chip" aria-pressed="' + (String(cur) === String(t[0])) + '" data-act="' + act + '" data-' + key + '="' + ctx.esc(t[0]) + '">' + t[1] + '</button>').join('') + '</div>';
  }

  /* ---------- spoken instructions ("how to play") ---------- */
  const HOW = {
    hub: ['Pick a game. Finish it to add a color to your rainbow!', null],
    popL: ['Tap the balloon with the letter I say. Pop five!', null],
    popW: ['Tap the balloon with the right picture. Pop five!', null],
    popN: ['Tap the balloon with the number I say. Pop five!', null],
    popC: ['Tap the balloon with the color I say. Pop five!', null],
    popS: ['Tap the balloon with the shape I say. Pop five!', null],
    dragL: ['Drag each big letter to its little letter.', null],
    dragW: ['Drag each picture to its shadow.', null],
    dragN: ['Drag each number to the group with that many.', null],
    dragC: ['Drag each color to the same color.', null],
    dragS: ['Drag each shape to its shadow.', null],
    sound: ['Listen. Tap the letter the word starts with. Sometimes it ends with it!', null],
    add: ['Listen to the problem. Tap the answer.', null],
    build: ['Drag the missing letters into the boxes.', null],
    count: ['Drag the right number into the basket. Count with me!', null],
    sing: ['Press sing and sing with me. Press clap to clap!', null]
  };
  function howKey(g) {
    if (g.screen !== 'play') return 'hub';
    if (g.game === 'pop' || g.game === 'drag') return g.game + SUFFIX[g.sec];
    return g.game;
  }
  /* Instructions and praise are always English. Only the practice words use her second language. */
  function sayHow(ctx, g, key, onend) {
    const t = HOW[key];
    return F().say(ctx, t[0], 'en-US', false, true, onend);
  }
  const helpOn = (ctx) => ctx.state.gameHelp !== false;

  /* ---------- parent progress card ---------- */
  function progressCard(ctx) {
    const st = ctx.state; const f = F(); const u = f.unitOf(ctx);
    const defs = [
      ['Letters', 'letters', SA.letters.map((x) => ({ id: x.l, label: x.l }))],
      ['Numbers', 'numbers', numItems(ctx).map((x) => ({ id: x.id, label: String(x.n) }))],
      ['Colors', 'colors', colorItems(ctx).map((x) => ({ id: x.id, label: x.en }))],
      ['Shapes', 'shapes', shapeItems(ctx).map((x) => ({ id: x.id, label: x.en }))],
      [u.name + ' words', 'words', wordItems(ctx).map((x) => ({ id: x.id, label: x.en }))]
    ];
    let h = '<div class="card"><b>Her progress</b><p class="small muted">Counted from the games. A piece is mastered after 3 right answers. Green = mastered, yellow = started, gray = not yet. Turn on Practice above to aim her games at the yellow and gray ones.</p>';
    defs.forEach((d) => {
      const rows = d[2].map((x) => ({ x, n: winsOf(ctx, d[1], x.id) })); const done = rows.filter((r) => r.n >= 3).length;
      h += '<div style="margin:10px 0 2px"><b>' + ctx.esc(d[0]) + '</b> <span class="small muted">' + done + ' of ' + rows.length + ' mastered</span> ' + (done < rows.length ? '' : '<span class="pill">All mastered 🌈</span>') + '</div><div class="pgrid">' +
        rows.map((r) => '<span class="pbadge ' + (r.n >= 3 ? 'm' : r.n > 0 ? 's' : '') + '" title="' + r.n + ' right">' + ctx.esc(r.x.label) + '</span>').join('') + '</div>';
    });
    const nextUp = [];
    defs.forEach((d) => d[2].forEach((x) => { const n = winsOf(ctx, d[1], x.id); if (n > 0 && n < 3) nextUp.push(x.label); }));
    if (nextUp.length) h += '<p class="small"><b>Started, keep practicing:</b> ' + ctx.esc(nextUp.slice(0, 12).join(', ')) + '</p>';
    return h + '</div>';
  }

  /* ---------- grown-up view: choose what she learns and how she plays ---------- */
  const secLabel = (k, u) => ({ letters: '🔤 Letters', numbers: '🔢 Numbers', colors: '🎨 Colors', shapes: '🔷 Shapes', words: u.emoji + ' ' + u.name + ' words' })[k];
  function settingsView(ctx) {
    const f = F(); const u = f.unitOf(ctx); const c = cfg(ctx); const sample = wordItems(ctx)[0]; const es = focus(ctx) === 'es';
    const on = (cond) => String(!!cond);
    const grp = (label, hint, body) => '<div class="srow"><div class="slabel">' + label + '</div>' + body + (hint ? '<p class="small muted">' + hint + '</p>' : '') + '</div>';
    const lv = lvl(ctx); const base = SA.stage.base(ctx.state); const age = SA.stage.ageText(ctx.state); const LI = SA.stage.LEVELS;
    let h = '<div class="card"><b>Her level</b><div class="stats"><span>🎂 ' + (age ? ctx.esc(age) : 'add birth month') + '</span><span>🚀 starts at ' + LI[lv].name + '</span></div>' +
      '<div class="stats">' + SECS.map((k) => '<span title="' + k + '">' + secLabel(k, u).split(' ')[0] + ' L' + LV(ctx, k) + '</span>').join('') + '</div>' +
      '<p class="small muted">She starts at her age. Each section moves up by itself when she masters most of it (3 right answers each). ' + ctx.esc(LI[lv].does) + '</p>' +
      ((ctx.state.levelLog || []).length ? '<p class="small keep"><b>Level-ups:</b> ' + (ctx.state.levelLog || []).slice(0, 4).map((x) => ctx.esc(x.date.slice(5)) + ' ' + ctx.esc(({ letters: 'Letters', numbers: 'Numbers', colors: 'Colors', shapes: 'Shapes', words: 'Unit words' })[x.sec]) + ' to L' + x.level).join(', ') + '</p>' : '') +
      grp('Start point', 'Her age is the default. Ahead starts every section one or two levels higher.', chips(ctx, [['0', 'Her age'], ['1', '1 ahead'], ['2', '2 ahead']], c.boost, 'gboost', 'b')) +
      '<details class="acc"><summary>What each level teaches</summary><div class="acc-body">' + LI.map((x) => '<p class="small"><b>' + x.name + '</b> (' + x.like + '): ' + ctx.esc(x.does) + '</p>').join('') + '</div></details></div>';
    const ms = ctx.milestoneStatus();
    h += '<div class="card"><details class="acc" data-id="msacc"' + (ctx.ui.openDetails.msacc ? ' open' : '') + '><summary>✅ Milestones: what she can already do</summary><div class="acc-body">' +
      (ms.pct >= 0.75 && (c.boost | 0) < 2 ? '<div class="card good"><b>She has most of the ' + ctx.esc(ms.label.toLowerCase()) + ' milestones.</b><p class="small">Her games can start a level ahead.</p><button class="btn small" data-act="gboost" data-b="' + (((c.boost | 0) + 1)) + '">Start 1 level higher</button></div>' : '') +
      ctx.milestonesHtml() + '</div></details></div>';
    h += '<div class="card"><b>What she plays</b><p class="small muted">Solana only sees the sections that are on.</p><div class="chips">' +
      SECS.map((k) => '<button class="chip" aria-pressed="' + on(c.secs[k]) + '" data-act="gtoggle" data-s="' + k + '">' + (c.secs[k] ? '✓ ' : '') + secLabel(k, u) + '</button>').join('') + '</div>' +
      '<div class="small muted">Unit words follow the topic picked in the School tab.</div></div>';
    h += '<div class="card"><b>How she plays</b>' +
      grp('Say it in', es ? 'Numbers, colors, shapes, and unit words switch to ' + (sample ? sample.tl.name : 'her second language') + '. Praise is always English.' : 'Unit words can use her second language. Numbers, colors, and shapes use Spanish only when Spanish is her focus language.',
        chips(ctx, [['en', '🇺🇸 English'], ['tl', sample ? sample.tl.flag + ' ' + sample.tl.name : '🌎 Second language']], c.lang, 'glang', 'l')) +
      grp('Numbers', 'Auto picks the range for her level. Used by the Numbers games and Count it.', chips(ctx, [['auto', 'Auto'], ['5', '1 to 5'], ['10', '1 to 10'], ['20', '1 to 20']], c.range, 'grange', 'r')) +
      grp('Build a word', 'Easy gives her the first letter. Hard makes her spell all of it. Auto switches to Hard at level 3.', chips(ctx, [['auto', 'Auto'], ['1', 'Easy: 1 missing letter'], ['0', 'Hard: spell it all']], c.easy, 'geasy', 'e')) +
      grp('Practice', 'Aim the games at letters, numbers, and words she has not mastered yet.', chips(ctx, [['0', '🎲 Everything'], ['1', '🎯 What she is missing']], c.practice ? '1' : '0', 'gprac', 'p')) +
      grp('Spoken instructions', 'A voice explains how to play the first time she opens each game.', chips(ctx, [['1', '🔊 On'], ['0', '🔇 Off']], helpOn(ctx) ? '1' : '0', 'ghelp', 'v')) + '</div>';
    h += '<div class="card center"><button class="btn sun" data-act="gpreview">👀 Try Solana’s games</button><p class="small muted" style="margin-bottom:0">Nothing you do in the preview counts toward her stars or progress.</p></div>';
    h += '<div class="card note"><b>Her device</b><p class="small muted" style="margin-bottom:0">These choices are saved on this device. To copy them to Solana’s device, make a voice pack in Settings and import it there. It carries your recordings and these game settings.</p></div>';
    return h + progressCard(ctx) + (SA.parent ? SA.parent.lightRules(ctx) : '');
  }

  /* ---------- Solana's view: big and simple ---------- */
  function previewBar(ctx) {
    return previewing(ctx) ? '<div class="pvbar"><span>👀 Preview. Nothing is saved.</span><button class="btn alt small" data-act="gexit">◀ Back to settings</button></div>' : '';
  }
  function S_fun_unit(ctx, id) { SA.fun.handle('unit-set', { id: id }, ctx); }
  /* Hub: Letters, Numbers, Colors, Shapes, then every topic as its own tile. Same row of choices, no extra screen. */
  function hub(ctx, g) {
    const st = ctx.state; const c = cfg(ctx); const n = st.rbBands || 0;
    const base = ['letters', 'numbers', 'colors', 'shapes'].filter((k) => c.secs[k]);
    const bt = { letters: [SA.ic('letters'), 'Letters'], numbers: [SA.ic('numbers'), 'Numbers'], colors: [SA.ic('colors'), 'Colors'], shapes: [SA.ic('shapes'), 'Shapes'] };
    const pathDone = (st.pathDays || []).indexOf(ctx.dkey()) >= 0;
    const pathTile = '<button class="gbig pathbig" data-act="gpath"><span>' + SA.ic(pathDone ? 'check' : 'plane') + '</span>' + (pathDone ? 'Play again!' : 'Let’s go!') + '</button>';
    const thinkTile = '<button class="gbig" data-act="gskills"><span>' + (SA.picSvg('brain') || '🧠') + '</span>Think it!</button>';
    const tiles = pathTile + base.map((k) => '<button class="gbig" data-act="gsec" data-s="' + k + '"><span>' + bt[k][0] + '</span>' + bt[k][1] + '</button>').join('') + thinkTile +
      (c.secs.words ? (SA.topicOrder || SA.units.map((u) => u.id)).map((id) => SA.units.find((u) => u.id === id)).filter(Boolean).map((u) =>
        '<button class="gbig" style="background:linear-gradient(160deg,' + u.c2 + ',' + u.c1 + ')" data-act="gtopic" data-id="' + u.id + '"><span>' + SA.topicIc(u) + '</span>' + ctx.esc(u.name) + (u.school ? ' 🏫' : '') + '</button>').join('') : '');
    return '<div class="card gtop"><div class="rbcol">' + rainbow(n, true) + '<div class="small muted">' + n + ' of 7 · 🌈 ' + (st.rainbows || 0) + '</div></div>' +
      '<button class="iconbtn" data-act="ghow" aria-label="How to play">❓</button></div>' +
      '<div class="gbtns n4 secs">' + tiles + '</div>';
  }
  function secView(ctx, g) {
    const games = gamesFor(ctx, g.sec); const u = F().unitOf(ctx);
    return '<div class="gbar"><button class="btn alt backbtn" data-act="gback" aria-label="Back">◀</button><span class="gtitle">' + ctx.esc(secLabel(g.sec, u)) + '</span><button class="iconbtn" data-act="ghow" aria-label="How to play">❓</button></div>' +
      '<div class="gbtns' + (games.length >= 4 ? ' n4' : '') + '">' + games.map((k) => '<button class="gbig" data-act="gstart" data-g="' + k + '"><span>' + GAME_DEF[k][0] + '</span>' + GAME_DEF[k][1] + '</button>').join('') + '</div>' +
      (g.sec === 'letters' ? '<button class="gbig wide" data-act="glgrid"><span>🔤</span>See all the letters</button>' : '');
  }
  function lgridView(ctx, g) {
    const wins = ctx.state.letterWins || {};
    return '<div class="gbar"><button class="btn alt backbtn" data-act="gback" aria-label="Back">◀</button><span class="gtitle">🔤 Letters</span><span></span></div>' +
      '<div class="lgrid">' + SA.letters.map((x, i) => '<button class="lbtn" data-act="gletter" data-i="' + i + '" aria-label="Letter ' + x.l + '">' + x.l + x.l.toLowerCase() + ((wins[x.l] || 0) >= 3 ? '<em>🌈</em>' : '') + '</button>').join('') + '</div>';
  }
  /* top bar inside a game: back, progress dots, and a small help icon */
  function bar(done, total) {
    let dots = '';
    if (total) { dots = '<span class="dots" role="img" aria-label="' + done + ' of ' + total + '">'; for (let i = 0; i < total; i++) dots += '<i class="' + (i < done ? 'on' : '') + '"></i>'; dots += '</span>'; } else dots = '<span></span>';
    return '<div class="gbar"><button class="btn alt backbtn" data-act="gback" aria-label="Back">◀</button>' + dots + '<button class="iconbtn" data-act="ghow" aria-label="How to play">❓</button></div>';
  }

  /* ---------- letter card ---------- */
  function letterCard(ctx, g) {
    const esc = ctx.esc; const child = ctx.isChild(); const L = SA.letters[g.letter]; const key = 'mom:letter:' + L.l + ':sound';
    const has = ctx.rec.has(key); const on = ctx.rec.active() === key;
    let rec = '';
    if (has) rec += '<button class="btn sun small" data-act="mplay" data-key="' + esc(key) + '">▶ Mom says the sound</button> ';
    if (!child) rec += '<button class="btn ' + (on ? 'coral' : 'alt') + ' small" data-act="mrec" data-key="' + esc(key) + '">' + (on ? '⏹ Stop' : (has ? '🎙 Redo the sound' : '🎙 Record the sound')) + '</button>';
    return '<div class="row between"><button class="btn alt backbtn" data-act="gback" aria-label="Back">◀</button><span class="pill">Letter ' + L.l + '</span></div>' +
      '<div class="card center play-card"><div class="big-em" style="font-size:96px;line-height:1">' + L.l + L.l.toLowerCase() + '</div>' +
      '<div class="big-em">' + L.e + '</div><div class="big-word">' + esc(L.w) + '</div>' +
      '<p>' + esc(L.end ? L.l + ' is for ' + L.w + ' (it ends with ' + L.l + ')' : L.l + ' is for ' + L.w) + '</p>' +
      '<div class="row" style="justify-content:center"><button class="btn" data-act="gsayletter">🔊 Hear it</button><button class="btn alt" data-act="gsayletter" data-slow="1">🐢 Slow</button></div>' +
      (rec ? '<div style="margin-top:10px">' + rec + '</div>' : '') +
      (child ? '' : '<p class="small muted">Tip: record the letter sound (like “mmm” or “sss”), not the letter name. Phones read single letters aloud as names, so your voice teaches the sound best.</p>') + '</div>' +
      '<div class="row between"><button class="btn alt" data-act="gletternav" data-d="-1" aria-label="Previous letter">◀</button><button class="btn alt" data-act="gletternav" data-d="1" aria-label="Next letter">▶</button></div>';
  }

  /* ---------- pop game ---------- */
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  function newPop(ctx, g) {
    const used = g.pop ? g.pop.used : []; const n = g.pop ? g.pop.n : 0;
    if (g.game === 'sound') {
      const L = letterItems(); const useEnd = LV(ctx, 'letters') >= 3 && Math.random() < 0.5; let target; let pic; let word; let end;
      if (useEnd) {
        const w = pick(SA.spellWords.filter((x) => used.indexOf('e:' + x.w) < 0), 1)[0] || pick(SA.spellWords, 1)[0];
        target = L.find((x) => x.l === w.w.slice(-1).toUpperCase()); pic = w.e; word = w.w; end = true; used.push('e:' + w.w);
      } else {
        const pool = needyOf(ctx, g, L); const fresh = pool.filter((x) => used.indexOf(x.id) < 0);
        target = pick(fresh.length ? fresh : pool, 1)[0]; pic = target.e; word = target.w; end = !!target.end; used.push(target.id);
      }
      const others = pick(L.filter((x) => x.id !== target.id), 3);
      g.pop = { n, used, target, opts: shuffle([target].concat(others)), pic, word, end };
      g.lock = false; g.tok++; return;
    }
    if (g.game === 'add') {
      const NL = LV(ctx, 'numbers'); const max = Math.min(rangeMax(ctx), NL >= 4 ? 20 : NL >= 3 ? 10 : 5); const sub = NL >= 3 && Math.random() < 0.4;
      let a; let b; let ans;
      if (sub) { a = ri(2, max); b = ri(1, a - 1); ans = a - b; } else { a = ri(1, Math.max(1, max - 1)); b = ri(1, Math.max(1, max - a)); ans = a + b; }
      const N = numItems(ctx); const one = (k) => N.find((x) => x.n === k) || SA.numbers[k - 1] && { id: String(k), n: k, en: SA.numbers[k - 1].en, es: SA.numbers[k - 1].es };
      const target = one(ans);
      const near = []; for (let k = Math.max(1, ans - 3); k <= ans + 3; k++) if (k !== ans && k <= Math.max(max, ans + 1) && one(k)) near.push(one(k));
      const others = pick(near, 3);
      g.pop = { n, used, target, opts: shuffle([target].concat(others)), a, b, sub, thing: pick(SA.countThings, 1)[0] };
      g.lock = false; g.tok++; return;
    }
    const items = itemsFor(ctx, g); const pool = needyOf(ctx, g, items);
    const fresh = pool.filter((x) => used.indexOf(x.id) < 0);
    const target = pick(fresh.length ? fresh : pool, 1)[0];
    let cand = items.filter((x) => x.id !== target.id && !(target.e && x.e === target.e)); if (cand.length < 3) cand = items.filter((x) => x.id !== target.id);
    if (sentenceOn(ctx, g, target)) { /* a sentence must not name another picture on the screen */
      const sent = String(g.lang === 'tl' ? target.spEs : target.sp).toLowerCase();
      const named = (x) => { const w = String(g.lang === 'tl' ? x.tl.text : x.en).toLowerCase().replace(/^(la|el|los|las|un|una) /, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); return new RegExp('(^|[^a-záéíóúñ])' + w + '(s|es)?([^a-záéíóúñ]|$)').test(sent); };
      const clean = cand.filter((x) => !named(x)); if (clean.length >= 3) cand = clean;
    }
    const others = pick(cand, 3);
    g.pop = { n, used: used.concat([target.id]), target, opts: shuffle([target].concat(others)) };
    g.lock = false; g.tok++;
  }
  const sentenceOn = (ctx, g, t) => g.sec === 'words' && LV(ctx, 'words') >= 2 && !!(g.lang === 'tl' ? (focus(ctx) === 'es' ? t.spEs : '') : t.sp);
  function popPrompt(ctx, g, t) {
    const nm = itemName(ctx, g, t); const es = esOn(ctx, g);
    if (g.game === 'sound') { const p = g.pop; return 'Which letter does ' + p.word + (p.end ? ' end' : ' start') + ' with?'; }
    if (g.game === 'add') {
      const p = g.pop; const A = SA.numbers[p.a - 1]; const B = SA.numbers[p.b - 1]; const es2 = esOn(ctx, g);
      return 'What is ' + A.en + (p.sub ? ' take away ' : ' plus ') + B.en + '?';
    }
    if (sentenceOn(ctx, g, t)) return g.lang === 'tl' ? t.spEs : t.sp;
    if (g.sec === 'letters') return 'Pop the letter ' + t.l + '!';
    if (g.sec === 'words' && g.lang === 'tl') return nm + '!';
    if (g.sec === 'numbers') return es ? t.es + '!' : 'Pop the number ' + t.en + '!';
    if (g.sec === 'colors') return es ? t.es + '!' : 'Pop the ' + nm + ' balloon!';
    if (es) return nm + '!';
    return 'Pop the ' + nm + '!';
  }
  /* Solana cannot read yet, so every prompt is spoken. The text is small and for the grown-up. */
  function popView(ctx, g) {
    const esc = ctx.esc; const p = g.pop; const t = p.target; let cue = '';
    if (g.game === 'sound') cue = '<div class="big-em">' + p.pic + '</div>';
    if (g.game === 'add') cue = '<div class="eq">' + group(p.a, p.thing.e) + '<b>' + (p.sub ? '➖' : '➕') + '</b>' + group(p.b, p.thing.e) + '<b>＝ ?</b></div>';
    if (sentenceOn(ctx, g, t)) cue = '<div class="big-em">🕷️</div>';
    return bar(p.n, POP_ROUNDS) +
      '<div class="card center gcard">' + cue + '<button class="iconbtn big" data-act="gagain" aria-label="Hear again">🔊</button><div class="gprompt">' + esc(popPrompt(ctx, g, t)) + '</div></div>' +
      '<div class="balloons">' + p.opts.map((o, i) => {
        const col = g.sec === 'colors' ? o.c : g.sec === 'shapes' ? '#ffffff' : BALLOON[(i + (p.n * 2)) % BALLOON.length];
        return '<button class="balloon" data-act="gpop" data-id="' + esc(o.id) + '" style="--c:' + col + ';--d:' + (i * 0.35) + 's" aria-label="' + esc(g.sec === 'letters' ? 'Letter ' + o.l : (g.sec === 'colors' ? itemName(ctx, g, o) + (esOn(ctx, g) ? '' : ' balloon') : itemName(ctx, g, o))) + '">' + balloonFace(g, o) + '</button>';
      }).join('') + '</div>';
  }
  function promptSay(ctx, g) {
    const t = g.pop.target; const f = F();
    if (g.game === 'sound') return f.say(ctx, g.pop.word + '. ' + popPrompt(ctx, g, t), 'en-US', false, true);
    if (g.game === 'add') return f.say(ctx, popPrompt(ctx, g, t), 'en-US', false, true);
    if (sentenceOn(ctx, g, t)) return f.say(ctx, popPrompt(ctx, g, t), g.lang === 'tl' ? t.tl.tag : 'en-US');
    if (g.sec === 'letters') return f.say(ctx, popPrompt(ctx, g, t), 'en-US', false, true);
    if (g.sec === 'words' && g.lang === 'tl') return f.say(ctx, t.tl.text, t.tl.tag);
    if (esOn(ctx, g)) return f.say(ctx, popPrompt(ctx, g, t), ctx.LBY.es.tts);
    return f.say(ctx, popPrompt(ctx, g, t), 'en-US');
  }

  /* ---------- drag boards (match it, build a word) and the counting basket ---------- */
  function newBoard(ctx, g, kind) {
    let tiles = []; let slots = [];
    if (kind === 'drag') {
      const items = pickNeedy(ctx, g, itemsFor(ctx, g), 3);
      if (g.sec === 'letters') {
        tiles = shuffle(items.map((x) => ({ key: 't' + x.l, match: x.l, html: '<b>' + x.l + '</b>' })));
        slots = shuffle(items.map((x) => ({ key: 's' + x.l, match: x.l, empty: '<b>' + x.lo + '</b>', filled: '<b>' + x.l + x.lo + '</b>' })));
      } else if (g.sec === 'numbers') {
        const things = pick(SA.countThings, 3);
        tiles = shuffle(items.map((x) => ({ key: 't' + x.id, match: x.id, html: '<b>' + x.n + '</b>', it: x })));
        slots = shuffle(items.map((x, i) => ({ key: 's' + x.id, match: x.id, cls: 'big' + (x.n > 10 ? ' huge' : ''), empty: group(x.n, things[i].e), filled: group(x.n, things[i].e) + '<b class="dg">' + x.n + '</b>', it: x })));
      } else if (g.sec === 'colors') {
        const cs = items.filter((x) => x.id !== 'white');
        tiles = shuffle(cs.map((x) => ({ key: 't' + x.id, match: x.id, html: swatch(x.c, false), it: x })));
        slots = shuffle(cs.map((x) => ({ key: 's' + x.id, match: x.id, empty: swatch(x.c, true), filled: swatch(x.c, false), it: x })));
      } else if (g.sec === 'shapes') {
        tiles = shuffle(items.map((x) => ({ key: 't' + x.id, match: x.id, html: shapeSvg(x, x.c), it: x })));
        slots = shuffle(items.map((x) => ({ key: 's' + x.id, match: x.id, empty: shapeSvg(x, INK, true), filled: shapeSvg(x, x.c), it: x })));
      } else {
        tiles = shuffle(items.map((x) => ({ key: 't' + x.id, match: x.id, html: '<b class="em">' + x.e + '</b>', it: x })));
        slots = shuffle(items.map((x) => ({ key: 's' + x.id, match: x.id, empty: '<b class="em shadow">' + x.e + '</b>', filled: '<b class="em">' + x.e + '</b>', it: x })));
      }
      g.board = { kind, tiles, slots, filled: {}, word: null, done: false };
    } else if (kind === 'build') {
      const L = LV(ctx, g.sec); const lo = L >= 3 ? 5 : L === 2 ? 4 : 3; const hi = L >= 3 ? 6 : L === 2 ? 5 : 4;
      const okLen = (w) => /^[a-z]+$/i.test(w) && w.length >= lo && w.length <= hi;
      const list = g.sec === 'words' ? wordItems(ctx).filter((w) => okLen(w.en)).map((w) => ({ w: w.en.toLowerCase(), e: w.e })) : [];
      const bank = SA.spellWords.concat(SA.spellWords2 || []);
      const lvlList = bank.filter((x) => okLen(x.w));
      const src = list.length >= 3 ? list : (lvlList.length >= 3 ? lvlList : bank);
      const last = g.board && g.board.word ? g.board.word.w : '';
      const word = pick(src.filter((x) => x.w !== last), 1)[0] || src[0];
      const chars = word.w.split('');
      slots = chars.map((c, i) => ({ key: 's' + i, match: c, fixed: g.easy && i > 0, empty: '<b></b>', filled: '<b>' + c + '</b>' }));
      const need = slots.filter((s) => !s.fixed).map((s) => s.match);
      const extra = pick(ALPHA.filter((c) => chars.indexOf(c) < 0), 2);
      tiles = shuffle(need.concat(extra).map((c, j) => ({ key: 't' + j, match: c, html: '<b>' + c + '</b>' })));
      g.board = { kind, tiles, slots, filled: {}, word, done: false };
      slots.forEach((s) => { if (s.fixed) g.board.filled[s.key] = '*'; });
    } else { // count
      const max = rangeMax(ctx);
      const last = g.board && g.board.n ? g.board.n : 0;
      const cand = SA.numbers.filter((x) => x.n <= max && x.n !== last);
      const needy = g.practice ? cand.filter((x) => winsOf(ctx, 'numbers', String(x.n)) < 3) : cand;
      const num = pick(needy.length ? needy : cand, 1)[0] || SA.numbers[2];
      const thing = pick(SA.countThings, 1)[0];
      const total = Math.min(num.n + 2, 22);
      g.board = { kind: 'count', n: num.n, thing, tiles: Array.from({ length: total }, (_, i) => ({ key: 't' + i, match: 'x', html: '<b class="em">' + thing.e + '</b>' })), placed: {}, count: 0, done: false };
    }
    g.sel = null; g.lock = false; g.tok++;
  }
  function boardView(ctx, g) {
    const esc = ctx.esc; const b = g.board; const placed = {};
    Object.keys(b.filled).forEach((k) => { if (b.filled[k] !== '*') placed[b.filled[k]] = true; });
    let top;
    if (b.kind === 'build') top = '<div class="big-em">' + b.word.e + '</div><div class="gprompt">Spell it!</div>' + (b.done ? '<div class="big-word">' + esc(b.word.w) + '</div>' : '');
    else top = '<div class="gprompt">' + ({ letters: 'Drag each big letter to its little letter!', numbers: 'Drag each number to its group!', colors: 'Drag each color to its circle!', shapes: 'Drag each shape to its shadow!', words: 'Drag each picture to its shadow!' })[g.sec] + '</div>';
    const slots = b.slots.map((s) => {
      const f = b.filled[s.key]; const cls = s.cls ? ' ' + s.cls : '';
      if (f) return '<div class="slot ok' + cls + (s.fixed ? ' fixed' : '') + '" data-key="' + s.key + '">' + s.filled + '</div>';
      return '<button class="slot' + cls + '" data-act="gslot" data-key="' + s.key + '" data-match="' + esc(s.match) + '" aria-label="Empty spot">' + s.empty + '</button>';
    }).join('');
    const tiles = b.tiles.map((t) => placed[t.key] ? '' : '<div class="tile' + (g.sel === t.key ? ' sel' : '') + '" data-key="' + t.key + '" data-match="' + esc(t.match) + '" role="button" tabindex="0">' + t.html + '</div>').join('');
    const need = b.slots.filter((s) => !s.fixed); const got = need.filter((s) => b.filled[s.key]).length;
    return bar(got, need.length) +
      '<div class="card center gcard">' + top + '</div>' +
      '<div class="slots' + (b.kind === 'build' ? ' build' : '') + '">' + slots + '</div><div class="tiles">' + tiles + '</div>';
  }
  function countPrompt(ctx, g, b) { return 'Put ' + SA.numbers[b.n - 1].en + ' ' + (b.n === 1 ? b.thing.s : b.thing.p) + ' in the basket!'; }
  function countView(ctx, g) {
    const esc = ctx.esc; const b = g.board;
    const inBasket = b.tiles.filter((t) => b.placed[t.key]).map((t) => t.html).join('');
    const tiles = b.tiles.map((t) => b.placed[t.key] ? '' : '<div class="tile sm' + (b.tiles.length > 12 ? ' xs' : '') + (g.sel === t.key ? ' sel' : '') + '" data-key="' + t.key + '" data-match="x" role="button" tabindex="0">' + t.html + '</div>').join('');
    return bar(b.count, b.n) +
      '<div class="card center gcard"><div class="cue"><span class="cue-n">' + b.n + '</span><span class="cue-e">' + b.thing.e + '</span></div><button class="iconbtn big" data-act="gagain" aria-label="Hear again">🔊</button><div class="gprompt">' + esc(countPrompt(ctx, g, b)) + '</div></div>' +
      '<div class="slots"><button class="slot basket" data-act="gslot" data-key="basket" aria-label="Basket"><span class="bk-items">' + inBasket + '</span><b class="bk-n">' + (b.count || '') + '</b></button></div>' +
      '<div class="tiles">' + tiles + '</div>';
  }
  function boardComplete(b) { return b.slots.every((s) => b.filled[s.key]); }

  /* ---------- sing it: original chants with a clap button ---------- */
  function newSing(ctx, g) {
    const lines = [];
    if (g.sec === 'numbers') {
      const es = g.lang === 'tl' && focus(ctx) === 'es'; const tag = es ? ctx.LBY.es.tts : 'en-US';
      const max = Math.min(rangeMax(ctx), 10);
      SA.numbers.filter((x) => x.n <= max).forEach((x) => lines.push({ t: (es ? x.es : x.en) + '!', tag, html: '<b>' + x.n + '</b> ' + (es ? x.es : x.en) }));
      lines.push({ t: 'Clap, clap, clap!', tag: 'en-US', html: '👏 Clap, clap, clap!' });
      g.sing = { it: null, big: '🔢', lines, claps: 0, playing: false, last: '' };
      return;
    }
    const items = wordItems(ctx); const last = g.sing ? g.sing.last : '';
    const it = pick(items.filter((x) => x.id !== last), 1)[0] || items[0];
    const W = it.en;
    if (g.lang === 'tl') {
      const T = it.tl.text; const tag = it.tl.tag;
      if (focus(ctx) === 'es') { lines.push({ t: '¡' + T + ', ' + T + ', ' + T + '!', tag }, { t: 'Clap, clap, clap!', tag: 'en-US' }); }
      else lines.push({ t: T + ', ' + T + ', ' + T + '!', tag });
    } else {
      lines.push({ t: W + ', ' + W + ', ' + W + '!', tag: 'en-US' }, { t: 'I see the ' + W + '. Clap, clap, clap!', tag: 'en-US' }, { t: 'Hello, ' + W + '! Wave bye-bye!', tag: 'en-US' });
    }
    lines.forEach((l) => { l.t = l.t.charAt(0).toUpperCase() + l.t.slice(1); l.html = ctx.esc(l.t); });
    g.sing = { it, big: it.e, lines, claps: 0, playing: false, last: it.id };
  }
  function singView(ctx, g) {
    const sg = g.sing; const isNum = g.sec === 'numbers';
    return bar(0, 0) +
      '<div class="card center play-card"><div class="big-em">' + sg.big + '</div>' +
      '<div class="row" style="justify-content:center"><button class="btn" data-act="gsing">▶ Sing with me</button><button class="btn sun" data-act="gclap" id="clapBtn">👏 Clap!</button></div>' +
      '<p class="small muted" style="margin:6px 0 0">Claps: <b id="clapN">' + sg.claps + '</b></p>' +
      '<div class="clines">' + sg.lines.map((l, i) => '<div class="cline" data-i="' + i + '">' + l.html + '</div>').join('') + '</div>' +
      (isNum ? '' : '<div class="row" style="justify-content:center"><button class="btn alt small" data-act="gnextsong">➡ Next word</button></div>') + '</div>';
  }
  function highlight(i) { Array.prototype.forEach.call(document.querySelectorAll('.cline'), (el, k) => el.classList.toggle('on', k === i)); }
  function singAlong(ctx, g) {
    const sg = g.sing; if (!sg || sg.playing) return; sg.playing = true; const tok = g.tok; let i = 0;
    const alive = () => g.tok === tok && g.screen === 'play' && g.game === 'sing';
    const step = () => {
      if (!alive()) { sg.playing = false; return; }
      if (i >= sg.lines.length) { sg.playing = false; highlight(-1); finish(ctx, g); return; }
      highlight(i); const L = sg.lines[i]; let called = false;
      const next = () => { if (called) return; called = true; i += 1; setTimeout(step, 250); };
      const ok = SA.kid.sing(ctx, L.t, L.tag, next);
      setTimeout(next, ok ? 12000 : 1800);
    };
    step();
  }

  /* ---------- finish screen ---------- */
  function doneView(ctx, g) {
    const st = ctx.state;
    const pd = g.path ? '<div class="dots" style="justify-content:center;margin:6px 0">' + g.path.steps.map((x, i) => '<i class="' + (i <= g.path.i ? 'on' : '') + '"></i>').join('') + '</div>' : '';
    return '<div class="card hero center"><div class="big-em">🎉</div>' + pd + '<b style="font-size:28px">' + (g.full ? 'A whole rainbow!' : 'You did it!') + '</b>' + (previewing(ctx) ? '' : rainbow(st.rbBands || 0) +
      '<div class="small muted">' + (g.full ? 'Rainbows made: ' + (st.rainbows || 0) : (st.rbBands || 0) + ' of 7 colors') + '</div>') +
      '<div class="row" style="justify-content:center;margin-top:10px"><button class="btn alt iconbtn big" data-act="ghub" aria-label="Games">🏠</button><button class="btn sun iconbtn big" data-act="' + (g.path ? 'gpathnext' : 'gagain-game') + '" aria-label="' + (g.path ? 'Next' : 'Play again') + '">▶</button></div></div>';
  }

  G.view = function (ctx) {
    const g = GS(ctx); const child = ctx.isChild();
    if (!child && !g.preview) return '<h2>Game settings</h2>' + settingsView(ctx);
    if (g.screen !== 'play') sync(ctx, g);
    let h = previewBar(ctx);
    if (g.screen === 'hub') h += '<h2>Games</h2>';
    if (g.screen === 'letter') return h + letterCard(ctx, g);
    if (g.screen === 'lgrid') return h + lgridView(ctx, g);
    if (g.screen === 'skills') return h + SA.skills.view(ctx);
    if (g.screen === 'sec') return h + secView(ctx, g);
    if (g.screen === 'done') return h + doneView(ctx, g);
    if (g.screen === 'play') {
      if (g.game === 'pop' || g.game === 'sound' || g.game === 'add') return h + popView(ctx, g);
      if (g.game === 'count') return h + countView(ctx, g);
      if (g.game === 'sing') return h + singView(ctx, g);
      return h + boardView(ctx, g);
    }
    return h + hub(ctx, g);
  };

  /* ---------- flow ---------- */
  function startGame(ctx, g, which) {
    sync(ctx, g);
    if (g.sec === 'words' && wordItems(ctx).length < 4) { ctx.toast('This unit needs at least 4 words.'); return; }
    if (gamesFor(ctx, g.sec).indexOf(which) < 0) return;
    if (g.practice && (which === 'pop' || which === 'drag' || which === 'count' || which === 'sound')) { const all = itemsFor(ctx, g); if (all.length && all.every((x) => winsOf(ctx, g.sec, x.id) >= 3)) ctx.toast('Everything here is mastered! Playing with everything.'); }
    g.game = which; g.screen = 'play'; g.full = false;
    if (which === 'pop' || which === 'sound' || which === 'add') { g.pop = null; newPop(ctx, g); }
    else if (which === 'sing') { g.sing = null; newSing(ctx, g); g.tok++; }
    else { g.board = null; newBoard(ctx, g, which); }
    ctx.render(false);
    g.told = g.told || {}; const hk = howKey(g); const first = !g.told[hk] && helpOn(ctx); g.told[hk] = true;
    const tok = g.tok;
    if (first) {
      /* instructions first; the balloon or basket prompt follows when they finish (or "Hear again" any time) */
      sayHow(ctx, g, hk, (which === 'pop' || which === 'sound' || which === 'add' || which === 'count') ? () => { if (g.tok === tok && g.screen === 'play') promptSayAny(ctx, g); } : null);
    } else if (which === 'pop' || which === 'sound' || which === 'add' || which === 'count') setTimeout(() => { if (g.tok === tok && g.screen === 'play') promptSayAny(ctx, g); }, 250);
  }
  function promptSayAny(ctx, g) {
    if ((g.game === 'pop' || g.game === 'sound' || g.game === 'add') && g.pop) return promptSay(ctx, g);
    if (g.game === 'count' && g.board) return F().say(ctx, countPrompt(ctx, g, g.board), 'en-US', false, true);
    return false;
  }
  /* Guided path: a short walk through the day's games, one after another. */
  function buildPath(ctx) {
    const c = cfg(ctx); const want = [['letters', 'pop'], ['numbers', 'pop'], ['words', 'drag'], ['colors', 'pop'], ['shapes', 'drag'], ['numbers', 'sing']];
    const g = GS(ctx); const keep = g.sec; const out = [];
    want.forEach((w) => { if (c.secs[w[0]]) { g.sec = w[0]; if (gamesFor(ctx, w[0]).indexOf(w[1]) >= 0) out.push({ sec: w[0], game: w[1] }); } });
    g.sec = keep; return out.slice(0, 5);
  }
  function pathStep(ctx, g) {
    const st = g.path.steps[g.path.i]; g.sec = st.sec; startGame(ctx, g, st.game);
  }
  function finish(ctx, g) {
    g.full = reward(ctx); g.screen = 'done'; sYay(); ctx.render(false);
    if (g.full) F().say(ctx, 'Wow! A rainbow!', 'en-US'); else F().say(ctx, praise(ctx, g, false), 'en-US');
  }
  function later(g, ms, fn) { const tok = g.tok; setTimeout(() => { if (g.tok === tok && g.screen === 'play') fn(); }, ms); }

  function placeCount(ctx, g, tileEl) {
    const b = g.board; if (!b || g.lock || b.done) return false;
    const tile = b.tiles.find((t) => t.key === tileEl.dataset.key); if (!tile || b.placed[tile.key]) return false;
    b.placed[tile.key] = true; b.count += 1; g.sel = null; sPop();
    const lastOne = b.count >= b.n; const sp = praise(ctx, g, !lastOne); ctx.toast(sp);
    if (esOn(ctx, g)) thenPraise(ctx, numWord(ctx, g, b.count), ctx.LBY.es.tts, sp, true); else F().say(ctx, numWord(ctx, g, b.count) + '! ' + sp, 'en-US', false, true);
    if (b.count >= b.n) {
      b.done = true; g.lock = true; win(ctx, 'numbers', String(b.n));
      ctx.render(true); later(g, 2600, () => finish(ctx, g)); return true;
    }
    ctx.render(true); return true;
  }
  function place(ctx, g, tileEl, slotEl) {
    const b = g.board; if (!b || g.lock) return false;
    if (b.kind === 'count') return placeCount(ctx, g, tileEl);
    const tile = b.tiles.find((t) => t.key === tileEl.dataset.key); const slot = b.slots.find((s) => s.key === slotEl.dataset.key);
    if (!tile || !slot || b.filled[slot.key]) return false;
    if (tile.match !== slot.match) {
      sNo(); slotEl.classList.add('wobble'); setTimeout(() => slotEl.classList.remove('wobble'), 500);
      if (b.kind === 'build') F().say(ctx, 'That is the letter ' + tile.match.toUpperCase() + '. Try again!', 'en-US', false, true);
      else sayWrong(ctx, g, tile.it || { l: tile.match });
      return false;
    }
    b.filled[slot.key] = tile.key; g.sel = null; sPop();
    if (b.kind === 'drag') win(ctx, g.sec, slot.match);
    if (b.kind === 'build') { const p = praise(ctx, g, true); ctx.toast(p); F().say(ctx, 'Letter ' + tile.match.toUpperCase() + '! ' + p, 'en-US', false, true); }
    else if (slot.it) sayRight(ctx, g, slot.it);
    else sayRight(ctx, g, { l: slot.match, id: slot.match });
    if (boardComplete(b)) {
      b.done = true; g.lock = true;
      if (b.kind === 'build') setTimeout(() => F().say(ctx, b.word.w + '! ' + praise(ctx, g, false), 'en-US'), 900);
      ctx.render(true); later(g, 1900, () => finish(ctx, g)); return true;
    }
    ctx.render(true); return true;
  }

  /* Start one game directly (used by Learn > Today). Returns false when that section is turned off. */
  G.launch = function (ctx, sec, game) {
    const g = GS(ctx); if (!cfg(ctx).secs[sec]) return false;
    g.sec = sec; g.path = null; if (gamesFor(ctx, sec).indexOf(game) < 0) return false;
    startGame(ctx, g, game); return true;
  };
  G.handle = function (a, d, ctx) {
    const g = GS(ctx); const f = F();
    if (a === 'gskills' || a.indexOf('gsk-') === 0) { SA.kid.stop(); g.path = null; return SA.skills.handle(a, d, ctx, g); }
    if (a === 'ghub' || a === 'gexit' || a === 'gback' || a === 'gsec' || a === 'gtopic') { SA.kid.stop(); g.path = null; }
    switch (a) {
      case 'gsec': { g.sec = d.s; g.screen = 'sec'; ctx.render(false); const nm = ({ letters: 'Letters', numbers: 'Numbers', colors: 'Colors', shapes: 'Shapes' })[d.s] || (f.unitOf(ctx).name + ' words'); f.say(ctx, nm, 'en-US', false, true); return true; }
      case 'gtoggle': { const c = cfg(ctx); c.secs[d.s] = !c.secs[d.s]; if (!SECS.some((k) => c.secs[k])) c.secs[d.s] = true; ctx.save(); ctx.render(true); return true; }
      case 'glang': cfg(ctx).lang = d.l; ctx.save(); ctx.render(true); return true;
      case 'grange': cfg(ctx).range = d.r; ctx.save(); ctx.render(true); return true;
      case 'geasy': cfg(ctx).easy = d.e; ctx.save(); ctx.render(true); return true;
      case 'gboost': cfg(ctx).boost = d.b; ctx.save(); ctx.render(true); return true;
      case 'gprac': cfg(ctx).practice = d.p === '1'; ctx.save(); ctx.render(true); return true;
      case 'gpreview': g.preview = true; g.screen = 'hub'; g.game = null; g.tok++; ctx.render(false); return true;
      case 'gexit': g.preview = false; g.screen = 'hub'; g.game = null; g.tok++; g.lock = false; if (ctx.rec.active()) ctx.rec.stop(); try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { /* ignore */ } ctx.render(false); return true;
      case 'gtopic': { S_fun_unit(ctx, d.id); g.sec = 'words'; g.screen = 'sec'; ctx.render(false); f.say(ctx, f.unitOf(ctx).name, 'en-US', false, true); return true; }
      case 'glgrid': g.screen = 'lgrid'; ctx.render(false); return true;
      case 'ghub': g.screen = 'hub'; g.game = null; g.tok++; ctx.render(false); return true;
      case 'gstart': g.path = null; startGame(ctx, g, d.g); return true;
      case 'gpath': { const steps = buildPath(ctx); if (!steps.length) return true; g.path = { steps, i: 0 }; f.say(ctx, 'Let us go!', 'en-US', false, true); pathStep(ctx, g); return true; }
      case 'gpathnext': {
        if (!g.path) return true; g.path.i += 1;
        if (g.path.i >= g.path.steps.length) { ctx.state.pathDays = ctx.state.pathDays || []; if (ctx.state.pathDays.indexOf(ctx.dkey()) < 0) ctx.state.pathDays.push(ctx.dkey()); ctx.save(); g.path = null; g.screen = 'hub'; g.game = null; g.tok++; ctx.render(false); f.say(ctx, 'You did it! All done!', 'en-US', false, true); return true; }
        pathStep(ctx, g); return true;
      }
      case 'ghow': sayHow(ctx, g, howKey(g)); return true;
      case 'ghelp': ctx.state.gameHelp = d.v === '1'; ctx.save(); ctx.render(true); return true;
      case 'gback':
        g.screen = g.screen === 'letter' ? 'lgrid' : (g.screen === 'lgrid' || g.screen === 'play' || g.screen === 'done') ? 'sec' : 'hub'; g.game = null; g.tok++; g.lock = false; if (ctx.rec.active()) ctx.rec.stop();
        try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { /* ignore */ }
        ctx.render(false); return true;
      case 'gagain': promptSayAny(ctx, g); return true;
      case 'gagain-game': startGame(ctx, g, g.game); return true;
      case 'gletter': if (ctx.rec.active()) ctx.rec.stop(); g.letter = +d.i; g.screen = 'letter'; ctx.render(false); f.say(ctx, letterPhrase(letterItems()[g.letter]), 'en-US', false, true); return true;
      case 'gletternav': if (ctx.rec.active()) ctx.rec.stop(); g.letter = (g.letter + (+d.d) + 26) % 26; ctx.render(true); f.say(ctx, letterPhrase(letterItems()[g.letter]), 'en-US', false, true); return true;
      case 'gsayletter': f.say(ctx, letterPhrase(letterItems()[g.letter]), 'en-US', d.slow === '1', true); return true;
      case 'gsing': singAlong(ctx, g); return true;
      case 'gnextsong': if (g.sing && g.sing.playing) return true; newSing(ctx, g); g.tok++; ctx.render(true); return true;
      case 'gclap': {
        sClap(); if (g.sing) { g.sing.claps += 1; const n = document.getElementById('clapN'); if (n) n.textContent = g.sing.claps; }
        const btn = document.getElementById('clapBtn'); if (btn) { btn.classList.remove('wobble'); void btn.offsetWidth; btn.classList.add('wobble'); setTimeout(() => btn.classList.remove('wobble'), 450); }
        return true;
      }
      case 'gpop': {
        const p = g.pop; if (!p || g.lock) return true;
        const el = document.querySelector('.balloon[data-id="' + (window.CSS && CSS.escape ? CSS.escape(d.id) : d.id) + '"]');
        const it = p.opts.find((o) => o.id === d.id);
        if (d.id !== p.target.id) { sNo(); if (el) { el.classList.add('wobble'); setTimeout(() => el.classList.remove('wobble'), 500); } sayWrong(ctx, g, it); return true; }
        g.lock = true; sPop(); if (el) el.classList.add('popped');
        win(ctx, g.sec, it.id);
        setTimeout(() => sayRight(ctx, g, it), 150);
        p.n += 1;
        later(g, 1300, () => { if (p.n >= POP_ROUNDS) finish(ctx, g); else { newPop(ctx, g); ctx.render(false); setTimeout(() => promptSay(ctx, g), 250); } });
        return true;
      }
      case 'gslot': {
        const b = g.board; if (!b || !g.sel) { f.say(ctx, 'Pick a piece first!', 'en-US'); return true; }
        const tileEl = document.querySelector('.tile[data-key="' + g.sel + '"]'); const slotEl = document.querySelector('.slot[data-key="' + d.key + '"]');
        if (tileEl && slotEl) place(ctx, g, tileEl, slotEl);
        return true;
      }
      default: return false;
    }
  };

  /* ---------- drag with pointer events (works with touch and mouse) ---------- */
  G.api = { get reward() { return reward; }, get sYay() { return sYay; }, get sNo() { return sNo; }, get praise() { return praise; }, get previewing() { return previewing; }, get rainbow() { return rainbow; }, get beep() { return beep; } };
  G.mount = function (ctx) {
    if (SA.skills && SA.skills.mount) SA.skills.mount(ctx);
    const view = document.getElementById('view'); let drag = null;
    function snapBack(el) { el.style.transition = 'transform .2s'; el.style.transform = ''; setTimeout(() => { el.style.transition = ''; }, 220); }
    view.addEventListener('pointerdown', (e) => {
      const t = e.target.closest ? e.target.closest('.tile') : null; if (!t) return;
      drag = { el: t, sx: e.clientX, sy: e.clientY, moved: false, id: e.pointerId };
      try { t.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ }
    });
    view.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.sx; const dy = e.clientY - drag.sy;
      if (!drag.moved && Math.abs(dx) + Math.abs(dy) > 8) { drag.moved = true; drag.el.classList.add('lift'); }
      if (drag.moved) drag.el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(1.12)';
    });
    function end(e, cancel) {
      if (!drag || e.pointerId !== drag.id) return;
      const t = drag.el; const moved = drag.moved; drag = null; t.classList.remove('lift');
      const g = GS(ctx);
      if (!moved) { // a tap: select the piece and say what it is
        t.style.transform = '';
        if (cancel || !g.board) return;
        g.sel = t.dataset.key; Array.prototype.forEach.call(view.querySelectorAll('.tile'), (x) => x.classList.toggle('sel', x === t));
        const tile = g.board.tiles.find((x) => x.key === g.sel);
        if (tile && g.board.kind !== 'count') { if (g.board.kind === 'build') F().say(ctx, tile.match, 'en-US', false, true); else if (tile.it) sayItem(ctx, g, tile.it); else sayItem(ctx, g, { l: tile.match, id: tile.match }); }
        return;
      }
      if (cancel) { snapBack(t); return; }
      t.style.pointerEvents = 'none';
      const under = document.elementFromPoint(e.clientX, e.clientY); t.style.pointerEvents = '';
      const slot = under && under.closest ? under.closest('.slot[data-act="gslot"]') : null;
      if (slot && place(ctx, g, t, slot)) return;
      snapBack(t);
    }
    view.addEventListener('pointerup', (e) => end(e, false));
    view.addEventListener('pointercancel', (e) => end(e, true));
  };
})();
