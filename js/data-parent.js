/* Solo's Academy: parent guide and daily "parent moves".
   Original wording. Ideas draw on Montessori practice, serve-and-return research from the
   Harvard Center on the Developing Child, and growth-mindset praise research (Mueller and Dweck, 1998).
   These are play and parenting ideas, not medical or educational advice. */
(function () {
  window.SA = window.SA || {};

  /* One category per day, cycling. Each category has several moves; the move also rotates. */
  SA.moveCats = [
    { id: 'serve', e: '🏓', name: 'Serve and return' },
    { id: 'practical', e: '🧽', name: 'Real-life job' },
    { id: 'effort', e: '💪', name: 'Praise the effort' },
    { id: 'play', e: '🧱', name: 'Open-ended play' },
    { id: 'choice', e: '🔀', name: 'Her choice' },
    { id: 'math', e: '🔢', name: 'Everyday math' },
    { id: 'feel', e: '💛', name: 'Feelings and limits' },
    { id: 'narrate', e: '🗣️', name: 'Talk it through' },
    { id: 'music', e: '🥁', name: 'Music and rhythm' },
    { id: 'move', e: '🌤️', name: 'Move and explore' },
    { id: 'routine', e: '🕒', name: 'Steady routine' },
    { id: 'notice', e: '🔍', name: 'Notice and adapt' }
  ];

  SA.parentMoves = {
    serve: [
      { t: 'Wait for her turn', d: 'When she points at or says something, look at it too, say what you see, then wait about 5 seconds before talking again. Her answer is the "return."', say: 'You found a leaf. What else do you see?' },
      { t: 'Ask what will happen next', d: 'Pick an open question with no wrong answer. Let her guess, then test the guess together.', say: 'What do you think the squirrel will do next?' },
      { t: 'Repeat and add one idea', d: 'Say her words back and add one new detail. Do not correct; just model the longer version.', say: 'She says "big tree." You say "Big tree with a bird on it."' },
      { t: 'Ask why', d: 'Ask why something is happening, then wonder out loud with her.', say: 'Why do you think the bird is up so high?' }
    ],
    practical: [
      { t: 'Pour and wipe', d: 'Set a small tray with two small pitchers and a sponge. She pours water from one to the other and wipes any spill herself. Stay beside her for water play.', say: 'The sponge is for spills. You can wipe it up.' },
      { t: 'Wipe the table together', d: 'Give her her own small cloth and a spray bottle of water. Real jobs feel like important work at this age.', say: 'Thank you for helping our family.' },
      { t: 'Make a snack', d: 'Let her wash fruit, tear lettuce, or spread soft butter with a child-safe knife while you sit next to her. Cut round foods like grapes lengthwise first.', say: 'You get to make your own snack today.' },
      { t: 'Put it back', d: 'Keep her shoes and a few toys in a basket or low shelf she can reach, so she can put things away without asking.', say: 'Shoes live in the basket. You can do it.' }
    ],
    effort: [
      { t: 'Name what she did', d: 'Praise the work and the strategy, not how smart she is. Be specific about what you saw.', say: 'You kept trying that puzzle piece until it fit.' },
      { t: 'Let it be a little hard', d: 'When she gets frustrated, wait a moment before rescuing. Then offer a hint, not the answer.', say: 'That is tricky. What could you try a different way?' },
      { t: 'Praise the try', d: 'Praise trying and practicing, even when it did not work yet.', say: 'You worked so hard on that tower. What will you try next?' },
      { t: 'Cheer the practice', d: 'Notice practice over results, like singing a sound again or balancing one more time.', say: 'You practiced that sound again. Your voice is getting stronger.' }
    ],
    play: [
      { t: 'The box game', d: 'Give her a big cardboard box and ask what it can become today. Join her idea instead of leading.', say: 'What is this box today?' },
      { t: 'Playdough trees', d: 'Roll a trunk, roots, and leaves from playdough. Let her decide what the tree needs.', say: 'What does your tree need to grow?' },
      { t: 'Block building', d: 'Offer wooden blocks with no plan. Describe what she builds with real words: tall, wide, next to, under.', say: 'You built a tall tower with a flat roof.' },
      { t: 'Loose parts walk', d: 'Collect big leaves and sticks outside and make something. Keep small things like acorns and seeds out of her reach; they are choking hazards under age 4.', say: 'Which leaf is the biggest? Which is the smoothest?' }
    ],
    choice: [
      { t: 'Two good choices', d: 'Offer two options you are both happy with. Give her time to decide.', say: 'Do you want the red shirt or the blue shirt?' },
      { t: 'Snack choice', d: 'Offer two healthy snacks. Say the choice once, then let her pick.', say: 'Apple slices or banana?' },
      { t: 'Pick the first stop', d: 'Let her choose which stop on the Today plan comes first.', say: 'Which stop do you want to do first?' },
      { t: 'Pick the helper job', d: 'Let her choose how she helps with a small chore.', say: 'Do you want to carry the napkins or the spoons?' }
    ],
    math: [
      { t: 'Count the stairs', d: 'Count out loud as you climb. Touch or point as you go so the number matches the step.', say: 'One, two, three. How many stairs?' },
      { t: 'Sort the laundry', d: 'Sort socks or clothes by color or size together. No worksheet needed.', say: 'Which pile do the red socks go in?' },
      { t: 'Shape hunt', d: 'Spot shapes on a walk or at home: circle plates, square windows, triangle roofs.', say: 'Can you find something round?' },
      { t: 'Match the socks', d: 'Match socks into pairs during laundry or getting dressed, and name where each piece of clothing goes.', say: 'Which sock goes with this one?' },
      { t: 'Count the crackers', d: 'Count snack pieces together, or compare big and small pieces. Let her eat the answer.', say: 'How many crackers are on your plate?' },
      { t: 'More or fewer', d: 'Line up a few snacks or blocks and compare. Let her fix it to make them even.', say: 'Who has more? How can we make it fair?' }
    ],
    feel: [
      { t: 'Name it, hold the limit', d: 'Accept the feeling and keep the rule. Offer a safe way to let the feeling out.', say: 'You are mad. I will not let you throw the block. You can stomp your feet.' },
      { t: 'Feelings check-in', d: 'Ask how her body feels, let her point to a face, and say the feeling word back.', say: 'Your face looks sad. Do you need a hug or some space?' },
      { t: 'Feeling words in the story', d: 'When reading, pause on a face and ask what the character feels and why.', say: 'How do you think the little bird feels? Why?' },
      { t: 'Short and kind', d: 'Use one short phrase that names the feeling and says you are there. Skip the long explanation until she is calm.', say: 'Stopping is hard. I am right here.' },
      { t: 'Calm first, talk second', d: 'During a big feeling, stay close and breathe slowly. Talk about it once she is calm.', say: 'I am here. Let us do airplane breathing.' }
    ],
    narrate: [
      { t: 'Narrate the routine', d: 'While you dress, cook, or walk, name what you and she are doing, using real words for objects, actions, and feelings.', say: 'First we put on your socks. Now the left shoe goes on.' },
      { t: 'Describe her play', d: 'Say what she is doing without quizzing her. It gives her words for her own actions.', say: 'You are pushing the car up the big ramp.' },
      { t: 'Use a new word', d: 'Slip one fresh, specific word into the day and use it three times in different ways.', say: 'That branch is sturdy. This one is thin and bendy.' },
      { t: 'Tell it again', d: 'Retell something from her day in a short story and let her fill in the parts she remembers.', say: 'Today we saw a squirrel. What did he do next?' }
    ],
    music: [
      { t: 'Clap the beat', d: 'Clap or pat a steady beat to a favorite song, then try a pattern like clap, clap, stomp.', say: 'Clap, clap, stomp. Your turn!' },
      { t: 'Kitchen band', d: 'Use a pot, a wooden spoon, and a shaker made from a sealed container with rice (tape the lid shut and supervise). Explore loud, soft, fast, and slow.', say: 'Can you play it soft like a mouse?' },
      { t: 'Sing the routine', d: 'Make up a short tune for hand washing or cleanup. Simple repeated songs are easy to join.', say: 'Let us sing our cleanup song.' }
    ],
    move: [
      { t: 'Cushion course', d: 'Build a short obstacle path from cushions and pillows to crawl, climb, and jump over, with you spotting her.', say: 'Go over the mountain, then under the tunnel.' },
      { t: 'Leaf and cloud watch', d: 'Spend a few minutes outside and watch leaves, clouds, and birds. Wonder out loud with her.', say: 'What shape is that cloud?' },
      { t: 'Follow a line', d: 'Walk along a line of tape on the floor or a painted line at the park, then jump over a crack in the path. Stay close and hold her hand near any street.', say: 'Can you walk on the line like a tightrope?' },
      { t: 'Free play outside', d: 'Let her run, climb, and dig with little direction. Stay close, step in only for safety.', say: 'You climbed all the way up!' }
    ],
    notice: [
      { t: 'Notice first', d: 'Watch her play for three minutes without helping or directing. Notice what she picks, how long she stays, and what she repeats. That is her interest showing.', say: 'I see you lining up the cars by color.' },
      { t: 'Try, then adapt', d: 'Try an activity. If she loses interest or gets frustrated, change one thing: make it easier, make it harder, make it shorter, or switch the materials.', say: 'Let us try it a different way.' },
      { t: 'Connection over finishing', d: 'Stop when the connection fades. How you play together matters more than finishing the activity.', say: 'We can stop here. I loved playing with you.' },
      { t: 'Three-minute activities', d: 'Many toddler activities work in about three minutes: stack, sort, sing, or find. Stop while she still wants more.', say: 'One more minute, then we will do it again tomorrow.' }
    ],
    routine: [
      { t: 'Same order, same words', d: 'Keep the order of morning, bath, and bedtime steps the same each day, and say the same few words at each step so she knows what comes next.', say: 'Bath, pajamas, two books, lights out.' },
      { t: 'Picture routine', d: 'Make a simple picture chart of the day with her help. The Today stops can be its steps.', say: 'What comes after breakfast?' },
      { t: 'Warn before changes', d: 'Give a short heads-up before switching activities, then use a calm cue like a song or timer.', say: 'Two more minutes, then we clean up.' }
    ]
  };

  /* Montessori-style home setup checklist (checkboxes saved on the device). */
  SA.homeSetup = [
    { id: 'hs1', t: 'Clothes she can reach: a low drawer or hooks with two outfits to choose from' },
    { id: 'hs2', t: 'A low shelf in the fridge or pantry with a few snacks she may take herself' },
    { id: 'hs3', t: 'A stable step stool at the sink so she can wash her hands and fill a cup' },
    { id: 'hs4', t: 'Her own cloth and small broom or brush for spills' },
    { id: 'hs5', t: 'A low shelf with a few toys on trays (fewer toys, put out neatly)' },
    { id: 'hs6', t: 'A pouring tray with two small pitchers (adult nearby for water play)' },
    { id: 'hs7', t: 'A basket or hook for shoes and a coat at her height' },
    { id: 'hs8', t: 'A cozy book nook with a few books facing out' }
  ];

  SA.parentGuide = {
    intro: 'Early-childhood research and Montessori practice share one idea: steady, responsive daily time beats gadgets, flashcards, and packed schedules. This page turns that into small habits that fit the app.',
    principles: [
      { t: 'Serve and return', d: 'She "serves" with a sound, a word, a look, or a point. You "return" by answering, adding a bit, and waiting for her next turn. The Harvard Center on the Developing Child calls this back-and-forth fundamental to how the brain wires up in the earliest years.' },
      { t: 'Praise effort and strategy', d: 'Say what she did ("You kept trying") more than who she is ("You are so smart"). A classic 1998 study by Mueller and Dweck found that praising intelligence undermined children\'s motivation compared with praising effort. Later work on growth-mindset programs shows smaller effects, so treat this as a helpful habit, not a guarantee.' },
      { t: 'Real work counts as learning', d: 'In Montessori homes, washing a table, pouring, and sweeping are treated as meaningful work that builds focus, hand control, and independence. Set things up so she can do them herself, and stay close for safety.' },
      { t: 'Follow her lead, with firm limits', d: 'Notice what she gravitates toward and offer more of it. She has freedom to choose what she does, and you stay firm about how things are treated (gently, back on the shelf).' },
      { t: 'Open-ended beats flashy', d: 'Blocks, playdough, and boxes can become anything, so she has to supply the ideas. That is the creative work.' },
      { t: 'Protect free time', d: 'The guides warn against over-scheduling a toddler. One sport, one art, and plenty of unplanned time is plenty at this age.' },
      { t: 'Talk, read, sing, move', d: 'The simplest curriculum for ages 0 to 3 in the guides is language-rich routines: narrate what you do, read daily (rhythmic, repetitive books are great), sing and clap, move and explore outdoors, and keep a steady daily rhythm.' }
    ],
    dont: [
      'Do not drill her with flashcards or push her to perform for visitors.',
      'Do not rescue her from every small struggle. Stay near, wait, then offer a hint.',
      'Do not turn feelings into a lesson in the middle of a meltdown. Calm first, talk second.'
    ],
    eclectic: {
      title: 'An eclectic approach that fits her',
      intro: 'No single method fits every child, so the sources you shared suggest mixing methods and adjusting to the child. The app is built that way on purpose.',
      attribution: 'The four approaches below come from a quote in your notes, credited to Karen Morse of Hoagies\u2019 Gifted Education Page. I could not find that wording on the Davidson Online page you linked, so check the original source before quoting it.',
      approaches: [
        { t: 'Classical education', d: 'Emphasizes the tools of learning.', app: 'In the app: sound drills, word cards, reading and singing.' },
        { t: 'Lifestyle learning', d: 'Treats education as an integral part of the community around her.', app: 'In the app: real-life jobs, outdoor time, activities, and talking with native speakers.' },
        { t: 'Mastery learning', d: 'Sequential, with immediate feedback.', app: 'In the app: step-by-step sing drills, quiz answers with instant stars, learned stars, and the sticker chart.' },
        { t: 'Integrated learning', d: 'Combines several subjects in project form or units of study.', app: 'In the app: each unit (Trees, Water) weaves language, science, math, movement, art, and feelings around one topic.' }
      ],
      models: [
        { t: 'Project-based learning', d: 'Diving into a real-world challenge and creating something tangible, like a product, presentation, or solution.' },
        { t: 'Self-paced learning', d: 'Moving at her own speed: faster in strong areas, slower where it is hard.' },
        { t: 'Unit studies', d: 'A theme that combines subjects, like history, science, and art, around one central topic.' }
      ],
      pieces: [
        { t: 'Differentiated instruction', d: 'Matching materials and teaching to where she is now, using her strengths and growth areas.' },
        { t: 'Interdisciplinary learning', d: 'Several subjects in one experience, which builds big-picture thinking.' },
        { t: 'Acceleration versus enrichment', d: 'Acceleration is about pace. Enrichment is about depth over speed, such as encouraging creativity, curiosity, and critical thinking.' }
      ],
      notice: [
        'Notice, Try, Adapt, Connect: watch what she does, try an idea, change one thing if it does not fit, and keep the relationship first.',
        'Watch what she picks first, how long she stays, and what she repeats. Save it in the Daily log under Interest.',
        'Does she like a set order, or free exploring? Short bursts or long stretches? Doing, looking, or listening?',
        'Choose the next activity from those answers, not from a label.'
      ],
      caution: 'Reviews of the research have not found strong evidence that teaching to a fixed "learning style" improves learning, so treat these as observations about her interests, pace, and attention, not labels. Many of the toddler activity ideas in your notes come from a page that sells products and cites no research, so I used only the simple, low-risk ideas.'
    },
    later: {
      title: 'Later on: if she shows advanced learning',
      intro: 'None of this is for now. At almost 3, the guides agree the job is curiosity, language, and joy. The Davidson Academy itself does not consider applicants below grade 4. Come back to this when she is older and you see her learning much faster or going much deeper than her peers.',
      terms: [
        { t: 'Acceleration', d: 'Moving through material faster than a traditional curriculum allows. Forms include grade-skipping, advancing in one subject while staying with peers in others, and early entrance (starting school younger, or taking college courses during high school).' },
        { t: 'Enrichment', d: 'Exploring topics more deeply, with more complexity and variety, without necessarily moving faster. Examples: independent study, pull-out programs, summer programs, and extracurricular activities.' },
        { t: 'Compacting', d: 'Streamlining the core curriculum by removing what she has already mastered, to free time for advanced or enrichment work. The steps: identify the goals, pre-assess her, cut the repeats, and substitute new content.' },
        { t: 'Interest-led learning', d: 'Letting her go deep on topics she loves, which builds motivation from the inside.' }
      ],
      models: [
        { t: 'Subject-centered', d: 'Organizes learning by subject, such as math or science, moving from basic to advanced topics.' },
        { t: 'Learner-centered', d: 'Starts from the student\'s needs, passions, and abilities, with self-directed exploration.' },
        { t: 'Problem-centered', d: 'Built around real-world problems students investigate and solve, such as Problem-Based Learning (small-group research and solutions) and Inquiry-Based Learning (student-driven, open-ended questions).' }
      ],
      programs: [
        { t: 'Integrated Curriculum Model (VanTassel-Baska, William & Mary Center for Gifted Education)', d: 'A framework for teaching high-ability learners built on three dimensions: advanced content (in-depth study, advanced reading, primary sources), higher-level processes and product development (reasoning, research, problem-based learning), and big interdisciplinary concepts such as change, systems, patterns, and cause and effect. Units exist in language arts, math, science, and social studies, sold through publishers such as Kendall Hunt and Prufrock Press.', u: 'https://education.wm.edu/centers/cfge/curriculum/index.php' },
        { t: 'Beast Academy (Art of Problem Solving)', d: 'A full math program for ages 6 to 13 that teaches problem solving through comic-style guides and puzzles. Levels run from Level 1 (ages 6 to 8) to Level 5 (ages 10 to 13), as books, online, or both.', u: 'https://beastacademy.com/faq' },
        { t: 'Davidson Academy', d: 'A free public school for profoundly gifted middle and high school students. Its curriculum fits the learner-centered model, with a Prospective Learning Plan for each student, classes grouped by ability instead of age, and acceleration. The eligibility page requires grade 4 or above, strict testing and placement criteria, and Nevada residency for the school. Davidson Academy Online serves students across the U.S. and Canada; its requirements are listed at davidsononline.org.', u: 'https://www.davidsonacademy.unr.edu/admissions/eligibility/' },
        { t: 'Wordly Wise 3000', d: 'A vocabulary workbook series with levels from kindergarten up to grade 12. Look at it when she is reading on her own.', u: 'https://www.rainbowresource.com/wordly-wise-3000-all-editions' },
        { t: 'Beyond the Page', d: 'A literature and project-based curriculum named in your notes. I did not verify its grade levels, so check its website before relying on it.', u: '' }
      ],
      caution: 'No test or checklist in this app can tell you whether she is gifted. If you ever want to know, a licensed child psychologist or her school can assess her when she is older.'
    },
    books: [
      { t: 'The Montessori Child', by: 'Simone Davies and Junnifa Uzodike', note: 'A parent guide for ages 3 to 12 with home setup ideas and an appendix of hands-on activities using household materials.', u: 'https://themontessorinotebook.com/the-montessori-child' }
    ],
    sources: [
      { t: 'Davidson Online: The basics of homeschool curricula for gifted students', u: 'https://www.davidsononline.org/blog/the-basics-of-homeschool-curricula-for-gifted-students/' },
      { t: 'Your Baby\u2019s a Genius: Toddler learning guide (activity ideas only; it cites no research and sells products)', u: 'https://yourbabysagenius.com/stages/toddler' },
      { t: 'Davidson Academy: curriculum models for gifted learners', u: 'https://www.davidsonacademy.unr.edu/blog/curriculum-models-for-gifted-learners/' },
      { t: 'William & Mary Center for Gifted Education: curriculum framework', u: 'https://education.wm.edu/centers/cfge/curriculum/index.php' },
      { t: 'Beast Academy FAQ (Art of Problem Solving)', u: 'https://beastacademy.com/faq' },
      { t: 'Davidson Academy eligibility', u: 'https://www.davidsonacademy.unr.edu/admissions/eligibility/' },
      { t: 'Harvard Center on the Developing Child: Serve and Return', u: 'https://developingchild.harvard.edu/resources/serve-return-interaction/' },
      { t: 'Mueller and Dweck (1998), Praise for intelligence can undermine children\'s motivation and performance', u: 'https://www.columbia.edu/cu/psychology/courses/3615/Readings/Mueller_Dweck.pdf' },
      { t: 'The Montessori Child, by Simone Davies and Junnifa Uzodike', u: 'https://themontessorinotebook.com/the-montessori-child' }
    ],
    safety: 'Safety: Stay with her for water play, knives, and small objects. Cut round foods such as grapes lengthwise. Keep acorns, seeds, and other small items out of reach under age 4. If you ever have concerns about her speech, development, or behavior, ask her pediatrician.'
  };
})();
