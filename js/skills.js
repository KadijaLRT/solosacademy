/* Solo's Academy: "Think it!" skill games on Solana's side. Each one practices a skill from the milestone
   checklists or the age roadmap (see INFO). No reading needed: pictures, colors, voice, and taps. */
(function () {
  window.SA = window.SA || {};
  const K = (SA.skills = {});
  const F = () => SA.fun;
  const API = () => SA.games.api;

  const INFO = [
    { id: 'circle', icon: 'shapes', name: 'Draw a circle', total: 3, skill: 'Draws a circle when shown how. Fine motor control and pre-writing.' },
    { id: 'pattern', icon: 'colors', name: 'Patterns', total: 5, skill: 'Sees and continues a simple pattern. Early math and thinking.' },
    { id: 'next', icon: 'story', name: 'What comes next?', total: 5, skill: 'Puts events in order and says what comes next.' },
    { id: 'rhyme', icon: 'words', name: 'Rhymes', total: 5, skill: 'Hears words that sound the same at the end. Early sound awareness for reading.' },
    { id: 'more', icon: 'numbers', name: 'More or less', total: 5, skill: 'Compares big and small, more and fewer.' }
    ,{ id: 'action', icon: 'activities', name: 'What are they doing?', total: 5, skill: 'Names actions in pictures, like jumping, pushing, and spinning. Language and vocabulary.' },
    { id: 'beat', icon: 'music', name: 'Copy the beat', total: 3, skill: 'Listens, remembers a short beat, and taps it back. Memory, attention, and rhythm.' }
  ];
  K.info = INFO;

  const rnd = (n) => Math.floor(Math.random() * n);
  function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = rnd(i + 1); const t = b[i]; b[i] = b[j]; b[j] = t; } return b; }
  const pic = (en, cls) => '<span class="skpic ' + (cls || '') + '">' + (SA.picSvg(en) || '') + '</span>';
  const SK = (ctx) => { const g = ctx.ui.games; g.sk = g.sk || { screen: 'menu', game: null, round: 0, q: null, lock: false, wrong: 0 }; return g.sk; };
  const say = (ctx, t, onend) => F().say(ctx, t, 'en-US', false, true, onend);
  function wins(ctx, id) { return ((ctx.state.skillWins || {})[id]) || 0; }
  function level(ctx, id) { return Math.min(4, SA.stage.level(ctx.state) + (wins(ctx, id) >= 12 ? 1 : 0)); }
  function addWin(ctx, id) {
    if (API().previewing(ctx)) return;
    ctx.state.skillWins = ctx.state.skillWins || {}; ctx.state.skillWins[id] = wins(ctx, id) + 1; ctx.save();
  }
  K.winsOf = wins; K.levelOf = level;

  /* ---------- question makers ---------- */
  const COLORS = () => SA.colors.filter((c) => ['red', 'blue', 'yellow', 'green', 'purple'].indexOf(c.id) >= 0);
  function mkPattern(ctx) {
    const L = level(ctx, 'pattern'); const cs = shuffle(COLORS());
    const units = L <= 1 ? [['A', 'B']] : L === 2 ? [['A', 'A', 'B'], ['A', 'B', 'B']] : L === 3 ? [['A', 'B', 'C']] : [['A', 'A', 'B', 'C'], ['A', 'B', 'B', 'C']];
    const u = units[rnd(units.length)]; const map = { A: cs[0], B: cs[1], C: cs[2] };
    const shown = u.length * 2; const seq = []; for (let i = 0; i < shown; i++) seq.push(map[u[i % u.length]]);
    const ans = map[u[shown % u.length]];
    const others = cs.filter((c) => c.id !== ans.id).slice(0, 2);
    return { kind: 'pattern', seq, ans: ans.id, opts: shuffle([ans].concat(others)).map((c) => ({ id: c.id, c: c.c, en: c.en })), say: 'What comes next?' };
  }
  const SEQS = [
    { s: ['cloud', 'rain', 'rainbow'], easy: true }, { s: ['seed', 'tree', 'apple'], easy: true }, { s: ['letter', 'mail carrier', 'house'], easy: true },
    { s: ['one', 'two', 'three'], easy: true }, { s: ['Sunday', 'Monday', 'Tuesday'] }, { s: ['spring', 'summer', 'fall', 'winter'] }, { s: ['suitcase', 'ticket', 'airport', 'airplane'] }
  ];
  function mkNext(ctx) {
    const L = level(ctx, 'next'); const pool = SEQS.filter((x) => L >= 2 || x.easy); const q = pool[rnd(pool.length)];
    const ans = q.s[q.s.length - 1]; const shown = q.s.slice(0, -1);
    const all = [].concat.apply([], SEQS.map((x) => x.s)).filter((e) => q.s.indexOf(e) < 0);
    const opts = shuffle([ans].concat(shuffle(all).slice(0, 2)));
    return { kind: 'next', shown, ans, opts: opts.map((e) => ({ id: e, en: e })), say: 'What comes next?' };
  }
  const PAIRS = [['cat', 'hat'], ['tree', 'bee'], ['moon', 'spoon'], ['house', 'mouse'], ['star', 'car'], ['boat', 'coat'], ['bed', 'head'], ['dog', 'frog'], ['train', 'rain'], ['bear', 'chair']];
  function mkRhyme(ctx) {
    const L = level(ctx, 'rhyme'); const p = PAIRS[rnd(PAIRS.length)]; const flip = rnd(2); const ask = p[flip]; const ans = p[1 - flip];
    const pool = [].concat.apply([], PAIRS.filter((x) => x !== p)); const n = L <= 0 ? 1 : 2;
    const opts = shuffle([ans].concat(shuffle(pool).slice(0, n)));
    return { kind: 'rhyme', ask, ans, opts: opts.map((e) => ({ id: e, en: e })), say: 'Which one rhymes with ' + ask + '?' };
  }
  const STUFF = ['apple', 'star', 'cat', 'dog', 'car', 'heart', 'bird', 'fish'];
  function mkMore(ctx) {
    const L = level(ctx, 'more'); const icon = STUFF[rnd(STUFF.length)];
    const modes = L <= 1 ? ['big', 'small', 'more'] : ['more', 'fewer', 'more', 'fewer', 'big', 'small'];
    const mode = modes[rnd(modes.length)]; const side = rnd(2);
    if (mode === 'big' || mode === 'small') {
      return { kind: 'more', mode, icon, sizes: side ? [1, 0.55] : [0.55, 1], ans: side === (mode === 'big' ? 1 : 0) ? 0 : 1, say: mode === 'big' ? 'Which one is big?' : 'Which one is small?' };
    }
    const max = L <= 1 ? 5 : L === 2 ? 8 : 10; const minDiff = L >= 3 ? 1 : 2;
    let a; let b; do { a = 1 + rnd(max); b = 1 + rnd(max); } while (Math.abs(a - b) < minDiff);
    const bigger = a > b ? 0 : 1; const ans = mode === 'more' ? bigger : 1 - bigger;
    return { kind: 'more', mode, icon, counts: [a, b], ans, say: mode === 'more' ? 'Which has more?' : 'Which has fewer?' };
  }
  function mkCircle(ctx) {
    const L = level(ctx, 'circle');
    return { kind: 'circle', guide: L <= 2 ? (L <= 1 ? 'bold' : 'light') : 'none', say: L >= 3 ? 'Draw a big circle. Start at the green dot!' : 'Trace the circle with your finger!' };
  }
  const ACTS = { jump: 'jumping', push: 'pushing', pull: 'pulling', spin: 'spinning', fly: 'flying', bounce: 'bouncing', falling: 'falling', swing: 'swinging', roll: 'rolling' };
  function mkAction(ctx) {
    const L = level(ctx, 'action'); const keys = Object.keys(ACTS); const ans = keys[rnd(keys.length)];
    const opts = shuffle([ans].concat(shuffle(keys.filter((x) => x !== ans)).slice(0, L <= 1 ? 1 : 2)));
    return { kind: 'action', ans, opts: opts.map((e) => ({ id: e, en: ACTS[e] })), say: 'Which one is ' + ACTS[ans] + '?' };
  }
  const PADS = [{ c: '#e63946', f: 392 }, { c: '#3a86ff', f: 523 }, { c: '#2fbf71', f: 659 }];
  function mkBeat(ctx) {
    const L = level(ctx, 'beat'); const np = L <= 1 ? 2 : 3; const n = 2 + (L >= 2 ? 1 : 0) + (L >= 4 ? 1 : 0); const seq = [];
    for (let i = 0; i < n; i++) seq.push(rnd(np));
    return { kind: 'beat', pads: PADS.slice(0, np), seq, pos: 0, say: 'Listen, then copy the beat!' };
  }
  const MAKERS = { circle: mkCircle, pattern: mkPattern, next: mkNext, rhyme: mkRhyme, more: mkMore, action: mkAction, beat: mkBeat };

  /* ---------- views ---------- */
  const bar = (back, g, dots) => '<div class="gbar"><button class="btn alt backbtn" data-act="' + back + '" aria-label="Back">◀</button>' + (dots || '<span></span>') + (g ? '<button class="iconbtn" data-act="gsk-again" aria-label="Hear again">🔊</button>' : '<span></span>') + '</div>';
  function dotsHtml(done, total) { let h = '<span class="dots" role="img" aria-label="' + done + ' of ' + total + '">'; for (let i = 0; i < total; i++) h += '<i class="' + (i < done ? 'on' : '') + '"></i>'; return h + '</span>'; }

  function menuView(ctx) {
    return bar('ghub', false) + '<h2>Think it!</h2><div class="gbtns n4 secs">' + INFO.map((x) => '<button class="gbig" data-act="gsk-start" data-g="' + x.id + '"><span>' + SA.ic(x.icon) + '</span>' + ctx.esc(x.name) + '</button>').join('') + '</div>';
  }
  function optBtn(i, inner, extra) { return '<button class="skopt' + (extra || '') + '" data-act="gsk-pick" data-i="' + i + '">' + inner + '</button>'; }
  function questionView(ctx, sk) {
    const q = sk.q; const info = INFO.find((x) => x.id === sk.game);
    const head = bar('gsk-menu', true, dotsHtml(sk.round, info.total));
    const sel = (i) => (sk.picked === i ? (i === q.ansIdx ? ' good' : ' no') : '');
    let body = '';
    if (q.kind === 'pattern') {
      body = '<div class="skrow">' + q.seq.map((c) => '<i class="skdot" style="background:' + c.c + '"></i>').join('') + '<i class="skdot ask">?</i></div>' +
        '<div class="skrow opts">' + q.opts.map((o, i) => optBtn(i, '<i class="skdot big" style="background:' + o.c + '"></i>', sel(i))).join('') + '</div>';
    } else if (q.kind === 'next') {
      body = '<div class="skrow">' + q.shown.map((e) => pic(e)).join('<b class="skarrow">➜</b>') + '<b class="skarrow">➜</b><span class="skpic ask">?</span></div>' +
        '<div class="skrow opts">' + q.opts.map((o, i) => optBtn(i, pic(o.id), sel(i))).join('') + '</div>';
    } else if (q.kind === 'rhyme') {
      body = '<div class="skrow">' + pic(q.ask, 'xl') + '</div><div class="skwords">' + ctx.esc(q.ask) + '</div>' +
        '<div class="skrow opts">' + q.opts.map((o, i) => optBtn(i, pic(o.id), sel(i))).join('') + '</div>';
    } else if (q.kind === 'more') {
      const side = (i) => q.sizes ? pic(q.icon, 'sz').replace('class="skpic sz"', 'class="skpic" style="width:' + Math.round(q.sizes[i] * 110) + 'px;height:' + Math.round(q.sizes[i] * 110) + 'px"')
        : '<span class="skgrp">' + new Array(q.counts[i] + 1).join(pic(q.icon, 'sm')) + '</span>';
      body = '<div class="skrow opts two">' + [0, 1].map((i) => optBtn(i, side(i), sel(i))).join('') + '</div>';
    } else if (q.kind === 'action') {
      body = '<div class="skrow opts">' + q.opts.map((o, i) => optBtn(i, pic(o.id, 'lg'), sel(i))).join('') + '</div>';
    } else if (q.kind === 'beat') {
      body = '<div class="skrow opts">' + q.pads.map((pd, i) => '<button class="skpad" id="skpad' + i + '" data-act="gsk-pad" data-i="' + i + '" style="background:' + pd.c + '" aria-label="Drum ' + (i + 1) + '"></button>').join('') + '</div>' +
        '<div class="skwords" id="skbeatmsg">' + ctx.esc(sk.beatMsg || '') + '</div>';
    } else if (q.kind === 'circle') {
      body = '<div class="sktrace"><svg id="sktrace" viewBox="0 0 240 240" aria-label="Drawing space">' +
        (q.guide === 'none' ? '' : '<circle cx="120" cy="120" r="80" class="skguide ' + q.guide + '"/>') +
        '<circle cx="120" cy="40" r="9" class="skstart"/><polyline id="sktpath" points="" class="skpath"/></svg></div>' +
        '<div class="row" style="justify-content:center;margin-top:8px"><button class="btn alt iconbtn big" data-act="gsk-clear" aria-label="Start over">↺</button></div>';
    }
    return head + '<div class="card center gcard sk">' + (sk.game === 'circle' ? '' : '<div class="skprompt">' + ctx.esc(q.say) + '</div>') + body + '</div>';
  }
  function doneView(ctx, sk) {
    const st = ctx.state;
    return bar('gsk-menu', false) + '<div class="card hero center"><div class="big-em">🎉</div><b style="font-size:28px">You did it!</b>' + API().rainbow(st.rbBands || 0, false) +
      '<div class="row" style="justify-content:center;margin-top:10px"><button class="btn alt iconbtn big" data-act="gsk-menu" aria-label="More games">🏠</button><button class="btn sun iconbtn big" data-act="gsk-again-game" aria-label="Again">▶</button></div></div>';
  }
  K.view = function (ctx) {
    const sk = SK(ctx);
    if (sk.screen === 'play' && sk.q) return questionView(ctx, sk);
    if (sk.screen === 'done') return doneView(ctx, sk);
    return menuView(ctx);
  };

  /* ---------- flow ---------- */
  function newRound(ctx, g, sk) {
    let q = MAKERS[sk.game](ctx);
    /* Never the same question as one of her last few, even from an earlier day. */
    const sigOf = (x) => { try { return JSON.stringify([x.kind, x.say, x.seq && x.seq.map((c) => c.id || c), x.ans, x.opts && x.opts.map((o) => o.id), x.ask, x.shown && x.shown.map((e) => e.id || e), x.sizes, x.counts, x.pads && x.pads.length]); } catch (e) { return ''; } };
    const lq = (ctx.state.lastQ = ctx.state.lastQ || {}); const recent = lq[sk.game] || [];
    for (let tries = 0; tries < 8 && recent.indexOf(sigOf(q)) >= 0; tries++) q = MAKERS[sk.game](ctx);
    if (!API().previewing(ctx)) { lq[sk.game] = recent.concat([sigOf(q)]).slice(-5); }
    if (q.kind === 'more') q.ansIdx = q.ans;
    else if (q.opts) q.ansIdx = q.opts.findIndex((o) => o.id === q.ans);
    sk.q = q; sk.lock = false; sk.picked = null; sk.screen = 'play';
    if (q.kind === 'pattern') q.seq = q.seq.map((c) => ({ id: c.id, c: c.c }));
    ctx.render(false); const tok = g.tok;
    if (q.kind === 'beat') { setTimeout(() => { if (g.tok === tok && sk.q === q) say(ctx, q.say, () => playBeat(ctx, g, sk, q)); }, 250); return; }
    setTimeout(() => { if (g.tok === tok && sk.screen === 'play' && sk.q === q) say(ctx, q.say); }, 250);
  }
  function flash(i, on) { const el = document.getElementById('skpad' + i); if (el) el.classList.toggle('lit', on); }
  function playBeat(ctx, g, sk, q) {
    const tok = g.tok; sk.lock = true; q.pos = 0; sk.beatMsg = 'Listen...'; const m = document.getElementById('skbeatmsg'); if (m) m.textContent = sk.beatMsg;
    q.seq.forEach((pi, n) => {
      setTimeout(() => { if (g.tok === tok && sk.q === q) { flash(pi, true); API().beep(q.pads[pi].f, q.pads[pi].f, 0.3); } }, 500 + n * 750);
      setTimeout(() => { flash(pi, false); }, 500 + n * 750 + 400);
    });
    setTimeout(() => { if (g.tok === tok && sk.q === q) { sk.lock = false; sk.beatMsg = 'Your turn!'; const mm = document.getElementById('skbeatmsg'); if (mm) mm.textContent = sk.beatMsg; } }, 500 + q.seq.length * 750);
  }
  function padTap(ctx, g, sk, i) {
    const q = sk.q; if (!q || q.kind !== 'beat' || sk.lock) return;
    flash(i, true); API().beep(q.pads[i].f, q.pads[i].f, 0.25); const tok = g.tok; setTimeout(() => flash(i, false), 250);
    if (i !== q.seq[q.pos]) { API().sNo(); say(ctx, 'Try again. Listen!'); sk.lock = true; setTimeout(() => { if (g.tok === tok && sk.q === q) playBeat(ctx, g, sk, q); }, 1400); return; }
    q.pos += 1;
    if (q.pos >= q.seq.length) { API().sYay(); say(ctx, API().praise(ctx, g, true)); sk.beatMsg = ''; roundDone(ctx, g, sk); }
  }
  function startSkill(ctx, g, sk, id) {
    g.tok++; sk.game = id; sk.round = 0; sk.screen = 'play'; newRound(ctx, g, sk);
  }
  function roundDone(ctx, g, sk) {
    const info = INFO.find((x) => x.id === sk.game); const tok = g.tok;
    addWin(ctx, sk.game); sk.round += 1; sk.lock = true;
    setTimeout(() => {
      if (g.tok !== tok) return;
      if (sk.round >= info.total) { API().reward(ctx); sk.screen = 'done'; sk.q = null; ctx.render(false); API().sYay(); say(ctx, API().praise(ctx, g, false)); } else newRound(ctx, g, sk);
    }, 1500);
  }
  function pick(ctx, g, sk, i) {
    const q = sk.q; if (!q || sk.lock) return;
    sk.picked = i;
    if (i === q.ansIdx) {
      API().sYay();
      if (q.kind === 'rhyme') say(ctx, q.opts[i].en + ' rhymes with ' + q.ask + '! ' + API().praise(ctx, g, true));
      else if (q.kind === 'next') say(ctx, q.ans + '! ' + API().praise(ctx, g, true));
      else if (q.kind === 'action') say(ctx, q.opts[i].en + '! ' + API().praise(ctx, g, true));
      else say(ctx, API().praise(ctx, g, true));
      ctx.render(true); roundDone(ctx, g, sk);
    } else {
      API().sNo(); sk.wrong += 1;
      if (q.kind === 'rhyme') say(ctx, q.opts[i].en + '. Listen again. ' + q.say); else if (q.kind === 'action') say(ctx, q.opts[i].en + '. ' + q.say); else say(ctx, 'Try again!');
      ctx.render(true); const tok = g.tok;
      setTimeout(() => { if (g.tok === tok && sk.q === q && !sk.lock) { sk.picked = null; ctx.render(true); } }, 700);
    }
  }

  K.handle = function (a, d, ctx, g) {
    const sk = SK(ctx);
    switch (a) {
      case 'gskills': g.tok++; g.screen = 'skills'; sk.screen = 'menu'; ctx.render(false); say(ctx, 'Think it!'); return true;
      case 'gsk-start': startSkill(ctx, g, sk, d.g); return true;
      case 'gsk-again-game': startSkill(ctx, g, sk, sk.game); return true;
      case 'gsk-menu': g.tok++; sk.screen = 'menu'; sk.q = null; try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { /* ignore */ } ctx.render(false); return true;
      case 'gsk-again': if (sk.q) say(ctx, sk.q.say); return true;
      case 'gsk-pick': pick(ctx, g, sk, +d.i); return true;
      case 'gsk-pad': padTap(ctx, g, sk, +d.i); return true;
      case 'gsk-clear': { const p = document.getElementById('sktpath'); if (p) p.setAttribute('points', ''); sk.pts = []; return true; }
      default: return false;
    }
  };

  /* ---------- circle drawing (pointer events) ---------- */
  function judge(pts, q) {
    if (pts.length < 20) return false;
    let minx = 1e9; let maxx = -1e9; let miny = 1e9; let maxy = -1e9;
    pts.forEach((p) => { minx = Math.min(minx, p[0]); maxx = Math.max(maxx, p[0]); miny = Math.min(miny, p[1]); maxy = Math.max(maxy, p[1]); });
    const cx = (minx + maxx) / 2; const cy = (miny + maxy) / 2;
    const rs = pts.map((p) => Math.hypot(p[0] - cx, p[1] - cy)); const mean = rs.reduce((s, r) => s + r, 0) / rs.length;
    if (mean < 35 || mean > 118) return false;
    const sd = Math.sqrt(rs.reduce((s, r) => s + (r - mean) * (r - mean), 0) / rs.length);
    const bins = {}; pts.forEach((p) => { bins[Math.floor(((Math.atan2(p[1] - cy, p[0] - cx) + Math.PI) / (2 * Math.PI)) * 12) % 12] = 1; });
    const covered = Object.keys(bins).length; const first = pts[0]; const last = pts[pts.length - 1];
    const closed = Math.hypot(first[0] - last[0], first[1] - last[1]) <= mean * 0.7;
    const tol = q.guide === 'none' ? 0.25 : 0.32;
    return covered >= 10 && closed && sd / mean <= tol;
  }
  K.judge = judge;
  K.mount = function (ctx) {
    K._ctx = ctx;
    const view = document.getElementById('view'); let drawing = null;
    const toSvg = (svg, e) => { const r = svg.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * 240, ((e.clientY - r.top) / r.height) * 240]; };
    view.addEventListener('pointerdown', (e) => {
      const svg = e.target.closest ? e.target.closest('#sktrace') : null; if (!svg) return;
      const sk = SK(ctx); if (!sk.q || sk.q.kind !== 'circle' || sk.lock) return;
      drawing = { id: e.pointerId, svg, pts: [toSvg(svg, e)] }; try { svg.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ } e.preventDefault();
    });
    view.addEventListener('pointermove', (e) => {
      if (!drawing || e.pointerId !== drawing.id) return;
      drawing.pts.push(toSvg(drawing.svg, e)); const p = document.getElementById('sktpath');
      if (p) p.setAttribute('points', drawing.pts.map((q) => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' '));
    });
    const end = (e) => {
      if (!drawing || e.pointerId !== drawing.id) return;
      const pts = drawing.pts; drawing = null; const sk = SK(ctx); const g = ctx.ui.games; if (!sk.q || sk.q.kind !== 'circle') return;
      if (judge(pts, sk.q)) { API().sYay(); say(ctx, API().praise(ctx, g, true)); const p = document.getElementById('sktpath'); if (p) p.classList.add('good'); roundDone(ctx, g, sk); }
      else { API().sNo(); say(ctx, 'Nice try! Make it go all the way around.'); const tok = g.tok; setTimeout(() => { const p = document.getElementById('sktpath'); if (g.tok === tok && p && !sk.lock) p.setAttribute('points', ''); }, 900); }
    };
    view.addEventListener('pointerup', end); view.addEventListener('pointercancel', end);
  };
})();
