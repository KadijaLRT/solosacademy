/* Solo's Academy: open topic shelf. These topics are not tied to a school unit.
   The five CREC units stay in SA.units and are marked school:true. Add a topic by pushing one more object to SA.units.
   All lines are original. Spanish is standard Latin American usage; ask a native speaker to double-check. */
(function () {
  window.SA = window.SA || {};
  const W = (week, rows) => rows.map((r) => ({ en: r[0], es: r[1], emoji: r[2], week: week, spidey: 'Spidey says: ' + r[0] + '!', spideyEs: '¡Spidey dice: ' + r[1] + '!' }));
  SA.units.forEach((u) => { u.school = true; });
  const T = [
    { id: 'days', name: 'Days of the week', emoji: '📅', c1: '#ffe9b8', c2: '#fff6dc', weeks: ['Days', 'Yesterday, today, tomorrow'],
      words: W('Days', [['Sunday', 'domingo', '1️⃣'], ['Monday', 'lunes', '2️⃣'], ['Tuesday', 'martes', '3️⃣'], ['Wednesday', 'miércoles', '4️⃣'], ['Thursday', 'jueves', '5️⃣'], ['Friday', 'viernes', '6️⃣'], ['Saturday', 'sábado', '7️⃣'], ['week', 'la semana', '🗓️']])
        .concat(W('Yesterday, today, tomorrow', [['yesterday', 'ayer', '⏪'], ['today', 'hoy', '📅'], ['tomorrow', 'mañana', '⏩']])),
      feelings: [{ q: 'How does she feel on Saturday? No school, and a day to play!', a: 'happy', es: 'feliz' }, { q: 'How does she feel on Monday morning? She is going to see her friends.', a: 'excited', es: 'emocionado' }, { q: 'How does she feel on Friday? She got all her puzzle pieces in!', a: 'proud', es: 'orgulloso' }] },
    { id: 'months', name: 'Months of the year', emoji: '🗓️', c1: '#d9e8ff', c2: '#eef4ff', weeks: ['Winter months', 'Spring months', 'Summer months', 'Fall months'],
      words: W('Winter months', [['January', 'enero', '⛄'], ['February', 'febrero', '❤️'], ['December', 'diciembre', '🎄']])
        .concat(W('Spring months', [['March', 'marzo', '🍀'], ['April', 'abril', '🌧️'], ['May', 'mayo', '🌷']]))
        .concat(W('Summer months', [['June', 'junio', '☀️'], ['July', 'julio', '🎆'], ['August', 'agosto', '🏖️']]))
        .concat(W('Fall months', [['September', 'septiembre', '🍎'], ['October', 'octubre', '🎃'], ['November', 'noviembre', '🦃']])),
      feelings: [{ q: 'How does she feel in a snowy month when she can build a snowman?', a: 'happy', es: 'feliz' }, { q: 'How does she feel in her birthday month? Cake is coming!', a: 'excited', es: 'emocionado' }, { q: 'How does she feel after she says all twelve months?', a: 'proud', es: 'orgulloso' }] },
    { id: 'seasons', name: 'Seasons and weather', emoji: '🌦️', c1: '#cdeeff', c2: '#eefaff', weeks: ['Seasons', 'Weather', 'What to wear'],
      words: W('Seasons', [['spring', 'la primavera', '🌷'], ['summer', 'el verano', '🏖️'], ['fall', 'el otoño', '🍂'], ['winter', 'el invierno', '❄️']])
        .concat(W('Weather', [['sun', 'el sol', '☀️'], ['rain', 'la lluvia', '🌧️'], ['snow', 'la nieve', '☃️'], ['wind', 'el viento', '💨'], ['cloud', 'la nube', '☁️'], ['rainbow', 'el arco iris', '🌈'], ['storm', 'la tormenta', '⛈️']]))
        .concat(W('What to wear', [['umbrella', 'el paraguas', '☂️'], ['coat', 'el abrigo', '🧥'], ['boots', 'las botas', '🥾'], ['sunglasses', 'las gafas de sol', '🕶️'], ['scarf', 'la bufanda', '🧣'], ['gloves', 'los guantes', '🧤']])),
      feelings: [{ q: 'How does she feel when she splashes in a rain puddle?', a: 'happy', es: 'feliz' }, { q: 'How does she feel when thunder booms?', a: 'scared', es: 'asustado' }, { q: 'How does she feel when a rainbow comes out?', a: 'excited', es: 'emocionado' }] },
    { id: 'space', name: 'Space and planets', emoji: '🚀', c1: '#d6d3ff', c2: '#ecebff', weeks: ['Sky', 'Space travel', 'Planets'],
      words: W('Sky', [['sun', 'el sol', '☀️'], ['moon', 'la luna', '🌙'], ['star', 'la estrella', '⭐'], ['night', 'la noche', '🌃'], ['galaxy', 'la galaxia', '🌌'], ['comet', 'el cometa', '☄️']])
        .concat(W('Space travel', [['rocket', 'el cohete', '🚀'], ['astronaut', 'el astronauta', '🧑‍🚀'], ['telescope', 'el telescopio', '🔭'], ['satellite', 'el satélite', '🛰️']]))
        .concat(W('Planets', [['Earth', 'la Tierra', '🌍'], ['Mars', 'Marte', '🔴'], ['Jupiter', 'Júpiter', '🟠'], ['Saturn', 'Saturno', '🪐'], ['Venus', 'Venus', '🟡'], ['Neptune', 'Neptuno', '🔵']])),
      feelings: [{ q: 'How does the astronaut feel at blast off?', a: 'excited', es: 'emocionado' }, { q: 'How does the little star feel when the sky gets dark and she is far from home?', a: 'scared', es: 'asustado' }, { q: 'How does the astronaut feel after she lands safely?', a: 'proud', es: 'orgulloso' }] },
    { id: 'body', name: 'My body', emoji: '🧍', c1: '#ffd9e4', c2: '#ffeef3', weeks: ['Face', 'Body', 'Inside'],
      words: W('Face', [['eye', 'el ojo', '👁️'], ['ear', 'la oreja', '👂'], ['nose', 'la nariz', '👃'], ['mouth', 'la boca', '👄'], ['tooth', 'el diente', '🦷'], ['tongue', 'la lengua', '👅']])
        .concat(W('Body', [['hand', 'la mano', '✋'], ['foot', 'el pie', '🦶'], ['leg', 'la pierna', '🦵'], ['arm', 'el brazo', '💪'], ['hair', 'el pelo', '💇']]))
        .concat(W('Inside', [['brain', 'el cerebro', '🧠'], ['heart', 'el corazón', '❤️'], ['bone', 'el hueso', '🦴']])),
      feelings: [{ q: 'How does she feel when she kicks a goal with her strong legs?', a: 'proud', es: 'orgulloso' }, { q: 'How does she feel when she gets a big hug?', a: 'happy', es: 'feliz' }, { q: 'How does she feel when she stubs her toe?', a: 'sad', es: 'triste' }] },
    { id: 'animals', name: 'Animals', emoji: '🦁', c1: '#ffe0b3', c2: '#fff1d9', weeks: ['Farm', 'Wild', 'Ocean'],
      words: W('Farm', [['cow', 'la vaca', '🐄'], ['pig', 'el cerdo', '🐖'], ['horse', 'el caballo', '🐴'], ['sheep', 'la oveja', '🐑'], ['chicken', 'la gallina', '🐔'], ['duck', 'el pato', '🦆']])
        .concat(W('Wild', [['lion', 'el león', '🦁'], ['elephant', 'el elefante', '🐘'], ['giraffe', 'la jirafa', '🦒'], ['monkey', 'el mono', '🐒'], ['zebra', 'la cebra', '🦓'], ['bear', 'el oso', '🐻']]))
        .concat(W('Ocean', [['fish', 'el pez', '🐟'], ['whale', 'la ballena', '🐋'], ['octopus', 'el pulpo', '🐙'], ['shark', 'el tiburón', '🦈'], ['turtle', 'la tortuga', '🐢'], ['dolphin', 'el delfín', '🐬']])),
      feelings: [{ q: 'How does the baby lion feel when he is with his family?', a: 'happy', es: 'feliz' }, { q: 'How does the little duck feel when she cannot find her mom?', a: 'sad', es: 'triste' }, { q: 'How does the monkey feel when he swings to the top of the tree?', a: 'proud', es: 'orgulloso' }] },
    { id: 'plane', name: 'Airplanes and travel', emoji: '✈️', c1: '#cfeaff', c2: '#eaf6ff', weeks: ['The plane', 'The airport', 'Things that go'],
      words: W('The plane', [['airplane', 'el avión', '✈️'], ['pilot', 'el piloto', '🧑‍✈️'], ['wing', 'el ala', '🪽'], ['wheel', 'la rueda', '🛞'], ['helicopter', 'el helicóptero', '🚁']])
        .concat(W('The airport', [['airport', 'el aeropuerto', '🛫'], ['runway', 'la pista', '🛬'], ['suitcase', 'la maleta', '🧳'], ['ticket', 'el boleto', '🎫'], ['tower', 'la torre', '🗼']]))
        .concat(W('Things that go', [['car', 'el carro', '🚗'], ['bus', 'el autobús', '🚌'], ['train', 'el tren', '🚆'], ['boat', 'el barco', '⛵'], ['bike', 'la bicicleta', '🚲']])),
      feelings: [{ q: 'How does the pilot feel when the plane lifts off the ground?', a: 'excited', es: 'emocionado' }, { q: 'How does a little girl feel when she lands and sees Grandma?', a: 'happy', es: 'feliz' }, { q: 'How does the pilot feel after a smooth landing?', a: 'proud', es: 'orgulloso' }] },
    { id: 'food', name: 'Food', emoji: '🍎', c1: '#ffe0e0', c2: '#fff1f1', weeks: ['Fruit', 'Veggies', 'Meals'],
      words: W('Fruit', [['apple', 'la manzana', '🍎'], ['banana', 'el plátano', '🍌'], ['grapes', 'las uvas', '🍇'], ['orange', 'la naranja', '🍊'], ['strawberry', 'la fresa', '🍓'], ['watermelon', 'la sandía', '🍉']])
        .concat(W('Veggies', [['carrot', 'la zanahoria', '🥕'], ['corn', 'el maíz', '🌽'], ['broccoli', 'el brócoli', '🥦'], ['tomato', 'el tomate', '🍅'], ['potato', 'la papa', '🥔'], ['cucumber', 'el pepino', '🥒']]))
        .concat(W('Meals', [['milk', 'la leche', '🥛'], ['bread', 'el pan', '🍞'], ['egg', 'el huevo', '🥚'], ['cheese', 'el queso', '🧀'], ['rice', 'el arroz', '🍚'], ['water', 'el agua', '💧']])),
      feelings: [{ q: 'How does she feel when she tastes a sweet strawberry?', a: 'happy', es: 'feliz' }, { q: 'How does she feel when she tries a new food for the first time?', a: 'proud', es: 'orgulloso' }, { q: 'How does she feel when her ice cream falls on the ground?', a: 'sad', es: 'triste' }] },
    { id: 'home', name: 'Home and family', emoji: '🏠', c1: '#e6f5d0', c2: '#f4fbe8', weeks: ['Rooms', 'Things at home', 'Family'],
      words: W('Rooms', [['kitchen', 'la cocina', '🍳'], ['bedroom', 'el dormitorio', '🛏️'], ['bathroom', 'el baño', '🛁'], ['living room', 'la sala', '🛋️']])
        .concat(W('Things at home', [['bed', 'la cama', '🛏️'], ['chair', 'la silla', '🪑'], ['table', 'la mesa', '🍽️'], ['door', 'la puerta', '🚪'], ['window', 'la ventana', '🪟'], ['lamp', 'la lámpara', '💡']]))
        .concat(W('Family', [['mom', 'mamá', '👩'], ['dad', 'papá', '👨'], ['baby', 'el bebé', '👶'], ['grandma', 'la abuela', '👵'], ['grandpa', 'el abuelo', '👴'], ['sister', 'la hermana', '👧'], ['brother', 'el hermano', '👦']])),
      feelings: [{ q: 'How does she feel when Mom or Dad gives her a big hug?', a: 'happy', es: 'feliz' }, { q: 'How does she feel when her family goes out and she misses them?', a: 'sad', es: 'triste' }, { q: 'How does she feel when she helps set the table all by herself?', a: 'proud', es: 'orgulloso' }] }
  ];
  T.forEach((u) => { u.school = false; SA.units.push(u); });
  /* Topics shown first on Solana's pick-a-topic screen */
  SA.topicOrder = T.map((u) => u.id).concat(SA.units.filter((u) => u.school).map((u) => u.id));
})();
