/* Solo's Academy: 6-week WATER theme (same structure as Trees).
   Book titles are real picture books; check your library for availability.
   langIds point to words that already exist in the six-language word bank. */
(function () {
  window.SA = window.SA || {};
  SA.themes = SA.themes || [];
  SA.themes.push({
    id: 'water',
    name: 'Water',
    emoji: '💧',
    langIds: ['water', 'fish', 'cloud', 'sun', 'blue', 'bird'],
    safety: 'Safety: Stay within arm’s reach of her around any water, including baths, buckets, pools, and puddles. Children can drown in even a small amount of water, so empty buckets and tubs when you finish. Use a life jacket on boats. Keep ice cubes, pebbles, and shells out of her mouth; they can be choking hazards for young children. Do not let her drink from puddles, ponds, or streams. Wash hands after water play.',
    weeks: [
      {
        title: 'Water All Around Us',
        focus: 'Where we find water and what we use it for: drinking, washing, and playing.',
        words: ['water', 'wet', 'dry', 'drip', 'splash', 'pour', 'cup', 'soap'],
        books: ['Water Is Water by Miranda Paul', 'A Drop Around the World by Barbara McKinney', 'Hello Ocean by Pam Munoz Ryan'],
        songs: ['Row, Row, Row Your Boat', 'Wash your hands to a song she knows (sing it while you scrub)'],
        movement: ['Pretend to pour, splash, and drip with your hands and feet.', 'Wet and dry walk: step on a damp towel, then a dry one. How do they feel?', 'Carry a small cup of water across the room without spilling.', 'Water wiggle: wiggle like a drip, flow like a stream, jump like a splash.'],
        hero: ['Spidey rescue: help a toy hero take a bath and name each body part you wash.', 'Spidey web drops: tape a string and hang "water drops" cut from blue paper.', 'Pilot check: look out the window and say where you see water outside.', 'Fly a paper airplane over a blue blanket "lake".'],
        craft: ['Water painting: paint a fence or paper bag with a brush and plain water and watch it dry.', 'Blue torn-paper puddle collage.', 'Make a "Where is water?" picture with 3 places.'],
        science: ['Sponge play: soak a sponge, then squeeze it. What happens?', 'Sort things into wet and dry.', 'Wonder together: where does water come from at the sink? (Pipes bring it from far away.)'],
        math: ['Count 5 cups as you fill them.', 'Which cup has more water? Which has less?', 'Sort toy items into "uses water" and "does not use water".'],
        sel: ['Thankful for water: name one thing water helps you do.', 'Taking turns pouring. Say "my turn, your turn".', 'Name a feeling you have at bath time.'],
        questions: ['What do we use water for?', 'Is the towel wet or dry?', 'Where do you see water?', 'How does the water feel?'],
        teacherAsk: 'Ask her teacher which water words the class is using this week.'
      },
      {
        title: 'Rain and Clouds',
        focus: 'Clouds, rain, puddles, and where puddles go.',
        words: ['rain', 'cloud', 'drop', 'puddle', 'umbrella', 'thunder', 'rainbow', 'sun'],
        books: ['Rain! by Linda Ashman', 'Rain by Manya Stojic', 'The Snowy Day by Ezra Jack Keats'],
        songs: ['Rain, Rain, Go Away', 'The Itsy Bitsy Spider (the rain comes down)'],
        movement: ['Rain dance: tap fingers on your head like drops, then stomp like heavy rain.', 'Puddle jump: jump over a blue paper puddle with two feet.', 'Cloud float: drift slowly across the room like a cloud.', 'Umbrella march: hold a pretend umbrella and walk in a line.'],
        hero: ['Pilot weather report: "Today it is cloudy. The rain is falling."', 'Fly your paper plane through cotton ball clouds.', 'Spidey web catches a drop: hold a clear cup out in the rain (adult with her).', 'Spidey stays dry: build a tiny shelter from a towel and chairs.'],
        craft: ['Cotton ball cloud with blue paper rain.', 'Rainbow with finger paint.', 'Make rain with a shaker: seal rice in a clear bottle and tape the lid.'],
        science: ['Watch a puddle on a sunny day. It gets smaller because the water goes up into the air.', 'Clouds are made of tiny drops of water. When drops get heavy, they fall as rain.', 'Fill a clear cup outside and see how much rain it catches.'],
        math: ['Count the raindrops you draw, up to 5.', 'Which cloud is bigger? Which is smaller?', 'Sort things for a rainy day and a sunny day.'],
        sel: ['Rainy days can feel quiet or sad. Name how you feel and what could help.', 'Share the umbrella. Say "come under".', 'Patience: wait for the rain to stop and then go outside.'],
        questions: ['What is falling from the cloud?', 'Where did the puddle go?', 'What do we wear in the rain?', 'What color is the rainbow?'],
        teacherAsk: 'Ask whether the class is reading about the weather so you can match the books.'
      },
      {
        title: 'Rivers, Lakes, and Oceans',
        focus: 'Water that flows and water that waves, and which water is salty.',
        words: ['river', 'lake', 'ocean', 'wave', 'flow', 'salty', 'shore', 'sand'],
        books: ['A River by Marc Martin', 'Hello Ocean by Pam Munoz Ryan', 'Commotion in the Ocean by Giles Andreae'],
        songs: ['Row, Row, Row Your Boat', 'Make up a wave song that goes up high and down low'],
        movement: ['Wave walk: rise on tiptoes and crouch low like a wave.', 'River run: walk in a long wiggly line along a rope "river".', 'Shell hop: hop from paper shell to paper shell.', 'Sway like seaweed with soft arms.'],
        hero: ['Spidey web bridge: tape a line on the floor as a bridge over a pretend river.', 'Pilot over the ocean: fly low and name what you see below.', 'Spidey on the shore: build a sandcastle in a tray of sand.', 'Seaplane landing: land a paper plane on a blue sheet.'],
        craft: ['Blue wave painting with a sponge.', 'Ocean in a bottle: water, blue color, and a little baby oil, taped shut.', 'Paper plate shell with crayon lines.'],
        science: ['Ocean water is salty. A river is not. (Do not taste ocean water.)', 'Make waves in a tray of water with your hand.', 'Compare water that stands still with water that flows.'],
        math: ['Count 6 shells into a basket.', 'Which wave is big? Which is small?', 'Line up rocks from small to big.'],
        sel: ['The ocean can feel big. Name what feels big and what helps you feel brave.', 'Take turns building and knocking down the sandcastle.', 'Say "careful" when you stand near the water.'],
        questions: ['What is bigger, a river or an ocean?', 'How does the sand feel?', 'What do waves do?', 'Who might live in the ocean?'],
        teacherAsk: 'Ask which water places the class has talked about so far.'
      },
      {
        title: 'Animals That Live in Water',
        focus: 'Fish, frogs, ducks, turtles, and whales and how they live in or near water.',
        words: ['fish', 'frog', 'duck', 'turtle', 'whale', 'swim', 'fin', 'tail'],
        books: ['Swimmy by Leo Lionni', 'Hooray for Fish! by Lucy Cousins', 'Big Blue Whale by Nicola Davies'],
        songs: ['Five Little Ducks', 'Five Little Speckled Frogs', 'Baby Shark (use the sounds sh and ch)'],
        movement: ['Fish swim: wiggle your hands like fins and glide across the floor.', 'Frog jump: crouch and hop on two feet.', 'Duck waddle: waddle with your hands as a beak.', 'Whale spout: blow out a big breath like a spout.'],
        hero: ['Spidey meets a frog: hop like the frog and say "ribbit".', 'Pilot over the pond: fly low and count the ducks.', 'Spidey web fishing: tie a string to a magnet "fish" game (adult only for the magnet).', 'Dive and rescue: a toy hero saves a toy fish from a bowl of water.'],
        craft: ['Paper plate fish with scales made from torn tissue paper.', 'Handprint fish or frog.', 'Draw a pond with 3 animals.'],
        science: ['Fish breathe with gills, so they can stay in water.', 'A whale is a mammal and breathes air through a blowhole.', 'Water rolls off a duck’s feathers. Test it with a feather and a drop of water.'],
        math: ['Count 5 fish.', 'Which fish is biggest? Which is smallest?', 'Match the animal to where it lives.'],
        sel: ['Swimmy is small but brave. Name something you did that was brave.', 'Be gentle with animals and watch them quietly.', 'Take turns being the frog and the duck.'],
        questions: ['Where does the fish live?', 'What sound does the frog make?', 'How does the duck move?', 'Why does the whale come up for air?'],
        teacherAsk: 'Ask which animals the class has learned about and mention them at home.'
      },
      {
        title: 'Sink, Float, and Boats',
        focus: 'What sinks, what floats, and how boats, ice, and bubbles behave.',
        words: ['sink', 'float', 'boat', 'bubble', 'ice', 'melt', 'heavy', 'light'],
        books: ['Boats by Byron Barton', 'Who Sank the Boat? by Pamela Allen', 'Mr. Gumpy’s Outing by John Burningham'],
        songs: ['Row, Row, Row Your Boat', 'A Sailor Went to Sea', 'Make a bubble song and pop on the last word'],
        movement: ['Bubble pop: reach and pop soap bubbles with your hands.', 'Boat sway: rock side to side as if on gentle water.', 'Float like a feather, sink like a stone: move slow, then drop low.', 'Row together: sit on the floor and row with both arms.'],
        hero: ['Spidey boat rescue: float a toy hero on a foil boat in a tub.', 'Seaplane float: does a paper plane float or sink? Test it quickly.', 'Pilot meets a boat: name the boat parts, sail, and flag.', 'Spidey web bubbles: blow bubbles and catch one without popping it.'],
        craft: ['Foil boat: fold a piece of foil into a boat.', 'Bubble painting with a straw and soapy colored water (adult blows, she watches).', 'Draw a boat on blue paper.'],
        science: ['Test 6 things: which sink, which float? Guess first, then try (use big items only).', 'Ice melts when it is warm. Watch an ice cube in a bowl in the sun, with an adult holding it.', 'Soap makes bubbles. What shape are they?'],
        math: ['Count items that sink, then items that float.', 'Which is heavy? Which is light?', 'Sort floaters and sinkers into two bowls.'],
        sel: ['Try again: the first boat sank. What can we change? Say "I can try again".', 'Take turns dropping items in the water.', 'Name how you feel when a bubble pops.'],
        questions: ['Will it sink or float?', 'What happens to ice in the sun?', 'What shape is a bubble?', 'How can we make the boat float?'],
        teacherAsk: 'Ask whether the class is doing sink and float tests so you can try the same objects at home.'
      },
      {
        title: 'Water Safety and Saving Water',
        focus: 'Staying safe near water, taking care of water, and celebrating what she learned.',
        words: ['safe', 'careful', 'stop', 'turn off', 'drink', 'clean', 'save', 'thank you'],
        books: ['Re-read a favorite from the last 5 weeks', 'Water Is Water by Miranda Paul', 'A Drop Around the World by Barbara McKinney'],
        songs: ['Sing a favorite song from each week', 'Make up a "turn off the tap" song'],
        movement: ['Stop and go: freeze at "stop", move at "go".', 'Walk, do not run, next to a pool or tub.', 'Water relay: carry a sponge in a spoon to a bowl.', 'Dance to a favorite water song.'],
        hero: ['Spidey says: stay close to a grown-up near water.', 'Pilot checklist: "Life jacket on? Check. Grown-up near? Check."', 'Spidey saves the drops: turn off the tap while we brush our teeth.', 'Water helper badge: draw a badge for a water helper.'],
        craft: ['Make a "stay safe near water" poster with simple pictures.', 'Make a water journal with one drawing per week.', 'Decorate a reusable water bottle with stickers.'],
        science: ['Compare how much water runs from a tap in 10 seconds. Why turn it off?', 'Where does dirty water go? Talk about clean water together.', 'Review: float or sink, rain and puddles, animals in water.'],
        math: ['Count 10 drops of water into a cup.', 'How many cups does the bottle hold? Count as you pour (adult supervises).', 'Count how many times we turned off the tap today.'],
        sel: ['Safe feels good. Name a time when you felt safe.', 'Look after water the way you look after friends.', 'Celebrate: say what you are proud of from the Water weeks.'],
        questions: ['Who should be with you near water?', 'How can we save water?', 'What was your favorite water animal?', 'What did you learn about rain?'],
        teacherAsk: 'Ask her teacher what the class is moving on to after Water, and ask for the next word list.'
      }
    ]
  });
})();
