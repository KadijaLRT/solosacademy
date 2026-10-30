/* Sky Academy: 6-week TREES theme, matched to the classroom theme.
   To add a theme later, copy this structure and push it to SA.themes. */
(function () {
  window.SA = window.SA || {};

  SA.themes = [{
    id: 'trees',
    name: 'Trees',
    emoji: '🌳',
    langCategory: 'trees',
    safety: 'Safety: Acorns, seeds, and pine cones are choking hazards for children under 4, so keep them within reach of you only and supervise closely. Do not let her eat berries, mushrooms, or leaves. Wash hands after outdoor play. Learn to spot poison ivy.',
    weeks: [
      {
        title: 'Tree Detectives: Parts of a Tree',
        focus: 'Find and name the roots, trunk, branches, and leaves.',
        words: ['tree', 'trunk', 'bark', 'branch', 'leaf', 'root', 'tall', 'rough'],
        books: ['A Tree Is Nice by Janice May Udry', 'The Busy Tree by Jennifer Ward', 'Tap the Magic Tree by Christie Matheson'],
        songs: ['Head, Shoulders, Knees and Toes (sing it with tree parts: trunk, branches, leaves, roots)', 'Itsy Bitsy Spider (the spider climbs the trunk)'],
        movement: ['Be a tree: stand tall, wiggle your branches (arms), and sway in the wind.', 'Tree hug: find a trunk outside and feel the bark with gentle hands.', 'Measure a tree trunk by hugging it. How many hugs around?', 'Root stomp: stomp your feet for roots, stretch up for branches.'],
        hero: ['Spidey climb: crawl up a pillow "trunk" slowly, then say the name of each tree part you pass.', 'Spidey ears: stand under a tree and listen for 10 seconds. What sounds do you hear?', 'Look for spider webs in the branches. Look, do not touch.', 'Pilot view: draw a tree from the top, like a pilot looking down.'],
        craft: ['Bark rubbing: put paper on a trunk and rub a crayon sideways.', 'Build a paper tree: brown trunk, green leaf shapes.', 'Tree parts puzzle: cut a drawing of a tree into 4 pieces and put it back together.'],
        science: ['Compare 3 trees. Which is tallest? Which has the roughest bark?', 'Take a "tree detective" walk with a magnifying glass.', 'Look for roots above ground. Why do trees need roots? (To drink water and stay standing.)'],
        math: ['Count how many branches you can see on one tree.', 'Sort leaves: big, small.', 'Find 3 leaves the same shape.'],
        sel: ['Gentle hands: we touch trees softly because they are alive.', 'Practice patience: trees grow slowly. What can we wait for?', 'Name a feeling you have when you are outside near trees.'],
        questions: ['What parts does a tree have?', 'Which part is under the ground?', 'What do you see up high?', 'How does the bark feel?'],
        teacherAsk: 'Ask her teacher which tree words they are using in class this week.'
      },
      {
        title: 'Leaves and Seasons',
        focus: 'Why leaves change color and fall, and how to sort and describe them.',
        words: ['leaf', 'fall', 'crunchy', 'pile', 'rake', 'orange', 'green', 'wind'],
        books: ['Red Leaf, Yellow Leaf by Lois Ehlert', 'Leaf Man by Lois Ehlert', 'Leaves by David Ezra Stein'],
        songs: ['Itsy Bitsy Spider (rainy fall day version)', 'Make up a "falling leaves" song to a tune she knows'],
        movement: ['Leaf dance: float like a leaf to the floor, spin, and land softly.', 'Jump in a pile of leaves (check for sticks first).', 'Rake leaves with a child-size rake.', 'Wind game: blow a feather and chase it.'],
        hero: ['Spidey jump: jump into the leaf pile and say "I landed!"', 'Spidey eyes: find the reddest leaf, then the yellowest leaf.', 'Pilot weather report: "Today the wind is strong and the leaves are falling."', 'Fly a paper airplane through falling leaves.'],
        craft: ['Leaf collage: glue leaves into a picture of an animal or person.', 'Leaf stamp painting with washable paint.', 'Color matching: put a leaf next to the paint it matches.'],
        science: ['Why do leaves change color? Green fades when the days get shorter, and yellow and orange show up.', 'Sink or float: test a leaf in water.', 'Leaf sort: smooth edge or pointy edge.'],
        math: ['Count 10 leaves into a bag.', 'Sort leaves by color, then count each pile.', 'Which pile has more?'],
        sel: ['Letting go: leaves let go of trees. What can we let go of when we feel mad?', 'Name how you feel on a windy day.', 'Take turns raking and jumping.'],
        questions: ['What color is the leaf?', 'What happens to leaves in fall?', 'How does the crunchy leaf sound?', 'Why do leaves fall?'],
        teacherAsk: 'Ask which leaf colors and words the class has learned.'
      },
      {
        title: 'Seeds and Growing',
        focus: 'Seeds grow into trees with soil, water, and sun.',
        words: ['seed', 'acorn', 'pine cone', 'sprout', 'soil', 'water', 'grow', 'sun'],
        books: ['The Tiny Seed by Eric Carle', 'A Seed Is Sleepy by Dianna Hutts Aston', 'The Carrot Seed by Ruth Krauss'],
        songs: ['Row, Row, Row Your Boat (sing "plant, plant, plant a seed")', 'Itsy Bitsy Spider'],
        movement: ['Seed to tree: curl up small like a seed, then slowly grow into a tall tree.', 'Pretend to dig, plant, water, and wait.', 'Roll like a seed down a soft hill.', 'Acorn hunt: look for acorns on a walk and use a basket (adult holds them).'],
        hero: ['Spidey stretch: grow from a tiny seed into a giant tree, one inch at a time.', 'Pilot seed drop: toss a paper plane with a tiny pretend seed to a faraway garden.', 'Spider and seed: where could a spider hide in a little sprout?', 'Wings and seeds: some seeds, like maple helicopters, spin like little planes.'],
        craft: ['Paint a seed growing from a dot into a tree on one long paper.', 'Make seed pictures with big dried beans (adult only, never in mouth).', 'Make a pine cone bird feeder with adult help.'],
        science: ['Plant a bean in a clear cup with a wet paper towel and watch it sprout over days.', 'Open a pine cone and find the seeds inside.', 'Compare seeds: big, small, smooth, rough.'],
        math: ['Count 5 seeds into a cup.', 'Sort seeds by size.', 'Measure the sprout every 2 days with a ruler or a piece of yarn.'],
        sel: ['Patience: seeds need time. What are we waiting for?', 'Growth mindset: "I cannot do it YET."', 'Take care of the sprout together every day.'],
        questions: ['What does a seed need?', 'What will grow from the acorn?', 'What happens first, then next?', 'How did the sprout change?'],
        teacherAsk: 'Ask whether the class is planting seeds so you can match it at home.'
      },
      {
        title: 'Tree Homes: Animals and Insects',
        focus: 'Who lives in and around trees.',
        words: ['nest', 'squirrel', 'owl', 'woodpecker', 'hole', 'web', 'home', 'hide'],
        books: ['Owl Babies by Martin Waddell', 'Are You a Spider? by Judy Allen', 'Tree: A Peek-Through Picture Book by Britta Teckentrup'],
        songs: ['Itsy Bitsy Spider (a spider lives in the tree)', 'Five Little Monkeys Jumping on the Bed (pretend monkeys live in the tree)'],
        movement: ['Squirrel run: scamper, freeze, and nibble.', 'Owl walk: quiet steps, big eyes, head turns.', 'Hide and seek behind a tree.', 'Woodpecker taps: tap a rhythm with your hands.'],
        hero: ['Spidey web: crawl under a table "web" and tell what you see.', 'Look for webs, nests, and holes in trees. Take a photo and talk about it later.', 'Pilot flight: fly to the tree home of the owl and land softly.', 'Be a spider: climb a rope or ladder carefully and say "up, up, up".'],
        craft: ['Paper plate owl: add feathers and big eyes.', 'Make a pretend nest from sticks, grass, and yarn.', 'Draw a tree with a home for an animal inside.'],
        science: ['Who lives here? Look up, look down, and look around the trunk.', 'Why do animals use trees? (Safe homes, food, and shade.)', 'Compare a bird nest and a squirrel nest picture.'],
        math: ['Count 3 baby owls in a nest.', 'Match the animal to its home.', 'How many legs does a spider have? Count to 8.'],
        sel: ['Everyone needs a safe home. What makes you feel safe?', 'Taking care of animals means being quiet and gentle.', 'Practice asking for what you need: "Can I have a turn?"'],
        questions: ['Who lives in the tree?', 'Where does the squirrel hide?', 'Why does the owl need a home?', 'What is a safe place for you?'],
        teacherAsk: 'Ask which animals the class talked about and mention them at home.'
      },
      {
        title: 'What Trees Give Us',
        focus: 'Shade, fruit, paper, wood, and clean air, plus gratitude.',
        words: ['shade', 'fruit', 'apple', 'paper', 'wood', 'air', 'thank you', 'share'],
        books: ['The Giving Tree by Shel Silverstein', 'Apple Farmer Annie by Monica Wellington', 'Ten Apples Up on Top! by Theo LeSieg'],
        songs: ['Twinkle, Twinkle, Little Star (sing a thank-you verse for trees)', 'The Wheels on the Bus'],
        movement: ['Shade game: stand in shade, then in sun. Which feels cooler?', 'Deep breaths: breathe in clean air, breathe out slowly.', 'Apple pick: reach up high to pick pretend apples.', 'Carry a pretend log and stack it.'],
        hero: ['Spidey helper: help carry groceries and name what comes from trees (apples, paper bag).', 'Pilot cargo: load pretend wooden boxes onto a plane.', 'Hero thanks: say thank you to a tree for shade.', 'Be a helper: sort paper recycling and name the pile.'],
        craft: ['Apple stamp painting.', 'Make a thank-you card for the tree, a teacher, or someone who helps you.', 'Tear paper into pieces and build a collage tree.'],
        science: ['Look at a paper towel and a pencil. Both come from trees.', 'Taste apples: sweet, sour, crunchy.', 'Trees make the oxygen we breathe. Breathe slowly and say "thank you, trees".'],
        math: ['Count apples into a basket (up to 10).', 'Cut an apple into 2 equal halves.', 'Which is more, 3 apples or 5 apples?'],
        sel: ['Gratitude: tell one thing you are thankful for every day.', 'Sharing: we share the apple slices.', 'Kind words: say thank you to the people who help you.'],
        questions: ['What do trees give us?', 'What comes from an apple tree?', 'What is wood used for?', 'What are you thankful for?'],
        teacherAsk: 'Ask what the class is thankful for so you can repeat it at home.'
      },
      {
        title: 'Caring for Trees and the Winter Forest',
        focus: 'How to protect trees, what changes in winter, and evergreens.',
        words: ['plant', 'evergreen', 'snow', 'needles', 'protect', 'gentle', 'forest', 'care'],
        books: ['The Great Kapok Tree by Lynne Cherry', 'Over and Under the Snow by Kate Messner', 'The Lorax by Dr. Seuss (a longer read-aloud, fine to read in short parts)'],
        songs: ['Itsy Bitsy Spider (winter version)', 'Make up a "plant a tree" song to a tune she knows'],
        movement: ['Snow tree: tall, still, quiet, then shake off the snow.', 'Plant a tree: pretend to dig, plant, and water.', 'Winter walk: find evergreens and bare trees.', 'Stomp tracks in the snow and look for animal prints.'],
        hero: ['Hero promise: say a way to protect trees ("I will be gentle with trees").', 'Spidey care: pick up litter and put it in the bin (adult handles anything sharp).', 'Pilot forest tour: fly an imaginary plane over the forest and name what you see.', 'Look for webs with frost on them on cold mornings, from a safe distance.'],
        craft: ['Paper evergreen: green triangle layers with cotton snow.', 'Decorate a tree for birds with pine cones and bird seed.', 'Draw a forest picture and tell a story about it.'],
        science: ['Compare evergreen needles and fall leaves.', 'Why do some trees keep their leaves? (Needles are tough and shed little at once.)', 'Look at a tree stump or picture to see rings, one ring for each year of growth.'],
        math: ['Count the evergreen trees you see on a walk.', 'Sort trees by bare and evergreen.', 'How many trees in your forest picture? Count them aloud.'],
        sel: ['Taking care of the world helps us feel proud.', 'Cooperation: plant or decorate something together.', 'Talk about a time you were gentle.'],
        questions: ['How can we help trees?', 'Which trees stay green in winter?', 'What do animals do in the winter forest?', 'What did you learn about trees these six weeks?'],
        teacherAsk: 'Ask the teacher what she learned about trees, and celebrate with a family tree walk.'
      }
    ]
  }];
})();
