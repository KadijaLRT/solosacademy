/* Solo's Academy app logic. Everything runs on this device. No accounts, no tracking. The only network use is the optional Groq story button. */
(function () {
  'use strict';
  const S = window.SA;
  const KEY = 'solosacademy.v1';
  const OLD_KEY = 'skyacademy.v1'; // earlier name, read once so nothing is lost

  /* ---------- helpers ---------- */
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const dkey = (d) => { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  const dayNum = (d) => { d = d || new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000); };
  const parseKey = (k) => { const p = String(k).split('-').map(Number); return new Date(p[0], (p[1] || 1) - 1, p[2] || 1); };
  const pick = (arr, n) => arr[((n % arr.length) + arr.length) % arr.length];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const LBY = {}; S.langs.forEach((l) => { LBY[l.id] = l; });
  const WBY = {}; S.words.forEach((w) => { WBY[w.id] = w; });
  const CATBY = {}; S.categories.forEach((c) => { CATBY[c.id] = c; });
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const APP_VERSION = 46;
  const KID_TABS = [['games', '🎈', 'Games'], ['learn', '📚', 'Learn'], ['feel', '💛', 'Feelings']];
  const PARENT_TABS = [['today', '🏠', 'Today'], ['learn', '📚', 'Learn'], ['games', '🎈', 'Games'], ['theme', '🏫', 'School'], ['grow', '🚀', 'Grow'], ['act', '🎭', 'Activities']];

  /* ---------- state ---------- */
  function defaults() {
    return {
      v: 1, birth: '', nick: 'Solana', parentName: 'Kadija', role: 'parent', pinHash: '', pinSalt: '', themeStart: '', mode: 'focus', focusLang: 'es', level: 'standard', rate: 0.8,
      done: {}, learned: {}, said: {}, feelLog: {}, milestones: {}, activities: null, quizStars: 0, onboarded: false,
      look: 'retro', charVoice: 'hero', gameStars: 0, rbBands: 0, rainbows: 0, letterWins: {}, unit: 'trees', songDays: [], log: [], customWords: {}, fmastered: {}, homeSetup: {}, unitStarts: {}
    };
  }
  function load() {
    const s = defaults();
    try {
      const raw = localStorage.getItem(KEY) || localStorage.getItem(OLD_KEY);
      if (raw) { const o = JSON.parse(raw); Object.keys(o).forEach((k) => { s[k] = o[k]; }); }
    } catch (e) { /* storage may be blocked; app still works for this session */ }
    if (!s.activities) s.activities = JSON.parse(JSON.stringify(S.activityDefaults));
    if (!s.boxingAdded) { s.boxingAdded = true; if (Array.isArray(s.activities) && !s.activities.some((a) => a.id === 'a-boxing' || /boxing/i.test(a.name))) { const b = S.activityDefaults.find((a) => a.id === 'a-boxing'); if (b) s.activities.push(JSON.parse(JSON.stringify(b))); } }
    if (!s.violinAdded) { s.violinAdded = true; if (Array.isArray(s.activities) && !s.activities.some((a) => a.id === 'a-violin' || /violin/i.test(a.name))) { const v = S.activityDefaults.find((a) => a.id === 'a-violin'); if (v) s.activities.push(JSON.parse(JSON.stringify(v))); } }
    if (!s.themeStart) s.themeStart = dkey();
    if (!s.stretchSet) { s.level = 'stretch'; s.stretchSet = true; } /* she is learning ahead of her age: start on the longer daily plan */
    return s;
  }
  let state = load();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
    updateHeader();
  }

  const ui = { wlang: null, wcat: 'all', tweek: null, gtab: 'hub', mband: null, cardList: [], cardIdx: 0, openDetails: {} };

  /* ---------- derived ---------- */
  function ageYears() {
    if (!state.birth) return null;
    const p = state.birth.split('-').map(Number);
    if (!p[0] || !p[1]) return null;
    return (Date.now() - new Date(p[0], p[1] - 1, 1).getTime()) / (365.25 * 86400000);
  }
  function growthBand() {
    const a = ageYears();
    if (a == null) return S.growth[0];
    for (const g of S.growth) { if (a >= g.min && a < g.max) return g; }
    return a >= 12 ? S.growth[S.growth.length - 1] : S.growth[0];
  }
  function defaultMilestoneBand() {
    const a = ageYears();
    if (a == null || a < 4) return 'm3';
    if (a < 5) return 'm4';
    return 'm5';
  }
  function planTheme() { return S.themes.find((t) => t.id === state.unit) || S.themes[0]; }
  function startFor(id) {
    if (id === 'trees') return state.themeStart || dkey();
    state.unitStarts = state.unitStarts || {};
    if (!state.unitStarts[id]) { state.unitStarts[id] = dkey(); save(); }
    return state.unitStarts[id];
  }
  function themeInfo() {
    const th = planTheme();
    const diff = dayNum() - dayNum(parseKey(startFor(th.id)));
    let n = Math.floor(diff / 7); let pre = false; let over = false;
    if (n < 0) { n = 0; pre = true; }
    if (n >= th.weeks.length) { n = th.weeks.length - 1; over = true; }
    return { th, n, week: th.weeks[n], pre, over, diff: Math.max(0, diff) };
  }
  function chosenLang() {
    if (state.mode === 'tour') return S.langs[dayNum() % S.langs.length].id;
    return state.focusLang || 'es';
  }
  function wordsFor(lang) { return S.words.filter((w) => w[lang]); }
  const lkey = (lang, id) => lang + ':' + id;
  /* Words Solana mastered in her games (3 right answers) count in the passport, along with words you mark as learned. */
  function masteredSet() {
    const set = new Set(); const gw = state.gameWins || {};
    Object.keys(gw).forEach((k) => { if (gw[k] >= 3 && k.indexOf('words:') === 0) { const en = k.split(':').slice(2).join(':').toLowerCase(); if (en) set.add(en); } });
    return set;
  }
  const isLearned = (lang, w, ms) => !!state.learned[lkey(lang, w.id)] || (ms || masteredSet()).has(String(w.en).toLowerCase());
  const gameMastered = (lang, w, ms) => !state.learned[lkey(lang, w.id)] && (ms || masteredSet()).has(String(w.en).toLowerCase());
  function learnedCount(lang) { const ms = masteredSet(); return wordsFor(lang).filter((w) => isLearned(lang, w, ms)).length; }
  function starTotal() {
    let n = 0;
    Object.keys(state.done).forEach((d) => { Object.keys(state.done[d]).forEach((b) => { if (state.done[d][b]) n++; }); });
    n += Object.keys(state.said).filter((k) => state.said[k]).length;
    n += state.quizStars || 0;
    n += (state.songDays || []).length;
    n += state.gameStars || 0;
    return n;
  }

  /* ---------- toast + modal ---------- */
  let toastTimer = null;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 2200);
  }
  function openModal(html) {
    $('#modalCard').innerHTML = html;
    $('#modal').hidden = false;
    $('#modalCard').scrollTop = 0;
  }
  function closeModal() {
    $('#modal').hidden = true; $('#modalCard').innerHTML = '';
    stopBreath(); stopRecording(true);
    try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { /* ignore */ }
  }

  /* ---------- speech ---------- */
  let voices = [];
  function loadVoices() { try { if ('speechSynthesis' in window) voices = speechSynthesis.getVoices() || []; } catch (e) { voices = []; } }
  function normTag(t) { return String(t || '').toLowerCase().replace('_', '-'); }
  function findVoice(tag) {
    if (!voices.length) loadVoices();
    const t = normTag(tag); const base = t.split('-')[0];
    return voices.find((v) => normTag(v.lang) === t) || voices.find((v) => normTag(v.lang).split('-')[0] === base) || null;
  }
  function hasVoice(tag) { return !!findVoice(tag); }
  /* opts is optional: { pitch, rate } gives a character-style sound (rate is a multiplier). */
  /* Optional natural English voice (api/tts.js). Plain lines only; characters and singing stay on the device voice.
     Clips are cached on the device, so each line is fetched once. Any problem falls back to the device voice. */
  let nEl = null; let nUrl = null;
  const NSILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
  function neuralOk(text, tag, opts) {
    return !!state.neural && /^en/i.test(tag || '') && !(opts && (opts.pitch || opts.rate)) && navigator.onLine !== false && String(text).length <= 190;
  }
  function speakNeural(text, tag, slow, opts) {
    try {
      if (!nEl) nEl = new Audio();
      try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { /* ignore */ }
      nEl.pause(); nEl.src = NSILENT; const u = nEl.play(); if (u && u.catch) u.catch(() => {});
      const my = ++nSeq; const key = 'tts:' + text;
      const fallback = () => { if (my === nSeq) speak(text, tag, slow, Object.assign({}, opts || {}, { noNeural: true })); };
      (async () => {
        let blob = null;
        try { blob = await recGet(key); } catch (e) { blob = null; }
        if (!blob) {
          const r = await fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
          if (!r.ok) throw new Error('tts');
          blob = await r.blob();
          if (!blob || blob.size < 500) throw new Error('empty');
          try { await recPut(key, blob); } catch (e) { /* ignore */ }
        }
        if (my !== nSeq) return;
        if (nUrl) URL.revokeObjectURL(nUrl);
        nUrl = URL.createObjectURL(blob); nEl.src = nUrl;
        nEl.playbackRate = slow ? 0.85 : 1;
        nEl.onended = () => { if (opts && opts.onend) opts.onend(); };
        await nEl.play();
      })().catch(fallback);
      return true;
    } catch (e) { return false; }
  }
  let nSeq = 0;
  function speak(text, tag, slow, opts) {
    try {
      nSeq++; try { if (nEl) nEl.pause(); } catch (e) { /* ignore */ }
      if (!(opts && opts.noNeural) && neuralOk(text, tag, opts) && speakNeural(text, tag, slow, opts)) return true;
      if (!('speechSynthesis' in window)) return false;
      const v = findVoice(tag);
      if (!v && tag.split('-')[0] === 'zu') return false;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = tag; if (v) u.voice = v;
      u.rate = clamp((state.rate || 0.8) * (slow ? 0.65 : 1) * ((opts && opts.rate) || 1), 0.3, 1.3);
      u.pitch = clamp((opts && opts.pitch) || 1.05, 0.1, 2);
      if (opts && opts.onend) u.onend = opts.onend;
      speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  }
  if ('speechSynthesis' in window) { loadVoices(); try { speechSynthesis.onvoiceschanged = loadVoices; } catch (e) { /* ignore */ } }

  /* ---------- recordings (IndexedDB) ---------- */
  let dbp = null; let recSet = new Set(); let recorder = null; let recStream = null; let recChunks = []; let recTarget = null; let recCb = null; let recTimer = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise((res, rej) => {
      try {
        const r = indexedDB.open('skyacademy-audio', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('rec');
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      } catch (e) { rej(e); }
    });
    return dbp;
  }
  function idb(mode, fn) {
    return db().then((d) => new Promise((res, rej) => {
      const tx = d.transaction('rec', mode); const rq = fn(tx.objectStore('rec'));
      tx.oncomplete = () => res(rq ? rq.result : undefined);
      tx.onerror = () => rej(tx.error);
    }));
  }
  const recPut = (k, b) => idb('readwrite', (s) => s.put(b, k));
  const recGet = (k) => idb('readonly', (s) => s.get(k));
  const recDel = (k) => idb('readwrite', (s) => s.delete(k));
  const recKeys = () => idb('readonly', (s) => s.getAllKeys());
  recKeys().then((k) => { recSet = new Set(k || []); }).catch(() => {});

  function stopRecording(discard) {
    try { if (recorder && recorder.state !== 'inactive') { if (discard) recorder.onstop = null; recorder.stop(); } } catch (e) { /* ignore */ }
    if (recStream) { try { recStream.getTracks().forEach((t) => t.stop()); } catch (e) { /* ignore */ } }
    recorder = null; recStream = null;
  }
  /* cb (optional) runs after the clip is saved instead of refreshing the Sky card. Clips stop by themselves after 20 seconds. */
  async function startRecording(key, cb) {
    if (!navigator.mediaDevices || !window.MediaRecorder) { toast('Recording is not supported in this browser.'); return; }
    try {
      if (recorder) stopRecording(true); /* never leave an earlier microphone stream running */
      recStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const type = ['audio/mp4', 'audio/webm', 'audio/ogg'].find((t) => window.MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t));
      recorder = type ? new MediaRecorder(recStream, { mimeType: type }) : new MediaRecorder(recStream);
      recChunks = []; recTarget = key; recCb = cb || null;
      recorder.ondataavailable = (e) => { if (e.data && e.data.size) recChunks.push(e.data); };
      recorder.onstop = async () => {
        clearTimeout(recTimer);
        const after = recCb; recCb = null;
        const blob = new Blob(recChunks, { type: recorder && recorder.mimeType ? recorder.mimeType : (type || 'audio/mp4') });
        try { await recPut(recTarget, blob); recSet.add(recTarget); toast('Recording saved'); } catch (e) { toast('Could not save the recording.'); }
        stopRecording(true); if (after) after(); else refreshCard();
      };
      recorder.start();
      clearTimeout(recTimer); recTimer = setTimeout(() => { try { if (recorder && recorder.state === 'recording') recorder.stop(); } catch (e) { /* ignore */ } }, 20000);
      setRecUi(true);
    } catch (e) { toast('Microphone permission is needed to record.'); stopRecording(true); }
  }
  /* iOS only lets audio play inside a tap. The clip is read from storage after the tap, so one shared
     element is "unlocked" with a silent sound during the tap and then given the real clip. */
  const SILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
  let clipEl = null; let clipUrl = null;
  async function playRecording(key) {
    try {
      try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { /* ignore */ }
      if (!clipEl) clipEl = new Audio();
      clipEl.pause(); clipEl.src = SILENT; const unlock = clipEl.play(); if (unlock && unlock.catch) unlock.catch(() => {});
      const blob = await recGet(key);
      if (!blob) { toast('No recording yet'); return; }
      if (clipUrl) URL.revokeObjectURL(clipUrl);
      clipUrl = URL.createObjectURL(blob); clipEl.src = clipUrl;
      clipEl.play().catch(() => toast('Could not play the recording.'));
    } catch (e) { toast('Could not play the recording.'); }
  }
  function setRecUi(on) {
    const b = $('#recBtn'); if (!b) return;
    b.dataset.act = on ? 'rec-stop' : 'rec-start';
    b.textContent = on ? '⏹ Stop' : '🎙 Record';
    b.classList.toggle('coral', on);
  }

  /* ---------- voice pack: move recordings between devices as one file ---------- */
  function blobToDataUrl(blob) { return new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = () => rej(fr.error); fr.readAsDataURL(blob); }); }
  async function buildPack() {
    const keys = await recKeys(); const clips = {};
    for (const k of keys) { const blob = await recGet(k); if (blob) clips[k] = await blobToDataUrl(blob); }
    const json = JSON.stringify({ app: 'solos-academy', kind: 'voicepack', v: 2, made: dkey(), clips, settings: { gameCfg: state.gameCfg || null, gameHelp: state.gameHelp !== false } });
    return { file: new File([json], 'solos-voice-pack-' + dkey() + '.json', { type: 'application/json' }), n: Object.keys(clips).length };
  }
  async function importPack(file) {
    try {
      const o = JSON.parse(await file.text());
      if (!o || o.app !== 'solos-academy' || o.kind !== 'voicepack' || !o.clips || typeof o.clips !== 'object') throw new Error('bad');
      let n = 0;
      for (const k of Object.keys(o.clips)) {
        const u = o.clips[k];
        if (typeof u !== 'string' || u.indexOf('data:audio/') !== 0 || k.length > 200) continue;
        const blob = await (await fetch(u)).blob(); await recPut(k, blob); recSet.add(k); n++;
      }
      let sets = false;
      if (o.settings && typeof o.settings === 'object') {
        const gc = o.settings.gameCfg;
        if (gc && typeof gc === 'object') {
          const secs = {}; ['letters', 'numbers', 'colors', 'shapes', 'words'].forEach((k) => { secs[k] = !(gc.secs && gc.secs[k] === false); });
          state.gameCfg = { secs, lang: gc.lang === 'tl' ? 'tl' : 'en', range: gc.range === '10' ? '10' : '5', easy: gc.easy !== false, practice: !!gc.practice }; sets = true;
        }
        if (typeof o.settings.gameHelp === 'boolean') { state.gameHelp = o.settings.gameHelp; sets = true; }
        if (sets) { save(); ui.games = null; }
      }
      toast((n ? 'Imported ' + n + (n === 1 ? ' recording' : ' recordings') : 'No recordings in that file') + (sets ? ' and the game settings.' : '.')); render(true);
    } catch (er) { toast('That file does not look like a Solo’s Academy voice pack.'); }
  }

  /* ---------- profiles: parent view and child view, with an optional PIN ---------- */
  function isChild() { return state.role === 'child'; }
  async function hashPin(pin, salt) {
    const t = salt + ':' + pin;
    try {
      if (window.crypto && crypto.subtle) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
        return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) { /* fall through */ }
    let h = 5381; for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0;
    return 'x' + h;
  }
  function openPinEntry() {
    openModal('<button class="btn alt small close" data-act="modal-close">Cancel</button><div class="center"><div class="big-em">👪</div><h2 style="margin-top:0">Grown-ups only</h2><p class="muted">Enter the parent PIN.</p>' +
      '<input type="password" id="pinIn" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="off" style="max-width:200px;text-align:center;font-size:28px;letter-spacing:6px">' +
      '<p><button class="btn" data-act="pin-submit">Open</button></p></div>');
    setTimeout(() => { const i = $('#pinIn'); if (i) i.focus(); }, 50);
  }
  function openPinSet() {
    openModal('<button class="btn alt small close" data-act="modal-close">Cancel</button><h2 style="margin-top:0">' + (state.pinHash ? 'Change PIN' : 'Set a parent PIN') + '</h2>' +
      '<p class="small muted">' + (ui.afterPin ? 'Pick a PIN first so only you can get back to your view. ' : '') + '4 to 6 digits. It keeps the parent view closed when you switch to ' + esc(state.nick || 'your child') + '’s view. It is a child lock, not strong security.</p>' +
      '<label class="f" for="pinNew">New PIN</label><input type="password" id="pinNew" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="off">' +
      '<label class="f" for="pinNew2">Type it again</label><input type="password" id="pinNew2" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="off">' +
      '<p><button class="btn" data-act="pin-save">Save PIN</button></p>');
  }
  async function submitPin() {
    const v = ($('#pinIn') || {}).value || '';
    const h = await hashPin(v, state.pinSalt || '');
    if (h === state.pinHash) { state.role = 'parent'; save(); closeModal(); go('today'); render(false); toast('Welcome back'); }
    else { const i = $('#pinIn'); if (i) { i.value = ''; i.classList.add('shake'); setTimeout(() => i.classList.remove('shake'), 400); } toast('That PIN did not match'); }
  }
  function toChild() { state.role = 'child'; save(); closeModal(); go('games'); render(false); toast('Solana’s view'); }
  async function savePin() {
    const a = ($('#pinNew') || {}).value || ''; const b = ($('#pinNew2') || {}).value || '';
    if (!/^\d{4,6}$/.test(a)) { toast('Use 4 to 6 digits'); return; }
    if (a !== b) { toast('The two PINs do not match'); return; }
    const salt = Math.random().toString(36).slice(2) + Date.now().toString(36);
    state.pinSalt = salt; state.pinHash = await hashPin(a, salt); save(); closeModal(); if (ui.afterPin) { ui.afterPin = false; toChild(); } else { render(true); toast('PIN saved'); }
  }

  /* ---------- header ---------- */
  function updateHeader() {
    const sc = $('#starCount'); if (sc) sc.textContent = starTotal();
    const sub = $('#subtitle');
    if (sub) {
      const seg = { today: 'Today’s flight plan', words: 'Word time!', play: 'Play time!', games: 'Game setup', feel: 'Feelings time', theme: 'Pick our show!', grow: 'Grow', act: 'Activities', settings: 'Settings' }[route()];
      const kidSeg = { learn: 'Learn time!', games: 'Game time!', feel: 'How do you feel?' }[route()];
      if (isChild()) sub.textContent = 'Hi ' + (state.nick || 'friend') + '! ' + (kidSeg || '');
      else sub.textContent = 'Hi ' + (state.parentName || 'there') + '! ' + (seg || '');
    }
    const rb = $('#roleBtn'); const sb = $('#settingsBtn'); const st = $('#starBtn');
    if (rb) { rb.classList.toggle('lockbtn', isChild()); rb.textContent = isChild() ? '👪' : '👧'; rb.setAttribute('aria-label', isChild() ? 'Grown-ups: press and hold to open the parent view' : 'Switch to ' + (state.nick || 'child') + '’s view'); }
    if (sb) sb.hidden = isChild();
    if (st) st.dataset.to = isChild() ? 'stars' : 'words';
  }

  /* ---------- TODAY ---------- */
  const BLOCKS = {
    feel: { e: '💛', t: 'Feelings check-in', m: 2 },
    english: { e: '🗣️', t: 'Talk and sound play', m: 5 },
    lang: { e: '🌍', t: 'Second language', m: 5 },
    move: { e: '🤸', t: 'Move and play', m: 5 },
    read: { e: '📚', t: 'Read and sing', m: 5 },
    math: { e: '🔢', t: 'Number play', m: 4 },
    art: { e: '🎨', t: 'Make and discover', m: 6 }
  };
  const LEVELS = {
    light: ['feel', 'english', 'lang', 'move'],
    standard: ['feel', 'english', 'lang', 'move', 'read'],
    stretch: ['feel', 'english', 'lang', 'move', 'read', 'math', 'art']
  };
  function flatEnglish() { const out = []; S.english.forEach((c) => c.words.forEach((w) => out.push(w))); return out; }
  function findEnglish(word) { const t = String(word).toLowerCase(); return flatEnglish().find((w) => w.w.toLowerCase() === t) || null; }
  function qLevel() { const a = ageYears(); const i = (a == null ? 1 : Math.round((a - 2) * 1.5)) + S.stage.boost(state); return clamp(i, 0, S.questionLadder.length - 1); }
  function sayBtn(text, label) { return '<button class="btn small alt" data-act="say-en" data-text="' + esc(text) + '">🔊 ' + esc(label || 'Hear') + '</button>'; }
  function wordRow(lang, w) {
    const L = LBY[lang]; const x = w[lang]; const rtl = L.dir === 'rtl' ? ' rtl' : '';
    return '<div class="row between" style="padding:8px 0;border-bottom:1px solid var(--line)">' +
      '<div style="min-width:0"><span style="font-size:28px">' + w.e + '</span> <b class="' + rtl + '" style="font-size:22px">' + esc(x[0]) + '</b>' +
      '<div class="muted small">' + esc(w.en) + ' &middot; sounds like ' + esc(x[1]) + (x[2] ? ' &middot; ' + esc(x[2]) : '') + '</div></div>' +
      '<div class="row"><button class="btn small" data-act="speak" data-lang="' + lang + '" data-id="' + w.id + '">🔊</button>' +
      '<button class="btn small alt" data-act="open-card" data-lang="' + lang + '" data-id="' + w.id + '">Open</button></div></div>';
  }
  function langWordsToday(lang, info) {
    const th = info.th; const inTheme = (w) => (th.langIds ? th.langIds.indexOf(w.id) >= 0 : w.c === th.langCategory);
    const order = S.categories.map((c) => c.id);
    const pool = wordsFor(lang).slice().sort((a, b) => ((inTheme(b) ? 1 : 0) - (inTheme(a) ? 1 : 0)) || (order.indexOf(a.c) - order.indexOf(b.c)));
    if (!pool.length) return [];
    const msU = masteredSet(); const unlearned = pool.filter((w) => !isLearned(lang, w, msU));
    const src = unlearned.length >= 3 ? unlearned : pool;
    const start = (info.diff * 3) % src.length; const out = [];
    for (let i = 0; i < 3; i++) out.push(src[(start + i) % src.length]);
    return out;
  }
  function blockBody(id, info) {
    const wk = info.week;
    if (id === 'feel') {
      const cur = state.feelLog[dkey()];
      const btns = S.feelings.map((f) => '<button class="chip' + (cur === f.id ? ' on' : '') + '" data-act="feel-pick" data-id="' + f.id + '" style="font-size:20px">' + f.e + ' ' + f.name + '</button>').join('');
      const f = S.feelings.find((x) => x.id === cur);
      return '<p>Ask: <b>"How is your body feeling today?"</b> Let her point to a face.</p><div class="chips" style="flex-wrap:wrap;overflow:visible">' + btns + '</div>' +
        (f ? '<div class="say"><b>' + f.name + '</b>: ' + esc(f.body) + '<br>Try: ' + esc(f.do[0]) + '</div>' : '<p class="muted small">Tap one. Naming a feeling is how feelings get smaller.</p>') +
        '<button class="btn alt small" data-act="go" data-to="feel">Open feelings toolkit</button>';
    }
    if (id === 'english') {
      const word = pick(wk.words, info.diff); const en = findEnglish(word);
      const q = S.questionLadder[qLevel()]; const sp = pick(S.soundPlay, info.diff);
      return '<h3 style="margin-top:4px">Word of the day: ' + esc(word) + ' ' + sayBtn(word) + '</h3>' +
        (en ? '<p class="muted small">Say it in parts: <b>' + esc(en.s) + '</b></p><ol><li>Say: <b>' + esc(en.l[0]) + '</b></li><li>Then: <b>' + esc(en.l[1]) + '</b></li><li>Then: <b>' + esc(en.l[2]) + '</b> ' + sayBtn(en.l[2], 'Hear') + '</li></ol>'
          : '<p>Say it quiet, say it loud, say it in a silly voice. Then use it in a sentence about today.</p>') +
        '<div class="say"><b>' + esc(q.level) + ' question:</b> ' + esc(pick(q.q, info.diff)) + '<br><span class="muted small">Wait 5 quiet seconds. Then add one word to what she says.</span></div>' +
        '<p><b>Sound play: ' + esc(sp.title) + '.</b> ' + esc(sp.how) + ' Try: ' + esc(sp.words.join(', ')) + '.</p>' +
        '<p><b>Tongue tickler:</b> ' + esc(pick(S.tonguePlay, info.diff)) + ' ' + sayBtn(pick(S.tonguePlay, info.diff), 'Hear') + '</p>' +
        '<p class="muted small">' + esc(pick(S.englishTips, info.diff)) + '</p>';
    }
    if (id === 'lang') {
      const lang = chosenLang(); const L = LBY[lang]; const ws = langWordsToday(lang, info);
      const songs = (S.langSongs[lang] || []).slice(0, 1);
      return '<p><b>' + L.flag + ' ' + esc(L.name) + '</b> today. ' + (state.mode === 'tour' ? 'Tour mode: a new language each day.' : 'Focus mode: one language at a time.') + '</p>' +
        ws.map((w) => wordRow(lang, w)).join('') +
        '<div class="say">Say each word 3 times: whisper, normal, big voice. Use your hands or point to the real thing.</div>' +
        (songs.length ? '<p class="small muted">Song idea: ' + esc(songs[0]) + '</p>' : '') +
        (lang === 'zu' ? '<p class="small muted">Tip: record a Zulu speaker saying each word, or ask a friend to. Open a card and tap Record.</p>' : '') +
        '<button class="btn alt small" data-act="go" data-to="words">More words</button>';
    }
    if (id === 'move') {
      return '<div class="say"><b>Move:</b> ' + esc(pick(wk.movement, info.diff)) + '</div><div class="say"><b>Spidey and airplane play:</b> ' + esc(pick(wk.hero, info.diff)) + '</div><p class="muted small">Narrate what she does with real words: "You are climbing UP the big, rough trunk."</p>';
    }
    if (id === 'read') {
      return '<p><b>Book:</b> ' + esc(pick(wk.books, info.diff)) + '</p><p><b>Sing:</b> ' + esc(pick(wk.songs, info.diff)) + '</p><div class="say"><b>After the story, ask:</b> ' + esc(pick(wk.questions, info.diff)) + '</div><p class="muted small">Let her point, turn pages, and finish familiar lines.</p>';
    }
    if (id === 'math') {
      return '<div class="say"><b>Count and sort:</b> ' + esc(pick(wk.math, info.diff)) + '</div><p class="muted small">Touch each thing once as you count. Ask "How many?" and wait.</p>';
    }
    if (id === 'art') {
      const item = info.diff % 2 === 0 ? ['Make', pick(wk.craft, info.diff)] : ['Discover', pick(wk.science, info.diff)];
      return '<div class="say"><b>' + item[0] + ':</b> ' + esc(item[1]) + '</div><p class="muted small">' + esc(pick(wk.sel, info.diff)) + '</p>';
    }
    return '';
  }
  function weeklyActiveDays() {
    let n = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const day = state.done[dkey(d)];
      if (day && Object.keys(day).some((k) => day[k])) n++;
    }
    return n;
  }
  function stampLevel(lang) {
    const total = wordsFor(lang).length; const n = learnedCount(lang);
    if (n >= total && total) return ['🥇', 'Gold'];
    if (n >= 30) return ['🥈', 'Silver'];
    if (n >= 10) return ['🥉', 'Bronze'];
    return ['✈️', 'Boarding'];
  }
  function progressLine() {
    const learned = Object.keys(state.learned).filter((k) => state.learned[k]).length + Object.keys(state.fmastered || {}).filter((k) => state.fmastered[k]).length;
    const mastered = Object.keys(state.letterWins || {}).filter((k) => state.letterWins[k] >= 3).length + Object.keys(state.gameWins || {}).filter((k) => state.gameWins[k] >= 3).length;
    return '<span>📚 ' + learned + '</span><span>🔤 ' + mastered + '</span><span>🌈 ' + (state.rainbows || 0) + '</span>';
  }
  function stageCard() {
    const lv = S.stage.level(state); const L = S.stage.LEVELS[lv]; const age = S.stage.ageText(state);
    const sl = ['letters', 'numbers', 'colors', 'shapes', 'words'].map((k, i) => ['🔤', '🔢', '🎨', '🔷', '📖'][i] + ' L' + Math.min(4, lv + ((state.adapt || {})[k] || 0))).join(' ');
    return '<div class="card note"><b>Hello ' + esc(state.parentName || 'there') + ', here’s ' + esc(state.nick || 'her') + '’s progress</b><div class="stats">' + progressLine() + '</div><div class="small">🚀 ' + (age ? esc(age) + ' old' : 'Add her birth month in Settings') + ' · starts at <b>' + L.name + '</b></div><div class="stats">' + sl + '</div></div>';
  }
  function viewToday() {
    const info = themeInfo(); const ids = LEVELS[state.level] || LEVELS.standard;
    const today = state.done[dkey()] || {};
    const doneN = ids.filter((b) => today[b]).length; const total = ids.length;
    const mins = ids.reduce((a, b) => a + BLOCKS[b].m, 0);
    const hr = new Date().getHours(); const greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
    const dateStr = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    let h = '<div class="card hero"><div class="row between"><div><b style="font-size:22px">' + greet + (state.parentName ? ', ' + esc(state.parentName) : '') + '!</b><div class="muted">' + esc(dateStr) + '</div></div>' +
      '<span class="pill green">' + info.th.emoji + ' Week ' + (info.n + 1) + ' of ' + info.th.weeks.length + (info.over ? ' (done!)' : '') + '</span></div>' +
      '<p style="margin:10px 0 2px"><b>' + esc(info.week.title) + '</b><br><span class="muted">' + esc(info.week.focus) + '</span></p>' +
      '<div class="runway"><div class="line"></div><div class="plane" style="left:' + (total ? (8 + (doneN / total) * 84) : 8) + '%">✈️</div></div>' +
      '<div class="row between small"><span>' + doneN + ' of ' + total + ' stops done &middot; about ' + mins + ' min</span><span>' + weeklyActiveDays() + ' of 7 days active</span></div></div>';
    h += '<div class="card"><div class="row between"><b>🏫 This week at school</b><button class="btn alt small" data-act="go" data-to="theme">School tab</button></div><div class="chips" style="margin-top:8px">' + (info.week.words || []).slice(0, 8).map((w) => '<span class="pill">' + esc(w) + '</span>').join('') + '</div></div>';
    if (state.unit && !S.themes.some((t) => t.id === state.unit)) { const un = S.units.find((x) => x.id === state.unit); if (un) h += '<div class="card note">Today’s show is <b>' + un.emoji + ' ' + esc(un.name) + '</b>. Learn and Games use its words.' + (un.school ? ' This daily plan still follows Trees until a plan for ' + esc(un.name) + ' is added.' : ' It is an open topic, so there is no school plan. The daily plan below still follows Trees as her school support.') + '</div>'; }
    if (info.over) h += '<div class="card note">The 6 ' + esc(info.th.name.toLowerCase()) + ' weeks are complete. You can repeat week 6, or ask her teacher for the next theme. See the School tab.</div>';
    if (info.pre) h += '<div class="card note">Your theme starts on ' + esc(startFor(info.th.id)) + '. This is a preview of week 1.</div>';
    const nextId = ids.find((b) => !today[b]);
    if (nextId) h += '<div class="card good nextstop"><b>👉 Next stop</b><div>' + BLOCKS[nextId].e + ' ' + BLOCKS[nextId].t + ' · ' + BLOCKS[nextId].m + ' min</div></div>';
    h += '<div class="card note small">👧 <b>In her view:</b> Learn, then Today. She sees these same stops as big pictures. Feelings, Talk, Words, Story and Numbers open the matching activity for her; Move and Make wait for you to do them together. Ticks show on both screens.</div>';
    h += stageCard();
    h += S.parent.moveCard(ctx, info.diff);
    ids.forEach((b) => {
      const m = BLOCKS[b]; const isDone = !!today[b]; const id = 'blk-' + b;
      h += '<details class="block' + (isDone ? ' done' : '') + '" data-id="' + id + '"' + (ui.openDetails[id] ? ' open' : '') + '><summary><span class="b-emoji">' + m.e + '</span><div><div class="b-title">' + m.t + '</div><div class="b-min">' + m.m + ' min</div></div>' +
        '<button class="check" data-act="toggle-block" data-b="' + b + '" aria-label="Mark ' + m.t + ' done" aria-pressed="' + isDone + '">' + (isDone ? '✓' : '') + '</button></summary><div class="b-body">' + blockBody(b, info) + '</div></details>';
    });
    if (doneN === total && total) h += '<div class="card good center"><div style="font-size:40px">🎉</div><b>Landed! All stops done today.</b><p class="muted small">Big hug. Then free play, no agenda.</p></div>';
    h += '<h2>Language passport</h2><div class="grid wide">' + S.langs.map((l) => {
      const n = learnedCount(l.id); const t = wordsFor(l.id).length; const lv = stampLevel(l.id);
      return '<button class="stamp ' + (n >= 10 ? 'got' : '') + '" style="font:inherit;color:inherit;text-align:left;cursor:pointer" data-act="wlang" data-lang="' + l.id + '"><span class="fl">' + l.flag + '</span><div style="flex:1"><b>' + l.name + '</b><div class="progress"><i style="width:' + (t ? Math.round(n / t * 100) : 0) + '%"></i></div><span class="small muted">' + n + ' of ' + t + ' learned</span></div><span class="lv" title="' + lv[1] + '">' + lv[0] + '</span></button>';
    }).join('') + '</div><p class="small muted">Words count when you tap "Learned" on a word card, and automatically when she masters them in her games (3 right answers). Bronze at 10 words, silver at 30, gold at all.</p>';
    const mws = Array.from(masteredSet()).sort();
    h += '<div class="card"><b>🎈 Mastered in her games: ' + mws.length + (mws.length === 1 ? ' word' : ' words') + '</b>' +
      (mws.length ? '<div class="chips" style="flex-wrap:wrap;overflow:visible;margin-top:8px">' + mws.slice(0, 40).map((x) => '<button class="chip" data-act="say-en" data-text="' + esc(x) + '">' + esc(x) + '</button>').join('') + '</div>' + (mws.length > 40 ? '<p class="small muted">Showing 40 of ' + mws.length + '.</p>' : '')
        : '<p class="small muted">Nothing yet. A word shows here after she answers it right 3 times in Games.</p>') + '</div>';
    return h;
  }

  /* ---------- WORDS ---------- */
  function viewWords() {
    if (!ui.wlang) ui.wlang = chosenLang();
    const lang = ui.wlang;
    let h = '<h2>Words</h2><div class="chips">' +
      '<button class="chip" aria-pressed="' + (lang === 'en') + '" data-act="wlang" data-lang="en">🇺🇸 English</button>' +
      S.langs.map((l) => '<button class="chip" aria-pressed="' + (lang === l.id) + '" data-act="wlang" data-lang="' + l.id + '">' + l.flag + ' ' + l.name + '</button>').join('') + '</div>';
    if (lang === 'en') return h + viewEnglish();
    const L = LBY[lang];
    h += '<div class="card"><div class="row between"><div><b>' + L.flag + ' ' + esc(L.name) + '</b> <span class="muted">' + esc(L.native) + '</span></div>' +
      '<div class="row"><button class="btn small sun" data-act="quiz-start">🎯 Quiz</button><button class="btn small alt" data-act="songs">🎵 Songs</button></div></div>' +
      (isChild() ? '' : '<p class="small muted">' + esc(S.langNotes[lang]) + '</p>') +
      (!hasVoice(L.tts) ? '<p class="small"><b>Voice:</b> this device has no ' + esc(L.name) + ' voice' + (lang === 'zu' ? '. Use Record on each card.' : ' yet, or the voice list has not loaded. Open Settings and tap Test voice.') + '</p>' : '') +
      '<p class="small muted">Learned: ' + learnedCount(lang) + ' of ' + wordsFor(lang).length + '</p></div>';
    h += '<div class="chips"><button class="chip" aria-pressed="' + (ui.wcat === 'all') + '" data-act="wcat" data-cat="all">All</button>' +
      S.categories.map((c) => '<button class="chip" aria-pressed="' + (ui.wcat === c.id) + '" data-act="wcat" data-cat="' + c.id + '">' + c.emoji + ' ' + c.name + '</button>').join('') + '</div>';
    const list = wordsFor(lang).filter((w) => ui.wcat === 'all' || w.c === ui.wcat);
    ui.cardList = list.map((w) => ({ lang, id: w.id }));
    const msL = masteredSet();
    h += '<div class="grid">' + list.map((w) => {
      const x = w[lang]; const k = lkey(lang, w.id); const lrn = isLearned(lang, w, msL); const rtl = L.dir === 'rtl' ? ' rtl' : '';
      return '<button class="wc' + (lrn ? ' learned' : '') + '" data-act="open-card" data-lang="' + lang + '" data-id="' + w.id + '">' +
        (recSet.has(k) ? '<span class="badge" title="Has a recording">🎙</span>' : '') + (lrn ? '<span class="badge" style="left:10px;right:auto">' + (state.learned[k] ? '✅' : '🎈') + '</span>' : '') +
        '<span class="em">' + w.e + '</span><span class="w' + rtl + '">' + esc(x[0]) + '</span><span class="p">' + esc(x[1]) + '</span><span class="en">' + esc(w.en) + '</span></button>';
    }).join('') + '</div>';
    return h;
  }
  /* Parent Learn tab: topic play (cards, sing, story) and the word bank in one place. */
  function viewLearn() {
    const mode = ui.learnMode || 'play';
    const chips = '<div class="chips">' + [['play', '🎬 Topic play'], ['bank', '🗣️ Word bank']].map((t) => '<button class="chip" aria-pressed="' + (mode === t[0]) + '" data-act="learn-mode" data-m="' + t[0] + '">' + t[1] + '</button>').join('') + '</div>';
    return chips + (mode === 'bank' ? viewWords() : S.fun.viewPlay(ctx));
  }
  function viewEnglish() {
    let h = '<p class="muted">Clear talking and a growing vocabulary. Tap a word to see how to say it, then build it into a sentence.</p>';
    S.english.forEach((c, ci) => {
      h += '<details class="acc"' + (ci === 0 ? ' open' : '') + '><summary>' + esc(c.cat) + '</summary><div class="acc-body"><div class="grid">' +
        c.words.map((w, wi) => '<button class="wc" data-act="open-en" data-c="' + ci + '" data-w="' + wi + '"><span class="em">' + w.e + '</span><span class="w">' + esc(w.w) + '</span><span class="p">' + esc(w.s) + '</span></button>').join('') +
        '</div></div></details>';
    });
    h += '<details class="acc"><summary>🎤 Sound play (clear speech)</summary><div class="acc-body"><p class="small muted">Sounds come in at different times. Some, like r, l, th, and s-blends, are often tricky until age 5 or later. That is normal.</p>' +
      S.soundPlay.map((s) => '<div class="say"><b>' + esc(s.title) + '</b><br>' + esc(s.how) + '<br><span class="muted small">Words: ' + esc(s.words.join(', ')) + '</span></div>').join('') + '</div></details>';
    h += '<details class="acc"><summary>😄 Tongue ticklers</summary><div class="acc-body">' + S.tonguePlay.map((t) => '<p>' + esc(t) + ' ' + sayBtn(t) + '</p>').join('') + '</div></details>';
    if (!isChild()) h += '<details class="acc"><summary>❓ Question ladder</summary><div class="acc-body"><p class="small muted">Start at the first level. Move up when she answers easily.</p>' +
      S.questionLadder.map((q, i) => '<div class="say"><b>' + (i + 1) + '. ' + esc(q.level) + '</b><br>' + q.q.map(esc).join('<br>') + '</div>').join('') + '</div></details>';
    if (!isChild()) h += '<details class="acc"><summary>💡 Tips for talking</summary><div class="acc-body"><ul>' + S.englishTips.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul></div></details>';
    h += '<details class="acc"><summary>🎵 Songs to sing</summary><div class="acc-body"><ul>' + S.englishSongs.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul></div></details>';
    return h;
  }
  function openEnglish(ci, wi) {
    const w = S.english[ci].words[wi];
    openModal('<button class="btn alt small close" data-act="modal-close">Close</button><div class="center"><div class="big-em">' + w.e + '</div><div class="big-word">' + esc(w.w) + '</div><div class="pill">' + esc(w.s) + '</div>' +
      '<p>' + sayBtn(w.w, 'Hear it') + ' <button class="btn small alt" data-act="say-en" data-text="' + esc(w.w) + '" data-slow="1">🐢 Slow</button></p></div>' +
      '<h3>Build it up</h3><ol>' + w.l.map((x) => '<li style="margin:8px 0"><b>' + esc(x) + '</b> ' + sayBtn(x) + '</li>').join('') + '</ol>' +
      '<p class="muted small">Say it with her. If she says only the first part, great: you say the next step and let her echo.</p>');
  }
  function cardHtml(lang, id) {
    const w = WBY[id]; const L = LBY[lang]; const x = w[lang]; const k = lkey(lang, id); const rtl = L.dir === 'rtl' ? ' rtl' : '';
    const hasRec = recSet.has(k);
    return '<button class="btn alt small close" data-act="modal-close">Close</button><div class="center">' +
      '<div class="big-em">' + w.e + '</div><div class="muted">' + esc(w.en) + '</div><div class="big-word' + rtl + '">' + esc(x[0]) + '</div>' +
      (x[2] ? '<div>' + esc(x[2]) + '</div>' : '') + '<p><span class="pill">Sounds like: ' + esc(x[1]) + '</span></p>' +
      '<div class="row" style="justify-content:center"><button class="btn" data-act="speak" data-lang="' + lang + '" data-id="' + id + '">🔊 Hear</button>' +
      '<button class="btn alt" data-act="speak" data-lang="' + lang + '" data-id="' + id + '" data-slow="1">🐢 Slow</button>' +
      (hasRec ? '<button class="btn sun" data-act="rec-play" data-key="' + esc(k) + '">▶️ Recording</button>' : '') + '</div>' +
      (hasVoice(L.tts) ? '' : '<p class="small muted">No ' + esc(L.name) + ' voice on this device. Record a native speaker below.</p>') +
      '<div class="row" style="justify-content:center;margin-top:10px"><button class="btn alt small" id="recBtn" data-act="rec-start" data-key="' + esc(k) + '">🎙 Record</button>' +
      (hasRec ? '<button class="btn alt small" data-act="rec-del" data-key="' + esc(k) + '">Delete recording</button>' : '') + '</div>' +
      '<div class="row" style="justify-content:center;margin-top:14px"><button class="btn ' + (state.said[k] ? '' : 'alt') + '" data-act="card-said">⭐ ' + (state.said[k] ? 'She said it!' : 'She said it') + '</button>' +
      '<button class="btn ' + (state.learned[k] ? '' : 'alt') + '" data-act="card-learned">✅ ' + (state.learned[k] ? 'Learned' : 'Mark learned') + '</button></div>' +
      (gameMastered(lang, w) ? '<p class="small muted center">🎈 She mastered this word in her games.</p>' : '') +
      '<div class="row between" style="margin-top:16px"><button class="btn alt small" data-act="card-nav" data-dir="-1">◀ Back</button><span class="muted small">' + (ui.cardIdx + 1) + ' of ' + ui.cardList.length + '</span><button class="btn alt small" data-act="card-nav" data-dir="1">Next ▶</button></div></div>';
  }
  function openCard(lang, id) {
    if (!ui.cardList.length || !ui.cardList.some((c) => c.lang === lang && c.id === id)) {
      ui.cardList = wordsFor(lang).map((w) => ({ lang, id: w.id }));
    }
    ui.cardIdx = ui.cardList.findIndex((c) => c.lang === lang && c.id === id);
    openModal(cardHtml(lang, id));
  }
  function refreshCard() {
    const c = ui.cardList[ui.cardIdx]; if (!c || $('#modal').hidden) return;
    const top = $('#modalCard').scrollTop; $('#modalCard').innerHTML = cardHtml(c.lang, c.id); $('#modalCard').scrollTop = top;
  }

  /* ---------- quiz ---------- */
  let quiz = null;
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function startQuiz() {
    const lang = ui.wlang; const pool = wordsFor(lang).filter((w) => ui.wcat === 'all' || w.c === ui.wcat);
    if (pool.length < 3) { toast('Pick a bigger group of words for a quiz.'); return; }
    quiz = { lang, pool: shuffle(pool).slice(0, 5), i: 0, score: 0, all: wordsFor(lang), locked: false };
    renderQuiz();
  }
  function renderQuiz() {
    const q = quiz; if (!q) return;
    if (q.i >= q.pool.length) {
      openModal('<div class="center"><div class="big-em">🎉</div><h2>' + q.score + ' of ' + q.pool.length + '!</h2><p>Every right answer earned a star.</p><button class="btn" data-act="quiz-start">Play again</button> <button class="btn alt" data-act="modal-close">Done</button></div>');
      return;
    }
    const t = q.pool[q.i]; const L = LBY[q.lang]; const rtl = L.dir === 'rtl' ? ' rtl' : '';
    const others = shuffle(q.all.filter((w) => w.id !== t.id && w.e !== t.e)).slice(0, 2);
    q.opts = shuffle([t].concat(others)); q.target = t; q.locked = false;
    openModal('<button class="btn alt small close" data-act="modal-close">Close</button><div class="center"><p class="muted">Question ' + (q.i + 1) + ' of ' + q.pool.length + '</p>' +
      '<p>Which one is</p><div class="big-word' + rtl + '">' + esc(t[q.lang][0]) + '</div><p><button class="btn" data-act="quiz-hear">🔊 Hear</button></p>' +
      '<div class="row" style="justify-content:center;gap:14px;margin-top:10px">' + q.opts.map((o, i) => '<button class="opt" data-act="quiz-pick" data-i="' + i + '" aria-label="' + esc(o.en) + '">' + o.e + '</button>').join('') + '</div></div>');
    speak(t[q.lang][0], L.tts);
  }

  /* ---------- FEELINGS ---------- */
  let breathTimer = null;
  function stopBreath() { if (breathTimer) { clearTimeout(breathTimer); breathTimer = null; } }
  function startBreath() {
    stopBreath();
    const root = $('#modal').hidden ? document : $('#modalCard');
    const plane = $('#bplane', root); const cnt = $('#bcount', root); if (!plane || !cnt) return;
    const seq = [];
    for (let c = 0; c < 3; c++) { [1, 2, 3].forEach((n) => seq.push(['in', n])); [1, 2, 3, 4].forEach((n) => seq.push(['out', n])); }
    let i = 0;
    (function step() {
      if (i >= seq.length) { cnt.textContent = 'Great flying! 🌟'; plane.className = 'plane'; breathTimer = null; return; }
      const s = seq[i++];
      cnt.textContent = (s[0] === 'in' ? 'Breathe in ' : 'Breathe out ') + s[1];
      if (isChild() && s[1] === 1) speak(s[0] === 'in' ? 'Breathe in' : 'Breathe out', 'en-US', true);
      plane.className = 'plane ' + (s[0] === 'in' ? 'up' : 'down');
      breathTimer = setTimeout(step, 1000);
    })();
  }
  function recentFeelings() {
    const out = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const f = S.feelings.find((x) => x.id === state.feelLog[dkey(d)]);
      out.push('<div class="center" style="min-width:44px"><div style="font-size:28px">' + (f ? f.e : '·') + '</div><div class="small muted">' + ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][d.getDay()] + '</div></div>');
    }
    return '<div class="row" style="justify-content:space-between">' + out.join('') + '</div>';
  }
  function viewFeel() {
    let h = '<h2>Feelings toolkit</h2><p class="muted">Name it, breathe, then solve it. CDC parent tips for age 3 include giving her words for her feelings and teaching her to take deep breaths, hug a favorite toy, or go to a quiet, safe place.</p>';
    h += '<div class="grid g3">' + S.feelings.map((f) => '<button class="feel-card" style="background:' + f.color + '33" data-act="feel-open" data-id="' + f.id + '"><span class="em">' + f.e + '</span>' + f.name + '</button>').join('') + '</div>';
    h += '<div class="card"><b>This week</b>' + recentFeelings() + '</div>';
    h += '<h2>✈️ Airplane breathing</h2><div class="card breath"><div class="plane" id="bplane">✈️</div><div class="count" id="bcount">Ready for takeoff?</div><button class="btn" data-act="breath-start">Start 3 flights</button></div>';
    h += '<h2>Calm-down tools</h2>' + S.calmTools.map((t) => '<div class="card"><b>' + esc(t.name) + '</b><p>' + esc(t.text) + '</p></div>').join('');
    h += '<h2>When it gets hard</h2>' + S.scripts.map((s) => '<details class="acc"><summary>' + esc(s.title) + '</summary><div class="acc-body"><ol>' + s.steps.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ol></div></details>').join('');
    h += '<h2>Friend skills by age</h2>' + S.friendLadder.map((f) => '<details class="acc"><summary>Age ' + esc(f.age) + '</summary><div class="acc-body"><ul>' + f.skills.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></div></details>').join('');
    return h;
  }
  function viewKidFeel() {
    let h = '<h2>How do you feel?</h2><p class="muted">Tap a face.</p>';
    h += '<div class="grid g3">' + S.feelings.map((f) => '<button class="feel-card" style="background:' + f.color + '33" data-act="feel-open" data-id="' + f.id + '"><span class="em">' + f.e + '</span>' + f.name + '</button>').join('') + '</div>';
    h += '<div class="card"><b>This week</b>' + recentFeelings() + '</div>';
    h += '<h2>✈️ Airplane breathing</h2><div class="card breath"><div class="plane" id="bplane">✈️</div><div class="count" id="bcount">Ready for takeoff?</div><button class="btn" data-act="breath-start">Start 3 flights</button></div>';
    return h;
  }
  function openFeeling(id) {
    const f = S.feelings.find((x) => x.id === id); if (!f) return;
    const words = f.words.length ? S.words.filter((w) => f.words.indexOf(w.id) >= 0) : [];
    let tr = '';
    if (words.length) {
      tr = '<h3>In other languages</h3><div class="scroll-x"><table class="tbl">' + S.langs.map((l) => { const x = words[0][l.id]; return x ? '<tr><td>' + l.flag + ' ' + l.name + '</td><td class="' + (l.dir === 'rtl' ? 'rtl' : '') + '"><b>' + esc(x[0]) + '</b></td><td class="muted small">' + esc(x[1]) + '</td><td><button class="btn small alt" data-act="speak" data-lang="' + l.id + '" data-id="' + words[0].id + '">🔊</button></td></tr>' : ''; }).join('') + '</table></div>';
    }
    openModal('<button class="btn alt small close" data-act="modal-close">Close</button><div class="center"><div class="big-em">' + f.e + '</div><div class="big-word">' + f.name + '</div></div>' +
      '<p><b>My body feels:</b> ' + esc(f.body) + '</p><h3>What can I do?</h3><ul>' + f.do.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' + tr +
      '<div class="row" style="margin-top:14px"><button class="btn" data-act="feel-log" data-id="' + f.id + '">I feel this today</button><button class="btn alt" data-act="breath-modal">✈️ Breathe</button></div>');
  }

  /* ---------- THEME ---------- */
  function viewTheme() {
    const chips = '<h2>School</h2>' + S.fun.unitChips(ctx);
    if (!S.themes.some((t) => t.id === state.unit)) return chips + S.fun.unitPage(ctx);
    return chips + viewPlan();
  }
  function viewPlan() {
    const info = themeInfo(); const th = info.th;
    if (ui.tweek == null) ui.tweek = info.n;
    const wk = th.weeks[ui.tweek]; const start = parseKey(startFor(th.id));
    const ws = new Date(start); ws.setDate(ws.getDate() + ui.tweek * 7);
    const we = new Date(ws); we.setDate(we.getDate() + 6);
    const fmt = (d) => MONTHS[d.getMonth()] + ' ' + d.getDate();
    const lang = chosenLang(); const L = LBY[lang];
    let h = '<h2>' + th.emoji + ' ' + esc(th.name) + ' theme</h2><p class="muted">Matched to what her class is doing for the next 6 weeks. If her teacher shifts the plan, change the start date in Settings.</p>';
    h += '<div class="chips">' + th.weeks.map((w, i) => '<button class="chip" aria-pressed="' + (ui.tweek === i) + '" data-act="tweek" data-n="' + i + '">Week ' + (i + 1) + (i === info.n ? ' (now)' : '') + '</button>').join('') + '</div>';
    h += '<div class="card hero"><b style="font-size:20px">' + esc(wk.title) + '</b><div class="muted small">' + fmt(ws) + ' to ' + fmt(we) + '</div><p>' + esc(wk.focus) + '</p></div>';
    h += '<div class="card"><b>Words to learn this week</b><div class="chips" style="flex-wrap:wrap;overflow:visible">' + wk.words.map((w) => '<button class="chip" data-act="say-en" data-text="' + esc(w) + '">🔊 ' + esc(w) + '</button>').join('') + '</div></div>';
    const inTheme = (w) => (th.langIds ? th.langIds.indexOf(w.id) >= 0 : w.c === th.langCategory);
    const tw = wordsFor(lang).filter(inTheme);
    h += '<details class="acc" open><summary>' + L.flag + ' ' + esc(th.langLabel || (th.name + ' words')) + ' in ' + esc(L.name) + '</summary><div class="acc-body">' + tw.map((w) => wordRow(lang, w)).join('') + '<p class="small muted">Change the language in Settings, or compare all six below.</p></div></details>';
    const all = S.words.filter(inTheme);
    h += '<details class="acc"><summary>🌍 All six languages side by side</summary><div class="acc-body scroll-x"><table class="tbl"><tr><th></th>' + all.map((w) => '<th>' + w.e + ' ' + w.en + '</th>').join('') + '</tr>' +
      S.langs.map((l) => '<tr><td><b>' + l.flag + '</b></td>' + all.map((w) => '<td class="' + (l.dir === 'rtl' ? 'rtl' : '') + '">' + (w[l.id] ? '<button class="cell" data-act="open-card" data-lang="' + l.id + '" data-id="' + w.id + '">' + esc(w[l.id][0]) + '</button>' : '<span class="muted">n/a</span>') + '</td>').join('') + '</tr>').join('') + '</table></div></details>';
    const sec = (t, arr, open) => '<details class="acc"' + (open ? ' open' : '') + '><summary>' + t + '</summary><div class="acc-body"><ul>' + arr.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></div></details>';
    h += sec('📚 Books', wk.books, true) + sec('🎵 Songs', wk.songs) + sec('🤸 Move', wk.movement) + sec('🕷️ Spidey and airplane play', wk.hero) + sec('🎨 Make', wk.craft) + sec('🔬 Discover', wk.science) +
      sec('🔢 Count and sort', wk.math) + sec('💛 Feelings and friends', wk.sel) + sec('❓ Questions to ask', wk.questions);
    h += '<div class="card note"><b>Talk to her teacher:</b> ' + esc(wk.teacherAsk) + '</div>';
    h += '<div class="card warn small">' + esc(th.safety) + '</div>';
    h += S.fun.customWords(ctx);
    return h;
  }

  /* ---------- GROW ---------- */
  /* What Solana tapped on her Feelings screen, by day. */
  function growFeelings() {
    const log = state.feelLog || {}; const rows = []; const counts = {};
    for (let i = 0; i < 14; i++) {
      const d = new Date(); d.setDate(d.getDate() - i); const f = S.feelings.find((x) => x.id === log[dkey(d)]);
      if (f) counts[f.id] = (counts[f.id] || 0) + 1;
      rows.push('<div class="center" style="min-width:48px"><div style="font-size:30px">' + (f ? f.e : '·') + '</div><div class="small muted">' + d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2) + ' ' + d.getDate() + '</div></div>');
    }
    const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    const tally = top.length ? '<div class="stats">' + top.map((id) => { const f = S.feelings.find((x) => x.id === id); return '<span>' + f.e + ' ' + counts[id] + '</span>'; }).join('') + '</div>' : '<p>No feelings logged yet. Solana can tap a face on her Feelings screen.</p>';
    return '<div class="card"><b>Last 14 days</b><div class="row" style="flex-wrap:wrap;gap:6px;margin-top:8px">' + rows.reverse().join('') + '</div>' + tally + '</div>' +
      '<button class="btn alt small" data-act="go" data-to="feel">Open feelings toolkit</button>';
  }
  function growMilestones() {
    if (!ui.mband) ui.mband = defaultMilestoneBand();
    const band = S.milestones.find((m) => m.id === ui.mband);
    const done = band.items.filter((i) => state.milestones[i.id]).length;
    let h = '<div class="chips">' + S.milestones.map((m) => '<button class="chip" aria-pressed="' + (ui.mband === m.id) + '" data-act="mband" data-id="' + m.id + '">' + m.label + '</button>').join('') + '</div>';
    h += '<div class="card"><div class="row between"><b>' + done + ' of ' + band.items.length + ' checked</b><a href="' + band.url + '" target="_blank" rel="noopener">CDC list</a></div><div class="progress"><i style="width:' + Math.round(done / band.items.length * 100) + '%"></i></div>' +
      '<p class="small muted">These are skills most children (75% or more) show by this age. Check one when you have seen her do it, not as a test. Source: ' + esc(band.source) + '.</p></div>';
    const cats = []; band.items.forEach((i) => { if (cats.indexOf(i.cat) < 0) cats.push(i.cat); });
    cats.forEach((c) => {
      h += '<h3>' + esc(c) + '</h3><div class="card">' + band.items.filter((i) => i.cat === c).map((i) =>
        '<label class="ck"><input type="checkbox" data-ms="' + i.id + '"' + (state.milestones[i.id] ? ' checked' : '') + '><span>' + esc(i.t) + '</span></label>').join('') + '</div>';
    });
    h += '<div class="card warn"><b>When to act</b><p>' + esc(S.actEarly) + '</p></div>';
    return h;
  }
  function growMap() {
    const cur = growthBand(); const gid = ui.gband || cur.id; const g = S.growth.find((x) => x.id === gid) || cur;
    let h = '<div class="chips">' + S.growth.map((x) => '<button class="chip" aria-pressed="' + (x.id === g.id) + '" data-act="gband" data-id="' + x.id + '">' + esc(x.range.replace('Ages ', '').replace('Age ', '')) + (x.id === cur.id ? ' ⭐' : '') + '</button>').join('') + '</div>';
    h += '<div class="card hero"><b style="font-size:20px">' + esc(g.range) + '</b> <span class="pill">' + esc(g.grade) + '</span>' + (g.id === cur.id ? ' <span class="pill green">Now</span>' : '') + '</div>';
    const AIC = { 'English and talking': '🗣️', 'Reading and writing': '📖', 'Math': '🔢', 'Science and thinking': '🔬', 'Second language': '🌍', 'Feelings and friends': '💛', 'Body and movement': '🤸', 'Art and music': '🎨' };
    h += '<div class="grid g2">' + Object.keys(g.areas).map((a) => '<details class="card area"><summary><span class="area-em">' + (AIC[a] || '🌱') + '</span><b>' + esc(a) + '</b></summary><p class="small">' + esc(g.areas[a]) + '</p></details>').join('') + '</div>';
    return h;
  }
  function growLevels() {
    const lv = S.stage.level(state); const names = { letters: ['🔤', 'Letters'], numbers: ['🔢', 'Numbers'], colors: ['🎨', 'Colors'], shapes: ['🔷', 'Shapes'], words: ['📖', 'Topic words'] };
    const rows = Object.keys(names).map((k) => { const l = Math.min(4, lv + ((state.adapt || {})[k] || 0)); return '<div class="lvrow"><span class="lvem">' + names[k][0] + '</span><div style="flex:1"><div class="small"><b>' + names[k][1] + '</b> · Level ' + l + '</div><div class="progress"><i style="width:' + Math.round((l + 1) / 5 * 100) + '%"></i></div></div></div>'; }).join('');
    return stageCard() + '<div class="card">' + rows + '</div>' +
      ((state.levelLog || []).length ? '<div class="card"><b>Level-ups</b><div class="stats">' + state.levelLog.slice(0, 6).map((x) => '<span>' + esc(x.date.slice(5)) + ' ' + (names[x.sec] || ['', x.sec])[0] + ' L' + x.level + '</span>').join('') + '</div></div>' : '');
  }
  function gTile(id, em, label, status) {
    return '<button class="gtile" data-act="gtab" data-t="' + id + '"><span class="gt-em">' + em + '</span><b>' + label + '</b><span class="gt-st">' + status + '</span></button>';
  }
  function growGuide() {
    const secs = S.parent.sections(ctx);
    if (ui.gsec) {
      const x = secs.find((y) => y.id === ui.gsec);
      if (x) return '<div class="gback"><button class="btn alt small" data-act="grsec" data-id="">◀ Guide</button><b>' + x.e + ' ' + esc(x.t) + '</b></div><div class="card">' + x.body + '</div>';
    }
    return '<div class="grid g2">' + secs.map((x) => '<button class="gtile" data-act="grsec" data-id="' + x.id + '"><span class="gt-em">' + x.e + '</span><b>' + esc(x.t) + '</b><span class="gt-st">' + esc(x.n) + '</span></button>').join('') + '</div>' + S.parent.safety(ctx);
  }
  const GTITLES = { miles: ['✅', 'Milestones'], feels: ['💛', 'Feelings'], log: ['📈', 'Daily log'], map: ['🗺️', 'Roadmap to 10'], guide: ['🌱', 'Parent guide'], levels: ['🚀', 'Her levels'] };
  function viewGrow() {
    const t = GTITLES[ui.gtab] ? ui.gtab : 'hub';
    if (t === 'hub') {
      const mb = S.milestones.find((m) => m.id === (ui.mband || defaultMilestoneBand())); const md = mb.items.filter((i) => state.milestones[i.id]).length;
      const f = S.feelings.find((x) => x.id === (state.feelLog || {})[dkey()]);
      const tip = S.parent.todayMove(themeInfo().diff).m.t; const lv = S.stage.level(state);
      return '<h2>Grow</h2><div class="grid g2">' +
        gTile('levels', S.ic('grow'), 'Her levels', 'Level ' + lv + (S.stage.ageText(state) ? ' · ' + esc(S.stage.ageText(state)) : '')) +
        gTile('miles', S.ic('check'), 'Milestones', md + ' of ' + mb.items.length + ' · ' + esc(mb.label.toLowerCase())) +
        gTile('feels', S.ic('heart'), 'Feelings', f ? 'Today: ' + esc(f.name) : 'None today') +
        gTile('log', S.ic('chart'), 'Daily log', (state.log || []).length + ' entries') +
        gTile('map', S.ic('map'), 'Roadmap to 10', 'Now: ' + esc(growthBand().range)) +
        gTile('guide', S.ic('sprout'), 'Parent guide', esc(tip)) + '</div>';
    }
    const head = '<div class="gback"><button class="btn alt small" data-act="gtab" data-t="hub">◀ Grow</button><b>' + GTITLES[t][0] + ' ' + GTITLES[t][1] + '</b></div>';
    if (t === 'miles') return head + growMilestones();
    if (t === 'feels') return head + growFeelings();
    if (t === 'log') return head + S.fun.viewLog(ctx);
    if (t === 'map') return head + growMap();
    if (t === 'levels') return head + growLevels();
    return (ui.gsec ? '' : head) + growGuide();
  }
  /* ---------- ACTIVITIES ---------- */
  const STATUS = { active: ['Active now', 'green'], next: ['Next up', 'sun'], planned: ['Planned', ''], paused: ['Paused', 'coral'], done: ['Finished', ''] };
  function whenText(a) {
    if (!a.when) return '';
    if (a.when === 'age4') {
      if (state.birth) { const p = state.birth.split('-').map(Number); return 'Turns 4 in ' + MONTHS[p[1] - 1] + ' ' + (p[0] + 4); }
      return 'When she turns 4';
    }
    const m = /^(\d{4})-(\d{2})$/.exec(a.when);
    if (m) return MONTHS[Number(m[2]) - 1] + ' ' + m[1];
    return a.when;
  }
  function goalTile(type, label) {
    const items = state.activities.filter((a) => a.type === type);
    const act = items.filter((a) => a.status === 'active');
    const soon = items.filter((a) => a.status === 'next' || a.status === 'planned');
    if (act.length) return '<div class="card good"><b>✅ ' + label + '</b><div>' + act.map((a) => esc(a.name)).join(', ') + '</div></div>';
    if (soon.length) {
      const rank = (a) => (a.status === 'next' ? '0' : /^\d{4}-\d{2}$/.test(a.when || '') ? '1' + a.when : a.when === 'age4' ? '2' : '3');
      const nx = soon.slice().sort((a, b) => (rank(a) < rank(b) ? -1 : rank(a) > rank(b) ? 1 : 0))[0];
      return '<div class="card note" style="min-width:0"><b>⏳ ' + label + ' up next</b><div>' + esc(nx.name) + (whenText(nx) ? ' <span class="muted">(' + esc(whenText(nx)) + ')</span>' : '') + '</div></div>';
    }
    return '<div class="card warn"><b>➕ ' + label + '</b><div>Nothing up next yet.</div></div>';
  }
  function viewAct() {
    let h = '<h2>Activities</h2><p class="muted">Goal: one sport and one art at all times. There is no limit on how many she can try.</p><div class="card note small">👧 <b>In her view:</b> Learn, then My day. Anything marked Active now or Next up shows there, and she hears it read aloud.</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' + goalTile('sport', 'Sport') + goalTile('art', 'Art') + '</div>';
    const order = ['active', 'next', 'planned', 'paused', 'done'];
    const list = state.activities.slice().sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));
    h += '<div class="row between"><h2 style="margin:6px 0">Her list</h2><button class="btn" data-act="act-open" data-id="">＋ Add</button></div>';
    h += list.map((a) => '<div class="card"><div class="row between"><div><b style="font-size:19px">' + (a.type === 'sport' ? '🏅' : a.type === 'art' ? '🎭' : '⭐') + ' ' + esc(a.name) + '</b> <span class="pill ' + STATUS[a.status][1] + '">' + STATUS[a.status][0] + '</span>' +
      (whenText(a) ? '<div class="muted small">' + esc(whenText(a)) + '</div>' : '') + '</div><button class="btn alt small" data-act="act-open" data-id="' + esc(a.id) + '">Edit</button></div>' +
      (a.note ? '<p class="small">' + esc(a.note) + '</p>' : '') + (a.lang ? '<p class="small muted">🌍 ' + esc(a.lang) + '</p>' : '') + '</div>').join('');
    h += '<h2>Ideas</h2>' + S.activityIdeas.map((x, i) => '<div class="card"><div class="row between"><div><b>' + esc(x.name) + '</b> <span class="pill">' + esc(x.type) + '</span><div class="small muted">' + esc(x.why) + '</div></div><button class="btn alt small" data-act="act-idea" data-i="' + i + '">Add</button></div></div>').join('');
    h += '<div class="card note small"><b>Safety notes.</b> Ask every program about its minimum age, coach-to-child ratio, and safety rules. For riding, use a certified riding helmet (ASTM/SEI) and ask the stable how they match horses and lessons to small children. For water, an adult stays within arm’s reach.</div>';
    return h;
  }
  function openActivity(id) {
    const a = id ? state.activities.find((x) => x.id === id) : { id: '', name: '', type: 'sport', status: 'planned', when: '', note: '', lang: '' };
    if (!a) return;
    const opt = (v, cur, t) => '<option value="' + v + '"' + (v === cur ? ' selected' : '') + '>' + t + '</option>';
    openModal('<button class="btn alt small close" data-act="modal-close">Close</button><h2 style="margin-top:0">' + (id ? 'Edit activity' : 'Add activity') + '</h2>' +
      '<input type="hidden" id="aid" value="' + esc(a.id) + '">' +
      '<label class="f" for="aname">Name</label><input type="text" id="aname" value="' + esc(a.name) + '">' +
      '<label class="f" for="atype">Type</label><select id="atype">' + opt('sport', a.type, 'Sport') + opt('art', a.type, 'Art') + opt('other', a.type, 'Other') + '</select>' +
      '<label class="f" for="astatus">Status</label><select id="astatus">' + Object.keys(STATUS).map((k) => opt(k, a.status, STATUS[k][0])).join('') + '</select>' +
      '<label class="f" for="awhen">When (for example 2027-01, or "age4", or a note)</label><input type="text" id="awhen" value="' + esc(a.when) + '">' +
      '<label class="f" for="anote">Notes</label><textarea id="anote">' + esc(a.note) + '</textarea>' +
      '<div class="row" style="margin-top:14px"><button class="btn" data-act="act-save">Save</button>' + (id ? '<button class="btn coral" data-act="act-del" data-id="' + esc(a.id) + '">Delete</button>' : '') + '</div>');
  }

  /* ---------- SETTINGS ---------- */
  function viewSettings() {
    const sel = (k, opts) => '<select data-set="' + k + '">' + opts.map((o) => '<option value="' + o[0] + '"' + (String(state[k]) === String(o[0]) ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select>';
    const standalone = window.navigator.standalone || (window.matchMedia && matchMedia('(display-mode: standalone)').matches);
    let hs = ''; let hm = '';
    /* Solana's settings */
    hs += '<div class="card"><b>👧 About her</b><p class="small muted">Stays on this device only. The birth month sets her starting level.</p>' +
      '<label class="f" for="s-nick">Her nickname</label><input type="text" id="s-nick" data-set="nick" value="' + esc(state.nick) + '" maxlength="30" autocomplete="off">' +
      '<label class="f" for="s-birth">Birth month and year</label><input type="month" id="s-birth" data-set="birth" value="' + esc(state.birth) + '"></div>';
    hs += '<div class="card"><b>🌍 Languages and voice</b>' +
      '<label class="f">Second-language mode</label>' + sel('mode', [['focus', 'Focus: one language at a time (recommended)'], ['tour', 'Tour: a new language each day']]) +
      '<label class="f">Focus language</label>' + sel('focusLang', S.langs.map((l) => [l.id, l.flag + ' ' + l.name])) +
      '<p class="small muted">Tip: switch the focus language each month, or keep one going for longer. Real conversation with native speakers helps most.</p>' +
      '<label class="f">Voice speed</label>' + sel('rate', [[0.6, 'Slow'], [0.8, 'Gentle (default)'], [1, 'Normal']]) +
      '<label class="f">Natural English voice (needs internet and the Groq key)</label>' + sel('neural', [['', 'Off: device voice (default)'], ['1', 'On: natural voice, falls back if it fails']]) +
      '<p><button class="btn alt small" data-act="test-voice">🔊 Test voice</button></p></div>';
    hs += '<div class="card"><b>📖 Story character</b><p class="small muted">Who stars in the word lines and the story. Spidey is the default.</p><div class="chips">' + S.fun.heroes.map((h) => '<button class="chip" aria-pressed="' + ((state.hero || 'spidey') === h[0]) + '" data-act="hero-set" data-id="' + h[0] + '">' + h[1] + ' ' + esc(h[2] || state.nick || 'Solana') + '</button>').join('') + '</div></div>';
    hs += '<div class="card"><b>🌳 Class unit</b><label class="f" for="s-theme">' + esc(planTheme().name) + ' start date</label><input type="date" id="s-theme" data-set="themeStart" value="' + esc(startFor(planTheme().id)) + '">' +
      '<p class="small muted">Change the unit itself in the School tab.</p></div>';
    hs += '<div class="card"><b>🎈 Games and levels</b><p class="small muted">What she plays, her start level, and practice live in Game settings.</p><p style="margin-bottom:0"><button class="btn" data-act="go" data-to="games">Open Game settings</button></p></div>';
    hs += '<div class="card"><b>🎨 How her screens look</b><label class="f">Style</label>' + sel('look', [['retro', 'Retro preschool TV everywhere (default)'], ['mixed', 'Retro for kid screens only'], ['classic', 'Classic calm look']]) +
      '<p class="small muted">Kid screens are Games, Learn, and Feelings. Parent screens keep the calm look in the middle option.</p></div>';
    hs += '<div class="card"><b>Voice pack (send recordings and game settings to another device)</b><p class="small muted">Your voice clips and Game setup choices live on this device only. To put them on Solana’s device: 1. Tap Make voice pack here. 2. Tap Share and send it to her device (AirDrop or Messages). 3. On her device, switch to the grown-up view, open Settings, tap Import, and pick the file. This device has ' + recSet.size + (recSet.size === 1 ? ' recording' : ' recordings') + '. The file stays between your own devices.</p>' +
      '<div class="row"><button class="btn alt" data-act="pack-make">' + (ui.pack ? 'Make it again' : 'Make voice pack') + '</button><label class="btn alt" style="display:inline-flex;align-items:center;cursor:pointer">Import<input id="packFile" type="file" accept="application/json,.json" hidden></label></div>' +
      (ui.pack ? '<p class="small">' + 'Ready: ' + ui.pack.n + (ui.pack.n === 1 ? ' recording' : ' recordings') + ' and your game settings.' + '</p>' + '<div class="row"><button class="btn sun" data-act="pack-share">📤 Share</button><button class="btn alt" data-act="pack-save">⬇ Save file</button></div>' : '') + '</div>';
    /* My settings */
    hm += '<div class="card"><b>👤 About me</b><label class="f" for="s-me">Your name (shown on your screen)</label><input type="text" id="s-me" data-set="parentName" value="' + esc(state.parentName) + '" maxlength="30" autocomplete="off"></div>';
    hm += '<div class="card"><b>📅 My daily plan</b><label class="f">Daily time</label>' + sel('level', [['light', 'Light, about 17 min'], ['standard', 'Standard, about 22 min'], ['stretch', 'Stretch, about 32 min']]) +
      '<p class="small muted">Short, playful sessions work best at this age, with conversation all day long. The CDC lists attention for 5 to 10 minutes as a milestone at age 5.</p>' +
      '<label class="f">Less reading</label>' + sel('lite', [['on', 'On: tap ⓘ for details'], ['off', 'Off: show all text']]) + '</div>';
    hm += '<div class="card"><b>Profiles</b><p class="small muted">Two views on this device: the parent view (everything) and ' + esc(state.nick || 'your child') + '’s view (Games, Learn, Feelings). A PIN keeps the parent view closed when you switch to the child view. It is a child lock, not strong security, and both views share the same saved progress on this device.</p>' +
      '<p>Parent PIN: <b>' + (state.pinHash ? 'set' : 'not set') + '</b></p><div class="row"><button class="btn small" data-act="pin-set-open">' + (state.pinHash ? 'Change PIN' : 'Set a PIN') + '</button>' + (state.pinHash ? '<button class="btn alt small" data-act="pin-remove">Remove PIN</button>' : '') + '</div>' +
      '<p style="margin-bottom:0"><button class="btn" data-act="role-toggle">Switch to ' + esc(state.nick || 'child') + '’s view</button></p></div>';
    hm += '<div class="card"><b>Backup</b><p class="small muted">Saves progress, settings, and activities as a file. Recordings are stored in this browser and are not in the backup.</p>' +
      '<div class="row"><button class="btn alt" data-act="backup">Download backup</button><label class="btn alt" style="display:inline-flex;align-items:center;cursor:pointer">Restore<input id="restoreFile" type="file" accept="application/json" hidden></label></div>' +
      '<p><button class="btn coral small" data-act="reset">Erase everything on this device</button></p></div>';
    hm += '<div class="card"><b>App version ' + APP_VERSION + '</b><p class="small muted">If this number is lower than the newest release, close the app fully and open it again twice.</p></div>';
    hm += '<div class="card note"><b>Privacy</b><p class="small">No accounts, ads, or analytics. Everything is saved on this device. The only things that use the internet are the optional Groq story button and the optional natural English voice. The story button sends just a word and the unit name; the natural voice sends one short English line at a time. Clearing Safari website data will erase it, so download a backup now and then.</p></div>';
    hm += '<div class="card"><b>Install on iPad or iPhone</b><p class="small">' + (standalone ? 'You are running it as an app. 🎉' : 'Open this page in Safari, tap the Share button, then "Add to Home Screen".') + '</p></div>';
    const tab = ui.sset === 'me' ? 'me' : 'solana';
    const seg = '<div class="chips seg"><button class="chip" aria-pressed="' + (tab === 'solana') + '" data-act="sset" data-t="solana">👧 ' + esc(state.nick || 'Solana') + '</button><button class="chip" aria-pressed="' + (tab === 'me') + '" data-act="sset" data-t="me">👤 Me</button></div>';
    return '<h2>Settings</h2>' + seg + (tab === 'me' ? hm : hs) + '<p class="small muted center">Solo’s Academy. Word sounds are approximations. Please have a native speaker check them.</p>';
  }
  function openOnboarding() {
    openModal('<div class="center"><div class="big-em">✈️</div><h2 style="margin-top:0">Welcome aboard</h2></div><p>Two optional details help the app show the right stage. They stay on this device only. The first time you tap the 👧 button to hand the device to ' + 'your child, the app asks you to set a PIN.</p>' +
      '<label class="f" for="o-nick">Nickname (optional)</label><input type="text" id="o-nick" maxlength="30" autocomplete="off">' +
      '<label class="f" for="o-birth">Birth month and year</label><input type="month" id="o-birth">' +
      '<div class="row" style="margin-top:14px"><button class="btn" data-act="onboard-save">Start</button><button class="btn alt" data-act="onboard-skip">Skip for now</button></div>');
  }

  /* ---------- router ---------- */
  const ctx = {
    S, ui, esc, speak, toast, dkey, LBY, starTotal, isChild,
    /* Parent recordings for the Learn tab. Keys look like mom:unit:word:lang. */
    rec: {
      has: (k) => recSet.has(k),
      play: (k) => playRecording(k),
      start: (k, cb) => startRecording(k, cb),
      stop: () => { try { if (recorder && recorder.state === 'recording') recorder.stop(); } catch (e) { /* ignore */ } },
      active: () => (recorder && recorder.state === 'recording' ? recTarget : null)
    },
    /* Today's plan, for Solana's Learn > Today screen. Both views share state.done, so a tick on either side shows on the other. */
    plan: {
      stops: () => {
        const info = themeInfo(); const ids = LEVELS[state.level] || LEVELS.standard; const day = state.done[dkey()] || {}; const wk = info.week;
        const short = (t) => { const s = String(t || ''); const i = s.indexOf(':'); if (i > 0 && i <= 40) return s.slice(0, i) + '!'; return s.split(' ').slice(0, 8).join(' ').replace(/[.,;:!?]+$/, '') + '!'; };
        return ids.map((b) => ({ id: b, done: !!day[b], line: b === 'move' ? short(pick(wk.movement, info.diff)) : b === 'art' ? short(info.diff % 2 === 0 ? pick(wk.craft, info.diff) : pick(wk.science, info.diff)) : '' }));
      },
      mark: (b) => { const k = dkey(); state.done[k] = state.done[k] || {}; state.done[k][b] = true; save(); }
    },
    get state() { return state; },
    save: () => save(),
    render: (k) => render(k)
  };
  const ROUTES = { today: viewToday, learn: () => (isChild() ? S.kid.view(ctx, 'learn') : viewLearn()), games: () => S.games.view(ctx), feel: () => (isChild() ? S.kid.view(ctx, 'feel') : viewFeel()), theme: viewTheme, grow: viewGrow, act: viewAct, settings: viewSettings };
  const KID_ROUTES = ['learn', 'games'];
  function applyLook(r) {
    const un = S.units.find((x) => x.id === state.unit) || S.units[0];
    document.body.className = 'look-' + (state.look || 'retro') + ((isChild() || KID_ROUTES.indexOf(r) >= 0) ? ' kid' : '');
    document.body.style.setProperty('--u1', un.c1); document.body.style.setProperty('--u2', un.c2);
  }
  function route() {
    let r = (location.hash || '').replace('#/', '');
    if (r === 'words' || r === 'play') { ui.learnMode = r === 'words' ? 'bank' : 'play'; r = 'learn'; try { history.replaceState(null, '', '#/learn'); } catch (e) { /* ignore */ } }
    if (isChild()) return KID_TABS.some((t) => t[0] === r) ? r : 'games';
    return ROUTES[r] ? r : 'today';
  }
  function renderTabs() {
    const tabs = isChild() ? KID_TABS : PARENT_TABS; const nav = $('#tabs');
    const TI = { today: 'home', learn: 'learn', games: 'games', theme: 'school', grow: 'grow', act: 'activities', feel: 'heart' };
    nav.innerHTML = tabs.map((t) => '<button data-act="go" data-to="' + t[0] + '"><span>' + (S.ic(TI[t[0]]) || t[1]) + '</span>' + t[2] + '</button>').join('');
  }
  /* Less reading for the grown-up view: long helper text hides behind a small ⓘ button. */
  function liteify() {
    $$('#view p.muted, #view p.small.muted').forEach((el) => {
      if (el.closest('details, .modal, .keep') || el.dataset.keep) return;
      el.classList.add('lite-hide');
      const b = document.createElement('button'); b.type = 'button'; b.className = 'info'; b.dataset.act = 'info'; b.setAttribute('aria-label', 'Show more info'); b.textContent = 'ⓘ';
      el.parentNode.insertBefore(b, el);
    });
  }
  function render(keepScroll) {
    const r = route(); const y = window.scrollY;
    stopBreath();
    applyLook(r);
    renderTabs();
    $('#view').innerHTML = ROUTES[r]();
    if (!isChild() && state.lite !== 'off') liteify();
    $$('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.to === r));
    updateHeader();
    window.scrollTo(0, keepScroll ? y : 0);
  }
  function go(to) { if (location.hash === '#/' + to) render(false); else location.hash = '#/' + to; }
  window.addEventListener('hashchange', () => render(false));

  /* ---------- events ---------- */
  document.addEventListener('toggle', (e) => {
    const t = e.target;
    if (t && t.matches && t.matches('details[data-id]')) ui.openDetails[t.dataset.id] = t.open;
  }, true);

  document.addEventListener('click', (e) => {
    if (e.target.id === 'modal') { closeModal(); return; }
    const el = e.target.closest('[data-act]'); if (!el) return;
    const a = el.dataset.act; const d = el.dataset;
    switch (a) {
      case 'hero-set': state.hero = d.id; save(); render(false); toast('Story character: ' + S.fun.hero(ctx).name); break;
      case 'learn-mode': ui.learnMode = d.m; render(false); break;
      case 'go': closeModal(); if (isChild()) { ui.kid = {}; if (S.kid) S.kid.stop(); } go(d.to); break;
      case 'sset': ui.sset = d.t; render(false); break;
      case 'info': { const n = el.nextElementSibling; if (n) n.classList.toggle('lite-show'); break; }
      case 'modal-close': ui.afterPin = false; closeModal(); break;
      case 'toggle-block': {
        e.preventDefault(); e.stopPropagation();
        const k = dkey(); state.done[k] = state.done[k] || {}; state.done[k][d.b] = !state.done[k][d.b];
        save(); render(true); if (state.done[k][d.b]) toast('Nice!');
        break;
      }
      case 'feel-pick': state.feelLog[dkey()] = d.id; save(); render(true); toast('Feeling saved'); break;
      case 'feel-open': openFeeling(d.id); break;
      case 'feel-log': state.feelLog[dkey()] = d.id; save(); closeModal(); toast('Saved. Thank you for telling me.'); if (route() === 'feel') render(true); break;
      case 'breath-start': startBreath(); break;
      case 'breath-modal': openModal('<button class="btn alt small close" data-act="modal-close">Close</button><div class="card breath" style="box-shadow:none;border:0"><div class="plane" id="bplane">✈️</div><div class="count" id="bcount">Ready for takeoff?</div><button class="btn" data-act="breath-start">Start 3 flights</button></div>'); break;
      case 'say-en': speak(d.text, 'en-US', d.slow === '1'); break;
      case 'speak': {
        const L = LBY[d.lang]; const w = WBY[d.id]; const k = lkey(d.lang, d.id);
        const ok = speak(w[d.lang][0], L.tts, d.slow === '1');
        if (!ok) { if (recSet.has(k)) playRecording(k); else toast('No ' + L.name + ' voice here. Open the card and tap Record.'); }
        break;
      }
      case 'open-card': openCard(d.lang, d.id); break;
      case 'open-en': openEnglish(+d.c, +d.w); break;
      case 'card-nav': {
        if (!ui.cardList.length) break;
        stopRecording(true);
        ui.cardIdx = (ui.cardIdx + (+d.dir) + ui.cardList.length) % ui.cardList.length; refreshCard(); break;
      }
      case 'card-learned': { const c = ui.cardList[ui.cardIdx]; const k = lkey(c.lang, c.id); state.learned[k] = !state.learned[k]; save(); refreshCard(); if (state.learned[k]) toast('Learned! ✅'); break; }
      case 'card-said': { const c = ui.cardList[ui.cardIdx]; const k = lkey(c.lang, c.id); state.said[k] = !state.said[k]; save(); refreshCard(); if (state.said[k]) toast('+1 ⭐'); break; }
      case 'rec-start': startRecording(d.key); break;
      case 'rec-stop': if (recorder && recorder.state !== 'inactive') recorder.stop(); setRecUi(false); break;
      case 'rec-play': playRecording(d.key); break;
      case 'rec-del': recDel(d.key).then(() => { recSet.delete(d.key); toast('Recording deleted'); refreshCard(); }).catch(() => toast('Could not delete')); break;
      case 'wlang': ui.wlang = d.lang; ui.wcat = 'all'; ui.learnMode = 'bank'; if (route() === 'learn') render(false); else go('learn'); break;
      case 'wcat': ui.wcat = d.cat; render(true); break;
      case 'songs': {
        const L = LBY[ui.wlang];
        openModal('<button class="btn alt small close" data-act="modal-close">Close</button><h2 style="margin-top:0">' + L.flag + ' ' + esc(L.name) + ' songs</h2><ul>' + (S.langSongs[ui.wlang] || []).map((s) => '<li>' + esc(s) + '</li>').join('') + '</ul><p class="small muted">Titles only. Look them up at your library or on a children’s video site, and sing along. Songs are one of the best ways to learn sounds.</p>');
        break;
      }
      case 'quiz-start': startQuiz(); break;
      case 'quiz-hear': if (quiz) speak(quiz.target[quiz.lang][0], LBY[quiz.lang].tts); break;
      case 'quiz-pick': {
        if (!quiz || quiz.locked) break;
        const o = quiz.opts[+d.i];
        if (o.id === quiz.target.id) {
          quiz.locked = true; quiz.score++; state.quizStars = (state.quizStars || 0) + 1; save(); el.classList.add('pop'); toast('Yes!');
          setTimeout(() => { quiz.i++; renderQuiz(); }, 800);
        } else { el.classList.add('shake'); setTimeout(() => el.classList.remove('shake'), 400); }
        break;
      }
      case 'tweek': ui.tweek = +d.n; render(true); break;
      case 'gtab': ui.gtab = d.t; ui.gsec = null; render(true); break;
      case 'grsec': ui.gsec = d.id || null; render(true); break;
      case 'gband': ui.gband = d.id; render(false); break;
      case 'mband': ui.mband = d.id; render(true); break;
      case 'act-open': openActivity(d.id || null); break;
      case 'act-save': {
        const name = $('#aname').value.trim(); if (!name) { toast('Please add a name'); break; }
        const id = $('#aid').value; const rec = { id: id || 'a-' + Date.now(), name, type: $('#atype').value, status: $('#astatus').value, when: $('#awhen').value.trim(), note: $('#anote').value.trim(), lang: '' };
        const i = state.activities.findIndex((x) => x.id === id);
        if (i >= 0) { rec.lang = state.activities[i].lang; state.activities[i] = rec; } else state.activities.push(rec);
        save(); closeModal(); render(true); toast('Saved'); break;
      }
      case 'act-del': if (window.confirm('Delete this activity?')) { state.activities = state.activities.filter((x) => x.id !== d.id); save(); closeModal(); render(true); } break;
      case 'act-idea': {
        const x = S.activityIdeas[+d.i];
        if (state.activities.some((y) => y.name === x.name)) { toast('Already on the list'); break; }
        state.activities.push({ id: 'a-' + Date.now(), name: x.name, type: x.type, status: 'planned', when: '', note: '', lang: '' }); save(); render(true); toast('Added to the list'); break;
      }
      case 'test-voice': { if (state.neural) { speak('Hello! Let us learn a new word today.', 'en-US'); toast('Playing natural English'); break; } const L = LBY[state.focusLang]; const w = WBY.hello; if (!speak(w[L.id][0], L.tts)) toast('No ' + L.name + ' voice on this device'); else toast('Playing ' + L.name); break; }
      case 'backup': {
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob); const link = document.createElement('a');
        link.href = url; link.download = 'solos-academy-backup-' + dkey() + '.json'; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000); break;
      }
      case 'pack-make': buildPack().then((p) => { ui.pack = p; render(true);  }).catch(() => toast('Could not make the voice pack.')); break;
      case 'pack-share': {
        const f = ui.pack && ui.pack.file; if (!f) break;
        if (navigator.canShare && navigator.canShare({ files: [f] })) navigator.share({ files: [f], title: 'Solo’s Academy voice pack' }).catch(() => {});
        else { const url = URL.createObjectURL(f); const link = document.createElement('a'); link.href = url; link.download = f.name; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000); toast('Saved. Send the file to her device.'); }
        break;
      }
      case 'pack-save': {
        const f = ui.pack && ui.pack.file; if (!f) break;
        const url = URL.createObjectURL(f); const link = document.createElement('a'); link.href = url; link.download = f.name; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000); break;
      }
      case 'reset': if (window.confirm('Erase all progress and settings on this device? This cannot be undone.')) { try { localStorage.removeItem(KEY); } catch (er) { /* ignore */ } state = load(); state.onboarded = true; save(); render(false); toast('Erased'); } break;
      case 'onboard-save': { const nk = ($('#o-nick').value || '').trim(); if (nk) state.nick = nk; } state.birth = $('#o-birth').value || ''; state.onboarded = true; save(); closeModal(); render(false); break;
      case 'onboard-skip': state.onboarded = true; save(); closeModal(); break;
      case 'splash-go': hideSplash(); break;
      case 'role-toggle':
        if (isChild()) { if (!state.pinHash) { state.role = 'parent'; save(); go('today'); render(false); } else toast('Grown-ups: press and hold the 👪 button'); }
        else if (!state.pinHash) { ui.afterPin = true; openPinSet(); }
        else toChild();
        break;
      case 'pin-submit': submitPin(); break;
      case 'pin-set-open': openPinSet(); break;
      case 'pin-save': savePin(); break;
      case 'pin-remove': state.pinHash = ''; state.pinSalt = ''; save(); render(true); toast('PIN removed. You will be asked for a new one next time you switch to her view.'); break;
      default: if (!S.games.handle(a, d, ctx) && !S.kid.handle(a, d, ctx)) S.fun.handle(a, d, ctx); break;
    }
  });

  document.addEventListener('change', (e) => {
    const el = e.target;
    if (el.dataset && el.dataset.set) {
      const k = el.dataset.set; let v = el.value;
      if (k === 'rate') v = parseFloat(v);
      if (k === 'themeStart' && planTheme().id !== 'trees') { state.unitStarts = state.unitStarts || {}; state.unitStarts[planTheme().id] = v; } else state[k] = v;
      save();
      if (k === 'themeStart') ui.tweek = null;
      if (k !== 'nick') toast('Saved');
      render(true);
    } else if (el.dataset && el.dataset.hs) {
      state.homeSetup = state.homeSetup || {}; state.homeSetup[el.dataset.hs] = el.checked; save(); render(true);
    } else if (el.dataset && el.dataset.ms) {
      state.milestones[el.dataset.ms] = el.checked; save(); render(true);
    } else if (el.id === 'packFile' && el.files && el.files[0]) {
      importPack(el.files[0]); el.value = '';
    } else if (el.id === 'restoreFile' && el.files && el.files[0]) {
      const fr = new FileReader();
      fr.onload = () => {
        try {
          const o = JSON.parse(fr.result); if (!o || typeof o !== 'object' || !o.done) throw new Error('bad');
          state = Object.assign(defaults(), o); if (!Array.isArray(state.activities)) state.activities = JSON.parse(JSON.stringify(S.activityDefaults)); ui.games = null; ui.pack = null; save(); render(false); toast('Restored');
        } catch (er) { toast('That file does not look like a Solo’s Academy backup.'); }
      };
      fr.readAsText(el.files[0]);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('#modal').hidden) closeModal();
    if (e.key === 'Enter' && e.target && e.target.id === 'pinIn') submitPin();
  });

  /* ---------- start ---------- */
  /* Spoken hello: Solana hears her own name; the grown-up hears a progress hello. */
  function greeting() {
    const kid = state.nick || 'friend';
    return isChild() ? 'Hello ' + kid + '! Let’s learn!' : 'Hello ' + (state.parentName || 'there') + '! Here’s ' + kid + '’s progress.';
  }
  function hideSplash() {
    const sp = $('#splash'); if (!sp || sp.hidden) return;
    sp.hidden = true; speak(greeting(), 'en-US');
    if (!state.onboarded && !isChild()) openOnboarding();
  }
  S.fun.mount(); S.games.mount(ctx);
  /* In Solana's view the grown-up button needs a press and hold, then the PIN. */
  (function () {
    const rb = $('#roleBtn'); if (!rb) return; let t = null;
    const stop = () => { if (t) { clearTimeout(t); t = null; } };
    rb.addEventListener('pointerdown', () => { if (!isChild() || !state.pinHash) return; stop(); t = setTimeout(() => { t = null; openPinEntry(); }, 1500); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => rb.addEventListener(ev, stop));
  })();
  render(false);
  if (state.look !== 'classic') { $('#splash').hidden = false; } else if (!state.onboarded && !isChild()) openOnboarding();
  /* Stop pinch and double-tap zoom (iOS ignores the viewport setting). */
  ['gesturestart', 'gesturechange', 'gestureend'].forEach((ev) => document.addEventListener(ev, (e) => e.preventDefault()));
  let lastTouch = 0;
  document.addEventListener('touchend', (e) => { const n = Date.now(); if (n - lastTouch < 350 && e.target.closest && !e.target.closest('input, textarea, select')) e.preventDefault(); lastTouch = n; }, { passive: false });
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    const had = !!navigator.serviceWorker.controller; let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (had && !reloaded) { reloaded = true; location.reload(); } });
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').then((r) => { try { r.update(); } catch (e) { /* ignore */ } }).catch(() => {}); });
  }
})();
