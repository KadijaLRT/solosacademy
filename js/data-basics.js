/* Solo's Academy: numbers, colors, and shapes for the Games tab.
   English plus Spanish. Spanish is used only when her focus language is Spanish. */
(function () {
  'use strict';
  const SA = window.SA;
  SA.numbers = [
    { n: 1, en: 'one', es: 'uno' }, { n: 2, en: 'two', es: 'dos' }, { n: 3, en: 'three', es: 'tres' },
    { n: 4, en: 'four', es: 'cuatro' }, { n: 5, en: 'five', es: 'cinco' }, { n: 6, en: 'six', es: 'seis' },
    { n: 7, en: 'seven', es: 'siete' }, { n: 8, en: 'eight', es: 'ocho' }, { n: 9, en: 'nine', es: 'nueve' },
    { n: 10, en: 'ten', es: 'diez' }, { n: 11, en: 'eleven', es: 'once' }, { n: 12, en: 'twelve', es: 'doce' },
    { n: 13, en: 'thirteen', es: 'trece' }, { n: 14, en: 'fourteen', es: 'catorce' }, { n: 15, en: 'fifteen', es: 'quince' },
    { n: 16, en: 'sixteen', es: 'dieciséis' }, { n: 17, en: 'seventeen', es: 'diecisiete' }, { n: 18, en: 'eighteen', es: 'dieciocho' },
    { n: 19, en: 'nineteen', es: 'diecinueve' }, { n: 20, en: 'twenty', es: 'veinte' }
  ];
  SA.colors = [
    { id: 'red', en: 'red', es: 'rojo', c: '#e63946' }, { id: 'blue', en: 'blue', es: 'azul', c: '#3a86ff' },
    { id: 'yellow', en: 'yellow', es: 'amarillo', c: '#ffd23f' }, { id: 'green', en: 'green', es: 'verde', c: '#2fbf71' },
    { id: 'orange', en: 'orange', es: 'naranja', c: '#ff9f1c' }, { id: 'purple', en: 'purple', es: 'morado', c: '#8338ec' },
    { id: 'pink', en: 'pink', es: 'rosa', c: '#ff7eb6' }, { id: 'brown', en: 'brown', es: 'marrón', c: '#8d5524' },
    { id: 'black', en: 'black', es: 'negro', c: '#222222' }, { id: 'gray', en: 'gray', es: 'gris', c: '#8e8e93' },
    { id: 'turquoise', en: 'turquoise', es: 'turquesa', c: '#1bbfb0' }
  ];
  /* Shapes are drawn as inline SVG paths (viewBox 0 0 100 100). */
  SA.shapes = [
    { id: 'circle', en: 'circle', es: 'círculo', c: '#e63946', svg: '<circle cx="50" cy="50" r="40"/>' },
    { id: 'square', en: 'square', es: 'cuadrado', c: '#3a86ff', svg: '<rect x="12" y="12" width="76" height="76" rx="6"/>' },
    { id: 'triangle', en: 'triangle', es: 'triángulo', c: '#2fbf71', svg: '<polygon points="50,10 92,86 8,86"/>' },
    { id: 'star', en: 'star', es: 'estrella', g: 'f', c: '#ffb703', svg: '<polygon points="50,6 61,37 94,37 67,57 77,90 50,70 23,90 33,57 6,37 39,37"/>' },
    { id: 'heart', en: 'heart', es: 'corazón', c: '#ff5c8a', svg: '<path d="M50 88 C10 58 8 24 31 18 C43 15 50 25 50 30 C50 25 57 15 69 18 C92 24 90 58 50 88Z"/>' },
    { id: 'rectangle', en: 'rectangle', es: 'rectángulo', c: '#ff9f1c', svg: '<rect x="4" y="24" width="92" height="52" rx="6"/>' },
    { id: 'oval', en: 'oval', es: 'óvalo', c: '#8338ec', svg: '<ellipse cx="50" cy="50" rx="44" ry="30"/>' },
    { id: 'diamond', en: 'diamond', es: 'rombo', c: '#00b4d8', svg: '<polygon points="50,6 92,50 50,94 8,50"/>' },
    { id: 'pentagon', en: 'pentagon', es: 'pentágono', c: '#2fbf71', svg: '<polygon points="50,6 94,38 77,90 23,90 6,38"/>' },
    { id: 'hexagon', en: 'hexagon', es: 'hexágono', c: '#ff7eb6', svg: '<polygon points="27,10 73,10 96,50 73,90 27,90 4,50"/>' }
  ];
  /* Things to count: singular and plural names. */
  SA.countThings = [
    { e: '🍎', s: 'apple', p: 'apples' }, { e: '⭐', s: 'star', p: 'stars' }, { e: '🐟', s: 'fish', p: 'fish' },
    { e: '🚗', s: 'car', p: 'cars' }, { e: '🌳', s: 'tree', p: 'trees' }, { e: '🦋', s: 'butterfly', p: 'butterflies' },
    { e: '🍌', s: 'banana', p: 'bananas' }, { e: '🎈', s: 'balloon', p: 'balloons' }, { e: '✈️', s: 'plane', p: 'planes' }
  ];
})();
