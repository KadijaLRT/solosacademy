/* Solo's Academy: do-together activities that match each roadmap age band. t = title, d = what to do, m = minutes.
   Keys match SA.growth ids and area names. Keep them short and safe; a grown-up is always nearby. */
(function () {
  window.SA = window.SA || {};
  const A = {
    g2: {
      'English and talking': [
        { t: 'Picture talk', d: 'Point to a picture in a book and ask "What is happening?" Then add one word to what she says: "Big dog!" becomes "The big dog runs."', m: 5 },
        { t: 'Say your name', d: 'Play pretend phone. Ring, ring! Ask "Who is this?" and wait for her to say her first name.', m: 3 }],
      'Reading and writing': [
        { t: 'Rhyme time', d: 'Sing or say a rhyme and stop before the last word. Let her fill it in: "Twinkle, twinkle, little ___."', m: 4 },
        { t: 'Big circle', d: 'Draw a big circle with a finger in sand, flour, or on a steamy window. Then try it with a fat crayon.', m: 5 }],
      'Math and thinking': [
        { t: 'Count and sort', d: 'Sort socks or toy cars by color. Count how many are in each pile, touching each one.', m: 5 },
        { t: 'Big and small', d: 'Find one big and one small thing in the room. Ask "Which is bigger?" and "Which is more?"', m: 4 }],
      'Feelings and friends': [
        { t: 'Name the feeling', d: 'When a feeling shows up, say it out loud: "You look sad. You wanted to stay." Then ask her to show the face.', m: 3 },
        { t: 'Side by side play', d: 'Sit near another child with the same toys. Narrate: "You are building. Your friend is building too."', m: 10 }],
      'Body': [
        { t: 'Kick and throw', d: 'Kick a soft ball to a grown-up, then toss it into a laundry basket from a few steps away.', m: 6 },
        { t: 'Big bead string', d: 'Thread large beads or pasta tubes onto a shoelace. Hold the end so she can focus on the beads.', m: 6 }],
      'Second language (my target)': [
        { t: 'Hello song', d: 'Greet her in your target language every morning, with a wave. Use the Word cards for greetings.', m: 2 },
        { t: 'Name the animal', d: 'Look at a toy animal or picture. Say its name in the target language and let her copy the sound.', m: 4 }]
    },
    g4: {
      'English and talking': [
        { t: 'My day story', d: 'At bedtime ask "What was the best part of your day?" Help her say it in a sentence with 4 or more words.', m: 5 },
        { t: 'What is it for?', d: 'Hold up a spoon, a cup, or a brush. Ask "What is it for?" and wait for her answer.', m: 4 }],
      'Reading and writing': [
        { t: 'Letter hunt', d: 'Find the first letter of her name on a cereal box or sign. Cheer each time you spot it.', m: 5 },
        { t: 'What comes next?', d: 'Stop halfway through a favorite book and ask "What happens next?" Then turn the page to check.', m: 5 }],
      'Math and thinking': [
        { t: 'Count to 10 steps', d: 'Count stairs, steps to the door, or snacks to 10. Point at each one as you count.', m: 4 },
        { t: 'Make a pattern', d: 'Line up red, blue, red, blue with blocks. Ask her to add the next one.', m: 5 }],
      'Feelings and friends': [
        { t: 'Can I play?', d: 'Practice asking to join in with puppets: "Can I play with you?" Take turns being the one who says yes.', m: 5 },
        { t: 'Helper job', d: 'Give her a small job, like putting napkins on the table, and thank her for helping.', m: 5 }],
      'Body': [
        { t: 'Water pouring', d: 'Pour water between two cups in the tub or outside. Fill to a line you drew with a marker.', m: 6 },
        { t: 'Big ball catch', d: 'Roll, then bounce, then toss a large ball. Start close and step back one step at a time.', m: 6 }],
      'Second language (my target)': [
        { t: 'I see a ___', d: 'On a walk, say "I see a ___" in the target language for something you spot. Let her try the same.', m: 6 },
        { t: 'Count to 10', d: 'Count toy cars or fruit to 10 in the target language. Clap on each number.', m: 4 }]
    },
    g5: {
      'English and talking': [
        { t: 'Two part story', d: 'Ask her to tell a story with a beginning and an ending: "First we went to the park, then we had a snack."', m: 6 },
        { t: 'Rhyme chain', d: 'Take turns saying words that rhyme with cat. See how long the chain gets.', m: 5 }],
      'Reading and writing': [
        { t: 'First sound', d: 'Say a word like "sun" and ask what sound it starts with. Then find three things that start with that sound.', m: 6 },
        { t: 'Write my name', d: 'Write her name in big dotted letters. She traces it, then tries one letter alone.', m: 6 }],
      'Math and thinking': [
        { t: 'Count to 20', d: 'Count jumps, claps, or steps up to 20. Try counting by pointing to a number line.', m: 5 },
        { t: 'Yesterday and tomorrow', d: 'Ask "What did we do yesterday? What will we do tomorrow?" Use the calendar to show where the days are.', m: 5 }],
      'Feelings and friends': [
        { t: 'Turn taking game', d: 'Play a simple board or card game and practice "my turn, your turn" and saying "good game."', m: 10 },
        { t: 'Family show', d: 'Let her sing or act something for the family. Clap at the end.', m: 8 }],
      'Body': [
        { t: 'Hop and balance', d: 'Hop on one foot for a few hops, then stand on one foot like a flamingo. Try the other foot too.', m: 5 },
        { t: 'Safe scissors', d: 'Cut along a thick line with child scissors, then a curvy line. Stay beside her.', m: 8 }],
      'Second language (my target)': [
        { t: 'Short sentences', d: 'Build a sentence together: "I want ___" or "I like ___" in the target language.', m: 6 },
        { t: 'First letter', d: 'Show the first letter or character of a word she knows. Trace it in the air together.', m: 5 }]
    },
    g6: {
      'English and talking': [
        { t: 'Retell it', d: 'After a book or show, ask her to retell it with a beginning, a middle, and an end.', m: 8 },
        { t: 'Family news', d: 'At dinner, let her give a one minute talk about her day while the family listens.', m: 5 }],
      'Reading and writing': [
        { t: 'Sight word hunt', d: 'Pick 5 common words, like the, and, was. Hunt for them in a book and tally each find.', m: 8 },
        { t: 'Sentence of the day', d: 'She writes one sentence with a capital letter at the start and a period at the end.', m: 8 }],
      'Math and thinking': [
        { t: 'Coin count', d: 'Count a small pile of coins together. Start with pennies and dimes, then add nickels.', m: 8 },
        { t: 'Measure it', d: 'Measure the table or a book with a ruler. Compare it to something else you measured.', m: 8 }],
      'Feelings and friends': [
        { t: 'Fix it with words', d: 'Role play a small problem, like two kids wanting the same toy. Practice saying "I feel ___ when ___."', m: 8 },
        { t: 'Good loser', d: 'Play a quick game and practice saying "good game" even when you lose. Name how it feels.', m: 10 }],
      'Body': [
        { t: 'Bike skills', d: 'Practice starting, stopping, and steering in a safe flat spot with a helmet on. A grown-up stays close.', m: 15 },
        { t: 'Sport practice', d: 'Pick one skill from her sport, like dribbling, and practice it for 10 minutes, then celebrate progress.', m: 10 }],
      'Second language (my target)': [
        { t: 'Write a word', d: 'She writes three simple words in the language of her script or alphabet and reads them aloud.', m: 8 },
        { t: 'Pretend shop', d: 'Play a short pretend conversation, like buying fruit, in the target language.', m: 8 }]
    },
    g8: {
      'English and talking': [
        { t: 'Two minute talk', d: 'She picks a topic she loves and presents it for two minutes. Others ask one question.', m: 10 },
        { t: 'Explain your thinking', d: 'Ask "How did you figure that out?" about a puzzle or a math problem, and listen to the whole answer.', m: 8 }],
      'Reading and writing': [
        { t: 'Chapter a day', d: 'Read a chapter of a book on her own, then tell you what happened in three sentences.', m: 20 },
        { t: 'Mini research', d: 'Pick an animal or place, find three facts from a book or a kid-safe site with you, and write a paragraph.', m: 20 }],
      'Math and thinking': [
        { t: 'Fact drills with a game', d: 'Roll two dice and multiply the numbers. First to 100 points wins.', m: 10 },
        { t: 'Recipe fractions', d: 'Double or halve a simple recipe and talk about the fractions you used.', m: 20 }],
      'Feelings and friends': [
        { t: 'Weekly planner', d: 'Fill in a weekly planner together with homework, practice, and fun. Check off tasks at the end of each day.', m: 10 },
        { t: 'Group project', d: 'Work with a sibling or friend on a build or a poster. Practice sharing jobs and solving disagreements by talking.', m: 20 }],
      'Body': [
        { t: 'Team skills', d: 'Practice one team skill, like passing, and talk about how to cheer teammates on.', m: 15 },
        { t: 'Show time', d: 'Let her plan and perform a short song, dance, or play for the family.', m: 20 }],
      'Second language (my target)': [
        { t: 'Familiar topics', d: 'Have a short chat about food, family, or school in the target language. Take turns asking questions.', m: 10 },
        { t: 'Easy reader', d: 'Read an easy children\'s book in the target language and tell you one thing you learned.', m: 15 }]
    }
  };
  SA.ageGames = A;
})();
