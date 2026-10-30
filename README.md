# Solo's Academy

A private learning app for Solo, ages 2 to 10. It runs in Safari on an iPad or iPhone, installs to the home screen, and works offline. There are no accounts, ads, or tracking. Everything is saved on the device. The only thing that uses the internet is the optional Groq story button (see step 4 below).

This app merges the earlier Sky Academy app with the Little Learners play features, and uses a retro preschool TV look (Sunny the sun mascot, chunky outlines, polka dots, a "Let's Learn!" opening screen).

## What is inside

- **Today**: a daily flight plan of about 17, 22, or 32 minutes, with tap-to-complete stops that earn stars.
- **Words**: 60 words in six languages (Spanish, French, Mandarin, Korean, Arabic, Zulu) with sounds-like guides, device voices, a quiz, and a Record button for native speakers. Plus English word building, clear-speech sound play, tongue ticklers, and a question ladder.
- **Play** (new; when she has learned every word in a week, it suggests skipping ahead or going deeper):
  - **Words**: picture cards for the current unit in English and her focus language, with a Spidey line for each word and a "learned" star.
  - **Sing**: 10 sound drills themed on Encanto, The Lion King, Tarzan, Trolls, Sing, Minions, Hotel Transylvania, Bebefinn, Pinkfong, and Frozen, with a "we did our 5 minutes" button. The chants are original and contain no song lyrics.
  - **Story**: a sentence expander (one word, short, longer), a feelings game, and the optional Groq story line button.
  - **Stickers**: a sticker board that unlocks as stars are earned.
- **Feelings**: a toolkit with six feelings in six languages, airplane breathing, calm-down tools, and scripts for hard moments.
- **Theme**: pick the unit. All five units (Trees, Water, Community Helpers, How Things Move, Buildings) have a full 6-week daily plan: weekly words, books, songs, movement, Spidey and airplane play, crafts, science, number play, feelings, and questions. The Today tab follows the selected unit, and each unit keeps its own start date (Settings). You can add your own words to any unit.
- **Parent move of the day** (on Today): one small, research-backed habit each day (serve and return, notice and adapt, talking it through, real-life jobs, praising effort, open-ended play, music and rhythm, moving outdoors, her own choices, everyday math, feelings and limits, steady routines).
- **Grow**: CDC milestone checklists, a **Parent guide** (big ideas, 11 kinds of daily parent moves, a Montessori home-setup checklist, an "An eclectic approach that fits her" section, a "Later on" section on gifted-learner curriculum models, sources), a **Daily log** (gymnastics skills, speech clarity 1 to 5, new words, and an Interest entry that shows what she keeps choosing), a growth map to age 10, and Big Goals.
- **Activities**: soccer, gymnastics, theater (January 2027), and horseback riding.
- **Settings, Look**: retro everywhere (default), retro on kid screens only (Words and Play), or the classic calm look.

## Two views: parent and Solana

- **Parent view** (the default): everything, including Today, Theme, Grow, Activities, the Parent guide, and Settings.
- **Solana's view**: only Play, Words, Feelings, and Stickers, with big kid-friendly screens and no parent text. Tap the 👧 button in the parent view to hand over the device. The app reopens in whichever view you used last.
- **PIN**: in Settings, Profiles, set a 4 to 6 digit PIN. Switching from Solana's view back to the parent view (the 👪 button) then asks for it. The PIN is a child lock, not strong security. It is stored on the device in scrambled form.
- These are two views on one device, not two online accounts. Both share the same saved progress. Separate logins on separate devices would need a server and a database, which this version deliberately does not use.

## Put it on the iPad and iPhone

1. Unzip `solos-academy.zip`. You get a folder named `solos-academy`.
2. Host the folder (free). Netlify Drop (app.netlify.com/drop) is the quickest: drag the folder onto the page. Vercel or GitHub Pages also work.
3. On the iPad or iPhone, open the address in **Safari**.
4. Tap **Share**, then **Add to Home Screen**, then **Add**.
5. Open it once while online. After that it works offline.

## Optional: turn on the Groq story button (Vercel)

1. Push this folder to a GitHub repo and import it in Vercel. Framework preset: Other. No build command.
2. In Vercel, Project Settings, Environment Variables, add `GROQ_API_KEY`, then redeploy.
3. The button calls `/api/spidey` (in `api/spidey.js`). The key stays on the server. The app sends only a word and the unit name.
4. On any host without this function (for example Netlify Drop), the button shows a friendly message and the rest of the app keeps working.
5. **If you see "model does not exist or you do not have access":** the function now tries `llama-3.1-8b-instant`, then `llama-3.3-70b-versatile`, then `openai/gpt-oss-20b`, then `openai/gpt-oss-120b`. To see which models your key can use, open `https://YOUR-SITE.vercel.app/api/spidey` in a browser (it lists model names only, never the key). To force one, add `GROQ_MODEL` in Vercel Environment Variables and redeploy. If every model is refused, check the model permissions for your project in the Groq console.

## Games tab (for Solana)

The Games tab is the first tab and the opening screen in Solana's view. The two views are different on purpose. **Solana's view only plays:** big section buttons, then big game buttons, a small ❓ for spoken help, and progress dots. No settings. **Your view is Game settings:** you choose what she learns and how she plays, then tap **Try Solana's games** to preview (a preview never saves stars or progress). The games are original and use ideas common to toddler learning apps (short rounds, big pictures, a friendly voice, a progress reward). Nothing is copied from any other app. A right answer is praised out loud in English every time ("Green! Great job!"), also in Spanish mode (the Spanish word first, then the English praise). A wrong try wobbles, says what she picked ("That is blue. Try again!"), and nothing is lost.

Five sections, with the games each one has:

| Section | Pop it | Match it | Build a word | Count it | Sing it |
|---|---|---|---|---|---|
| Letters | yes | big to little letter | yes | | |
| Numbers (1 to 5 or 1 to 10) | yes | number to its group | | yes | counting chant |
| Colors | yes | color to its circle | | | |
| Shapes | yes | shape to its shadow | | | |
| Unit words | yes | picture to shadow | yes | | chant for each word |

- **Pop it!** Five balloons per round. She hears the letter, number, color, shape, or word and taps the matching balloon.
- **Match it!** Drag a piece to its match, or tap a piece and then tap its spot.
- **Count it!** Drag the right number of things into the basket and count out loud with the app.
- **Sing it!** Short original chants made from the unit word (or counting up to 5 or 10), with a clap button. The chants are not from any existing song.
- **Build a word:** drag letters into the empty boxes. Easy has 1 missing letter, Hard spells it all. Spelling is always English.
- **Rainbow:** finishing a game adds a color (and a star). Seven colors make a rainbow, which gives bonus stars. A letter gets a 🌈 after she gets it right 3 times.
- **Game settings (parent view only):** turn sections on or off, choose the language, the number range (1 to 5 or 1 to 10), Build a word difficulty, Practice, and spoken instructions. They are saved on this device and travel to Solana's device in the voice pack.
- **Her progress (parent view only):** at the bottom of Game settings, every letter, number, color, shape, and unit word shows green (mastered, 3 right answers), yellow (started), or gray (not yet), plus a list of what she has started but not mastered. Solana's view does not show it. It counts right answers from Pop it, Match it, and Count it, and it is saved on this device (and in the backup).
- **Practice what she is missing:** a Practice setting in Game settings (🎲 Everything or 🎯 What she is missing). In practice mode, Pop it, Match it, and Count it aim at pieces with fewer than 3 right answers (the balloons still include other pieces as choices). If everything in a section is mastered, it plays with everything.
- **Language:** Letters are English. Numbers, colors, and shapes are English, or Spanish when her focus language is Spanish. Unit words use English or her focus language.
- **Letter cards:** tap any letter to see it, hear it, and (in the parent view) record the letter sound in your voice. Phones read single letters aloud as names, so your recorded sound teaches the sound best.
- **Spoken instructions:** each game explains how to play out loud the first time it starts, and the ❓ button repeats it any time. The on/off switch is in Game settings. Spanish instructions play only when she is practicing Spanish.
- **Please check:** the Spanish number, color, and shape words and the Spanish chant lines are standard, but ask a Spanish speaker to listen once.

## Voice pack (recordings and game settings between devices)

Your voice recordings and your Game settings are saved on the device where you make them. The voice pack is one file that carries both to Solana's device. On your device: Settings, **Make voice pack**, then **Share** (AirDrop or Messages) to her device. On her device: switch to the grown-up view (PIN if you set one), go to Settings, tap **Import**, and pick the file. Importing adds clips, replaces any clip with the same name, and replaces the game settings. The file never leaves your own devices.

## Character voices and Mom's voice

- **Character-style voices (Play, Words and Story):** pick Hero, Silly helper, Sparkle, Big bear, or Regular. These only change the pitch and speed of the device's own voice. They are not the real voices from her shows. Sound drills in the Sing tab always use the regular voice so each sound stays clear. How they sound depends on the voices on the device, so test on her iPad.
- **Mom's voice:** on a Words card in the parent view, tap **Record English** or **Record Spanish**, do your best character voice, then tap **Stop**. A **Mom** play button then appears for Solana. One clip per word and language, up to 20 seconds. Moving to another word stops and saves the clip. Clips stay on the device (not in the backup).

## Voices

The app uses the voices built into the device. Add voices in **Settings, Accessibility, Spoken Content, Voices**. Apple devices have no Zulu voice, so use **Record** on a word card and ask a Zulu speaker. For languages other than Spanish, the Play word cards use the Sky word bank when the word exists there, and fall back to Spanish otherwise.

## Please check these things

- **Pronunciation:** sounds-like guides are English-speaker approximations. Ask a native speaker to check them, especially Zulu, Arabic, and Mandarin tones.
- **Sound drills:** the tips are simple play ideas, not speech therapy. If you are worried about her speech, ask her pediatrician or a speech-language pathologist.
- **Books:** titles are real, but check your library.
- **Big Goals:** facts were checked on October 29, 2026. Rules, fees, and tax limits change. Confirm with the school or state. This is not legal or financial advice.

## Back up your data

Settings, **Download backup**. Restore from the same screen. Clearing Safari website data erases the app data. Recordings are not in the backup.

## Update the app

Re-upload the folder. Change `CACHE` in `sw.js` to a new name each time (for example `solos-academy-v12`), then close and reopen the app twice.

## Files

- `index.html`, `styles.css`, `retro.css`, `js/app.js`: the app and its looks
- `js/fun.js`, `js/data-fun.js`: Play tab, units, daily log, sing drills
- `js/games.js`, `games.css`, `js/data-letters.js`, `js/data-basics.js`: the Games tab (letters, numbers, colors, shapes, counting, chants)
- `js/parent.js`, `js/data-parent.js`: parent move of the day and the Parent guide
- `js/data-words.js`, `js/data-english.js`, `js/data-trees.js`, `js/data-pathway.js`: the original Sky Academy content
- `js/data-water.js`, `js/data-helpers.js`, `js/data-moving.js`, `js/data-buildings.js`: the 6-week plans for the other four units
- `api/spidey.js`: optional Groq function for Vercel
- `manifest.webmanifest`, `sw.js`, `icons/`: install and offline support


## Your name and the lock between views

Your screen says "Hi Kadija!" (change it in Settings, Your name). The first time you switch to Solana's view the app makes you set a PIN. In her view the grown-up button is faded and needs a press and hold of about 1.5 seconds, then the PIN. A quick tap does nothing.

## Her level (starts at her age, moves up as she learns)

The app reads her birth month (Settings) and starts her at the level for her age. Level 0 is about age 2 and level 4 is age 6 and up. Each section (letters, numbers, colors, shapes, unit words) then moves up on its own when she masters most of what that level asks (3 right answers per piece, about 80 percent of the pieces; for letters 5, 10, 16, then 22 letters). A level-up unlocks more: Sound it (first and last letters), Add it (adding, then taking away), numbers to 20, more colors and shapes, longer words to spell, a listening sentence for unit words, and a short Spanish sentence after each right Spanish answer. She hears "You are growing! New games for you!" and you see the level-ups in Game settings. Game settings, Start point, can start every section one or two levels higher. Solana cannot read yet, so every prompt is spoken, with big picture cues and icon buttons.

## Greetings

Solana hears "Hello Solana! Let's learn!" and you hear "Hello Kadija! Here's Solana's progress." Names come from Settings.

## Changing the unit

Theme tab (grown-up view), tap the unit at the top: Trees, Water, Community Helpers, How Things Move, or Buildings. A 📅 means the unit has a full 6-week daily plan. For a new unit, set its start date in Settings (the label shows the unit name) so the weeks line up with her class.

## Less reading (grown-up view)

Because long text is hard to scan, the grown-up view hides helper paragraphs behind a small ⓘ button (tap it to read). Today leads with a "Next stop" card and a one-line progress summary, and the parent move of the day is collapsed to its title. Turn it off in Settings, Look, Less reading.

## Topics (open shelf)
The Games home shows Letters, Numbers, Colors, Shapes and every topic side by side. Solana taps a picture tile (Days of the week, Months, Seasons and weather, Space and planets, My body, Animals, plus the five school units marked with a school badge) and the games switch to that topic's words. The CREC units stay as supporting topics. To add a topic, push one more object to `SA.units` in `js/data-topics.js`.

## Spoken language
All instructions, hints and praise are in English. Only the practice words and short word sentences use her second language.

## Tabs
Grown-up view: Today, Learn (topic play and word bank), Games, School (CREC unit), Grow (includes a Feelings log of what Solana taps), Activities.
Solana's view: Games, Learn, Feelings. Recordings you make in Learn (Mom's voice) play on her word cards.
