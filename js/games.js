/* Solo's Academy: Games tab for Solana. Original games in the style of toddler alphabet puzzle apps:
   pop the balloon you hear, drag pieces to match, build a word, and fill a rainbow.
   Positive reinforcement only: a wrong try wobbles and says "Try again", nothing is lost.
   Two sections: Letters (English) and Unit words (English or her second language). Runs fully offline. */
(function () {
  'use strict';
  const SA = window.SA;
  const G = (SA.games = {});
  const F = () => SA.fun;
  const BALLOON = ['#ff4d6d', '#3a86ff', '#ffd23f', '#2ec4b6', '#ff9f1c', '#8338ec'];
  const BANDS = ['#ff3b30', '#ff9500', '#ffd60a', '#34c759', '#0a84ff', '#5e5ce6', '#bf5af2'];
  const ALPHA = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const POP_ROUNDS = 5;

  function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = b[i]; b[i] = b[j]; b[j] = t; } return b; }
  function pick(a, n) { return shuffle(a).slice(0, n); }
  function GS(ctx) {
    if (!ctx.ui.games) ctx.ui.games = { sec: 'letters', game: null, screen: 'hub', lang: 'en', easy: true, letter: 0, tok: 0, lock: false, sel: null, pop: null, board: null };
    return ctx.ui.games;
  }

  /* ---------- sound effects (tiny synth, no files) ---------- */
  let ac = null;
  function beep(f1, f2, dur) {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
      const o = ac.createOscillator(); const gn = ac.createGain(); const t = ac.currentTime;
      o.type = 'sine'; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur);
      gn.gain.setValueAtTime(0.22, t); gn.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(gn); gn.connect(ac.destination); o.start(t); o.stop(t + dur);
    } catch (e) { /* sound is optional */ }
  }
  const sPop = () => beep(750, 180, 0.13);
  const sYay = () => { beep(523, 880, 0.2); setTimeout(() => beep(660, 1040, 0.22), 160); };
  const sNo = () => beep(220, 180, 0.12);

  /* ---------- items ---------- */
  function wordItems(ctx) {
    const f = F(); const u = f.unitOf(ctx);
    return f.wordsOf(ctx, u).map((w) => ({ id: w.en, e: w.emoji, en: w.en, tl: f.tlFor(ctx, w) }));
  }
  function letterItems() { return SA.letters.map((x) => ({ id: x.l, l: x.l, lo: x.l.toLowerCase(), w: x.w, e: x.e, end: !!x.end })); }
  function letterPhrase(it) { return it.end ? it.l + ' is for ' + it.w + '. ' + it.w + ' ends with ' + it.l + '.' : 'Letter ' + it.l + '. ' + it.l + ' is for ' + it.w + '.'; }
  /* Speak an item in the section's language. */
  function sayItem(ctx, g, it, lead) {
    const f = F();
    if (g.sec === 'letters') return f.say(ctx, (lead || '') + 'Letter ' + it.l + '.', 'en-US', false, true);
    if (g.lang === 'tl') { if (!f.say(ctx, it.tl.text, it.tl.tag)) ctx.toast('No ' + it.tl.name + ' voice on this device.'); return true; }
    return f.say(ctx, (lead || '') + it.en + '.', 'en-US');
  }
  function itemName(g, it) { return g.sec === 'letters' ? it.l : (g.lang === 'tl' ? it.tl.text : it.en); }

  /* ---------- rewards ---------- */
  function reward(ctx) {
    const st = ctx.state; st.gameStars = (st.gameStars || 0) + 1; st.rbBands = (st.rbBands || 0) + 1; let full = false;
    if (st.rbBands >= 7) { st.rbBands = 0; st.rainbows = (st.rainbows || 0) + 1; st.gameStars += 2; full = true; }
    ctx.save(); return full;
  }
  function win(ctx, id) {
    const st = ctx.state; st.letterWins = st.letterWins || {}; const was = st.letterWins[id] || 0; st.letterWins[id] = was + 1;
    ctx.save(); if (was + 1 === 3) ctx.toast('🌈 You know the letter ' + id + '!');
  }
  function rainbow(bands) {
    let h = '<div class="rb" role="img" aria-label="Rainbow, ' + bands + ' of 7 colors">';
    for (let k = 0; k < 7; k++) { const w = 220 - k * 24; h += '<i style="width:' + w + 'px;height:' + (w / 2) + 'px;border-color:' + (k < bands ? BANDS[k] : (k % 2 ? 'rgba(120,120,150,.32)' : 'rgba(120,120,150,.16)')) + '"></i>'; }
    return h + '</div>';
  }
  function rainbowCard(st) {
    const n = st.rbBands || 0;
    return '<div class="card center">' + rainbow(n) + '<b>' + (n >= 7 ? '🌈 Rainbow!' : n + ' of 7 colors') + '</b><div class="small muted">Rainbows made: ' + (st.rainbows || 0) + '. Finish a game to add a color.</div></div>';
  }
  function chips(ctx, items, cur, act, key) {
    return '<div class="chips">' + items.map((t) => '<button class="chip" aria-pressed="' + (String(cur) === String(t[0])) + '" data-act="' + act + '" data-' + key + '="' + ctx.esc(t[0]) + '">' + t[1] + '</button>').join('') + '</div>';
  }

  /* ---------- spoken instructions ("how to play") ---------- */
  const HOW = {
    hub: ['Pick a game! Pop it, Match it, or Build a word. Finish a game to add a color to your rainbow.', 'Elige un juego. Revienta globos, empareja o arma una palabra. Al terminar un juego, ganas un color del arcoíris.'],
    popL: ['Pop the balloon with the letter I say. Tap the right balloon. Pop five balloons to add a color to your rainbow!', null],
    popW: ['Listen to the word. Tap the balloon with the right picture. Pop five balloons to add a color to your rainbow!', 'Escucha la palabra. Toca el globo con el dibujo correcto. ¡Revienta cinco globos y gana un color del arcoíris!'],
    dragL: ['Drag each big letter to its little letter. You can also tap a big letter, then tap its spot.', null],
    dragW: ['Drag each picture to its shadow. You can also tap a picture, then tap its shadow.', 'Arrastra cada dibujo a su sombra. También puedes tocar el dibujo y luego su sombra.'],
    build: ['Look at the picture. Drag the missing letters into the empty boxes to spell the word.', null]
  };
  function howKey(g) { return g.screen === 'hub' ? 'hub' : g.game === 'pop' ? (g.sec === 'letters' ? 'popL' : 'popW') : g.game === 'drag' ? (g.sec === 'letters' ? 'dragL' : 'dragW') : 'build'; }
  /* Spanish is used only when she is practicing Spanish with unit words. Everything else is English. */
  function sayHow(ctx, g, key, onend) {
    const t = HOW[key]; const es = t[1] && g.sec === 'words' && g.lang === 'tl' && (ctx.state.focusLang || 'es') === 'es';
    return F().say(ctx, es ? t[1] : t[0], es ? ctx.LBY.es.tts : 'en-US', false, true, onend);
  }
  const helpOn = (ctx) => ctx.state.gameHelp !== false;

  /* ---------- hub ---------- */
  function hub(ctx, g) {
    const esc = ctx.esc; const st = ctx.state; const f = F(); const u = f.unitOf(ctx); const child = ctx.isChild();
    let h = rainbowCard(st) + '<div class="row" style="justify-content:center"><button class="btn small" data-act="ghow">🔊 How to play</button></div>' + chips(ctx, [['letters', '🔤 Letters'], ['words', u.emoji + ' ' + u.name + ' words']], g.sec, 'gsec', 's');
    if (g.sec === 'words') {
      const sample = wordItems(ctx)[0];
      if (sample) h += '<p class="small muted" style="margin:0">Say the words in:</p>' + chips(ctx, [['en', '🇺🇸 English'], ['tl', sample.tl.flag + ' ' + sample.tl.name]], g.lang, 'glang', 'l');
      if (!child) h += '<p class="small muted">Words come from the unit you picked in the Theme tab. Build a word always uses English spelling.</p>';
    }
    h += '<div class="gbtns">' +
      '<button class="gbig" data-act="gstart" data-g="pop"><span>🎈</span>Pop it!</button>' +
      '<button class="gbig" data-act="gstart" data-g="drag"><span>🧩</span>Match it!</button>' +
      '<button class="gbig" data-act="gstart" data-g="build"><span>🔨</span>Build a word</button></div>';
    h += '<p class="small muted" style="margin:6px 0 0">Build a word:</p>' + chips(ctx, [['1', '1 missing letter'], ['0', 'Spell it all']], g.easy ? '1' : '0', 'geasy', 'e');
    h += '<p class="small muted" style="margin:6px 0 0">Spoken instructions when a game starts:</p>' + chips(ctx, [['1', '🔊 On'], ['0', '🔇 Off']], helpOn(ctx) ? '1' : '0', 'ghelp', 'v');
    if (g.sec === 'letters') {
      const wins = st.letterWins || {};
      h += '<div class="card"><b>All the letters</b><p class="small muted">Tap a letter to learn it. A 🌈 means she has it!</p><div class="lgrid">' +
        SA.letters.map((x, i) => '<button class="lbtn" data-act="gletter" data-i="' + i + '" aria-label="Letter ' + x.l + '">' + x.l + x.l.toLowerCase() + ((wins[x.l] || 0) >= 3 ? '<em>🌈</em>' : '') + '</button>').join('') + '</div></div>';
    }
    return h;
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
    const items = g.sec === 'letters' ? letterItems() : wordItems(ctx);
    const used = g.pop ? g.pop.used : [];
    const fresh = items.filter((x) => used.indexOf(x.id) < 0);
    const target = pick(fresh.length ? fresh : items, 1)[0];
    const others = pick(items.filter((x) => x.id !== target.id), 3);
    g.pop = { n: g.pop ? g.pop.n : 0, used: used.concat([target.id]), target, opts: shuffle([target].concat(others)) };
    g.lock = false; g.tok++;
  }
  function popView(ctx, g) {
    const esc = ctx.esc; const p = g.pop; const t = p.target;
    const prompt = g.sec === 'letters' ? 'Pop the letter ' + t.l + '!' : 'Pop the ' + itemName(g, t) + '!';
    return '<div class="row between"><button class="btn alt small" data-act="gback">◀ Back</button><span class="pill">Balloon ' + (p.n + 1) + ' of ' + POP_ROUNDS + '</span></div>' +
      '<div class="card center"><div class="gprompt">' + esc(prompt) + '</div><button class="btn small" data-act="gagain">🔊 Hear again</button> <button class="btn alt small" data-act="ghow">❓ How to play</button></div>' +
      '<div class="balloons">' + p.opts.map((o, i) => '<button class="balloon" data-act="gpop" data-id="' + esc(o.id) + '" style="--c:' + BALLOON[(i + (p.n * 2)) % BALLOON.length] + ';--d:' + (i * 0.35) + 's" aria-label="' + esc(g.sec === 'letters' ? 'Letter ' + o.l : itemName(g, o)) + '">' +
        (g.sec === 'letters' ? '<b>' + o.l + '</b><small>' + o.lo + '</small>' : '<b class="em">' + o.e + '</b>') + '</button>').join('') + '</div>';
  }
  function promptSay(ctx, g) {
    const t = g.pop.target; const f = F();
    if (g.sec === 'letters') return f.say(ctx, 'Pop the letter ' + t.l + '!', 'en-US', false, true);
    if (g.lang === 'tl') return f.say(ctx, t.tl.text, t.tl.tag);
    return f.say(ctx, 'Pop the ' + t.en + '!', 'en-US');
  }

  /* ---------- drag boards (match it, build a word) ---------- */
  function newBoard(ctx, g, kind) {
    let tiles = []; let slots = [];
    if (kind === 'drag' && g.sec === 'letters') {
      const items = pick(letterItems(), 3);
      tiles = shuffle(items.map((x) => ({ key: 't' + x.l, match: x.l, html: '<b>' + x.l + '</b>', name: x.l })));
      slots = shuffle(items.map((x) => ({ key: 's' + x.l, match: x.l, empty: '<b>' + x.lo + '</b>', filled: '<b>' + x.l + x.lo + '</b>', name: x.l })));
    } else if (kind === 'drag') {
      const items = pick(wordItems(ctx), 3);
      tiles = shuffle(items.map((x) => ({ key: 't' + x.id, match: x.id, html: '<b class="em">' + x.e + '</b>', it: x })));
      slots = shuffle(items.map((x) => ({ key: 's' + x.id, match: x.id, empty: '<b class="em shadow">' + x.e + '</b>', filled: '<b class="em">' + x.e + '</b>', it: x })));
    } else {
      const list = g.sec === 'words' ? wordItems(ctx).filter((w) => /^[a-z]+$/i.test(w.en) && w.en.length >= 3 && w.en.length <= 6).map((w) => ({ w: w.en.toLowerCase(), e: w.e })) : [];
      const src = list.length >= 3 ? list : SA.spellWords;
      const last = g.board && g.board.word ? g.board.word.w : '';
      const word = pick(src.filter((x) => x.w !== last), 1)[0] || src[0];
      const chars = word.w.split('');
      slots = chars.map((c, i) => ({ key: 's' + i, match: c, fixed: g.easy && i > 0, empty: '<b></b>', filled: '<b>' + c + '</b>', name: c }));
      const need = slots.filter((s) => !s.fixed).map((s) => s.match);
      const extra = pick(ALPHA.filter((c) => chars.indexOf(c) < 0), 2);
      tiles = shuffle(need.concat(extra).map((c, j) => ({ key: 't' + j, match: c, html: '<b>' + c + '</b>', name: c })));
      g.board = { kind, tiles, slots, filled: {}, word, done: false };
      slots.forEach((s) => { if (s.fixed) g.board.filled[s.key] = '*'; });
      g.sel = null; g.lock = false; g.tok++;
      return;
    }
    g.board = { kind, tiles, slots, filled: {}, word: null, done: false };
    g.sel = null; g.lock = false; g.tok++;
  }
  function boardView(ctx, g) {
    const esc = ctx.esc; const b = g.board; const placed = {};
    Object.keys(b.filled).forEach((k) => { if (b.filled[k] !== '*') placed[b.filled[k]] = true; });
    let top;
    if (b.kind === 'build') top = '<div class="big-em">' + b.word.e + '</div><div class="gprompt">Spell it!</div>' + (b.done ? '<div class="big-word">' + esc(b.word.w) + '</div>' : '');
    else top = '<div class="gprompt">' + (g.sec === 'letters' ? 'Drag each big letter to its little letter!' : 'Drag each picture to its shadow!') + '</div>';
    const slots = b.slots.map((s) => {
      const f = b.filled[s.key];
      if (f) return '<div class="slot ok' + (s.fixed ? ' fixed' : '') + '" data-key="' + s.key + '">' + s.filled + '</div>';
      return '<button class="slot" data-act="gslot" data-key="' + s.key + '" data-match="' + esc(s.match) + '" aria-label="Empty spot">' + s.empty + '</button>';
    }).join('');
    const tiles = b.tiles.map((t) => placed[t.key] ? '' : '<div class="tile' + (g.sel === t.key ? ' sel' : '') + '" data-key="' + t.key + '" data-match="' + esc(t.match) + '" role="button" tabindex="0">' + t.html + '</div>').join('');
    return '<div class="row between"><button class="btn alt small" data-act="gback">◀ Back</button><span class="pill">' + (b.kind === 'build' ? 'Build a word' : 'Match it') + '</span></div>' +
      '<div class="card center">' + top + '<p class="small muted">You can drag, or tap a piece and then tap its spot.</p><button class="btn alt small" data-act="ghow">❓ How to play</button></div>' +
      '<div class="slots' + (b.kind === 'build' ? ' build' : '') + '">' + slots + '</div><div class="tiles">' + tiles + '</div>';
  }
  function boardComplete(b) { return b.slots.every((s) => b.filled[s.key]); }

  /* ---------- finish screen ---------- */
  function doneView(ctx, g) {
    const st = ctx.state;
    return '<div class="card hero center"><div class="big-em">🎉</div><b style="font-size:28px">' + (g.full ? 'A whole rainbow!' : 'You did it!') + '</b><p>+' + (g.full ? '3' : '1') + ' ⭐</p>' + rainbow(st.rbBands || 0) +
      '<div class="small muted">' + (g.full ? 'Rainbows made: ' + (st.rainbows || 0) : (st.rbBands || 0) + ' of 7 colors') + '</div>' +
      '<div class="row" style="justify-content:center;margin-top:10px"><button class="btn sun" data-act="gagain-game">▶ Play again</button><button class="btn alt" data-act="gback">Games</button></div></div>';
  }

  G.view = function (ctx) {
    const g = GS(ctx); let h = '<h2>Games</h2>';
    if (g.screen === 'letter') return h + letterCard(ctx, g);
    if (g.screen === 'done') return h + doneView(ctx, g);
    if (g.screen === 'play') return h + (g.game === 'pop' ? popView(ctx, g) : boardView(ctx, g));
    return h + hub(ctx, g);
  };

  /* ---------- flow ---------- */
  function startGame(ctx, g, which) {
    if (g.sec === 'words' && wordItems(ctx).length < 4) { ctx.toast('This unit needs at least 4 words.'); return; }
    g.game = which; g.screen = 'play'; g.full = false;
    if (which === 'pop') { g.pop = null; newPop(ctx, g); } else { g.board = null; newBoard(ctx, g, which); }
    ctx.render(false);
    g.told = g.told || {}; const hk = howKey(g); const first = !g.told[hk] && helpOn(ctx); g.told[hk] = true;
    const tok = g.tok;
    if (first) {
      /* instructions first; the balloon prompt follows when they finish (or "Hear again" any time) */
      sayHow(ctx, g, hk, which === 'pop' ? () => { if (g.tok === tok && g.screen === 'play' && g.pop && !g.lock) promptSay(ctx, g); } : null);
    } else if (which === 'pop') setTimeout(() => promptSay(ctx, g), 250);
  }
  function finish(ctx, g) {
    g.full = reward(ctx); g.screen = 'done'; sYay(); ctx.render(false);
    F().say(ctx, g.full ? 'Wow! A rainbow!' : 'Great job!', 'en-US');
  }
  function later(g, ms, fn) { const tok = g.tok; setTimeout(() => { if (g.tok === tok && g.screen === 'play') fn(); }, ms); }

  function place(ctx, g, tileEl, slotEl) {
    const b = g.board; if (!b || g.lock) return false;
    const tile = b.tiles.find((t) => t.key === tileEl.dataset.key); const slot = b.slots.find((s) => s.key === slotEl.dataset.key);
    if (!tile || !slot || b.filled[slot.key]) return false;
    if (tile.match !== slot.match) {
      sNo(); slotEl.classList.add('wobble'); setTimeout(() => slotEl.classList.remove('wobble'), 500);
      F().say(ctx, 'Try again!', 'en-US'); return false;
    }
    b.filled[slot.key] = tile.key; g.sel = null; sPop();
    if (b.kind === 'drag' && g.sec === 'letters') win(ctx, slot.match);
    if (b.kind === 'drag' && g.sec === 'words') sayItem(ctx, g, slot.it);
    else if (b.kind === 'drag') sayItem(ctx, g, { l: slot.match, id: slot.match });
    else F().say(ctx, tile.match, 'en-US', false, true);
    if (boardComplete(b)) {
      b.done = true; g.lock = true;
      if (b.kind === 'build') setTimeout(() => F().say(ctx, b.word.w + '!', 'en-US'), 700);
      ctx.render(true); later(g, 1900, () => finish(ctx, g)); return true;
    }
    ctx.render(true); return true;
  }

  G.handle = function (a, d, ctx) {
    const g = GS(ctx); const f = F();
    switch (a) {
      case 'gsec': g.sec = d.s; ctx.render(true); return true;
      case 'glang': g.lang = d.l; ctx.render(true); { const s = wordItems(ctx)[0]; if (s) sayItem(ctx, g, s); } return true;
      case 'geasy': g.easy = d.e === '1'; ctx.render(true); return true;
      case 'gstart': startGame(ctx, g, d.g); return true;
      case 'ghow': sayHow(ctx, g, howKey(g)); return true;
      case 'ghelp': ctx.state.gameHelp = d.v === '1'; ctx.save(); ctx.render(true); return true;
      case 'gback': g.screen = 'hub'; g.game = null; g.tok++; g.lock = false; if (ctx.rec.active()) ctx.rec.stop(); ctx.render(false); return true;
      case 'gagain': promptSay(ctx, g); return true;
      case 'gagain-game': startGame(ctx, g, g.game); return true;
      case 'gletter': g.letter = +d.i; g.screen = 'letter'; ctx.render(false); f.say(ctx, letterPhrase(letterItems()[g.letter]), 'en-US', false, true); return true;
      case 'gletternav': g.letter = (g.letter + (+d.d) + 26) % 26; ctx.render(true); f.say(ctx, letterPhrase(letterItems()[g.letter]), 'en-US', false, true); return true;
      case 'gsayletter': f.say(ctx, letterPhrase(letterItems()[g.letter]), 'en-US', d.slow === '1', true); return true;
      case 'gpop': {
        const p = g.pop; if (!p || g.lock) return true;
        const el = document.querySelector('.balloon[data-id="' + (window.CSS && CSS.escape ? CSS.escape(d.id) : d.id) + '"]');
        const it = p.opts.find((o) => o.id === d.id);
        if (d.id !== p.target.id) { sNo(); if (el) { el.classList.add('wobble'); setTimeout(() => el.classList.remove('wobble'), 500); } f.say(ctx, 'Try again!', 'en-US'); return true; }
        g.lock = true; sPop(); if (el) el.classList.add('popped');
        if (g.sec === 'letters') win(ctx, it.id);
        setTimeout(() => sayItem(ctx, g, it, 'Yes! '), 150);
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
        if (tile) { if (g.board.kind === 'build') F().say(ctx, tile.match, 'en-US', false, true); else if (tile.it) sayItem(ctx, g, tile.it); else sayItem(ctx, g, { l: tile.match, id: tile.match }); }
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
