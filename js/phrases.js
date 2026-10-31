/* Solo's Academy: your voice for the lines the games repeat the most (praise, try again, starting and finishing).
   A recorded clip is used in place of the device voice whenever a spoken line contains that exact phrase. */
(function () {
  'use strict';
  const SA = window.SA = window.SA || {};
  SA.phraseKey = function (t) {
    const k = String(t || '').toLowerCase().replace(/[’‘`]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
    return k ? 'mom:phrase:' + k : '';
  };
  const PRAISE = ['Great job!', 'You got it!', 'Awesome!', 'Super!', 'Nice work!', 'Amazing!', 'That is right!', 'Yay, you did it!', 'Fantastic!'];
  const SHORT = ['Yes!', 'Good!', 'Nice!', 'Great!'];
  const P = (SA.phrases = {});
  P.groups = function (ctx) {
    const nick = ctx.state.nick || 'Solana';
    return [
      { id: 'praise', t: '👏 Praise after a right answer', list: PRAISE },
      { id: 'short', t: '✨ Quick cheers', list: SHORT },
      { id: 'again', t: '💛 Try again', list: ['Try again!', 'Try again. Listen!', 'Nice try! Make it go all the way around.', 'Pick a piece first!'] },
      { id: 'start', t: '🚀 Starting', list: ['Hi ' + nick + '! Let’s learn!', 'Let us go!', 'Think it!'] },
      { id: 'end', t: '🌈 Finishing', list: ['You did it! All done!', 'Wow! A rainbow!', 'You are growing! New games for you!'] }
    ];
  };
  P.counts = function (ctx) {
    let n = 0; let d = 0;
    P.groups(ctx).forEach((g) => g.list.forEach((t) => { n++; if (ctx.rec.has(SA.phraseKey(t))) d++; }));
    return { n, d };
  };
  P.card = function (ctx) {
    const esc = ctx.esc; const c = P.counts(ctx); const live = ctx.rec.active(); const on = ctx.state.momPhrases !== false;
    let h = '<div class="card"><b>🎙 Your voice in the games (' + c.d + ' of ' + c.n + ' recorded)</b>' +
      '<p class="small muted">Record these once. Whenever a game says one of them, Solana hears you. Everything else still uses the phone voice. Tap Record, say it, tap Stop.</p>' +
      '<div class="chips" style="margin:6px 0"><button class="chip" aria-pressed="' + on + '" data-act="mom-toggle">' + (on ? '✓ Using my voice' : 'Using phone voice only') + '</button></div>';
    P.groups(ctx).forEach((g) => {
      const d = g.list.filter((t) => ctx.rec.has(SA.phraseKey(t))).length;
      h += '<details class="acc" data-id="ph-' + g.id + '"' + (ctx.ui.openDetails && ctx.ui.openDetails['ph-' + g.id] ? ' open' : '') + '><summary>' + g.t + ' (' + d + ' of ' + g.list.length + ')</summary><div class="acc-body">' +
        g.list.map((t) => {
          const k = SA.phraseKey(t); const has = ctx.rec.has(k); const rec = live === k;
          return '<div style="margin:8px 0"><div style="font-size:18px"><b>' + esc(t) + '</b></div>' +
            (has ? '<button class="btn sun small" data-act="mplay" data-key="' + esc(k) + '">▶ Hear</button> ' : '') +
            '<button class="btn ' + (rec ? 'coral' : 'alt') + ' small" data-act="mrec" data-key="' + esc(k) + '">' + (rec ? '⏹ Stop' : (has ? '🎙 Redo' : '🎙 Record')) + '</button></div>';
        }).join('') + '</div></details>';
    });
    return h + '</div>';
  };
})();
