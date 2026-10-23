# Happy Birthday Indu

A big heart made of "Happy Birthday Indu" in 99 languages, building itself word by word on a black
screen, with your music. Plain HTML/CSS/JS, no build step, no dependencies.

- The music is `assets/music.mp3` (already included). Replace that file to change the song.
- Black background with a drifting blue mist, soft blue flowers and falling petals (`bg.js`).
- The heart has 3D depth: it tilts with your mouse or phone and gently sways on its own.
- Buttons (top right): zoom in to read the small words, and mute.
- Browsers block autoplay, so there is a "Tap to open" screen that starts the heart and the music.

## Run locally
Double-click `index.html`, or:

    python -m http.server 8000
    # open http://localhost:8000

## Deploy (static site, free)
Deploy the folder that directly contains `index.html`.
- Netlify: https://app.netlify.com/drop, drag the folder in.
- Vercel: `npx vercel` in this folder (framework "Other", no build command), then `npx vercel --prod`.
- GitHub Pages: push to a repo, Settings > Pages > Deploy from branch (root).

## Customise (top of script.js)
- `NAME` changes the name.
- `GREETINGS` is the language list. Add a line to add a language.
- `REVEAL_SECONDS` is how long the heart takes to build.
