/* Sky Academy: milestones (CDC), growth map to age 10, big goals, and activities. */
(function () {
  window.SA = window.SA || {};

  /* CDC "Learn the Signs. Act Early." checklists. Skills most children (75% or more) show by that age. */
  SA.milestones = [
    { id: 'm3', label: 'By age 3', source: 'CDC, Milestones by 3 Years (reviewed May 2026)', url: 'https://www.cdc.gov/act-early/milestones/3-years.html', items: [
      { id: 'm3-1', cat: 'Social and emotional', t: 'Calms down within 10 minutes after you leave her, like at a childcare drop-off' },
      { id: 'm3-2', cat: 'Social and emotional', t: 'Notices other children and joins them to play' },
      { id: 'm3-3', cat: 'Language', t: 'Talks with you in conversation using at least two back-and-forth exchanges' },
      { id: 'm3-4', cat: 'Language', t: 'Asks "who," "what," "where," or "why" questions, like "Where is mommy/daddy?"' },
      { id: 'm3-5', cat: 'Language', t: 'Says what action is happening in a picture or book when asked, like "running," "eating," or "playing"' },
      { id: 'm3-6', cat: 'Language', t: 'Says her first name, when asked' },
      { id: 'm3-7', cat: 'Language', t: 'Talks well enough for others to understand, most of the time' },
      { id: 'm3-8', cat: 'Thinking and learning', t: 'Draws a circle, when you show her how' },
      { id: 'm3-9', cat: 'Thinking and learning', t: 'Avoids touching hot objects, like a stove, when you warn her' },
      { id: 'm3-10', cat: 'Movement', t: 'Strings items together, like large beads or macaroni' },
      { id: 'm3-11', cat: 'Movement', t: 'Puts on some clothes by herself, like loose pants or a jacket' },
      { id: 'm3-12', cat: 'Movement', t: 'Uses a fork' }
    ]},
    { id: 'm4', label: 'By age 4', source: 'CDC, Milestones by 4 Years', url: 'https://www.cdc.gov/act-early/milestones/4-years.html', items: [
      { id: 'm4-1', cat: 'Social and emotional', t: 'Pretends to be something else during play (teacher, superhero, dog)' },
      { id: 'm4-2', cat: 'Social and emotional', t: 'Asks to go play with children if none are around, like "Can I play with Alex?"' },
      { id: 'm4-3', cat: 'Social and emotional', t: 'Comforts others who are hurt or sad, like hugging a crying friend' },
      { id: 'm4-4', cat: 'Social and emotional', t: 'Avoids danger, like not jumping from tall heights at the playground' },
      { id: 'm4-5', cat: 'Social and emotional', t: 'Likes to be a "helper"' },
      { id: 'm4-6', cat: 'Social and emotional', t: 'Changes behavior based on where she is (place of worship, library, playground)' },
      { id: 'm4-7', cat: 'Language', t: 'Says sentences with four or more words' },
      { id: 'm4-8', cat: 'Language', t: 'Says some words from a song, story, or nursery rhyme' },
      { id: 'm4-9', cat: 'Language', t: 'Talks about at least one thing that happened during her day, like "I played soccer."' },
      { id: 'm4-10', cat: 'Language', t: 'Answers simple questions like "What is a coat for?" or "What is a crayon for?"' },
      { id: 'm4-11', cat: 'Thinking and learning', t: 'Names a few colors of items' },
      { id: 'm4-12', cat: 'Thinking and learning', t: 'Tells what comes next in a well-known story' },
      { id: 'm4-13', cat: 'Thinking and learning', t: 'Draws a person with three or more body parts' },
      { id: 'm4-14', cat: 'Movement', t: 'Catches a large ball most of the time' },
      { id: 'm4-15', cat: 'Movement', t: 'Serves herself food or pours water, with adult supervision' },
      { id: 'm4-16', cat: 'Movement', t: 'Unbuttons some buttons' },
      { id: 'm4-17', cat: 'Movement', t: 'Holds crayon or pencil between fingers and thumb (not a fist)' }
    ]},
    { id: 'm5', label: 'By age 5', source: 'CDC, Milestones by 5 Years', url: 'https://www.cdc.gov/act-early/milestones/5-years.html', items: [
      { id: 'm5-1', cat: 'Social and emotional', t: 'Follows rules or takes turns when playing games with other children' },
      { id: 'm5-2', cat: 'Social and emotional', t: 'Sings, dances, or acts for you' },
      { id: 'm5-3', cat: 'Social and emotional', t: 'Does simple chores at home, like matching socks or clearing the table after eating' },
      { id: 'm5-4', cat: 'Language', t: 'Tells a story she heard or made up with at least two events' },
      { id: 'm5-5', cat: 'Language', t: 'Answers simple questions about a book or story after you read or tell it to her' },
      { id: 'm5-6', cat: 'Language', t: 'Keeps a conversation going with more than three back-and-forth exchanges' },
      { id: 'm5-7', cat: 'Language', t: 'Uses or recognizes simple rhymes (bat-cat, ball-tall)' },
      { id: 'm5-8', cat: 'Thinking and learning', t: 'Counts to 10' },
      { id: 'm5-9', cat: 'Thinking and learning', t: 'Names some numbers between 1 and 5 when you point to them' },
      { id: 'm5-10', cat: 'Thinking and learning', t: 'Uses words about time, like "yesterday," "tomorrow," "morning," or "night"' },
      { id: 'm5-11', cat: 'Thinking and learning', t: 'Pays attention for 5 to 10 minutes during activities (screen time does not count)' },
      { id: 'm5-12', cat: 'Thinking and learning', t: 'Writes some letters in her name' },
      { id: 'm5-13', cat: 'Thinking and learning', t: 'Names some letters when you point to them' },
      { id: 'm5-14', cat: 'Movement', t: 'Buttons some buttons' },
      { id: 'm5-15', cat: 'Movement', t: 'Hops on one foot' }
    ]}
  ];

  SA.actEarly = 'If she is not meeting one or more milestones, has lost skills she once had, or you have any concern, do not wait. Talk with her pediatrician and ask for a developmental screening. In Connecticut, the Birth to Three system serves children under 3 with developmental delays, and the school district handles preschool special education after age 3.';

  /* Growth map. Ages 2 to 5 follow the CDC lists above. Ages 6 to 10 are typical elementary goals in line with Common Core style standards (Connecticut uses these). Second-language goals are my suggested targets, not norms. */
  SA.growth = [
    { id: 'g2', range: 'Ages 2 to 3', grade: 'Head Start / toddler', min: 0, max: 4,
      areas: {
        'English and talking': 'Builds 3 to 4 word sentences, asks who/what/where/why, names actions in pictures, says her first name, and is understood by others most of the time by 3.',
        'Reading and writing': 'Handles books, turns pages, repeats favorite lines, enjoys rhymes, scribbles on purpose, and draws a circle after a demo.',
        'Math and thinking': 'Counts a few objects, matches and sorts by color or size, and understands big and small, more and less.',
        'Feelings and friends': 'Names basic feelings, calms down within about 10 minutes after goodbyes, and starts to play with other children.',
        'Body': 'Runs, climbs, kicks and throws a ball, strings large beads, uses a fork.',
        'Second language (my target)': 'Greetings, colors, numbers to 5, animals, and songs. Aim for 30 to 50 words understood and 15 to 20 spoken.'
      }},
    { id: 'g4', range: 'Age 4', grade: 'Pre-K', min: 4, max: 5,
      areas: {
        'English and talking': 'Speaks in sentences of 4+ words, tells about her day, says words from songs and stories, answers "what is it for?"',
        'Reading and writing': 'Knows many letters, recognizes her name, pretends to read, tells what comes next in a story.',
        'Math and thinking': 'Counts to 10, names colors, makes simple patterns, sorts by one feature, and starts to see shapes in the world.',
        'Feelings and friends': 'Pretend play with friends, asks to join play, comforts others, likes being a helper, behaves differently in different places.',
        'Body': 'Catches a large ball, pours water, unbuttons buttons, holds a crayon with fingers, draws a person with 3+ body parts.',
        'Second language (my target)': 'Simple phrases ("I see a ___", "I want ___"), counting to 10, a few songs. Aim for 100 words understood and 40 spoken.'
      }},
    { id: 'g5', range: 'Age 5', grade: 'Pre-K / Kindergarten', min: 5, max: 6,
      areas: {
        'English and talking': 'Tells a story with two or more events, keeps a conversation going for more than three turns, uses rhymes.',
        'Reading and writing': 'Names letters and their sounds, writes some letters in her name, begins to blend sounds into words.',
        'Math and thinking': 'Counts to 10 and beyond (stretch: to 20), names numbers 1 to 5, uses time words like yesterday and tomorrow, and pays attention for 5 to 10 minutes.',
        'Feelings and friends': 'Follows rules, takes turns, does simple chores, sings or acts for family.',
        'Body': 'Buttons, hops on one foot, more control with pencil and scissors.',
        'Second language (my target)': 'Short sentences, counting to 20, recognizing the first letters or characters of the language.'
      }},
    { id: 'g6', range: 'Ages 6 to 7', grade: 'Grades 1 and 2', min: 6, max: 8,
      areas: {
        'English and talking': 'Retells stories with beginning, middle, and end, asks and answers questions in a group, and speaks clearly in front of others.',
        'Reading and writing': 'Learns to read: decodes words, builds a bank of sight words, reads simple books on her own, and writes sentences with capital letters and periods.',
        'Math and thinking': 'Adds and subtracts within 20 (grade 1) and within 100 (grade 2), understands tens and ones, tells time, counts coins, and measures.',
        'Feelings and friends': 'Solves small conflicts with words, follows multi-step directions, can lose a game without a meltdown, and learns from mistakes.',
        'Body': 'Rides a bike, swims with confidence, builds skill in her sport and art.',
        'Second language (my target)': 'Reads and writes simple words in the script or alphabet, sings several songs, and has short pretend conversations.'
      }},
    { id: 'g8', range: 'Ages 8 to 10', grade: 'Grades 3 to 5', min: 8, max: 12,
      areas: {
        'English and talking': 'Presents to a group, asks thoughtful questions, and explains her thinking.',
        'Reading and writing': 'Reads chapter books fluently (by the end of grade 3, children shift from learning to read to reading to learn), writes multi-paragraph pieces, and does simple research.',
        'Math and thinking': 'Knows multiplication and division facts, works with fractions, decimals, and multi-digit numbers, and solves multi-step word problems.',
        'Feelings and friends': 'Works in groups, resolves most disagreements by talking, shows resilience, manages her time with a planner, and builds study habits.',
        'Body': 'Plays on teams, performs on stage, keeps up with practice and goals.',
        'Second language (my target)': 'Holds short conversations on familiar topics and reads easy children\'s books in the language.'
      }}
  ];

  /* Big goals: early graduation and scholarships. Facts below were checked on 2026-10-29 against the sources listed. */
  SA.bigGoals = {
    intro: 'Nobody can promise early graduation or a full scholarship. But many of the things that make both possible start right now: reading and math fluency, curiosity, steady habits, strong health and sleep, and depth in a sport and an art.',
    freeRide: [
      'Full rides are rare. One analysis of 2015-16 national data (reported by financial aid expert Mark Kantrowitz in The Gazette, 2018) found 1.5% of bachelor\'s degree students got enough scholarships and grants to cover 100% of the cost of attendance. Only 0.2% got $25,000 or more a year in scholarships alone. These numbers are dated, so treat them as a rough picture.',
      'A "free ride" is more likely to be a stack: need-based aid plus merit awards plus credits earned early, rather than one giant scholarship.'
    ],
    routes: [
      { t: 'Need-based aid', d: 'Some colleges promise to meet 100% of demonstrated financial need. Your family\'s income and assets decide what that means. File the FAFSA each year it is offered, and use each college\'s net price calculator.' },
      { t: 'Merit scholarships', d: 'Many universities offer large merit awards, sometimes full tuition, for top grades, test scores (where used), leadership, or talent. Each school has its own criteria and deadlines, often in the fall of senior year or earlier.' },
      { t: 'Selective scholarship programs', d: 'Programs such as QuestBridge and the Posse Foundation connect high-achieving students with full scholarships at partner colleges. Each has its own eligibility rules and timing, so check them when she is in 9th or 10th grade.' },
      { t: 'Talent scholarships', d: 'Strong, long-term work in a sport or an art can open athletic or arts scholarships. Depth, not a long list, is what usually stands out.' },
      { t: 'Shorten and shrink the bill', d: 'Earn college credit in high school (AP, dual enrollment), start at a community college, or finish a bachelor\'s degree in three years. Every credit earned early is a semester you do not pay for.' }
    ],
    early: [
      'Early graduation is set by each school district. For example, the Enfield, CT policy lets students who finish all requirements leave at the end of the second marking period of senior year, if they ask before the end of junior year. It says no one may graduate earlier than the end of junior year. Bloomfield Public Schools will have its own policy, so ask the district when she is in middle school.',
      'In Connecticut, high schoolers can earn college credit through UConn Early College Experience. UConn lists a program fee of $50 per credit (with full waivers for students who qualify), and says its credits transfer to other schools 87% of the time. The receiving college still decides what it accepts.',
      'Another form of acceleration is grade skipping. Schools often use a structured tool, such as the Iowa Acceleration Scale, to decide. Look at the whole child (academics, maturity, friendships) before deciding.',
      'Connecticut also offers a State Seal of Biliteracy for graduates who show high skill in English and another language. This is a good reason to keep the second language going all the way through high school.'
    ],
    habits: [
      'Read to her every day and talk about the story. Aim for strong reading by the end of 3rd grade, since after that most learning depends on reading.',
      'Build number sense with real objects and play. Strong math in elementary school makes algebra and higher courses easier later.',
      'Keep one sport and one art going year after year. Depth beats a long list.',
      'Protect sleep, movement, and play. Tired brains do not learn well.',
      'Teach her to try again after a mistake ("not yet"). Resilience matters more than speed.',
      'Show her your own love of learning. Let her see you read and finish hard things.',
      'Save for college early, even small amounts. A 529 plan is one option. According to Fidelity\'s CHET page, Connecticut allows a state income tax deduction of up to $5,000 (single) or $10,000 (married) in contributions. Confirm the current rules with the state and a financial adviser. This is not financial advice.'
    ],
    timeline: [
      { when: 'Ages 2 to 5', what: 'Talk, read, play, sing. Build language, curiosity, and feelings skills. Keep a sport and an art. Start a college savings plan if you can.' },
      { when: 'Ages 6 to 8 (grades 1 to 3)', what: 'Reading fluency by the end of grade 3. Math facts. Keep sport, art, and the second language. Try a new activity each year.' },
      { when: 'Ages 9 to 10 (grades 4 and 5)', what: 'Writing, research, multi-digit math, fractions. Leadership at small scale (team captain, class helper). Explore summer programs and enrichment.' },
      { when: 'Middle school (grades 6 to 8)', what: 'Take the most challenging classes she can handle. Learn study skills. Ask the district about honors tracks, early high school credit, and early graduation policy.' },
      { when: 'High school (grades 9 to 12)', what: 'AP and dual enrollment. Build a steady record in two or three activities and in service. Check test policies for each college. FAFSA opens each October for the next school year.' }
    ],
    sources: [
      { t: 'The Gazette: Reality check, odds of full ride', u: 'https://gazette.com/?p=1122414' },
      { t: 'UConn Early College Experience', u: 'https://ece.uconn.edu/policies-procedures/' },
      { t: 'Enfield Public Schools graduation policy (example)', u: 'https://www.enfieldschools.org/UserFiles/Servers/Server_899572/File/2024/6146%20Graduation%20Requirements%2001-23-24.pdf' },
      { t: 'Fidelity: Connecticut CHET 529 tax advantages', u: 'https://www.fidelity.com/529-plans/connecticut' },
      { t: 'Connecticut State Seal of Biliteracy', u: 'https://portal.ct.gov/sde-sealofbiliteracy' },
      { t: 'CDC Milestones', u: 'https://www.cdc.gov/act-early/milestones/index.html' }
    ]
  };

  /* Activities. The first four reflect the plan: soccer done, gymnastics next, theater January 2027, horseback riding at age 4. */
  SA.activityDefaults = [
    { id: 'a-soccer', name: 'Soccer', type: 'sport', status: 'done', when: '', note: 'Finished. Great start.', lang: 'Count goals and name colors of the jerseys in your focus language.' },
    { id: 'a-gym', name: 'Gymnastics', type: 'sport', status: 'next', when: '', note: 'Next sport.', lang: 'Count rolls and name body parts in your focus language.' },
    { id: 'a-theater', name: 'Theater', type: 'art', status: 'planned', when: '2027-01', note: 'Starts January 2027.', lang: 'Practice lines and songs in your focus language for fun.' },
    { id: 'a-horse', name: 'Horseback riding', type: 'sport', status: 'planned', when: 'age4', note: 'Planned for when she turns 4. Use a certified riding helmet (ASTM/SEI) and a program that matches her age.', lang: 'Learn horse and farm words in your focus language.' },
    { id: 'a-boxing', name: 'Boxing', type: 'sport', status: 'planned', when: '', note: 'Someday. Ask gyms about their minimum age; many youth programs start later than preschool, so a non-contact fitness or shadow-boxing class may be the first step. Choose a coach who works with young children.', lang: 'Count punches and name body parts in your focus language.' },
    { id: 'a-violin', name: 'Violin, then try other instruments', type: 'art', status: 'planned', when: '', note: 'Start with violin, then rotate through instruments to see which one she loves. Violins come in very small fractional sizes, so ask a teacher or shop to fit one to her. Keep each try short and playful, and let her pick what to try next.', lang: 'Name the instrument and its sounds (high, low, loud, soft) in your focus language.' }
  ];

  SA.activityIdeas = [
    { name: 'Swimming', type: 'sport', why: 'Water safety first. Drowning is a leading cause of death for young children, and lessons help. Ask about programs for her age.' },
    { name: 'Dance or ballet', type: 'art', why: 'Rhythm, coordination, and performing, which pairs well with theater.' },
    { name: 'Music lessons or choir', type: 'art', why: 'She loves singing. Early music supports language and memory.' },
    { name: 'Art classes', type: 'art', why: 'Painting, clay, and drawing build fine motor skills and creativity.' },
    { name: 'Martial arts', type: 'sport', why: 'Focus, respect, and body control. Look for child-focused programs.' },
    { name: 'Ice skating', type: 'sport', why: 'Balance and coordination. Use a helmet.' },
    { name: 'Tennis or pickleball', type: 'sport', why: 'Hand-eye coordination you can keep for life.' },
    { name: 'Library story time', type: 'other', why: 'Free language and literacy, plus bilingual or world-language sessions in some libraries.' },
    { name: 'Chess (later, around 5+)', type: 'other', why: 'Planning and patience.' },
    { name: 'Coding or robotics (later, around 7+)', type: 'other', why: 'Problem-solving and STEM skills.' },
    { name: 'Native-speaker playgroup or tutor', type: 'other', why: 'Children learn a language best by interacting with real people. Look for community groups and tutors for your language.' }
  ];
})();
