/* Solo's Academy: stage and challenge level.
   Her age sets a base stage. A grown-up "challenge" setting moves her ahead of it (default: one stage ahead).
   The effective level (0 to 4) decides how hard the games, questions, and daily plan are. */
(function () {
  'use strict';
  const SA = window.SA;
  const T = (SA.stage = {});
  T.LEVELS = [
    { n: 0, name: 'Level 0', like: 'about age 2', does: 'Letters, numbers 1 to 5, 4 shapes, 6 colors, unit words.' },
    { n: 1, name: 'Level 1', like: 'about age 3', does: 'Numbers 1 to 10, 6 shapes, 9 colors, matching big and little letters.' },
    { n: 2, name: 'Level 2', like: 'about age 4', does: 'Sound it (first letters of words), numbers to 20, Add it (sums to 5), 8 shapes, 11 colors, word-in-a-sentence listening, Spanish sentences, 4 to 5 letter words.' },
    { n: 3, name: 'Level 3', like: 'about age 5', does: 'Sound it with ending sounds, Add it and take away to 10, 10 shapes, spell 5 to 6 letter words in full.' },
    { n: 4, name: 'Level 4', like: 'age 6 and up', does: 'Everything in Level 3, with sums and take-away up to 20.' }
  ];
  /* Age in months from the birth month she was given, or null. */
  T.months = function (state) {
    if (!state.birth) return null;
    const p = String(state.birth).split('-').map(Number);
    if (!p[0] || !p[1]) return null;
    const now = new Date();
    return Math.max(0, (now.getFullYear() - p[0]) * 12 + (now.getMonth() + 1 - p[1]));
  };
  T.base = function (state) {
    const m = T.months(state);
    if (m == null) return 1;
    return m < 30 ? 0 : m < 42 ? 1 : m < 54 ? 2 : m < 66 ? 3 : 4;
  };
  /* boost: how many stages ahead (0, 1, or 2). Stored as state.gameCfg.boost. Default is 1. */
  T.boost = function (state) {
    const b = state.gameCfg && state.gameCfg.boost;
    return b === '0' ? 0 : b === '2' ? 2 : 1;
  };
  T.level = function (state) { return Math.min(4, T.base(state) + T.boost(state)); };
  T.ageText = function (state) {
    const m = T.months(state);
    if (m == null) return '';
    const y = Math.floor(m / 12); const r = m % 12;
    return y + (y === 1 ? ' year' : ' years') + (r ? ' ' + r + (r === 1 ? ' month' : ' months') : '');
  };
})();
