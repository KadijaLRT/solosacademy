/* Solo's Academy: Solana's Play, Words and Feelings tabs.
   Same layout as Games: big picture tiles, one choice per screen, a back arrow, and everything spoken aloud (she cannot read yet).
   Singing: a small xylophone melody plays and each word is spoken on its note. The device voice is still a computer voice,
   so recorded singing from a grown-up always sounds best. */
(function () {
  'use strict';
  const SA = window.SA; const K = (SA.kid = {});
  const F = () => SA.fun;
  const PENTA = [0, 2, 4, 7, 9, 12];
  const CONTOUR = [0, 1, 2, 1, 3, 2, 1, 0];
  let ac = null; let tok = 0;
  function audio() { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); return ac; }
  function note(semi) {
    try {
      const a = audio(); const t = a.currentTime; const o = a.createOscillator(); const gn = a.createGain();
      o.type = 'triangle'; o.frequency.value = 523.25 * Math.pow(2, semi / 12);
      gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(0.2, t + 0.02); gn.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
      o.connect(gn); gn.connect(a.destination); o.start(t); o.stop(t + 0.75);
    } catch (e) { /* sound is optional */ }
  }
  /* Sing a line: one melody note per word, each word spoken higher or lower to follow the tune. */
  K.sing = function (ctx, text, tag, onend, onword) {
    const my = ++tok; const words = String(text).replace(/[!?.,;:]/g, ' ').split(/\s+/).filter(Boolean);
    let i = 0;
    const done = () => { if (my === tok && onend) onend(); };
    const next = () => {
      if (my !== tok) return;
      if (i >= words.length) { setTimeout(done, 200); return; }
      const idx = i; const last = idx === words.length - 1;
      const semi = last ? 0 : PENTA[CONTOUR[idx % CONTOUR.length]]; i += 1;
      if (onword) onword(idx);
      note(semi);
      let moved = false; const go = () => { if (moved || my !== tok) return; moved = true; setTimeout(next, 120); };
      setTimeout(() => {
        const ok = ctx.speak(words[idx], tag, false, { pitch: 1 + semi * 0.05, rate: last ? 0.7 : 0.8, onend: go });
        setTimeout(go, ok ? 1600 : 500);
      }, 90);
    };
    next();
    return true;
  };
  K.stop = function () { tok++; try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { /* ignore */ } };

  /* ---------- shared bits ---------- */
  const KS = (ctx) => { const u = ctx.ui; u.kid = u.kid || {}; return u.kid; };
  const T = (ctx, tab) => { const k = KS(ctx); k[tab] = k[tab] || { stack: [], i: 0, drill: 0, step: 0, fi: 0, si: 0 }; return k[tab]; };
  /* Grown-up recordings made in the parent Play tab (Mom's voice) play first when they exist. */
  const momKey = (ctx, w, lang) => 'mom:' + F().unitOf(ctx).id + ':' + w.en + ':' + lang;
  const hasMom = (ctx, w, lang) => !!(ctx.rec && ctx.rec.has(momKey(ctx, w, lang)));
  const say = (ctx, text, tag, plain) => F().say(ctx, text, tag || 'en-US', false, plain !== false);
  function bar(canBack) {
    return '<div class="gbar">' + (canBack ? '<button class="btn alt backbtn" data-act="kback" aria-label="Back">◀</button>' : '<span></span>') + '<span></span><button class="iconbtn" data-act="kagain" aria-label="Hear again">🔊</button></div>';
  }
  const tile = (act, attrs, em, label, style) => '<button class="gbig"' + (style ? ' style="' + style + '"' : '') + ' data-act="' + act + '" ' + attrs + '><span>' + em + '</span>' + label + '</button>';
  const grid = (h) => '<div class="gbtns n4 secs">' + h + '</div>';
  const topicStyle = (u) => 'background:linear-gradient(160deg,' + u.c2 + ',' + u.c1 + ')';
  function topicTiles(ctx) {
    return (SA.topicOrder || SA.units.map((u) => u.id)).map((id) => SA.units.find((u) => u.id === id)).filter(Boolean)
      .map((u) => tile('ktopic', 'data-id="' + u.id + '"', SA.topicIc(u), ctx.esc(u.name) + (u.school ? ' 🏫' : ''), topicStyle(u))).join('');
  }
  K.view = function (ctx, tab) {
    const t = T(ctx, tab); const scr = t.stack.length ? t.stack[t.stack.length - 1] : 'hub';
    ctx.ui.kidTab = tab;
    const fn = K['v_' + tab + '_' + scr] || K['v_' + tab + '_hub'];
    const h = fn(ctx, t);
    return h;
  };
  function open(ctx, tab, scr) { const t = T(ctx, tab); t.stack.push(scr); ctx.render(false); }

  /* ---------- PLAY ---------- */
  K.v_learn_hub = function (ctx) {
    return grid(tile('kopen', 'data-t="learn" data-s="topics"', SA.ic('cards'), 'Word cards') + tile('kopen', 'data-t="learn" data-s="songs"', SA.ic('music'), 'Sing') + tile('kopen', 'data-t="learn" data-s="story"', SA.ic('story'), 'Story') + tile('kopen', 'data-t="learn" data-s="langs"', SA.ic('words'), 'Words'));
  };
  K.v_learn_topics = function (ctx) { return bar(true) + grid(topicTiles(ctx)); };
  K.v_learn_cards = function (ctx, t) {
    const u = F().unitOf(ctx); const list = F().wordsOf(ctx, u); t.i = ((t.i % list.length) + list.length) % list.length; const w = list[t.i]; const tl = F().tlFor(ctx, w);
    return bar(true) + '<div class="card center gcard"><div class="big-em">' + SA.pic(w.emoji, w.en) + '</div><div class="big-word">' + ctx.esc(w.en) + '</div>' +
      '<div class="row" style="justify-content:center;margin-top:8px"><button class="btn iconbtn big" data-act="ksay" data-k="en" aria-label="English">🇺🇸</button><button class="btn coral iconbtn big" data-act="ksay" data-k="tl" aria-label="' + ctx.esc(tl.name) + '">' + tl.flag + '</button></div>' +
      '<div class="row between" style="margin-top:14px"><button class="btn alt iconbtn big" data-act="knav" data-d="-1" aria-label="Previous">◀</button><button class="btn sun iconbtn big" data-act="knav" data-d="1" aria-label="Next">▶</button></div></div>';
  };
  K.v_learn_songs = function (ctx) {
    return bar(true) + grid(SA.songDrills.map((d, i) => tile('kdrill', 'data-i="' + i + '"', SA.ic('music'), ctx.esc(d.movie))).join(''));
  };
  K.v_learn_song = function (ctx, t) {
    const dr = SA.songDrills[t.drill]; const s = dr.steps[t.step];
    return bar(true) + '<div class="card center gcard"><div class="big-em">' + dr.emoji + '</div><div class="big-word" id="kline">' + ctx.esc(s.say) + '</div>' +
      '<div class="row" style="justify-content:center;margin-top:8px"><button class="btn iconbtn big" data-act="ksay" data-k="sing" aria-label="Sing">🎵</button><button class="btn alt iconbtn big" data-act="ksay" data-k="slow" aria-label="Slowly">🐢</button></div>' +
      '<div class="row between" style="margin-top:14px"><button class="btn alt iconbtn big" data-act="kstep" data-d="-1"' + (t.step === 0 ? ' disabled' : '') + ' aria-label="Back">◀</button><button class="btn sun iconbtn big" data-act="kstep" data-d="1"' + (t.step === dr.steps.length - 1 ? ' disabled' : '') + ' aria-label="Next">▶</button></div></div>';
  };
  K.v_learn_story = function (ctx, t) {
    const u = F().unitOf(ctx); const list = F().wordsOf(ctx, u); const w = list[((t.si % list.length) + list.length) % list.length];
    return bar(true) + '<div class="card center gcard"><div class="big-em">' + SA.pic(w.emoji, w.en) + '</div><div class="big-word" style="font-size:26px">' + ctx.esc(F().hero(ctx).name) + ' sees the ' + ctx.esc(w.en) + '.</div>' +
      '<div class="row" style="justify-content:center;margin-top:8px"><button class="btn iconbtn big" data-act="ksay" data-k="story" aria-label="Hear it">🔊</button><button class="btn sun iconbtn big" data-act="kstory" aria-label="Next">▶</button></div></div>';
  };

  /* ---------- WORDS ---------- */
  K.v_learn_langs = function (ctx) {
    const fl = ctx.LBY[ctx.state.focusLang || 'es'] || ctx.LBY.es;
    return bar(true) + grid(tile('kwlang', 'data-l="en"', '🇺🇸', 'English') + tile('kwlang', 'data-l="' + fl.id + '"', fl.flag, ctx.esc(fl.name)));
  };
  K.v_learn_cats = function (ctx, t) {
    if (t.lang === 'en') return bar(true) + grid(SA.english.map((c, i) => tile('kwcat', 'data-c="' + i + '"', c.words[0].e, ctx.esc(c.cat))).join(''));
    return bar(true) + grid(SA.categories.filter((c) => SA.words.some((w) => w.c === c.id && w[t.lang])).map((c) => tile('kwcat', 'data-c="' + c.id + '"', c.emoji, ctx.esc(c.name))).join(''));
  };
  function wordItems(ctx, t) {
    if (t.lang === 'en') return SA.english[+t.cat].words.map((w) => ({ e: w.e, text: w.w, tag: 'en-US' }));
    const L = ctx.LBY[t.lang];
    return SA.words.filter((w) => w.c === t.cat && w[t.lang]).map((w) => ({ e: w.e, text: w[t.lang][0], tag: L.tts, rtl: L.dir === 'rtl' }));
  }
  K.v_learn_list = function (ctx, t) {
    t.items = wordItems(ctx, t);
    return bar(true) + grid(t.items.map((x, i) => tile('kword', 'data-i="' + i + '"', x.e, '<span style="font-size:15px;line-height:1.1"' + (x.rtl ? ' dir="rtl"' : '') + '>' + ctx.esc(x.text) + '</span>')).join(''));
  };

  /* ---------- FEELINGS ---------- */
  K.v_feel_hub = function (ctx) {
    return grid(tile('kopen', 'data-t="feel" data-s="faces"', SA.faceIc('happy'), 'My feeling') + tile('kopen', 'data-t="feel" data-s="breath"', SA.ic('plane'), 'Breathe') + tile('kopen', 'data-t="feel" data-s="movies"', SA.ic('movie'), 'Story faces'));
  };
  K.v_feel_faces = function (ctx, t) {
    const sel = t.pick ? ctx.S.feelings.find((x) => x.id === t.pick) : null;
    return bar(true) + (sel ? '<div class="card center gcard"><div class="big-em">' + SA.faceIc(sel.id) + '</div><div class="big-word">' + ctx.esc(sel.name) + '</div></div>' : '') +
      '<div class="gbtns n4 secs" style="grid-template-columns:repeat(3,1fr)">' + ctx.S.feelings.map((f) => tile('kfeel', 'data-id="' + f.id + '"', SA.faceIc(f.id), ctx.esc(f.name), 'background:' + f.color + '55')).join('') + '</div>';
  };
  K.v_feel_breath = function () {
    return bar(true) + '<div class="card breath center gcard"><div class="plane" id="bplane">✈️</div><div class="count" id="bcount">✈️</div><button class="btn sun iconbtn big" data-act="breath-start" aria-label="Start">▶</button></div>';
  };
  K.v_feel_movies = function (ctx) {
    const u = F().unitOf(ctx);
    return bar(true) + grid(SA.movies.map((m) => tile('kmovie', 'data-id="' + m.id + '"', m.e, ctx.esc(m.title))).join('') + tile('kmovie', 'data-id="topic"', u.emoji, ctx.esc(u.name), topicStyle(u)));
  };
  function quizList(ctx, t) { const m = SA.movies.find((x) => x.id === t.mv); return m ? { e: m.e, qs: m.qs } : { e: F().unitOf(ctx).emoji, qs: F().unitOf(ctx).feelings }; }
  K.v_feel_quiz = function (ctx, t) {
    const z = quizList(ctx, t); const fb = z.qs[t.fi % z.qs.length];
    return bar(true) + '<div class="card center gcard"><div class="big-em">' + z.e + '</div><div class="gprompt">' + ctx.esc(fb.q) + '</div></div>' +
      '<div class="gbtns n4 secs" style="grid-template-columns:repeat(3,1fr)">' + SA.playFeelings.map((f) => tile('kfq', 'data-id="' + f.id + '"', SA.faceIc(f.id), ctx.esc(f.id))).join('') + '</div>';
  };

  /* ---------- spoken text for the current screen ---------- */
  function speakScreen(ctx) {
    const tab = ctx.ui.kidTab; const t = T(ctx, tab); const scr = t.stack.length ? t.stack[t.stack.length - 1] : 'hub';
    const u = F().unitOf(ctx);
    if (scr === 'cards') { const list = F().wordsOf(ctx, u); const w = list[((t.i % list.length) + list.length) % list.length]; if (hasMom(ctx, w, 'en')) { ctx.rec.play(momKey(ctx, w, 'en')); return true; } return say(ctx, w.en, 'en-US', false); }
    if (scr === 'story') { const list = F().wordsOf(ctx, u); const w = list[((t.si % list.length) + list.length) % list.length]; return say(ctx, F().hero(ctx).name + ' sees the ' + w.en + '.'); }
    if (scr === 'song') return K.sing(ctx, SA.songDrills[t.drill].steps[t.step].say, 'en-US');
    if (scr === 'quiz') { const z = quizList(ctx, t); return say(ctx, z.qs[t.fi % z.qs.length].q); }
    const label = { 'learn:hub': 'Pick one', 'learn:topics': 'Pick a topic', 'learn:songs': 'Pick a song', 'learn:langs': 'Pick a language', 'learn:cats': 'Pick one', 'learn:list': 'Tap a picture', 'feel:hub': 'Pick one', 'feel:movies': 'Pick a show', 'feel:faces': 'How do you feel?', 'feel:breath': 'Let us fly and breathe' }[tab + ':' + scr];
    return label ? say(ctx, label) : false;
  }
  K.enter = function (ctx) { setTimeout(() => speakScreen(ctx), 250); };

  K.handle = function (a, d, ctx) {
    const tab = ctx.ui.kidTab || 'learn'; const t = T(ctx, tab); const u = F().unitOf(ctx);
    switch (a) {
      case 'kopen': K.stop(); open(ctx, d.t, d.s); K.enter(ctx); return true;
      case 'kback': K.stop(); t.stack.pop(); ctx.render(false); K.enter(ctx); return true;
      case 'kagain': speakScreen(ctx); return true;
      case 'ktopic': { F().handle('unit-set', { id: d.id }, ctx); t.i = 0; t.si = 0; t.fi = 0; t.stack.push('cards'); ctx.render(false); say(ctx, F().unitOf(ctx).name); setTimeout(() => speakScreen(ctx), 1200); return true; }
      case 'knav': { const list = F().wordsOf(ctx, u); t.i = (t.i + (+d.d) + list.length) % list.length; ctx.render(false); speakScreen(ctx); return true; }
      case 'ksay': {
        if (d.k === 'tl') { const list = F().wordsOf(ctx, u); const w = list[((t.i % list.length) + list.length) % list.length]; const tl = F().tlFor(ctx, w); const lg = ctx.state.focusLang || 'es'; if (hasMom(ctx, w, lg)) { ctx.rec.play(momKey(ctx, w, lg)); return true; } if (!F().say(ctx, tl.text, tl.tag)) ctx.toast('No ' + tl.name + ' voice on this device.'); return true; }
        if (d.k === 'en') return speakScreen(ctx), true;
        if (d.k === 'sing') return speakScreen(ctx), true;
        if (d.k === 'slow') { ctx.speak(SA.songDrills[t.drill].steps[t.step].say, 'en-US', true, {}); return true; }
        if (d.k === 'story') return speakScreen(ctx), true;
        return true;
      }
      case 'kdrill': t.drill = +d.i; t.step = 0; t.stack.push('song'); ctx.render(false); speakScreen(ctx); return true;
      case 'kstep': { const dr = SA.songDrills[t.drill]; t.step = Math.max(0, Math.min(dr.steps.length - 1, t.step + (+d.d))); ctx.render(false); speakScreen(ctx); return true; }
      case 'kstory': { t.si += 1; ctx.render(false); speakScreen(ctx); return true; }
      case 'kwlang': t.lang = d.l; t.stack.push('cats'); ctx.render(false); K.enter(ctx); return true;
      case 'kwcat': t.cat = d.c; t.stack.push('list'); ctx.render(false); K.enter(ctx); return true;
      case 'kword': { const x = (t.items || [])[+d.i]; if (x && !F().say(ctx, x.text, x.tag)) ctx.toast('No voice for this language on this device.'); return true; }
      case 'kfeel': { const f = ctx.S.feelings.find((x) => x.id === d.id); t.pick = d.id; ctx.state.feelLog = ctx.state.feelLog || {}; ctx.state.feelLog[ctx.dkey()] = d.id; ctx.save(); ctx.render(false); if (f) say(ctx, 'You feel ' + f.name + '.'); return true; }
      case 'kmovie': t.mv = d.id === 'topic' ? null : d.id; t.fi = 0; t.stack.push('quiz'); ctx.render(false); speakScreen(ctx); return true;
      case 'kfq': {
        const z = quizList(ctx, t); const fb = z.qs[t.fi % z.qs.length];
        if (d.id === fb.a) { t.fi += 1; say(ctx, 'Yes! ' + d.id + '!'); setTimeout(() => { ctx.render(false); speakScreen(ctx); }, 1400); } else say(ctx, 'Try again!');
        return true;
      }
      default: return false;
    }
  };
})();
