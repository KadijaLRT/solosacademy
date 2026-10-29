/* Solo's Academy: renders the daily parent move on Today and the Parent guide in Grow. */
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
    return '<div class="card parent-move"><div class="row between"><b>' + x.cat.e + ' Parent move of the day</b><span class="pill">' + esc(x.cat.name) + '</span></div>' +
      '<p style="margin:8px 0 4px"><b>' + esc(x.m.t) + '</b></p><p style="margin:4px 0">' + esc(x.m.d) + '</p>' +
      '<div class="say"><b>Try saying:</b> ' + esc(x.m.say) + '</div>' +
      '<p class="small muted" style="margin-bottom:0">More ideas in Grow, Parent guide.</p></div>';
  };

  P.viewGuide = function (ctx) {
    const esc = ctx.esc; const G = SA.parentGuide; const st = ctx.state; const hs = st.homeSetup || {};
    const done = SA.homeSetup.filter((i) => hs[i.id]).length;
    let h = '<div class="card hero"><b style="font-size:20px">Parent guide</b><p>' + esc(G.intro) + '</p></div>';
    h += '<details class="acc" open><summary>The big ideas</summary><div class="acc-body">' + G.principles.map((p) => '<div class="say"><b>' + esc(p.t) + '</b><br>' + esc(p.d) + '</div>').join('') + '</div></details>';
    h += '<details class="acc"><summary>All the parent moves</summary><div class="acc-body">' + SA.moveCats.map((c) =>
      '<h3>' + c.e + ' ' + esc(c.name) + '</h3>' + SA.parentMoves[c.id].map((m) => '<div class="say"><b>' + esc(m.t) + '</b><br>' + esc(m.d) + '<br><span class="muted small">Try saying: ' + esc(m.say) + '</span></div>').join('')).join('') + '</div></details>';
    h += '<details class="acc"><summary>Home setup checklist (' + done + ' of ' + SA.homeSetup.length + ')</summary><div class="acc-body"><p class="small muted">Small changes so she can do things without asking. Check each one when it is done.</p>' +
      SA.homeSetup.map((i) => '<label class="ck"><input type="checkbox" data-hs="' + i.id + '"' + (hs[i.id] ? ' checked' : '') + '><span>' + esc(i.t) + '</span></label>').join('') + '</div></details>';
    h += '<details class="acc"><summary>What to avoid</summary><div class="acc-body"><ul>' + G.dont.map((d) => '<li>' + esc(d) + '</li>').join('') + '</ul></div></details>';
    const E = G.eclectic;
    h += '<details class="acc"><summary>' + esc(E.title) + '</summary><div class="acc-body"><p>' + esc(E.intro) + '</p>' +
      '<h3>Four approaches that mix well</h3>' + E.approaches.map((x) => '<div class="say"><b>' + esc(x.t) + '</b>: ' + esc(x.d) + '<br><span class="muted small">' + esc(x.app) + '</span></div>').join('') +
      '<p class="small muted">' + esc(E.attribution) + '</p>' +
      '<h3>Three ways to organize learning</h3>' + E.models.map((x) => '<div class="say"><b>' + esc(x.t) + '</b><br>' + esc(x.d) + '</div>').join('') +
      '<h3>Three pieces that fit any method</h3>' + E.pieces.map((x) => '<div class="say"><b>' + esc(x.t) + '</b><br>' + esc(x.d) + '</div>').join('') +
      '<h3>How to notice what fits her</h3><ul>' + E.notice.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
      '<div class="card warn small">' + esc(E.caution) + '</div></div></details>';
    const L = G.later;
    h += '<details class="acc"><summary>' + esc(L.title) + '</summary><div class="acc-body"><p>' + esc(L.intro) + '</p>' +
      '<h3>Four ideas gifted programs use</h3>' + L.terms.map((x) => '<div class="say"><b>' + esc(x.t) + '</b><br>' + esc(x.d) + '</div>').join('') +
      '<h3>Three ways a curriculum can be built</h3>' + L.models.map((x) => '<div class="say"><b>' + esc(x.t) + '</b><br>' + esc(x.d) + '</div>').join('') + '<h3>Frameworks and programs to know about</h3>' + L.programs.map((x) => '<div class="say"><b>' + esc(x.t) + '</b><br>' + esc(x.d) + (x.u ? '<br><a href="' + esc(x.u) + '" target="_blank" rel="noopener">Learn more</a>' : '') + '</div>').join('') +
      '<div class="card warn small">' + esc(L.caution) + '</div></div></details>';
    h += '<details class="acc"><summary>Book</summary><div class="acc-body">' + G.books.map((b) => '<div class="say"><b>' + esc(b.t) + '</b> by ' + esc(b.by) + '<br>' + esc(b.note) + '<br><a href="' + esc(b.u) + '" target="_blank" rel="noopener">Learn more</a><br><span class="muted small">Check your library for a copy.</span></div>').join('') + '</div></details>';
    h += '<details class="acc"><summary>Sources</summary><div class="acc-body"><ul>' + G.sources.map((s) => '<li><a href="' + esc(s.u) + '" target="_blank" rel="noopener">' + esc(s.t) + '</a></li>').join('') + '</ul><p class="small muted">Checked October 29, 2026. These are parenting ideas, not medical advice.</p></div></details>';
    h += '<div class="card warn small">' + esc(G.safety) + '</div>';
    return h;
  };
})();
