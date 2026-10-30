/* Solo's Academy: renders the daily parent move on Today, the set-up checklist and habits in Activities, and keep-it-light notes in game settings. */
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
    const esc = ctx.esc; const x = P.todayMove(diff); const w = P.why(x.cat.id);
    return '<details class="card parent-move" data-id="pmove"><summary style="cursor:pointer"><b>' + x.cat.e + ' ' + esc(x.m.t) + '</b> <span class="pill">' + esc(x.cat.name) + '</span></summary>' +
      '<p style="margin:8px 0 4px">' + esc(x.m.d) + '</p>' +
      '<div class="say"><b>Try saying:</b> ' + esc(x.m.say) + '</div>' + (w ? '<p class="small muted" style="margin:6px 0 0"><b>Why:</b> ' + esc(w.t) + '. ' + esc(w.d.split('. ')[0].replace(/\.$/, '')) + '.</p>' : '') + '</details>';
  };

  /* Which big idea sits behind each daily move (shown as a one-line "Why"). */
  const WHY = { serve: 0, practical: 2, effort: 1, play: 4, choice: 3, narrate: 6, music: 6, move: 6, routine: 5, notice: 3 };
  P.why = function (catId) {
    const k = WHY[catId]; if (k === undefined) return null;
    return SA.parentGuide.principles[k];
  };

  /* Home setup checklist, shown in the Activities tab. */
  P.setupCard = function (ctx) {
    const esc = ctx.esc; const hs = ctx.state.homeSetup || {}; const items = SA.homeSetup;
    const done = items.filter((i) => hs[i.id]).length;
    return '<details class="acc" data-id="act-setup"' + (ctx.ui.openDetails['act-setup'] ? ' open' : '') + '><summary>🏠 Set up her space (' + done + ' of ' + items.length + ')</summary><div class="acc-body">' +
      '<p class="small muted">Small changes so she can do things without asking. Check each one when it is done.</p>' +
      items.map((i) => '<label class="check-row" style="display:flex;gap:10px;align-items:flex-start;margin:8px 0"><input type="checkbox" data-hs="' + i.id + '"' + (hs[i.id] ? ' checked' : '') + '> <span>' + esc(i.t) + '</span></label>').join('') +
      '<p class="small muted">' + esc(SA.parentGuide.safety) + '</p><p class="small muted">Book for you: The Montessori Child, by Simone Davies and Junnifa Uzodike (home setup ideas for ages 3 to 12).</p></div></details>';
  };

  /* Long-run habits as a weekly tick list in the Activities tab. */
  P.habitsCard = function (ctx, weekKey) {
    const esc = ctx.esc; const hb = (ctx.state.habitWeek || {})[weekKey] || {}; const items = SA.parentGuide.habits;
    const done = items.filter((x, i) => hb[i]).length;
    return '<details class="acc" data-id="act-habits"' + (ctx.ui.openDetails['act-habits'] ? ' open' : '') + '><summary>🧱 Habits that build over the years (' + done + ' of ' + items.length + ' this week)</summary><div class="acc-body">' +
      '<p class="small muted">Tick each one when you did it this week. They reset every week.</p>' +
      items.map((x, i) => '<label style="display:flex;gap:10px;align-items:flex-start;margin:8px 0"><input type="checkbox" data-hb="' + i + '"' + (hb[i] ? ' checked' : '') + '> <span>' + esc(x) + '</span></label>').join('') + '</div></details>';
  };

  /* Keep-it-light rules, shown in Learn and game settings. */
  P.lightRules = function (ctx) {
    return '<div class="card"><b>🪶 Keep it light</b><ul class="small" style="margin:6px 0 0 18px">' + SA.parentGuide.dont.map((x) => '<li>' + ctx.esc(x) + '</li>').join('') + '</ul></div>';
  };
})();
