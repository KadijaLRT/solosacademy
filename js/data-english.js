/* Sky Academy: English talking, clear speech, and social-emotional content. */
(function () {
  window.SA = window.SA || {};

  /* Each word: w = word, s = syllables, e = emoji, l = ladder (one word, two or three words, a full sentence) */
  SA.english = [
    { cat: 'Trees', words: [
      { w: 'tree', s: 'tree', e: '🌳', l: ['tree', 'big tree', 'I see a big tree.'] },
      { w: 'leaf', s: 'leaf', e: '🍃', l: ['leaf', 'red leaf', 'The leaf is red.'] },
      { w: 'branch', s: 'branch', e: '🪵', l: ['branch', 'long branch', 'The bird sits on a branch.'] },
      { w: 'trunk', s: 'trunk', e: '🪵', l: ['trunk', 'thick trunk', 'The trunk is thick and rough.'] },
      { w: 'bark', s: 'bark', e: '🪵', l: ['bark', 'rough bark', 'I feel the rough bark.'] },
      { w: 'root', s: 'root', e: '🌿', l: ['root', 'under root', 'Roots grow under the ground.'] },
      { w: 'seed', s: 'seed', e: '🌱', l: ['seed', 'tiny seed', 'A tiny seed can grow.'] },
      { w: 'acorn', s: 'A-corn', e: '🌰', l: ['acorn', 'little acorn', 'An oak tree grows from an acorn.'] },
      { w: 'forest', s: 'FOR-est', e: '🌲', l: ['forest', 'big forest', 'Many trees make a forest.'] },
      { w: 'shade', s: 'shade', e: '⛱️', l: ['shade', 'cool shade', 'The tree gives us cool shade.'] },
      { w: 'tall', s: 'tall', e: '📏', l: ['tall', 'tall tree', 'That tree is very tall.'] },
      { w: 'grow', s: 'grow', e: '🌱', l: ['grow', 'trees grow', 'Trees grow up, up, up.'] }
    ]},
    { cat: 'Sky and Airplanes', words: [
      { w: 'airplane', s: 'AIR-plane', e: '✈️', l: ['plane', 'fast plane', 'The plane flies in the sky.'] },
      { w: 'pilot', s: 'PI-lot', e: '🧑‍✈️', l: ['pilot', 'brave pilot', 'The pilot flies the plane.'] },
      { w: 'wing', s: 'wing', e: '🪽', l: ['wing', 'big wing', 'The plane has two wings.'] },
      { w: 'cloud', s: 'cloud', e: '☁️', l: ['cloud', 'white cloud', 'I see a fluffy white cloud.'] },
      { w: 'airport', s: 'AIR-port', e: '🛫', l: ['airport', 'busy airport', 'We go to the airport.'] },
      { w: 'runway', s: 'RUN-way', e: '🛬', l: ['runway', 'long runway', 'The plane rolls on the runway.'] },
      { w: 'suitcase', s: 'SUIT-case', e: '🧳', l: ['suitcase', 'my suitcase', 'I pack my suitcase.'] },
      { w: 'travel', s: 'TRAV-el', e: '🗺️', l: ['travel', 'we travel', 'We travel to a new place.'] }
    ]},
    { cat: 'Feelings', words: [
      { w: 'happy', s: 'HAP-py', e: '😊', l: ['happy', 'I happy', 'I feel happy.'] },
      { w: 'sad', s: 'sad', e: '😢', l: ['sad', 'feel sad', 'I feel sad when my toy breaks.'] },
      { w: 'mad', s: 'mad', e: '😠', l: ['mad', 'so mad', 'I feel mad. I need to breathe.'] },
      { w: 'scared', s: 'scared', e: '😨', l: ['scared', 'a little scared', 'I feel scared. I need a hug.'] },
      { w: 'tired', s: 'TIRED', e: '😴', l: ['tired', 'very tired', 'I am tired. I want to rest.'] },
      { w: 'proud', s: 'proud', e: '🌟', l: ['proud', 'I proud', 'I am proud of my work.'] },
      { w: 'frustrated', s: 'FRUS-tra-ted', e: '😤', l: ['stuck', 'I stuck', 'I am frustrated. I need help.'] },
      { w: 'calm', s: 'calm', e: '😌', l: ['calm', 'feel calm', 'My body feels calm now.'] }
    ]},
    { cat: 'Kind Words', words: [
      { w: 'please', s: 'please', e: '🥺', l: ['please', 'more please', 'More water, please.'] },
      { w: 'thank you', s: 'THANK you', e: '🙏', l: ['thank you', 'thank you Mama', 'Thank you for helping me.'] },
      { w: 'sorry', s: 'SOR-ry', e: '🤝', l: ['sorry', 'I sorry', 'I am sorry I pushed you.'] },
      { w: 'share', s: 'share', e: '🧸', l: ['share', 'we share', 'We can share the blocks.'] },
      { w: 'help', s: 'help', e: '🙋', l: ['help', 'help me', 'Can you help me, please?'] },
      { w: 'my turn', s: 'my TURN', e: '🔁', l: ['turn', 'my turn', 'It is my turn. Then it is your turn.'] }
    ]},
    { cat: 'Action Words', words: [
      { w: 'climb', s: 'climb', e: '🧗', l: ['climb', 'I climb', 'I climb up the ladder.'] },
      { w: 'jump', s: 'jump', e: '🤸', l: ['jump', 'jump high', 'I can jump very high.'] },
      { w: 'fly', s: 'fly', e: '🕊️', l: ['fly', 'birds fly', 'Birds and planes fly.'] },
      { w: 'sing', s: 'sing', e: '🎤', l: ['sing', 'let us sing', 'Let us sing a song together.'] },
      { w: 'build', s: 'build', e: '🧱', l: ['build', 'build up', 'I build a tall tower.'] },
      { w: 'catch', s: 'catch', e: '🥎', l: ['catch', 'catch ball', 'I catch the ball.'] }
    ]},
    { cat: 'Opposites', words: [
      { w: 'big / small', s: 'big / small', e: '↕️', l: ['big', 'big and small', 'The tree is big. The seed is small.'] },
      { w: 'up / down', s: 'up / down', e: '⬆️', l: ['up', 'up and down', 'The plane goes up. Then it goes down.'] },
      { w: 'fast / slow', s: 'fast / slow', e: '🐢', l: ['fast', 'fast and slow', 'The plane is fast. The turtle is slow.'] },
      { w: 'loud / quiet', s: 'loud / QUI-et', e: '🔈', l: ['loud', 'loud and quiet', 'The jet is loud. The library is quiet.'] },
      { w: 'hot / cold', s: 'hot / cold', e: '🌡️', l: ['cold', 'hot and cold', 'The soup is hot. The ice is cold.'] },
      { w: 'open / close', s: 'O-pen / close', e: '🚪', l: ['open', 'open the door', 'I open the door. I close the door.'] }
    ]}
  ];

  /* Question ladder: ask these in order, moving up as she is ready. */
  SA.questionLadder = [
    { level: 'See and name', q: ['What do you see?', 'What is this?', 'Can you point to the ___?'] },
    { level: 'Describe', q: ['What color is it?', 'Is it big or small?', 'How does it feel?'] },
    { level: 'Use', q: ['What is it for?', 'What does it do?', 'Where does it live?'] },
    { level: 'Order and predict', q: ['What happened first?', 'What do you think happens next?', 'What if the seed gets water?'] },
    { level: 'Feelings and why', q: ['How does he feel?', 'Why is she sad?', 'What could we do to help?'] },
    { level: 'Tell me more', q: ['Tell me about your picture.', 'What was your favorite part of today?', 'What else?'] }
  ];

  /* Clear speech play. Sounds come in at different ages, and r, l, th, and s-blends are often tricky until age 5 or later. */
  SA.soundPlay = [
    { title: 'Lips and puffs: p, b, m', how: 'Pop a pretend bubble: "p p p". Hum with closed lips: "mmm". Feel the puff on your hand.', words: ['pop', 'bubble', 'mama', 'baby', 'plane'] },
    { title: 'Tongue taps: t, d, n', how: 'Tap the tongue behind your top teeth like a tiny drum: "t t t, d d d".', words: ['tree', 'top', 'down', 'nose', 'ten'] },
    { title: 'Back sounds: k, g', how: 'Say them from the back of the throat, like a gentle cough: "k k k, g g g".', words: ['cat', 'go', 'cloud', 'green', 'kite'] },
    { title: 'Air sounds: f, s, sh', how: 'Bite the bottom lip for "fff", make a snake for "sss", and say "shhh" like a sleepy train.', words: ['fly', 'sun', 'ship', 'leaf', 'seed'] },
    { title: 'Long vowels and endings', how: 'Stretch the middle of the word: "ttrreee". Then say the last sound loud: "leaf-fff".', words: ['tree', 'leaf', 'plane', 'moon', 'bird'] }
  ];

  SA.tonguePlay = [
    'Big bear, blue boat.',
    'Tiny turtle taps.',
    'Fast plane, far sky.',
    'Little leaf, long limb.',
    'Pop, pop, popcorn!',
    'Mama makes many muffins.'
  ];

  SA.englishTips = [
    'Say it back with one more word. If she says "big tree", you say "Yes, a big green tree!" That is called expanding, and it grows sentences.',
    'Wait 5 seconds after you ask something. Quiet time lets her find the words.',
    'Do not say "No, say it right." Just say the correct word back warmly: "Yes, the airplane!"',
    'Narrate while you do things: "I am washing the red apple."',
    'Talk about things that are not here: "Remember the big tree at the park?"',
    'If strangers rarely understand her by age 3, or she has lost words she once said, ask her pediatrician about a speech and language evaluation. Early help works best.'
  ];

  SA.englishSongs = [
    'Itsy Bitsy Spider (a spider climbing, great for Spidey fans)',
    'Twinkle, Twinkle, Little Star',
    'Head, Shoulders, Knees and Toes',
    'The Wheels on the Bus',
    'Row, Row, Row Your Boat',
    'Five Little Monkeys Jumping on the Bed'
  ];

  /* Feelings toolkit. Wording follows CDC tips: name feelings, teach calm-down skills, keep rules simple. */
  SA.feelings = [
    { id: 'happy', name: 'Happy', e: '😊', color: '#f7b731', body: 'Smile, light chest, wiggly feet.', do: ['Share it: "Tell me what made you happy."', 'Dance, sing, or give a high five.'], words: ['happy'] },
    { id: 'sad', name: 'Sad', e: '😢', color: '#4b7bec', body: 'Heavy chest, tears, quiet voice.', do: ['Hug a stuffed animal or a grown-up.', 'Say it: "I feel sad." Then ask: "Do you want a hug or some space?"'], words: ['sad'] },
    { id: 'angry', name: 'Mad', e: '😠', color: '#eb3b5a', body: 'Hot face, tight fists, loud voice.', do: ['Squeeze a pillow or press hands together hard.', 'Take 3 dragon breaths: smell the flower, blow out the candle.'], words: ['angry'] },
    { id: 'scared', name: 'Scared', e: '😨', color: '#8854d0', body: 'Fast heartbeat, tight tummy, wide eyes.', do: ['Stay close and say: "You are safe. I am here."', 'Name the fear, then take one tiny brave step together.'], words: ['scared'] },
    { id: 'tired', name: 'Tired', e: '😴', color: '#778ca3', body: 'Heavy eyes, yawning, cranky.', do: ['Quiet time with a book.', 'Rest first, then try the hard thing again.'], words: ['tired'] },
    { id: 'frustrated', name: 'Stuck', e: '😤', color: '#fa8231', body: 'Grunting, throwing, giving up.', do: ['Say: "This is hard. Let us try a new way."', 'Ask: "Do you want a hint or do you want to try again?"'], words: [] }
  ];

  SA.calmTools = [
    { name: 'Airplane breathing', text: 'Hold arms out like wings. Breathe in slowly while lifting wings up for 3 counts. Breathe out slowly while lowering wings for 4 counts. Do 3 flights.' },
    { name: 'Smell the flower, blow the candle', text: 'Breathe in through the nose like smelling a flower. Blow out through the mouth like a birthday candle. Repeat 3 times.' },
    { name: 'Squeeze and melt', text: 'Squeeze every muscle like a tight tree trunk for 3 counts. Then melt like warm snow. Repeat twice.' },
    { name: 'Cozy corner', text: 'A quiet spot with a pillow and a stuffed animal. It is not a punishment. It is a place to calm a body.' },
    { name: 'Body clues check', text: 'Ask: "What is your body telling you? Is your tummy tight? Are your hands hot?" Name the clue, then the feeling.' }
  ];

  /* Short scripts for common toddler situations. */
  SA.scripts = [
    { title: 'Big feelings, big tantrum', steps: ['Get low, stay calm, and keep your voice soft.', 'Name it: "You are so mad. You wanted the red cup."', 'Hold the limit: "I will not let you hit. You can stomp or squeeze a pillow."', 'When calm, hug and say what to do next time.'] },
    { title: 'Sharing and turns', steps: ['Use a visual timer or count: "Two more minutes, then it is your friend\'s turn."', 'Praise waiting: "You waited. That was hard and you did it."', 'Offer a trade: "You can have this one while you wait."'] },
    { title: 'Hitting or pushing', steps: ['Stop it gently: "I will not let you hit."', 'Check the hurt friend first.', 'Show the repair: "Let us say sorry and ask if they want a hug."', 'Later, practice "gentle hands" on a stuffed animal.'] },
    { title: 'Drop-off at school', steps: ['Keep the goodbye short and warm, with the same ritual every day (hug, kiss, wave).', 'Tell her when you will be back using her day: "After snack and outside time."', 'Never sneak away. Trust grows from predictable goodbyes.', 'CDC checklist: by 3, most children calm within 10 minutes after a drop-off.'] },
    { title: 'Joining a friend\'s play', steps: ['Practice at home with toys: "Can I play with you?"', 'Offer something to add: "I have a truck for your road."', 'If told no, say: "That is okay. I will try again later." Then find another game.'] }
  ];

  /* Friendship skills by age band. These are practice goals, not tests. */
  SA.friendLadder = [
    { age: '2 to 3', skills: ['Notices other children and joins them to play (CDC age 3)', 'Plays next to friends, starting to play together', 'Uses words for "mine", "my turn", and "help"'] },
    { age: '4', skills: ['Pretends with friends (teacher, superhero, dog)', 'Asks to join: "Can I play with Alex?"', 'Comforts someone who is hurt or sad', 'Likes being a helper'] },
    { age: '5', skills: ['Follows rules and takes turns in games', 'Does simple chores at home', 'Keeps a conversation going for several back-and-forth turns'] },
    { age: '6 to 7', skills: ['Solves small conflicts with words, with adult back-up', 'Understands that others have different feelings and ideas', 'Learns to lose a game without a meltdown'] },
    { age: '8 to 10', skills: ['Resolves most disagreements by talking, listening, and compromising', 'Stands up for herself and others kindly', 'Manages teams, groups, and friendship ups and downs', 'Handles setbacks and tries again (growth mindset)'] }
  ];
})();
