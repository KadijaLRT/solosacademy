/* Solo's Academy: "Trace it!" on Solana's side. She traces lines, shapes, numbers, capital letters, and the letters of her name with her finger.
   Checking is gentle: she passes when she follows most of the guide and stays near it, in any stroke order. No reading needed. */
(function () {
  'use strict';
  const SA = window.SA = window.SA || {};
  const T = (SA.trace = {});
  const F = () => SA.fun;
  const API = () => SA.games.api;

  /* Every glyph is drawn in a 100 by 100 box. strokes = SVG path strings, in the order a grown-up would write them. */
  const G = {};
  const add = (id, name, say, strokes) => { G[id] = { id, name, say, strokes }; };
  add('s-down', 'Line down', 'Trace the line going down!', ['M50 14 L50 86']);
  add('s-across', 'Line across', 'Trace the line going across!', ['M14 50 L86 50']);
  add('s-circle', 'Circle', 'Trace the circle!', ['M50 12 A38 38 0 1 1 49.9 12']);
  add('s-cross', 'Cross', 'Trace the cross!', ['M50 14 L50 86', 'M14 50 L86 50']);
  add('s-square', 'Square', 'Trace the square!', ['M20 20 L80 20 L80 80 L20 80 Z']);
  add('s-triangle', 'Triangle', 'Trace the triangle!', ['M50 16 L84 82 L16 82 Z']);
  add('s-x', 'X', 'Trace the X!', ['M22 18 L78 82', 'M78 18 L22 82']);
  add('s-diamond', 'Diamond', 'Trace the diamond!', ['M50 12 L84 50 L50 88 L16 50 Z']);
  const NUM = {
    0: ['M50 12 C84 12 84 88 50 88 C16 88 16 12 50 12'],
    1: ['M34 28 L52 12 L52 88'],
    2: ['M26 30 C26 4 78 4 76 32 C74 54 30 70 24 88 L78 88'],
    3: ['M26 20 C40 6 76 10 74 32 C72 50 52 50 46 50 C76 50 80 70 74 82 C62 98 30 96 22 78'],
    4: ['M64 88 L64 12 L20 62 L82 62'],
    5: ['M74 14 L30 14 L26 48 C48 38 78 46 76 68 C74 92 36 96 22 78'],
    6: ['M68 14 C34 8 22 40 22 64 C22 98 78 98 78 66 C78 42 38 38 24 62'],
    7: ['M22 14 L78 14 L42 88'],
    8: ['M50 50 C20 50 24 12 50 12 C76 12 80 50 50 50 C18 50 18 88 50 88 C82 88 82 50 50 50'],
    9: ['M74 38 C74 8 26 8 26 36 C26 62 74 62 74 38 C74 62 68 90 34 88']
  };
  Object.keys(NUM).forEach((n) => add('n-' + n, n, 'Trace the number ' + n + '!', NUM[n]));
  const LET = {
    A: ['M20 88 L50 12 L80 88', 'M32 62 L68 62'],
    B: ['M24 12 L24 88', 'M24 12 L52 12 C78 12 78 48 52 48 L24 48', 'M24 48 L56 48 C84 48 84 88 56 88 L24 88'],
    C: ['M80 26 C62 6 20 14 20 50 C20 86 62 94 80 74'],
    D: ['M24 12 L24 88', 'M24 12 C90 12 90 88 24 88'],
    E: ['M76 12 L24 12 L24 88 L76 88', 'M24 50 L66 50'],
    F: ['M76 12 L24 12 L24 88', 'M24 50 L66 50'],
    G: ['M80 26 C62 6 20 14 20 50 C20 86 66 96 80 70 L80 54 L54 54'],
    H: ['M24 12 L24 88', 'M76 12 L76 88', 'M24 50 L76 50'],
    I: ['M34 12 L66 12', 'M50 12 L50 88', 'M34 88 L66 88'],
    J: ['M62 12 L62 66 C62 94 22 94 22 66'],
    K: ['M26 12 L26 88', 'M74 12 L26 54', 'M42 40 L76 88'],
    L: ['M26 12 L26 88 L76 88'],
    M: ['M20 88 L20 12 L50 60 L80 12 L80 88'],
    N: ['M24 88 L24 12 L76 88 L76 12'],
    O: ['M50 12 C88 12 88 88 50 88 C12 88 12 12 50 12'],
    P: ['M24 88 L24 12 L52 12 C82 12 82 52 52 52 L24 52'],
    Q: ['M50 12 C88 12 88 88 50 88 C12 88 12 12 50 12', 'M58 66 L80 92'],
    R: ['M24 88 L24 12 L52 12 C82 12 82 52 52 52 L24 52', 'M50 52 L78 88'],
    S: ['M76 24 C66 6 24 10 24 32 C24 54 76 46 76 68 C76 92 32 94 22 76'],
    T: ['M20 14 L80 14', 'M50 14 L50 88'],
    U: ['M24 12 L24 62 C24 96 76 96 76 62 L76 12'],
    V: ['M20 12 L50 88 L80 12'],
    W: ['M14 12 L32 88 L50 36 L68 88 L86 12'],
    X: ['M22 12 L78 88', 'M78 12 L22 88'],
    Y: ['M22 12 L50 50 L78 12', 'M50 50 L50 88'],
    Z: ['M24 14 L76 14 L24 86 L76 86']
  };
  Object.keys(LET).forEach((l) => add('l-' + l, l, 'Trace the letter ' + l + '!', LET[l]));
  T.glyphs = G;
  const GROUPS = [
    { id: 'shapes', t: 'Lines and shapes', icon: '⭕', ids: ['s-down', 's-across', 's-circle', 's-cross', 's-square', 's-triangle', 's-x', 's-diamond'] },
    { id: 'numbers', t: 'Numbers', icon: '🔢', ids: Object.keys(NUM).map((n) => 'n-' + n) },
    { id: 'letters', t: 'Letters', icon: '🔤', ids: Object.keys(LET).map((l) => 'l-' + l) },
    { id: 'name', t: 'My name', icon: '⭐', ids: [] }
  ];
  T.groups = GROUPS;
  const nameIds = (ctx) => String(ctx.state.nick || 'Solana').toUpperCase().replace(/[^A-Z]/g, '').split('').map((l) => 'l-' + l);

  const TR = (ctx) => { const g = ctx.ui.games; g.tr = g.tr || { screen: 'menu', group: null, id: null, strokes: [], pass: false, idx: 0, lock: false }; return g.tr; };
  const say = (ctx, t, onend) => F().say(ctx, t, 'en-US', false, true, onend);
  const wins = (ctx, id) => ((ctx.state.traceWins || {})[id]) || 0;
  T.winsOf = wins;
  function addWin(ctx, id) {
    if (API().previewing(ctx)) return;
    ctx.state.traceWins = ctx.state.traceWins || {}; ctx.state.traceWins[id] = wins(ctx, id) + 1; ctx.save();
  }
  const level = (ctx) => SA.stage.level(ctx.state);
  const pts2str = (pts) => pts.map((q) => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ');

  /* ---------- views ---------- */
  const bar = (back, hear) => '<div class="gbar"><button class="btn alt backbtn" data-act="' + back + '" aria-label="Back">◀</button><span></span>' + (hear ? '<button class="iconbtn" data-act="gtr-hear" aria-label="Hear again">🔊</button>' : '<span></span>') + '</div>';
  const miniSvg = (id, cls) => '<svg viewBox="0 0 100 100" class="trmini ' + (cls || '') + '" aria-hidden="true">' + G[id].strokes.map((d) => '<path d="' + d + '"/>').join('') + '</svg>';
  function menuView(ctx) {
    return bar('ghub', false) + '<h2>Trace it!</h2><div class="gbtns n4 secs">' + GROUPS.map((x) => '<button class="gbig" data-act="gtr-group" data-g="' + x.id + '"><span style="font-size:54px">' + x.icon + '</span>' + x.t + '</button>').join('') + '</div>';
  }
  function pickView(ctx, tr) {
    const grp = GROUPS.find((x) => x.id === tr.group);
    return bar('gtr-menu', false) + '<h2>' + grp.t + '</h2><div class="gbtns n4 secs trgrid">' + grp.ids.map((id) => {
      const done = wins(ctx, id) > 0;
      return '<button class="gbig trtile' + (done ? ' done' : '') + '" data-act="gtr-pick" data-id="' + id + '" aria-label="' + ctx.esc(G[id].name) + '">' + miniSvg(id) + (done ? '<b class="trck">✓</b>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function dotsHtml(i, n) { let h = '<span class="dots" role="img" aria-label="' + i + ' of ' + n + '">'; for (let k = 0; k < n; k++) h += '<i class="' + (k < i ? 'on' : '') + '"></i>'; return h + '</span>'; }
  function playView(ctx, tr) {
    const gl = G[tr.id]; const L = level(ctx); const style = L <= 2 ? 'bold' : L === 3 ? 'light' : 'faint';
    const isName = tr.group === 'name'; const ids = isName ? nameIds(ctx) : null;
    const head = '<div class="gbar"><button class="btn alt backbtn" data-act="' + (isName ? 'gtr-menu' : 'gtr-back') + '" aria-label="Back">◀</button>' + (isName ? dotsHtml(tr.idx, ids.length) : '<span></span>') + '<button class="iconbtn" data-act="gtr-hear" aria-label="Hear again">🔊</button></div>';
    const guide = '<g id="trguide">' + gl.strokes.map((d) => '<path d="' + d + '" class="trguide ' + style + '"/>').join('') + '</g>';
    const starts = gl.strokes.map((d, i) => { const m = /^M\s*([\d.]+)[ ,]([\d.]+)/.exec(d); return '<circle cx="' + m[1] + '" cy="' + m[2] + '" r="4.2" class="trstart"/>' + (gl.strokes.length > 1 ? '<text x="' + m[1] + '" y="' + (+m[2] + 1.6) + '" class="trnum">' + (i + 1) + '</text>' : ''); }).join('');
    const drawn = tr.strokes.map((p) => '<polyline points="' + pts2str(p) + '" class="trpath' + (tr.pass ? ' good' : '') + '"/>').join('');
    return head + '<div class="card center gcard sk"><div class="sktrace"><svg id="trsvg" viewBox="0 0 100 100" aria-label="Drawing space">' + guide + starts + drawn + '<polyline id="trcur" points="" class="trpath"/></svg></div>' +
      '<div class="row" style="justify-content:center;margin-top:8px"><button class="btn alt iconbtn big" data-act="gtr-clear" aria-label="Start over">↺</button>' + (isName ? '' : '<button class="btn sun iconbtn big" data-act="gtr-next" aria-label="Next">▶</button>') + '</div></div>';
  }
  function doneView(ctx) {
    return bar('gtr-menu', false) + '<div class="card hero center"><div class="big-em">🎉</div><b style="font-size:28px">You did it!</b>' + API().rainbow(ctx.state.rbBands || 0, false) +
      '<div class="row" style="justify-content:center;margin-top:10px"><button class="btn alt iconbtn big" data-act="gtr-menu" aria-label="More">🏠</button><button class="btn sun iconbtn big" data-act="gtr-again" aria-label="Again">▶</button></div></div>';
  }
  T.view = function (ctx) {
    const tr = TR(ctx);
    if (tr.screen === 'play' && tr.id) return playView(ctx, tr);
    if (tr.screen === 'pick') return pickView(ctx, tr);
    if (tr.screen === 'done') return doneView(ctx);
    return menuView(ctx);
  };

  /* ---------- flow ---------- */
  function startGlyph(ctx, g, tr, id) {
    tr.id = id; tr.strokes = []; tr.pass = false; tr.lock = false; tr.screen = 'play'; g.tok++; ctx.render(false);
    const tok = g.tok; setTimeout(() => { if (g.tok === tok && tr.screen === 'play' && tr.id === id) say(ctx, tr.group === 'name' ? 'Trace the letter ' + G[id].name + ' in your name!' : G[id].say); }, 250);
  }
  function startGroup(ctx, g, tr, gid) {
    tr.group = gid; tr.idx = 0;
    if (gid === 'name') { const ids = nameIds(ctx); if (!ids.length) { tr.screen = 'menu'; ctx.render(false); return; } startGlyph(ctx, g, tr, ids[0]); return; }
    tr.screen = 'pick'; g.tok++; ctx.render(false); say(ctx, GROUPS.find((x) => x.id === gid).t);
  }
  function advance(ctx, g, tr) {
    if (tr.group === 'name') {
      const ids = nameIds(ctx); tr.idx += 1;
      if (tr.idx >= ids.length) { tr.screen = 'done'; API().reward(ctx); API().sYay(); ctx.render(false); say(ctx, 'Wow! You traced your name!'); return; }
      startGlyph(ctx, g, tr, ids[tr.idx]); return;
    }
    const grp = GROUPS.find((x) => x.id === tr.group); const i = grp.ids.indexOf(tr.id);
    startGlyph(ctx, g, tr, grp.ids[(i + 1) % grp.ids.length]);
  }

  T.handle = function (a, d, ctx, g) {
    const tr = TR(ctx);
    switch (a) {
      case 'gtrace': g.tok++; g.screen = 'trace'; tr.screen = 'menu'; ctx.render(false); say(ctx, 'Trace it!'); return true;
      case 'gtr-menu': g.tok++; tr.screen = 'menu'; tr.id = null; try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { /* ignore */ } ctx.render(false); return true;
      case 'gtr-group': startGroup(ctx, g, tr, d.g); return true;
      case 'gtr-pick': startGlyph(ctx, g, tr, d.id); return true;
      case 'gtr-back': g.tok++; tr.screen = 'pick'; tr.id = null; ctx.render(false); return true;
      case 'gtr-next': advance(ctx, g, tr); return true;
      case 'gtr-again': startGroup(ctx, g, tr, 'name'); return true;
      case 'gtr-hear': if (tr.id) say(ctx, tr.group === 'name' ? 'Trace the letter ' + G[tr.id].name + ' in your name!' : G[tr.id].say); return true;
      case 'gtr-clear': tr.strokes = []; tr.pass = false; tr.lock = false; ctx.render(true); return true;
      default: return false;
    }
  };

  /* ---------- checking ---------- */
  function guidePoints() {
    const out = []; const parts = []; let len = 0;
    document.querySelectorAll('#trguide path').forEach((p) => {
      const L = p.getTotalLength(); len += L; const n = Math.max(6, Math.round(L / 2.5)); const part = [];
      for (let i = 0; i <= n; i++) { const q = p.getPointAtLength((L * i) / n); out.push([q.x, q.y]); part.push([q.x, q.y]); }
      parts.push(part);
    });
    return { pts: out, len, parts };
  }
  function dense(strokes) {
    const out = []; let len = 0;
    strokes.forEach((s) => {
      for (let i = 0; i < s.length; i++) {
        out.push(s[i]);
        if (i) { const a = s[i - 1]; const b = s[i]; const dd = Math.hypot(b[0] - a[0], b[1] - a[1]); len += dd; const k = Math.floor(dd / 2.5); for (let j = 1; j < k; j++) out.push([a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k]); }
      }
    });
    return { pts: out, len };
  }
  const near = (p, list, r) => { const r2 = r * r; for (let i = 0; i < list.length; i++) { const dx = p[0] - list[i][0]; const dy = p[1] - list[i][1]; if (dx * dx + dy * dy <= r2) return true; } return false; };
  /* Gentle: most of the guide is covered, most of what she drew is near the guide, and it is not a scribble. */
  T._guide = guidePoints;
  T.judge = function (strokes, guide) {
    const d = dense(strokes); if (d.pts.length < 6 || !guide.pts.length) return { ok: false, why: 'short' };
    const cover = guide.pts.filter((p) => near(p, d.pts, 10)).length / guide.pts.length;
    const prec = d.pts.filter((p) => near(p, guide.pts, 13)).length / d.pts.length;
    if (d.len > guide.len * 3 + 40) return { ok: false, why: 'scribble', cover, prec };
    const eachOk = (guide.parts || []).every((part) => part.filter((p) => near(p, d.pts, 10)).length / part.length >= 0.62);
    return { ok: cover >= 0.78 && prec >= 0.62 && eachOk, why: 'more', cover, prec };
  };

  T.mount = function (ctx) {
    T._ctx = ctx;
    const view = document.getElementById('view'); let drawing = null;
    const toSvg = (svg, e) => { const r = svg.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100]; };
    view.addEventListener('pointerdown', (e) => {
      const svg = e.target.closest ? e.target.closest('#trsvg') : null; if (!svg) return;
      const tr = TR(ctx); if (tr.screen !== 'play' || tr.lock || tr.pass) return;
      drawing = { id: e.pointerId, svg, pts: [toSvg(svg, e)] }; try { svg.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ } e.preventDefault();
    });
    view.addEventListener('pointermove', (e) => {
      if (!drawing || e.pointerId !== drawing.id) return;
      drawing.pts.push(toSvg(drawing.svg, e)); const p = document.getElementById('trcur'); if (p) p.setAttribute('points', pts2str(drawing.pts));
    });
    const end = (e) => {
      if (!drawing || e.pointerId !== drawing.id) return;
      const pts = drawing.pts; drawing = null; const tr = TR(ctx); const g = ctx.ui.games; if (tr.screen !== 'play' || !tr.id) return;
      if (pts.length < 3) { const p = document.getElementById('trcur'); if (p) p.setAttribute('points', ''); return; }
      tr.strokes.push(pts); const p = document.getElementById('trcur'); if (p) p.setAttribute('points', '');
      const r = T.judge(tr.strokes, guidePoints());
      if (r.ok) {
        tr.pass = true; tr.lock = true; addWin(ctx, tr.id); API().sYay(); say(ctx, API().praise(ctx, g, true)); ctx.render(true);
        const tok = g.tok; setTimeout(() => { if (g.tok === tok && tr.screen === 'play') advance(ctx, g, tr); }, 1500);
      } else if (r.why === 'scribble') {
        API().sNo(); say(ctx, 'Nice try! Go slowly along the dots.'); tr.strokes = []; setTimeout(() => ctx.render(true), 300);
      } else {
        ctx.render(true); say(ctx, 'Keep going! Follow the dots.');
      }
    };
    view.addEventListener('pointerup', end); view.addEventListener('pointercancel', end);
  };

  /* Progress: how many of each group she has traced at least once. */
  T.progress = function (ctx) {
    return GROUPS.filter((x) => x.id !== 'name').map((x) => ({ id: x.id, t: x.t, done: x.ids.filter((id) => wins(ctx, id) > 0).map((id) => G[id].name), all: x.ids.map((id) => G[id].name), n: x.ids.length }));
  };
})();
