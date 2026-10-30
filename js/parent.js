/* Solo's Academy: renders the daily parent move on Today and the Parent guide in Progress. */
(function () {
  'use strict';
  const SA = window.SA;
  const P = (SA.parent = {});

  /* One move per day. Categories cycle daily; the move inside a category rotates every cycle. */
  P.todayMove = function (diff) {
    const cats = SA.moveCats; const cat = cats[((diff % cats.length) + cats.length) % cats.length];
    const list = SA.parentMoves[cat.id]; const m = list[Math.floor(diff / cats.length) % list.length];
    return { cat, m };
  };

  P.moveCard = function (ctx, diff) {
    const esc = ctx.esc; const x = P.todayMove(diff);
    return '<details class="card parent-move" data-id="pmove"><summary style="cursor:pointer"><b>' + x.cat.e + ' ' + esc(x.m.t) + '</b> <span class="pill">' + esc(x.cat.name) + '</span></summary>' +
      '<p style="margin:8px 0 4px">' + esc(x.m.d) + '</p>' +
      '<div class="say"><b>Try saying:</b> ' + esc(x.m.say) + '</div></details>';
  };

  /* Guide sections as data so Grow can show them as tiles. Each section: id, emoji, title, html body. */
  P.sections = function (ctx) {
    const esc = ctx.esc; const G = SA.parentGuide; const st = ctx.state; const hs = st.homeSetup || {};
    const done = SA.homeSetup.filter((i) => hs[i.id]).length;
    const B = SA.bigGoals; const li = (a) => '<ul>' + a.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>';
    const say = (t, d) => '<div class="say"><b>' + esc(t) + '</b><br>' + esc(d) + '</div>';
    const E = G.eclectic; const L = G.later;
    return [
      { id: 'ideas', e: '💡', t: 'Big ideas', n: G.principles.length + ' ideas', body: G.principles.map((p) => say(p.t, p.d)).join('') },
      { id: 'moves', e: '🤝', t: 'Parent moves', n: 'Try one today', body: SA.moveCats.map((c) => '<h3>' + c.e + ' ' + esc(c.name) + '</h3>' + SA.parentMoves[c.id].map((m) => '<div class="say"><b>' + esc(m.t) + '</b><br>' + esc(m.d) + '<br><span class="muted small">Try saying: ' + esc(m.say) + '</span></div>').join('')).join('') },
      { id: 'setup', e: '🏠', t: 'Home setup', n: done + ' of ' + SA.homeSetup.length, body: '<p class="small muted">Small changes so she can do things without asking. Check each one when it is done.</p>' + SA.homeSetup.map((i) => '<label class="ck"><input type="checkbox" data-hs="' + i.id + '"' + (hs[i.id] ? ' checked' : '') + '><span>' + esc(i.t) + '</span></label>').join('') },
      { id: 'build', e: '🧱', t: 'Build by 10', n: B.habits.length + ' habits', body: li(B.habits) },
      { id: 'time', e: '🗓️', t: 'Timeline', n: B.timeline.length + ' stops', body: B.timeline.map((t) => say(t.when, t.what)).join('') },
      { id: 'avoid', e: '🚫', t: 'What to avoid', n: G.dont.length + ' things', body: li(G.dont) },
      { id: 'methods', e: '🧩', t: E.title, n: 'Teaching styles', body: '<p>' + esc(E.intro) + '</p><h3>Four approaches that mix well</h3>' + E.approaches.map((x) => '<div class="say"><b>' + esc(x.t) + '</b>: ' + esc(x.d) + '<br><span class="muted small">' + esc(x.app) + '</span></div>').join('') +
        '<h3>Three ways to organize learning</h3>' + E.models.map((x) => say(x.t, x.d)).join('') + '<h3>Three pieces that fit any method</h3>' + E.pieces.map((x) => say(x.t, x.d)).join('') +
        '<h3>How to notice what fits her</h3>' + li(E.notice) + '<div class="card warn small">' + esc(E.caution) + '</div>' },
      { id: 'gifted', e: '🚀', t: L.title, n: 'Going deeper', body: '<p>' + esc(L.intro) + '</p><h3>Four ideas gifted programs use</h3>' + L.terms.map((x) => say(x.t, x.d)).join('') + '<h3>Three ways a curriculum can be built</h3>' + L.models.map((x) => say(x.t, x.d)).join('') +
        '<h3>Frameworks and programs to know about</h3>' + L.programs.map((x) => '<div class="say"><b>' + esc(x.t) + '</b><br>' + esc(x.d) + '</div>').join('') + '<div class="card warn small">' + esc(L.caution) + '</div>' },
      { id: 'book', e: '📖', t: 'Book', n: G.books.length + (G.books.length === 1 ? ' pick' : ' picks'), body: G.books.map((b) => '<div class="say"><b>' + esc(b.t) + '</b> by ' + esc(b.by) + '<br>' + esc(b.note) + '<br><span class="muted small">Check your library for a copy.</span></div>').join('') },
    ];
  };
  P.safety = function (ctx) { return '<div class="card warn small">' + ctx.esc(SA.parentGuide.safety) + '</div>'; };
  P.viewGuide = function (ctx) {
    const esc = ctx.esc; const G = SA.parentGuide;
    return '<div class="card hero"><b style="font-size:20px">Parent guide</b><p>' + esc(G.intro) + '</p></div>' +
      P.sections(ctx).map((x, k) => '<details class="acc"' + (k === 0 ? ' open' : '') + '><summary>' + esc(x.t) + '</summary><div class="acc-body">' + x.body + '</div></details>').join('') + P.safety(ctx);
  };
})();
