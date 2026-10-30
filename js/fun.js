/* Solo's Academy: play features (word cards with Spidey lines, sing-along drills, story time,
   sticker chart, unit switcher, daily log). Runs on this device. The only network use is the
   optional Groq story button, which sends just a word and the unit name. */
(function () {
  'use strict';
  const SA = window.SA;
  const F = (SA.fun = {});

  /* Original mascot: Sunny, a friendly sun-star. Not based on any existing character. */
  F.mascot = '<svg viewBox="0 0 100 100" role="img" aria-label="Sunny the sun"><g stroke="#2b2250" stroke-width="4" stroke-linejoin="round">' +
    '<polygon fill="#ff9f1c" points="50,2 60,22 82,12 78,35 98,42 82,58 94,78 72,78 66,98 50,84 34,98 28,78 6,78 18,58 2,42 22,35 18,12 40,22"/>' +
    '<circle cx="50" cy="48" r="28" fill="#ffd23f"/><circle cx="39" cy="42" r="5" fill="#2b2250"/><circle cx="61" cy="42" r="5" fill="#2b2250"/>' +
    '<path d="M36 56 Q50 72 64 56 Z" fill="#ff4d6d"/><circle cx="30" cy="54" r="5" fill="#ff8fa3" stroke="none"/><circle cx="70" cy="54" r="5" fill="#ff8fa3" stroke="none"/></g></svg>';

  const STICKERS = [
    [3, '🌟'], [8, '🦋'], [15, '🚀'], [25, '🦁'], [40, '🌈'], [60, '🏆'], [90, '👑'], [130, '🦸']
  ];

  /* ---------- helpers ---------- */
  function P(ctx) {
    if (!ctx.ui.play) ctx.ui.play = { tab: 'cards', wk: 'All', i: 0, show: false, drill: 0, step: 0, lvl: 1, si: 0, fi: 0, res: '', ai: '', busy: false };
    return ctx.ui.play;
  }
  function unitOf(ctx) { return SA.units.find((u) => u.id === ctx.state.unit) || SA.units[0]; }
  function wordsOf(ctx, u) { return u.words.concat((ctx.state.customWords || {})[u.id] || []); }
  function cardList(ctx, p) {
    const u = unitOf(ctx);
    return wordsOf(ctx, u).filter((w) => p.wk === 'All' || w.week === p.wk || w.week === 'All');
  }
  /* The word in her focus language. Spanish uses the unit data; other languages use Sky's word bank when the word exists there. */
  function tlFor(ctx, w) {
    const lang = ctx.state.focusLang || 'es'; const LBY = ctx.LBY;
    if (lang !== 'es') {
      const m = SA.words.find((x) => x.en.toLowerCase() === w.en.toLowerCase());
      if (m && m[lang]) { const L = LBY[lang]; return { text: m[lang][0], sound: m[lang][1], tag: L.tts, name: L.name, flag: L.flag, rtl: L.dir === 'rtl' }; }
    }
    return { text: w.es, sound: '', tag: LBY.es.tts, name: 'Spanish', flag: '🇪🇸', rtl: false };
  }
  function tagFor(ctx, text) { return /[áéíóúñ]|mariposa/i.test(text) ? ctx.LBY.es.tts : 'en-US'; }
  /* Character-style voice: the device voice with a different pitch and speed. Sing drills stay plain so sounds stay clear. */
  function voiceOf(ctx) { return SA.voices.find((v) => v.id === ctx.state.charVoice) || SA.voices[0]; }
  function say(ctx, text, tag, slow, plain, onend) {
    const o = plain ? {} : Object.assign({}, voiceOf(ctx)); if (onend) o.onend = onend;
    return ctx.speak(text, tag, slow, o);
  }
  function voiceRow(ctx) {
    const cur = voiceOf(ctx).id;
    return '<p class="small muted" style="margin-bottom:4px">Pick a voice:</p>' + chipRow(ctx, SA.voices.map((v) => [v.id, v.emoji + ' ' + v.name]), cur, 'pvoice', 'v');
  }
  /* Mom's voice: parent records a clip per word and language; Solana can play it. Stored on this device only. */
  function momKey(ctx, w, lang) { return 'mom:' + unitOf(ctx).id + ':' + w.en + ':' + lang; }
  function momCard(ctx, w, tl) {
    const esc = ctx.esc; const child = ctx.isChild(); const lang = ctx.state.focusLang || 'es';
    const slots = [['en', 'English', momKey(ctx, w, 'en')], ['tl', tl.name, momKey(ctx, w, lang)]];
    const live = ctx.rec.active();
    if (child && !slots.some((s) => ctx.rec.has(s[2]))) return '';
    const btns = slots.map((s) => {
      const has = ctx.rec.has(s[2]); const on = live === s[2];
      let h = '';
      if (has) h += '<button class="btn sun small" data-act="mplay" data-key="' + esc(s[2]) + '">▶ Mom: ' + esc(s[1]) + '</button> ';
      if (!child) h += '<button class="btn ' + (on ? 'coral' : 'alt') + ' small" data-act="mrec" data-key="' + esc(s[2]) + '">' + (on ? '⏹ Stop' : (has ? '🎙 Redo ' : '🎙 Record ') + esc(s[1])) + '</button>';
      return '<div style="margin:6px 0">' + h + '</div>';
    }).join('');
    return '<div class="card"><b>🎙 Mom’s voice</b>' + (child ? '' : '<p class="small muted">Do your best character voice, then tap Stop. One clip per word and language, up to 20 seconds. Clips stay on this device.</p>') + btns + '</div>';
  }
  F.say = say; F.unitOf = unitOf; F.wordsOf = wordsOf; F.tlFor = tlFor;
  function chipRow(ctx, items, cur, act, key) {
    return '<div class="chips">' + items.map((t) => '<button class="chip" aria-pressed="' + (cur === t[0]) + '" data-act="' + act + '" data-' + key + '="' + ctx.esc(t[0]) + '">' + t[1] + '</button>').join('') + '</div>';
  }

  /* ---------- PLAY tab ---------- */
  F.viewPlay = function (ctx) {
    const p = P(ctx);
    const tabs = [['cards', '🃏 Words'], ['sing', '🎵 Sing'], ['story', '🕷️ Story'], ['stick', '⭐ Stickers']];
    return '<h2>Play</h2>' + chipRow(ctx, tabs, p.tab, 'ptab', 't') + F['p_' + p.tab](ctx, p);
  };

  F.p_cards = function (ctx, p) {
    const esc = ctx.esc; const u = unitOf(ctx); const all = wordsOf(ctx, u);
    const weeks = [['All', 'All']].concat(u.weeks.filter((w) => all.some((x) => x.week === w)).map((w) => [w, w]));
    const list = cardList(ctx, p);
    let h = '<p class="muted small">' + u.emoji + ' Unit: <b>' + esc(u.name) + '</b>' + (ctx.isChild() ? '' : '. Change it in the Theme tab.') + '</p>' + chipRow(ctx, weeks, p.wk, 'pwk', 'w') + voiceRow(ctx);
    if (!list.length) return h + '<div class="card">No words for this week yet.</div>';
    p.i = ((p.i % list.length) + list.length) % list.length;
    const w = list[p.i]; const tl = tlFor(ctx, w); const key = u.id + ':' + w.en; const done = !!ctx.state.fmastered[key];
    const allDone = list.length >= 3 && list.every((x) => ctx.state.fmastered[u.id + ':' + x.en]);
    const wi = weeks.findIndex((x) => x[0] === p.wk); const nextWk = weeks[(wi + 1) % weeks.length][0];
    h += '<div class="card center play-card"><div class="big-em">' + w.emoji + '</div><div class="big-word">' + esc(w.en) + '</div>' +
      (p.show ? '<div class="big-word tl' + (tl.rtl ? ' rtl' : '') + '">' + esc(tl.text) + '</div>' + (tl.sound ? '<p><span class="pill">Sounds like: ' + esc(tl.sound) + '</span></p>' : '') : '<p class="muted small">Tap the language button to reveal the word.</p>') +
      '<p style="font-size:19px">' + esc(w.spidey) + '</p>' +
      '<div class="row" style="justify-content:center"><button class="btn" data-act="pspeak" data-k="en">🔊 English</button>' +
      '<button class="btn coral" data-act="pspeak" data-k="tl">' + tl.flag + ' ' + esc(tl.name) + '</button></div>' +
      '<p><button class="btn sun" data-act="pspeak" data-k="sp">🕷️ Hear Spidey say it</button></p></div>' + momCard(ctx, w, tl) +
      '<div class="row between"><button class="btn alt" data-act="pnav" data-d="-1" aria-label="Previous word">◀</button>' +
      '<button class="btn ' + (done ? 'sun' : 'alt') + '" style="flex:1" data-act="plearn">' + (done ? '⭐ Learned!' : '☆ Mark learned') + '</button>' +
      '<button class="btn alt" data-act="pnav" data-d="1" aria-label="Next word">▶</button></div>' +
      '<p class="center small muted">' + (p.i + 1) + ' of ' + list.length + '</p>' +
      (allDone ? '<div class="card note"><b>🎉 All learned!</b><p>' + (p.wk === 'All' ? 'She knows every word in this unit. Go deeper with Story time, or a craft or science idea in the Theme tab.' : 'She knows every word this week. Skip ahead to the next week (skipping what is mastered is called compacting), or go deeper with Story time (enrichment).') + '</p>' + (p.wk === 'All' ? '' : '<button class="btn" data-act="pwk" data-w="' + esc(nextWk) + '">Next week ▶</button> ') + '<button class="btn alt" data-act="ptab" data-t="story">Go deeper: Story</button></div>' : '');
    return h;
  };

  F.p_sing = function (ctx, p) {
    const esc = ctx.esc; const dr = SA.songDrills[p.drill]; const s = dr.steps[p.step];
    const done = (ctx.state.songDays || []).indexOf(ctx.dkey()) >= 0;
    return '<div class="chips">' + SA.songDrills.map((d, i) => '<button class="chip" aria-pressed="' + (p.drill === i) + '" data-act="pdrill" data-i="' + i + '">' + d.emoji + ' ' + esc(d.movie) + '</button>').join('') + '</div>' +
      '<div class="card center play-card"><span class="pill">Sound focus: ' + esc(dr.sound) + '</span><p class="small">' + esc(dr.tip) + '</p>' +
      '<div class="big-word" style="margin:14px 0">' + esc(s.say) + '</div><p>👉 ' + esc(s.cue) + '</p>' +
      '<div class="row" style="justify-content:center"><button class="btn" data-act="psay" data-plain="1" data-text="' + esc(s.say) + '">🔊 Listen</button>' +
      '<button class="btn alt" data-act="psay" data-plain="1" data-text="' + esc(s.say) + '" data-slow="1">🐢 Slow</button></div>' +
      '<div class="row between" style="margin-top:14px"><button class="btn alt small" data-act="pstep" data-d="-1"' + (p.step === 0 ? ' disabled' : '') + '>◀</button>' +
      '<span class="small muted">Step ' + (p.step + 1) + ' of ' + dr.steps.length + '</span>' +
      '<button class="btn alt small" data-act="pstep" data-d="1"' + (p.step === dr.steps.length - 1 ? ' disabled' : '') + '>▶</button></div></div>' +
      '<button class="btn ' + (done ? 'sun' : '') + '" style="width:100%" data-act="psong-done">' + (done ? '🎉 Today’s 5 minutes done!' : '✅ We did our 5 minutes') + '</button>' +
      '<p class="center small muted">Singing days so far: ' + (ctx.state.songDays || []).length + (ctx.isChild() ? '' : '. These are original sound chants inspired by the sounds in her favorite shows, not song lyrics. Sing drills always use the regular voice so each sound stays clear.') + '</p>';
  };

  F.p_story = function (ctx, p) {
    const esc = ctx.esc; const u = unitOf(ctx); const list = wordsOf(ctx, u);
    const w = list[((p.si % list.length) + list.length) % list.length];
    const sentences = [w.en, 'Spidey sees the ' + w.en + '.', 'Spidey sees the big ' + w.en + ' and says, "Wow!"'];
    const fb = u.feelings[p.fi % u.feelings.length];
    return voiceRow(ctx) + '<div class="card center play-card"><div class="big-em">' + w.emoji + '</div><div class="small muted">' + esc(w.en) + ' / ' + esc(w.es) + '</div>' +
      chipRow(ctx, [[1, '1 word'], [2, 'Short'], [3, 'Longer']].map((x) => [String(x[0]), x[1]]), String(p.lvl), 'plvl', 'n') +
      '<div class="big-word" style="font-size:28px">' + esc(sentences[p.lvl - 1]) + '</div>' +
      '<div class="row" style="justify-content:center"><button class="btn" data-act="psay" data-text="' + esc(sentences[p.lvl - 1]) + '">🔊 Say it</button>' +
      '<button class="btn alt" data-act="pnext-story">Next word ▶</button></div>' +
      '<p><button class="btn coral" data-act="pai"' + (p.busy ? ' disabled' : '') + '>' + (p.busy ? 'Spidey is thinking...' : '🕷️ Ask Spidey for a new story line') + '</button></p>' +
      (ctx.isChild() ? '' : '<p class="small muted">Optional. Needs the internet and the hosted version with a Groq key. It sends only the word and unit name.</p>') +
      (p.ai ? '<div class="say" style="text-align:left;white-space:pre-line">' + esc(p.ai) + '</div>' : '') + '</div>' +
      '<div class="card"><b>Feelings in the ' + esc(u.name) + ' story</b><p style="font-size:19px">' + esc(fb.q) + '</p>' +
      '<div class="grid g3">' + SA.playFeelings.map((f) => '<button class="wc" data-act="pfeel" data-id="' + f.id + '"><span class="em">' + f.emoji + '</span><span class="en">' + f.id + ' / ' + f.es + '</span></button>').join('') + '</div>' +
      (p.res ? '<p><b>' + esc(p.res) + '</b></p>' : '') + '<button class="btn alt small" data-act="pfnext">Next question ▶</button></div>';
  };

  F.p_stick = function (ctx) {
    const st = ctx.state; const total = ctx.starTotal(); const earned = STICKERS.filter((s) => total >= s[0]).length;
    const next = STICKERS.find((s) => total < s[0]);
    const learned = Object.keys(st.learned).filter((k) => st.learned[k]).length + Object.keys(st.fmastered || {}).filter((k) => st.fmastered[k]).length;
    return '<div class="card hero center"><div class="big-em">⭐</div><b style="font-size:26px">' + total + (total === 1 ? ' star!' : ' stars!') + '</b>' +
      '<p>' + (next ? (next[0] - total) + ' more for the next sticker.' : 'Every sticker earned. Amazing!') + '</p></div>' +
      '<div class="grid g3 sticker-board">' + STICKERS.map((s) => total >= s[0]
        ? '<div class="card center sticker on"><div class="big-em">' + s[1] + '</div><div class="small muted">' + s[0] + ' stars</div></div>'
        : '<div class="card center sticker"><div class="big-em">🔒</div><div class="small muted">' + s[0] + ' stars</div></div>').join('') + '</div>' +
      '<div class="grid g3"><div class="card center"><b style="font-size:24px">' + learned + '</b><div class="small muted">words learned</div></div>' +
      '<div class="card center"><b style="font-size:24px">' + (st.songDays || []).length + '</b><div class="small muted">singing days</div></div>' +
      '<div class="card center"><b style="font-size:24px">' + earned + '</b><div class="small muted">stickers</div></div></div>' +
      (ctx.isChild() ? '' : '<p class="small muted center">Stars come from finished stops on Today, words she says, quiz answers, and singing days.</p>');
  };

  /* ---------- UNITS (Theme tab) ---------- */
  F.unitChips = function (ctx) {
    const chip = (u) => '<button class="chip" aria-pressed="' + (ctx.state.unit === u.id) + '" data-act="unit-set" data-id="' + u.id + '">' + u.emoji + ' ' + ctx.esc(u.name) + (SA.themes.some((t) => t.id === u.id) ? ' 📅' : '') + '</button>';
    return '<p class="small muted" style="margin-bottom:4px">Open topics (Solana can also pick these herself in Games):</p><div class="chips">' + SA.units.filter((u) => !u.school).map(chip).join('') + '</div>' +
      '<p class="small muted" style="margin:10px 0 4px">🏫 From school (CREC units, supporting what she does in class):</p><div class="chips">' + SA.units.filter((u) => u.school).map(chip).join('') + '</div>' +
      '<p class="small muted">📅 means the topic has a full 6-week daily plan.</p>';
  };
  F.customWords = function (ctx) {
    const esc = ctx.esc; const u = unitOf(ctx); const mine = (ctx.state.customWords || {})[u.id] || [];
    let h = '';
    h += '<div class="card"><b>Add your own words</b><p class="small muted">Ask her teacher for this week’s list and add it here. Words appear in the Play tab.</p>' +
      '<label class="f" for="cwen">English</label><input type="text" id="cwen" maxlength="30" autocomplete="off">' +
      '<label class="f" for="cwes">Spanish</label><input type="text" id="cwes" maxlength="30" autocomplete="off">' +
      '<label class="f" for="cwem">Emoji</label><input type="text" id="cwem" maxlength="4" value="⭐">' +
      '<p><button class="btn" data-act="cw-add">Add word</button></p>' +
      (mine.length ? '<ul>' + mine.map((w, i) => '<li>' + w.emoji + ' ' + esc(w.en) + ' / ' + esc(w.es) + ' <button class="btn alt small" data-act="cw-del" data-i="' + i + '">Remove</button></li>').join('') + '</ul>' : '') + '</div>';
    return h;
  };

  F.unitPage = function (ctx) {
    const esc = ctx.esc; const u = unitOf(ctx); const mine = (ctx.state.customWords || {})[u.id] || [];
    let h = '<div class="card hero"><b style="font-size:22px">' + u.emoji + ' ' + esc(u.name) + '</b><p>Starter unit. Word cards, Spidey lines, and story time in the Play tab all use this unit. The daily plan on the Today tab still follows Trees until a full plan for this unit is added.</p></div>';
    h += '<details class="acc" open><summary>' + (u.school ? '6-week plan outline' : 'Topic outline') + '</summary><div class="acc-body"><ol>' + u.weeks.map((w) => '<li>' + esc(w) + '</li>').join('') + '</ol></div></details>';
    h += '<div class="card"><b>Words</b>' + u.words.concat(mine).map((w, i) => {
      const tl = tlFor(ctx, w);
      return '<div class="row between" style="padding:8px 0;border-bottom:1px solid var(--line)"><div><span style="font-size:28px">' + w.emoji + '</span> <b style="font-size:20px">' + esc(w.en) + '</b> <span class="muted">/ ' + esc(tl.text) + '</span></div>' +
        '<button class="btn small" data-act="uspeak" data-i="' + i + '" aria-label="Hear ' + esc(w.en) + '">🔊</button></div>';
    }).join('') + '</div>';
    h += F.customWords(ctx);
    return h;
  };

  /* ---------- daily log (Grow tab) ---------- */
  F.viewLog = function (ctx) {
    const esc = ctx.esc; const st = ctx.state; const kind = ctx.ui.lkind || 'gym';
    const log = st.log || [];
    const sp = log.filter((e) => e.kind === 'speech' && e.clarity).slice(0, 10);
    const avg = sp.length ? (sp.reduce((a, e) => a + e.clarity, 0) / sp.length).toFixed(1) : '-';
    const vocab = {}; log.filter((e) => e.kind === 'vocab').forEach((e) => { vocab[e.skill.toLowerCase()] = 1; });
    let h = '<div class="grid g3"><div class="card center"><b style="font-size:24px">' + log.length + '</b><div class="small muted">entries</div></div>' +
      '<div class="card center"><b style="font-size:24px">' + Object.keys(vocab).length + '</b><div class="small muted">new words</div></div>' +
      '<div class="card center"><b style="font-size:24px">' + avg + '</b><div class="small muted">clarity avg</div></div></div>';
    const ints = {}; log.filter((e) => e.kind === 'interest').forEach((e) => { const k = e.skill.toLowerCase(); ints[k] = (ints[k] || 0) + 1; });
    const top = Object.keys(ints).sort((a, b) => ints[b] - ints[a]).slice(0, 3);
    if (top.length) h += '<div class="card note"><b>💡 What she keeps choosing</b><p>' + top.map((k) => esc(k) + ' (' + ints[k] + ')').join(', ') + '</p><p class="small muted">Use this to pick her next activity and unit ideas.</p></div>';
    h += '<div class="card"><b>Log something</b>' + chipRow(ctx, [['gym', '🤸 Gymnastics'], ['speech', '🗣️ Speech'], ['vocab', '📚 New word'], ['interest', '💡 Interest']], kind, 'lkind', 'k');
    if (kind === 'vocab') h += '<label class="f" for="lword">New word (any language)</label><input type="text" id="lword" maxlength="40" autocomplete="off">';
    else if (kind === 'interest') h += '<label class="f" for="lword">What did she pick or love today?</label><input type="text" id="lword" maxlength="60" autocomplete="off" placeholder="for example: lining up cars, singing, water pouring">';
    else h += '<label class="f" for="lskill">Skill</label><select id="lskill">' + SA.trackSkills[kind === 'gym' ? 'gymnastics' : 'speech'].map((s) => '<option>' + esc(s) + '</option>').join('') + '</select>';
    if (kind === 'speech') h += '<label class="f" for="lclar">How clear was she? 1 to 5</label><input type="range" id="lclar" min="1" max="5" value="3" style="width:100%">';
    h += '<label class="f" for="lnote">Note (optional)</label><input type="text" id="lnote" maxlength="120" autocomplete="off">' +
      '<p><button class="btn" data-act="log-add">Save entry</button></p></div>';
    h += '<div class="card"><b>Recent</b>' + (log.length ? '' : '<p class="muted small">Nothing logged yet.</p>') + log.slice(0, 20).map((e) =>
      '<div class="row between" style="padding:8px 0;border-bottom:1px solid var(--line)"><span>' + (e.kind === 'gym' ? '🤸' : e.kind === 'speech' ? '🗣️' : e.kind === 'interest' ? '💡' : '📚') + ' ' + esc(e.skill) + (e.clarity ? ' (' + e.clarity + '/5)' : '') + (e.note ? ': ' + esc(e.note) : '') + '<span class="muted small"> ' + esc(e.date) + '</span></span>' +
      '<button class="btn alt small" data-act="log-del" data-id="' + e.id + '" aria-label="Delete entry">✕</button></div>').join('') + '</div>';
    return h;
  };

  /* ---------- Groq story helper (optional) ---------- */
  async function askSpidey(ctx, p) {
    const u = unitOf(ctx); const list = wordsOf(ctx, u); const w = list[((p.si % list.length) + list.length) % list.length];
    if (location.protocol.indexOf('http') !== 0) { p.ai = 'The story helper works only on the hosted version. See the README, step 4.'; return; }
    p.busy = true; p.ai = ''; ctx.render(true);
    try {
      const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 15000);
      const r = await fetch('/api/spidey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctrl.signal, body: JSON.stringify({ en: w.en, es: w.es, theme: u.name }) });
      clearTimeout(t);
      const data = await r.json();
      p.ai = data.text || ('Spidey could not make a new story right now. Try the Short or Longer lines instead!' + (ctx.isChild() || !data.error ? '' : '\n\nFor the grown-up: ' + data.error));
    } catch (e) { p.ai = 'Could not reach the story helper. Everything else still works offline.'; }
    p.busy = false; ctx.render(true);
  }

  /* ---------- events ---------- */
  F.handle = function (a, d, ctx) {
    const p = P(ctx); const st = ctx.state; const today = ctx.dkey();
    const cur = () => { const l = cardList(ctx, p); return l.length ? l[((p.i % l.length) + l.length) % l.length] : null; };
    if (a !== 'mrec' && ctx.rec.active()) ctx.rec.stop(); /* leaving the card ends a recording */
    switch (a) {
      case 'pvoice': st.charVoice = d.v; ctx.save(); ctx.render(true); say(ctx, 'Hello ' + (ctx.state.nick || 'friend') + '! Let’s learn!', 'en-US'); return true;
      case 'mplay': ctx.rec.play(d.key); return true;
      case 'mrec': {
        if (ctx.rec.active()) { ctx.rec.stop(); return true; }
        ctx.rec.start(d.key, () => ctx.render(true)).then(() => ctx.render(true));
        return true;
      }
      case 'ptab': p.tab = d.t; ctx.render(true); return true;
      case 'pwk': p.wk = d.w; p.i = 0; p.show = false; ctx.render(true); return true;
      case 'pnav': p.i += +d.d; p.show = false; ctx.render(true); return true;
      case 'pspeak': {
        const w = cur(); if (!w) return true; const tl = tlFor(ctx, w);
        if (d.k === 'en') say(ctx, w.en, 'en-US');
        else if (d.k === 'tl') { p.show = true; ctx.render(true); if (!say(ctx, tl.text, tl.tag)) ctx.toast('No ' + tl.name + ' voice on this device.'); }
        else say(ctx, w.spidey, 'en-US');
        return true;
      }
      case 'plearn': { const w = cur(); if (!w) return true; const k = unitOf(ctx).id + ':' + w.en; st.fmastered = st.fmastered || {}; st.fmastered[k] = !st.fmastered[k]; ctx.save(); ctx.render(true); if (st.fmastered[k]) ctx.toast('Learned! ⭐'); return true; }
      case 'pdrill': p.drill = +d.i; p.step = 0; ctx.render(true); return true;
      case 'pstep': p.step = Math.max(0, Math.min(SA.songDrills[p.drill].steps.length - 1, p.step + +d.d)); ctx.render(true); return true;
      case 'psay': say(ctx, d.text, tagFor(ctx, d.text), d.slow === '1', d.plain === '1'); return true;
      case 'psong-done': st.songDays = st.songDays || []; if (st.songDays.indexOf(today) < 0) { st.songDays.push(today); ctx.save(); ctx.toast('Great singing! +1 ⭐'); } ctx.render(true); return true;
      case 'plvl': p.lvl = +d.n; ctx.render(true); return true;
      case 'pnext-story': p.si += 1; p.ai = ''; ctx.render(true); return true;
      case 'pai': askSpidey(ctx, p); return true;
      case 'pfeel': {
        const u = unitOf(ctx); const fb = u.feelings[p.fi % u.feelings.length]; const ok = d.id === fb.a;
        p.res = ok ? 'Yes! ' + fb.a + ' / ' + fb.es : 'Hmm, try again!'; ctx.render(true); if (ok) say(ctx, fb.a, 'en-US'); return true;
      }
      case 'pfnext': p.fi += 1; p.res = ''; ctx.render(true); return true;
      case 'unit-set': ctx.ui.tweek = null; st.unit = d.id; p.wk = 'All'; p.i = 0; p.si = 0; p.fi = 0; p.show = false; p.ai = ''; ctx.save(); ctx.render(true); ctx.toast('Unit: ' + unitOf(ctx).name); return true;
      case 'uspeak': { const u = unitOf(ctx); const w = wordsOf(ctx, u)[+d.i]; if (w) say(ctx, w.en, 'en-US'); return true; }
      case 'cw-add': {
        const en = (document.getElementById('cwen').value || '').trim(); const es = (document.getElementById('cwes').value || '').trim();
        const emoji = (document.getElementById('cwem').value || '⭐').trim() || '⭐';
        if (!en || !es) { ctx.toast('Add both words'); return true; }
        const id = unitOf(ctx).id; st.customWords = st.customWords || {}; st.customWords[id] = st.customWords[id] || [];
        st.customWords[id].push({ en, es, emoji, week: 'All', spidey: 'Spidey says: ' + en + '!', spideyEs: 'Spidey dice: ' + es + '!' });
        ctx.save(); ctx.render(true); ctx.toast('Word added'); return true;
      }
      case 'cw-del': { const id = unitOf(ctx).id; (st.customWords[id] || []).splice(+d.i, 1); ctx.save(); ctx.render(true); return true; }
      case 'lkind': ctx.ui.lkind = d.k; ctx.render(true); return true;
      case 'log-add': {
        const kind = ctx.ui.lkind || 'gym'; const note = (document.getElementById('lnote').value || '').trim();
        const e = { id: Date.now(), date: today, kind, note, skill: '' };
        if (kind === 'vocab' || kind === 'interest') { e.skill = (document.getElementById('lword').value || '').trim(); if (!e.skill) { ctx.toast(kind === 'vocab' ? 'Type the new word' : 'Type what she loved'); return true; } }
        else e.skill = document.getElementById('lskill').value;
        if (kind === 'speech') e.clarity = +document.getElementById('lclar').value;
        st.log = st.log || []; st.log.unshift(e); ctx.save(); ctx.render(true); ctx.toast('Saved'); return true;
      }
      case 'log-del': st.log = (st.log || []).filter((e) => String(e.id) !== String(d.id)); ctx.save(); ctx.render(true); return true;
      default: return false;
    }
  };

  F.mount = function () {
    Array.prototype.forEach.call(document.querySelectorAll('.mascot-slot'), (el) => { el.innerHTML = F.mascot; });
  };
})();
