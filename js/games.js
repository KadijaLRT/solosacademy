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
  const BALLOON = ['#ff4d6d', '#3a86ff', '#ffd23f', '#2ec4b6', '#ff9f1c', '#8338ec'];
  const BANDS = ['#ff3b30', '#ff9500', '#ffd60a', '#34c759', '#0a84ff', '#5e5ce6', '#bf5af2'];
  const ALPHA = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const POP_ROUNDS = 5;
  const INK = '#2b2250';
  const GAME_DEF = { pop: ['🎈', 'Pop it!'], drag: ['🧩', 'Match it!'], build: ['🔨', 'Build a word'], count: ['🧺', 'Count it!'], sing: ['🎵', 'Sing it!'] };
  const SEC_GAMES = { letters: ['pop', 'drag', 'build'], numbers: ['pop', 'drag', 'count', 'sing'], colors: ['pop', 'drag'], shapes: ['pop', 'drag'], words: ['pop', 'drag', 'build', 'sing'] };
  const SUFFIX = { letters: 'L', words: 'W', numbers: 'N', colors: 'C', shapes: 'S' };

  function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = b[i]; b[i] = b[j]; b[j] = t; } return b; }
  function pick(a, n) { return shuffle(a).slice(0, n); }
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
    if (c.range !== '10') c.range = '5';
    if (c.easy === undefined) c.easy = true;
    c.practice = !!c.practice;
    return c;
  }
  function sync(ctx, g) {
    const c = cfg(ctx); g.lang = c.lang; g.range = c.range; g.easy = c.easy; g.practice = c.practice;
    if (!c.secs[g.sec]) g.sec = SECS.filter((k) => c.secs[k])[0];
  }
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
    return f.wordsOf(ctx, u).map((w) => ({ id: w.en, e: w.emoji, en: w.en, tl: f.tlFor(ctx, w) }));
  }
  function letterItems() { return SA.letters.map((x) => ({ id: x.l, l: x.l, lo: x.l.toLowerCase(), w: x.w, e: x.e, end: !!x.end })); }
  function numItems(g) { const max = g.range === '10' ? 10 : 5; return SA.numbers.filter((x) => x.n <= max).map((x) => ({ id: String(x.n), n: x.n, en: x.en, es: x.es })); }
  const colorItems = () => SA.colors.map((x) => ({ id: x.id, en: x.en, es: x.es, c: x.c }));
  const shapeItems = () => SA.shapes.map((x) => ({ id: x.id, en: x.en, es: x.es, c: x.c, svg: x.svg }));
  function itemsFor(ctx, g) {
    switch (g.sec) { case 'letters': return letterItems(); case 'numbers': return numItems(g); case 'colors': return colorItems(); case 'shapes': return shapeItems(); default: return wordItems(ctx); }
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
  function thenPraise(ctx, text, tag, p, plain) {
    const f = F(); let called = false;
    const go = () => { if (called) return; called = true; f.say(ctx, p, 'en-US', false, true); };
    const ok = f.say(ctx, text, tag, false, !!plain, go);
    setTimeout(go, ok ? 2800 : 100); return true;
  }
  /* Say what she got right, then praise her in English (also shown on screen). */
  function sayRight(ctx, g, it) {
    const f = F(); const p = praise(ctx, g, false); ctx.toast(p + ' ⭐');
    if (g.sec === 'letters') return f.say(ctx, 'Letter ' + it.l + '! ' + p, 'en-US', false, true);
    if (g.sec === 'words') {
      if (g.lang === 'tl') return thenPraise(ctx, it.tl.text, it.tl.tag, p, false);
      return f.say(ctx, it.en + '! ' + p, 'en-US');
    }
    if (esOn(ctx, g)) return thenPraise(ctx, it.es, ctx.LBY.es.tts, p, false);
    return f.say(ctx, it.en + '! ' + p, 'en-US');
  }
  /* Wrong try: say what she picked, then ask her to try again. */
  function sayWrong(ctx, g, it) {
    const f = F(); const es = focus(ctx) === 'es' && g.lang === 'tl'; let text; let tag = 'en-US';
    if (g.sec === 'letters') text = 'That is the letter ' + it.l.toUpperCase() + '. Try again!';
    else if (g.sec === 'words') {
      if (g.lang === 'tl') { tag = it.tl.tag; text = es ? 'Eso es ' + it.tl.text + '. ¡Inténtalo otra vez!' : it.tl.text; }
      else text = 'That is the ' + it.en + '. Try again!';
    } else if (es) { tag = ctx.LBY.es.tts; text = it.es + '. ¡Inténtalo otra vez!'; }
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
  function winKey(ctx, sec, id) { return sec === 'words' ? 'words:' + ctx.state.unit + ':' + id : sec + ':' + id; }
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
    hub: ['Pick a game! Pop balloons, match things, count, sing, or build a word. Finish a game to add a color to your rainbow.', 'Elige un juego. Revienta globos, empareja, cuenta o canta. Al terminar un juego, ganas un color del arcoíris.'],
    popL: ['Pop the balloon with the letter I say. Tap the right balloon. Pop five balloons to add a color to your rainbow!', null],
    popW: ['Listen to the word. Tap the balloon with the right picture. Pop five balloons to add a color to your rainbow!', 'Escucha la palabra. Toca el globo con el dibujo correcto. ¡Revienta cinco globos y gana un color del arcoíris!'],
    popN: ['Listen to the number I say. Tap the balloon with that number. Pop five balloons to add a color to your rainbow!', 'Escucha el número. Toca el globo con ese número. ¡Revienta cinco globos y gana un color del arcoíris!'],
    popC: ['Listen to the color I say. Tap the balloon that is that color. Pop five balloons to add a color to your rainbow!', 'Escucha el color. Toca el globo de ese color. ¡Revienta cinco globos y gana un color del arcoíris!'],
    popS: ['Listen to the shape I say. Tap the balloon with that shape. Pop five balloons to add a color to your rainbow!', 'Escucha la forma. Toca el globo con esa forma. ¡Revienta cinco globos y gana un color del arcoíris!'],
    dragL: ['Drag each big letter to its little letter. You can also tap a big letter, then tap its spot.', null],
    dragW: ['Drag each picture to its shadow. You can also tap a picture, then tap its shadow.', 'Arrastra cada dibujo a su sombra. También puedes tocar el dibujo y luego su sombra.'],
    dragN: ['Drag each number to the group with that many things. You can also tap a number, then tap its group.', 'Arrastra cada número al grupo que tiene esa cantidad. También puedes tocar el número y luego su grupo.'],
    dragC: ['Drag each color to the circle with the same color. You can also tap a color, then tap its circle.', 'Arrastra cada color al círculo del mismo color. También puedes tocar el color y luego su círculo.'],
    dragS: ['Drag each shape to its shadow. You can also tap a shape, then tap its shadow.', 'Arrastra cada forma a su sombra. También puedes tocar la forma y luego su sombra.'],
    build: ['Look at the picture. Drag the missing letters into the empty boxes to spell the word.', null],
    count: ['Put the right number of things in the basket. Drag them in one at a time and count out loud with me!', 'Pon la cantidad correcta en la canasta. Arrástralos uno por uno y cuenta conmigo.'],
    sing: ['Press the sing button and sing along with me. Press the clap button to clap!', 'Toca el botón de cantar y canta conmigo. Toca el botón de aplaudir y aplaude.']
  };
  function howKey(g) {
    if (g.screen !== 'play') return 'hub';
    if (g.game === 'pop' || g.game === 'drag') return g.game + SUFFIX[g.sec];
    return g.game;
  }
  /* Spanish is used only when she is practicing Spanish. Everything else is English. */
  function sayHow(ctx, g, key, onend) {
    const t = HOW[key]; const es = !!t[1] && g.sec !== 'letters' && g.lang === 'tl' && focus(ctx) === 'es';
    return F().say(ctx, es ? t[1] : t[0], es ? ctx.LBY.es.tts : 'en-US', false, true, onend);
  }
  const helpOn = (ctx) => ctx.state.gameHelp !== false;

  /* ---------- parent progress card ---------- */
  function progressCard(ctx) {
    const st = ctx.state; const f = F(); const u = f.unitOf(ctx);
    const defs = [
      ['Letters', 'letters', SA.letters.map((x) => ({ id: x.l, label: x.l }))],
      ['Numbers', 'numbers', SA.numbers.map((x) => ({ id: String(x.n), label: String(x.n) }))],
      ['Colors', 'colors', SA.colors.map((x) => ({ id: x.id, label: x.en }))],
      ['Shapes', 'shapes', SA.shapes.map((x) => ({ id: x.id, label: x.en }))],
      [u.name + ' words', 'words', wordItems(ctx).map((x) => ({ id: x.id, label: x.e + ' ' + x.en }))]
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
    const grp = (label, hint, body) => '<div class="srow"><div class="slabel">' + label + '</div>' + body + (hint ? '<div class="small muted">' + hint + '</div>' : '') + '</div>';
    let h = '<div class="card"><b>What she plays</b><p class="small muted">Turn sections on or off. Solana only sees the ones that are on.</p><div class="chips">' +
      SECS.map((k) => '<button class="chip" aria-pressed="' + on(c.secs[k]) + '" data-act="gtoggle" data-s="' + k + '">' + (c.secs[k] ? '✓ ' : '') + secLabel(k, u) + '</button>').join('') + '</div>' +
      '<div class="small muted">Unit words follow the show you picked in the Theme tab.</div></div>';
    h += '<div class="card"><b>How she plays</b>' +
      grp('Say it in', es ? 'Numbers, colors, shapes, and unit words switch to ' + (sample ? sample.tl.name : 'her second language') + '. Praise is always English.' : 'Unit words can use her second language. Numbers, colors, and shapes use Spanish only when Spanish is her focus language.',
        chips(ctx, [['en', '🇺🇸 English'], ['tl', sample ? sample.tl.flag + ' ' + sample.tl.name : '🌎 Second language']], c.lang, 'glang', 'l')) +
      grp('Numbers', 'Used by the Numbers games and Count it.', chips(ctx, [['5', '1 to 5'], ['10', '1 to 10']], c.range, 'grange', 'r')) +
      grp('Build a word', 'Easy gives her the first letter. Hard makes her spell all of it.', chips(ctx, [['1', 'Easy: 1 missing letter'], ['0', 'Hard: spell it all']], c.easy ? '1' : '0', 'geasy', 'e')) +
      grp('Practice', 'Aim the games at letters, numbers, and words she has not mastered yet.', chips(ctx, [['0', '🎲 Everything'], ['1', '🎯 What she is missing']], c.practice ? '1' : '0', 'gprac', 'p')) +
      grp('Spoken instructions', 'A voice explains how to play the first time she opens each game.', chips(ctx, [['1', '🔊 On'], ['0', '🔇 Off']], helpOn(ctx) ? '1' : '0', 'ghelp', 'v')) + '</div>';
    h += '<div class="card center"><button class="btn sun" data-act="gpreview">👀 Try Solana’s games</button><p class="small muted" style="margin-bottom:0">Nothing you do in the preview counts toward her stars or progress.</p></div>';
    h += '<div class="card note"><b>Her device</b><p class="small" style="margin-bottom:0">These choices are saved on this device. To copy them to Solana’s device, make a voice pack in Settings and import it there. It carries your recordings and these game settings.</p></div>';
    return h + progressCard(ctx);
  }

  /* ---------- Solana's view: big and simple ---------- */
  function previewBar(ctx) {
    return previewing(ctx) ? '<div class="pvbar"><span>👀 Preview. Nothing is saved.</span><button class="btn alt small" data-act="gexit">◀ Back to settings</button></div>' : '';
  }
  function hub(ctx, g) {
    const st = ctx.state; const u = F().unitOf(ctx); const c = cfg(ctx); const n = st.rbBands || 0;
    const secs = SECS.filter((k) => c.secs[k]);
    return '<div class="card gtop"><div class="rbcol">' + rainbow(n, true) + '<div class="small muted">' + n + ' of 7 · 🌈 ' + (st.rainbows || 0) + '</div></div>' +
      '<button class="iconbtn" data-act="ghow" aria-label="How to play">❓</button></div>' +
      '<div class="gbtns n4 secs">' + secs.map((k) => '<button class="gbig" data-act="gsec" data-s="' + k + '"><span>' + secLabel(k, u).split(' ')[0] + '</span>' + ctx.esc(secLabel(k, u).split(' ').slice(1).join(' ')) + '</button>').join('') + '</div>';
  }
  function secView(ctx, g) {
    const games = SEC_GAMES[g.sec]; const u = F().unitOf(ctx);
    return '<div class="gbar"><button class="btn alt small" data-act="gback">◀ Back</button><span class="gtitle">' + ctx.esc(secLabel(g.sec, u)) + '</span><button class="iconbtn" data-act="ghow" aria-label="How to play">❓</button></div>' +
      '<div class="gbtns' + (games.length === 4 ? ' n4' : '') + '">' + games.map((k) => '<button class="gbig" data-act="gstart" data-g="' + k + '"><span>' + GAME_DEF[k][0] + '</span>' + GAME_DEF[k][1] + '</button>').join('') + '</div>' +
      (g.sec === 'letters' ? '<button class="gbig wide" data-act="glgrid"><span>🔤</span>See all the letters</button>' : '');
  }
  function lgridView(ctx, g) {
    const wins = ctx.state.letterWins || {};
    return '<div class="gbar"><button class="btn alt small" data-act="gback">◀ Back</button><span class="gtitle">🔤 Letters</span><span></span></div>' +
      '<div class="lgrid">' + SA.letters.map((x, i) => '<button class="lbtn" data-act="gletter" data-i="' + i + '" aria-label="Letter ' + x.l + '">' + x.l + x.l.toLowerCase() + ((wins[x.l] || 0) >= 3 ? '<em>🌈</em>' : '') + '</button>').join('') + '</div>';
  }
  /* top bar inside a game: back, progress dots, and a small help icon */
  function bar(done, total) {
    let dots = '';
    if (total) { dots = '<span class="dots" role="img" aria-label="' + done + ' of ' + total + '">'; for (let i = 0; i < total; i++) dots += '<i class="' + (i < done ? 'on' : '') + '"></i>'; dots += '</span>'; } else dots = '<span></span>';
    return '<div class="gbar"><button class="btn alt small" data-act="gback">◀ Back</button>' + dots + '<button class="iconbtn" data-act="ghow" aria-label="How to play">❓</button></div>';
  }

  /* ---------- letter card ---------- */
  function letterCard(ctx, g) {
    const esc = ctx.esc; const child = ctx.isChild(); const L = SA.letters[g.letter]; const key = 'mom:letter:' + L.l + ':sound';
    const has = ctx.rec.has(key); const on = ctx.rec.active() === key;
    let rec = '';
    if (has) rec += '<button class="btn sun small" data-act="mplay" data-key="' + esc(key) + '">▶ Mom says the sound</button> ';
    if (!child) rec += '<button class="btn ' + (on ? 'coral' : 'alt') + ' small" data-act="mrec" data-key="' + esc(key) + '">' + (on ? '⏹ Stop' : (has ? '🎙 Redo the sound' : '🎙 Record the sound')) + '</button>';
    return '<div class="row between"><button class="btn alt small" data-act="gback">◀ Back</button><span class="pill">Letter ' + L.l + '</span></div>' +
      '<div class="card center play-card"><div class="big-em" style="font-size:96px;line-height:1">' + L.l + L.l.toLowerCase() + '</div>' +
      '<div class="big-em">' + L.e + '</div><div class="big-word">' + esc(L.w) + '</div>' +
      '<p>' + esc(L.end ? L.l + ' is for ' + L.w + ' (it ends with ' + L.l + ')' : L.l + ' is for ' + L.w) + '</p>' +
      '<div class="row" style="justify-content:center"><button class="btn" data-act="gsayletter">🔊 Hear it</button><button class="btn alt" data-act="gsayletter" data-slow="1">🐢 Slow</button></div>' +
      (rec ? '<div style="margin-top:10px">' + rec + '</div>' : '') +
      (child ? '' : '<p class="small muted">Tip: record the letter sound (like “mmm” or “sss”), not the letter name. Phones read single letters aloud as names, so your voice teaches the sound best.</p>') + '</div>' +
      '<div class="row between"><button class="btn alt" data-act="gletternav" data-d="-1" aria-label="Previous letter">◀</button><button class="btn alt" data-act="gletternav" data-d="1" aria-label="Next letter">▶</button></div>';
  }

  /* ---------- pop game ---------- */
  function newPop(ctx, g) {
    const items = itemsFor(ctx, g); const pool = needyOf(ctx, g, items);
    const used = g.pop ? g.pop.used : [];
    const fresh = pool.filter((x) => used.indexOf(x.id) < 0);
    const target = pick(fresh.length ? fresh : pool, 1)[0];
    const others = pick(items.filter((x) => x.id !== target.id), 3);
    g.pop = { n: g.pop ? g.pop.n : 0, used: used.concat([target.id]), target, opts: shuffle([target].concat(others)) };
    g.lock = false; g.tok++;
  }
  function popPrompt(ctx, g, t) {
    const nm = itemName(ctx, g, t); const es = esOn(ctx, g);
    if (g.sec === 'letters') return 'Pop the letter ' + t.l + '!';
    if (g.sec === 'words' && g.lang === 'tl') return nm + '!';
    if (g.sec === 'numbers') return es ? '¡Revienta el número ' + t.es + '!' : 'Pop the number ' + t.en + '!';
    if (g.sec === 'colors') return es ? '¡Revienta el globo ' + t.es + '!' : 'Pop the ' + nm + ' balloon!';
    if (es) return nm + '!';
    return 'Pop the ' + nm + '!';
  }
  function popView(ctx, g) {
    const esc = ctx.esc; const p = g.pop; const t = p.target;
    return bar(p.n, POP_ROUNDS) +
      '<div class="card center gcard"><div class="gprompt">' + esc(popPrompt(ctx, g, t)) + '</div><button class="iconbtn" data-act="gagain" aria-label="Hear again">🔊</button></div>' +
      '<div class="balloons">' + p.opts.map((o, i) => {
        const col = g.sec === 'colors' ? o.c : g.sec === 'shapes' ? '#ffffff' : BALLOON[(i + (p.n * 2)) % BALLOON.length];
        return '<button class="balloon" data-act="gpop" data-id="' + esc(o.id) + '" style="--c:' + col + ';--d:' + (i * 0.35) + 's" aria-label="' + esc(g.sec === 'letters' ? 'Letter ' + o.l : (g.sec === 'colors' ? itemName(ctx, g, o) + (esOn(ctx, g) ? '' : ' balloon') : itemName(ctx, g, o))) + '">' + balloonFace(g, o) + '</button>';
      }).join('') + '</div>';
  }
  function promptSay(ctx, g) {
    const t = g.pop.target; const f = F();
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
        slots = shuffle(items.map((x, i) => ({ key: 's' + x.id, match: x.id, cls: 'big', empty: group(x.n, things[i].e), filled: group(x.n, things[i].e) + '<b class="dg">' + x.n + '</b>', it: x })));
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
      const list = g.sec === 'words' ? wordItems(ctx).filter((w) => /^[a-z]+$/i.test(w.en) && w.en.length >= 3 && w.en.length <= 6).map((w) => ({ w: w.en.toLowerCase(), e: w.e })) : [];
      const src = list.length >= 3 ? list : SA.spellWords;
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
      const max = g.range === '10' ? 10 : 5;
      const last = g.board && g.board.n ? g.board.n : 0;
      const cand = SA.numbers.filter((x) => x.n <= max && x.n !== last);
      const needy = g.practice ? cand.filter((x) => winsOf(ctx, 'numbers', String(x.n)) < 3) : cand;
      const num = pick(needy.length ? needy : cand, 1)[0] || SA.numbers[2];
      const thing = pick(SA.countThings, 1)[0];
      const total = Math.min(num.n + 2, 12);
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
    const tiles = b.tiles.map((t) => b.placed[t.key] ? '' : '<div class="tile sm' + (g.sel === t.key ? ' sel' : '') + '" data-key="' + t.key + '" data-match="x" role="button" tabindex="0">' + t.html + '</div>').join('');
    return bar(b.count, b.n) +
      '<div class="card center gcard"><div class="gprompt">' + esc(countPrompt(ctx, g, b)) + '</div><button class="iconbtn" data-act="gagain" aria-label="Hear again">🔊</button></div>' +
      '<div class="slots"><button class="slot basket" data-act="gslot" data-key="basket" aria-label="Basket"><span class="bk-items">' + inBasket + '</span><b class="bk-n">' + (b.count || '') + '</b></button></div>' +
      '<div class="tiles">' + tiles + '</div>';
  }
  function boardComplete(b) { return b.slots.every((s) => b.filled[s.key]); }

  /* ---------- sing it: original chants with a clap button ---------- */
  function newSing(ctx, g) {
    const lines = [];
    if (g.sec === 'numbers') {
      const es = g.lang === 'tl' && focus(ctx) === 'es'; const tag = es ? ctx.LBY.es.tts : 'en-US';
      const max = g.range === '10' ? 10 : 5;
      SA.numbers.filter((x) => x.n <= max).forEach((x) => lines.push({ t: (es ? x.es : x.en) + '!', tag, html: '<b>' + x.n + '</b> ' + (es ? x.es : x.en) }));
      lines.push({ t: es ? '¡Aplaude, aplaude, aplaude!' : 'Clap, clap, clap!', tag, html: '👏 ' + (es ? 'Aplaude, aplaude, aplaude!' : 'Clap, clap, clap!') });
      g.sing = { it: null, big: '🔢', lines, claps: 0, playing: false, last: '' };
      return;
    }
    const items = wordItems(ctx); const last = g.sing ? g.sing.last : '';
    const it = pick(items.filter((x) => x.id !== last), 1)[0] || items[0];
    const W = it.en;
    if (g.lang === 'tl') {
      const T = it.tl.text; const tag = it.tl.tag;
      if (focus(ctx) === 'es') { lines.push({ t: '¡' + T + ', ' + T + ', ' + T + '!', tag }, { t: '¡Mira ' + T + '!', tag }, { t: '¡Aplaude, aplaude, aplaude!', tag }); }
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
      const ok = F().say(ctx, L.t, L.tag, true, false, next);
      setTimeout(next, ok ? 7000 : 1800);
    };
    step();
  }

  /* ---------- finish screen ---------- */
  function doneView(ctx, g) {
    const st = ctx.state;
    return '<div class="card hero center"><div class="big-em">🎉</div><b style="font-size:28px">' + (g.full ? 'A whole rainbow!' : 'You did it!') + '</b>' + (previewing(ctx) ? '' : '<p>+' + (g.full ? '3' : '1') + ' ⭐</p>' + rainbow(st.rbBands || 0) +
      '<div class="small muted">' + (g.full ? 'Rainbows made: ' + (st.rainbows || 0) : (st.rbBands || 0) + ' of 7 colors') + '</div>') +
      '<div class="row" style="justify-content:center;margin-top:10px"><button class="btn alt" data-act="ghub">Games</button><button class="btn sun" data-act="gagain-game">▶ Play again</button></div></div>';
  }

  G.view = function (ctx) {
    const g = GS(ctx); const child = ctx.isChild();
    if (!child && !g.preview) return '<h2>Game settings</h2>' + settingsView(ctx);
    if (g.screen !== 'play') sync(ctx, g);
    let h = previewBar(ctx);
    if (g.screen === 'hub') h += '<h2>Games</h2>';
    if (g.screen === 'letter') return h + letterCard(ctx, g);
    if (g.screen === 'lgrid') return h + lgridView(ctx, g);
    if (g.screen === 'sec') return h + secView(ctx, g);
    if (g.screen === 'done') return h + doneView(ctx, g);
    if (g.screen === 'play') {
      if (g.game === 'pop') return h + popView(ctx, g);
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
    if (SEC_GAMES[g.sec].indexOf(which) < 0) return;
    if (g.practice && (which === 'pop' || which === 'drag' || which === 'count')) { const all = itemsFor(ctx, g); if (all.length && all.every((x) => winsOf(ctx, g.sec, x.id) >= 3)) ctx.toast('Everything here is mastered! Playing with everything.'); }
    g.game = which; g.screen = 'play'; g.full = false;
    if (which === 'pop') { g.pop = null; newPop(ctx, g); }
    else if (which === 'sing') { g.sing = null; newSing(ctx, g); g.tok++; }
    else { g.board = null; newBoard(ctx, g, which); }
    ctx.render(false);
    g.told = g.told || {}; const hk = howKey(g); const first = !g.told[hk] && helpOn(ctx); g.told[hk] = true;
    const tok = g.tok;
    if (first) {
      /* instructions first; the balloon or basket prompt follows when they finish (or "Hear again" any time) */
      sayHow(ctx, g, hk, (which === 'pop' || which === 'count') ? () => { if (g.tok === tok && g.screen === 'play') promptSayAny(ctx, g); } : null);
    } else if (which === 'pop' || which === 'count') setTimeout(() => { if (g.tok === tok && g.screen === 'play') promptSayAny(ctx, g); }, 250);
  }
  function promptSayAny(ctx, g) {
    if (g.game === 'pop' && g.pop) return promptSay(ctx, g);
    if (g.game === 'count' && g.board) return F().say(ctx, countPrompt(ctx, g, g.board), 'en-US', false, true);
    return false;
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
    const lastOne = b.count >= b.n; const sp = praise(ctx, g, !lastOne); ctx.toast(sp + ' ⭐');
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
    if (b.kind === 'build') { const p = praise(ctx, g, true); ctx.toast(p + ' ⭐'); F().say(ctx, 'Letter ' + tile.match.toUpperCase() + '! ' + p, 'en-US', false, true); }
    else if (slot.it) sayRight(ctx, g, slot.it);
    else sayRight(ctx, g, { l: slot.match, id: slot.match });
    if (boardComplete(b)) {
      b.done = true; g.lock = true;
      if (b.kind === 'build') setTimeout(() => F().say(ctx, b.word.w + '! ' + praise(ctx, g, false), 'en-US'), 900);
      ctx.render(true); later(g, 1900, () => finish(ctx, g)); return true;
    }
    ctx.render(true); return true;
  }

  G.handle = function (a, d, ctx) {
    const g = GS(ctx); const f = F();
    switch (a) {
      case 'gsec': g.sec = d.s; g.screen = 'sec'; ctx.render(false); return true;
      case 'gtoggle': { const c = cfg(ctx); c.secs[d.s] = !c.secs[d.s]; if (!SECS.some((k) => c.secs[k])) c.secs[d.s] = true; ctx.save(); ctx.render(true); return true; }
      case 'glang': cfg(ctx).lang = d.l; ctx.save(); ctx.render(true); return true;
      case 'grange': cfg(ctx).range = d.r; ctx.save(); ctx.render(true); return true;
      case 'geasy': cfg(ctx).easy = d.e === '1'; ctx.save(); ctx.render(true); return true;
      case 'gprac': cfg(ctx).practice = d.p === '1'; ctx.save(); ctx.render(true); return true;
      case 'gpreview': g.preview = true; g.screen = 'hub'; g.game = null; g.tok++; ctx.render(false); return true;
      case 'gexit': g.preview = false; g.screen = 'hub'; g.game = null; g.tok++; g.lock = false; if (ctx.rec.active()) ctx.rec.stop(); try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { /* ignore */ } ctx.render(false); return true;
      case 'glgrid': g.screen = 'lgrid'; ctx.render(false); return true;
      case 'ghub': g.screen = 'hub'; g.game = null; g.tok++; ctx.render(false); return true;
      case 'gstart': startGame(ctx, g, d.g); return true;
      case 'ghow': sayHow(ctx, g, howKey(g)); return true;
      case 'ghelp': ctx.state.gameHelp = d.v === '1'; ctx.save(); ctx.render(true); return true;
      case 'gback':
        g.screen = g.screen === 'letter' ? 'lgrid' : (g.screen === 'lgrid' || g.screen === 'play' || g.screen === 'done') ? 'sec' : 'hub'; g.game = null; g.tok++; g.lock = false; if (ctx.rec.active()) ctx.rec.stop();
        try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { /* ignore */ }
        ctx.render(false); return true;
      case 'gagain': promptSayAny(ctx, g); return true;
      case 'gagain-game': startGame(ctx, g, g.game); return true;
      case 'gletter': g.letter = +d.i; g.screen = 'letter'; ctx.render(false); f.say(ctx, letterPhrase(letterItems()[g.letter]), 'en-US', false, true); return true;
      case 'gletternav': g.letter = (g.letter + (+d.d) + 26) % 26; ctx.render(true); f.say(ctx, letterPhrase(letterItems()[g.letter]), 'en-US', false, true); return true;
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
  G.mount = function (ctx) {
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
