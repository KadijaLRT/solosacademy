/* Solo's Academy: letters and spelling words for the Games tab. English only.
   Each letter has one picture word that starts with that sound (X uses a word that ends in x). */
(function () {
  'use strict';
  const SA = window.SA;
  SA.letters = [
    { l: 'A', w: 'apple', e: '🍎' }, { l: 'B', w: 'banana', e: '🍌' }, { l: 'C', w: 'cat', e: '🐱' },
    { l: 'D', w: 'dog', e: '🐶' }, { l: 'E', w: 'elephant', e: '🐘' }, { l: 'F', w: 'fish', e: '🐟' },
    { l: 'G', w: 'grapes', e: '🍇' }, { l: 'H', w: 'hat', e: '🎩' }, { l: 'I', w: 'iguana', e: '🦎' },
    { l: 'J', w: 'juice', e: '🧃' }, { l: 'K', w: 'kite', e: '🪁' }, { l: 'L', w: 'lion', e: '🦁' },
    { l: 'M', w: 'moon', e: '🌙' }, { l: 'N', w: 'nose', e: '👃' }, { l: 'O', w: 'octopus', e: '🐙' },
    { l: 'P', w: 'plane', e: '✈️' }, { l: 'Q', w: 'queen', e: '👑' }, { l: 'R', w: 'rainbow', e: '🌈' },
    { l: 'S', w: 'spider', e: '🕷️' }, { l: 'T', w: 'tree', e: '🌳' }, { l: 'U', w: 'umbrella', e: '☂️' },
    { l: 'V', w: 'van', e: '🚐' }, { l: 'W', w: 'water', e: '💧' }, { l: 'X', w: 'box', e: '📦', end: true },
    { l: 'Y', w: 'yellow', e: '💛' }, { l: 'Z', w: 'zebra', e: '🦓' }
  ];
  /* Short words for Build a word (3 to 5 letters). */
  SA.spellWords = [
    { w: 'cat', e: '🐱' }, { w: 'dog', e: '🐶' }, { w: 'sun', e: '☀️' }, { w: 'hat', e: '🎩' }, { w: 'bus', e: '🚌' },
    { w: 'pig', e: '🐷' }, { w: 'cow', e: '🐮' }, { w: 'bed', e: '🛏️' }, { w: 'car', e: '🚗' }, { w: 'bee', e: '🐝' },
    { w: 'fox', e: '🦊' }, { w: 'owl', e: '🦉' }, { w: 'key', e: '🔑' }, { w: 'egg', e: '🥚' }, { w: 'star', e: '⭐' },
    { w: 'tree', e: '🌳' }, { w: 'moon', e: '🌙' }, { w: 'fish', e: '🐟' }, { w: 'frog', e: '🐸' }, { w: 'bear', e: '🐻' }, { w: 'kite', e: '🪁' }
  ];
  /* Longer words for higher levels (5 to 6 letters). */
  SA.spellWords2 = [
    { w: 'apple', e: '🍎' }, { w: 'plane', e: '✈️' }, { w: 'tiger', e: '🐯' }, { w: 'zebra', e: '🦓' }, { w: 'horse', e: '🐴' },
    { w: 'robot', e: '🤖' }, { w: 'cloud', e: '☁️' }, { w: 'truck', e: '🚚' }, { w: 'train', e: '🚂' }, { w: 'panda', e: '🐼' },
    { w: 'pizza', e: '🍕' }, { w: 'lemon', e: '🍋' }, { w: 'snake', e: '🐍' }, { w: 'whale', e: '🐋' }, { w: 'spider', e: '🕷️' },
    { w: 'rabbit', e: '🐰' }, { w: 'monkey', e: '🐵' }, { w: 'flower', e: '🌸' }, { w: 'rocket', e: '🚀' }
  ];
})();
