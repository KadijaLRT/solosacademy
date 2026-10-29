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

The Games tab is the first tab and the opening screen in Solana's view.

Original games in the style of toddler alphabet puzzle apps. Nothing is copied from any other app. A wrong try just wobbles and says "Try again", and nothing is lost.

- **Pop it!** Five balloons per round. She hears a letter or word and taps the matching balloon.
- **Match it!** Letters: drag each big letter to its little letter. Unit words: drag each picture to its shadow. She can also tap a piece, then tap its spot.
- **Build a word:** drag letters into the empty boxes. "1 missing letter" is the easy setting; "Spell it all" is harder. Spelling is always English.
- **Rainbow:** finishing a game adds a color (and a star). Seven colors make a rainbow, which gives bonus stars. A letter gets a 🌈 after she gets it right 3 times.
- **Letters or unit words:** the Letters section is English. The unit words section uses the unit you picked in the Theme tab, in English or Spanish.
- **Letter cards:** tap any letter to see it, hear it, and (in the parent view) record the letter sound in your voice. Phones read single letters aloud as names, so your recorded sound teaches the sound best.
- **Spoken instructions:** each game explains how to play out loud the first time it starts, and the **How to play** button repeats it any time. There is an on/off switch on the Games screen. Spanish instructions play only when she is practicing Spanish with unit words.

## Voice pack (recordings between devices)

Recordings are saved on the device where you make them. To move them to Solana's device: Settings, **Make voice pack**, then **Share** (AirDrop or Messages) to her device. On her device, open the parent view, go to Settings, and tap **Import**. Importing adds clips and replaces any clip with the same name. The file never leaves your own devices.

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

Re-upload the folder. Change `CACHE` in `sw.js` to a new name each time (for example `solos-academy-v10`), then close and reopen the app twice.

## Files

- `index.html`, `styles.css`, `retro.css`, `js/app.js`: the app and its looks
- `js/fun.js`, `js/data-fun.js`: Play tab, units, daily log, sing drills
- `js/parent.js`, `js/data-parent.js`: parent move of the day and the Parent guide
- `js/data-words.js`, `js/data-english.js`, `js/data-trees.js`, `js/data-pathway.js`: the original Sky Academy content
- `js/data-water.js`, `js/data-helpers.js`, `js/data-moving.js`, `js/data-buildings.js`: the 6-week plans for the other four units
- `api/spidey.js`: optional Groq function for Vercel
- `manifest.webmanifest`, `sw.js`, `icons/`: install and offline support
