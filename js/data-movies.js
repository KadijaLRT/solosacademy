/* Solo's Academy: feelings questions from her favorite movies and shows.
   Every question is written in my own words and checked against the film's plot summary. No lyrics, no script lines.
   a = the feeling a toddler would name (ids from SA.playFeelings). Minions is generic ("a minion") on purpose. */
(function () {
  window.SA = window.SA || {};
  SA.movies = [
    { id: 'spidey', title: 'Spidey and His Amazing Friends', e: '🕷️', qs: [
      { q: 'Spidey, Spin, and Ghost-Spider stop a villain and save the city. How do they feel?', a: 'proud' },
      { q: 'The Green Goblin makes a big mess. How does Spidey feel?', a: 'mad' },
      { q: 'Ghost-Spider glides high over the city. How does she feel?', a: 'excited' }] },
    { id: 'encanto', title: 'Encanto', e: '🦋', qs: [
      { q: 'Mirabel is the only one in her family without a gift. How does she feel?', a: 'sad' },
      { q: 'The magic house starts to crack. How does the family feel?', a: 'scared' },
      { q: 'Abuela says sorry to Mirabel. How does Mirabel feel?', a: 'happy' },
      { q: 'The whole family builds the house again together. How does Mirabel feel?', a: 'proud' }] },
    { id: 'lion', title: 'The Lion King', e: '🦁', qs: [
      { q: 'Baby Simba is shown to all the animals. How do they feel?', a: 'happy' },
      { q: 'Simba misses his dad, Mufasa. How does Simba feel?', a: 'sad' },
      { q: 'Timon and Pumbaa become Simba’s new friends. How does Simba feel?', a: 'happy' },
      { q: 'Simba goes back to Pride Rock to help everyone. How does he feel?', a: 'proud' }] },
    { id: 'tarzan', title: 'Tarzan', e: '🌴', qs: [
      { q: 'Kala finds baby Tarzan and takes him home. How does Kala feel?', a: 'happy' },
      { q: 'Kerchak treats Tarzan like he does not belong. How does Tarzan feel?', a: 'sad' },
      { q: 'Tarzan meets Jane and helps her. How does Tarzan feel?', a: 'excited' },
      { q: 'Tarzan helps free the gorillas. How does he feel?', a: 'proud' }] },
    { id: 'frozen', title: 'Frozen', e: '❄️', qs: [
      { q: 'Elsa’s ice magic shows in front of everyone. How does Elsa feel?', a: 'scared' },
      { q: 'Anna wants to play, but Elsa stays behind a closed door. How does Anna feel?', a: 'sad' },
      { q: 'Olaf dreams of a warm summer day. How does Olaf feel?', a: 'excited' },
      { q: 'Anna and Elsa make up at the end. How do they feel?', a: 'happy' }] },
    { id: 'sing', title: 'Sing', e: '🎤', qs: [
      { q: 'Meena is nervous to sing on stage. How does Meena feel?', a: 'scared' },
      { q: 'The theater breaks and Buster Moon loses it. How does Buster feel?', a: 'sad' },
      { q: 'Meena sings loud and strong for the crowd. How does she feel?', a: 'proud' },
      { q: 'The new theater opens. How does Buster feel?', a: 'happy' }] },
    { id: 'trolls', title: 'Trolls', e: '🌈', qs: [
      { q: 'Poppy throws a big happy party. How does Poppy feel?', a: 'happy' },
      { q: 'Branch worries the party is too loud. How does Branch feel?', a: 'scared' },
      { q: 'The Trolls and the Bergens make peace. How do they feel?', a: 'happy' }] },
    { id: 'hotel', title: 'Hotel Transylvania', e: '🧛', qs: [
      { q: 'Mavis turns 118 and wants to see the world. How does Mavis feel?', a: 'excited' },
      { q: 'Dracula worries that a human is at his hotel. How does Dracula feel?', a: 'scared' },
      { q: 'Mavis and Johnny have fun at the party. How do they feel?', a: 'happy' }] },
    { id: 'minions', title: 'Minions', e: '🍌', qs: [
      { q: 'A minion finds a big yellow banana. How does he feel?', a: 'happy' },
      { q: 'A minion drops his banana. How does he feel?', a: 'sad' },
      { q: 'A minion hears a loud boom. How does he feel?', a: 'scared' }] }
  ];
})();
