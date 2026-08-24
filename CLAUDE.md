# CLAUDE.md

Guidance for AI agents working in this repo. Keep it current when architecture changes.

## What this is

A Vue 3 + Vite flashcard web app for **English-speaking beginners learning Chinese**, organized
**HSK level → lesson → word**. Covers HSK 1–3 (data available); HSK 4/5 are placeholders.
Two audiences: a teacher in class (projector) and — most of the time — students self-studying,
so the UI must be self-explanatory to weak-Chinese users and is **bilingual (中文 + English)** throughout.

Live: https://delamoer.github.io/hsk-flashcards/ · Repo: `delamoer/hsk-flashcards` (public, gh-pages).

## Commands

```bash
npm run dev        # dev server (localhost:5173)
npm run build      # production build → dist/
npm run convert    # regenerate src/data/*.json from the xlsx (uv + openpyxl)
npm run deploy     # build + publish dist to gh-pages branch
```

## Architecture / data flow

- **Data is generated, not hand-written.** Source of truth = the three `HSK*_按课次词汇闪卡表.xlsx`
  in the repo root. `scripts/convert.py` normalizes them into `src/data/hsk{1,2,3}.json`.
  **Never edit `src/data/*.json` by hand** — edit the xlsx (and English titles in `convert.py`'s
  `TITLES_EN`), then run `npm run convert`.
- `src/data/index.js` loads the JSON and exposes `levels`, `getLevel`, `getLesson`, `allWords`.
  Word shape: `{ id, num, hanzi, pinyin, meaning, type("core"|"supplement"|null), note, examples:[{zh,en}] }`.
- **Routing** (`src/router/index.js`): hash history (`createWebHashHistory`) so the static build
  works on GitHub Pages without server rewrites. Routes: `/`, `/hsk/:level`,
  `/hsk/:level/lesson/:lesson`, `.../quiz`, `.../print`.
- **State** lives in composables backed by localStorage:
  - `useProgress` → per-word `{ s: "new"|"known"|"review", star }` (key `hsk-flashcards-progress-v1`)
  - `useSettings` → `{ toneColors, ttsRate }` (key `hsk-flashcards-settings-v1`)

## Conventions (do follow these)

- **`DESIGN.md` is the source of truth for all visuals.** It's a Google-Stitch-format design system
  (colors, typography, radius, spacing, components). `src/styles/main.css` mirrors its tokens as CSS
  variables. Take colors/spacing from there; don't invent new values.
- **Bilingual UI**: every button/label carries Chinese + a smaller English sub-label (e.g. "翻面 Flip").
  If space is tight, English-primary. Card *content* is the Chinese being learned; *chrome* is bilingual.
- **Flashcard front shows the 汉字 only.** Pinyin/English are on the back (or via the 👁 peek button).
- **Tone-colored pinyin** is a pedagogical contract, not decoration. `src/utils/pinyinTones.js` splits
  pinyin into syllables and wraps each in `.t1`–`.t4`/`.t0` (Pleco palette: 1 red / 2 green / 3 blue /
  4 purple / neutral gray). Colors are fixed across themes; togglable via `useSettings.toneColors`.

## Gotchas / non-obvious decisions

- **FlashCard flip** (`src/components/FlashCard.vue`): uses a 3D `rotateY` flip **plus an opacity swap
  at the flip midpoint** (`transition: opacity 0s .22s`). The opacity swap is deliberate — relying on
  `backface-visibility` alone caused both faces to bleed through in some renderers. Don't "simplify" it away.
  Also: the two faces MUST carry the `fc-face` class (position/size/backface) or they collapse into
  normal flow. Faces avoid `overflow:hidden` (it flattens the 3D context and re-breaks backface).
- **`base: "./"`** in `vite.config.js` (relative asset paths) + hash routing = works on any sub-path
  host (GitHub Pages `/hsk-flashcards/`) with no per-repo base config. Keep it relative.
- **TTS** (`src/utils/tts.js`) uses the browser `speechSynthesis` zh-CN voice — free, but availability
  varies by device. It degrades silently; never assume a voice exists.
- **`.claude/` is gitignored.** It holds a local symlink to the `huashu-design` skill (used only for
  design work) — not part of the app, must not enter the public repo.
- **`prototype/index.html`** is the original single-file hi-fi prototype (design reference / artifact),
  NOT production code. The Vue app is the real thing.

## Deploy

`git push` updates the source repo; `npm run deploy` (separately) rebuilds and pushes `dist/` to the
`gh-pages` branch, which GitHub Pages serves. Both are needed to fully ship a change.

## Adding HSK 4/5

Add the xlsx + its `TITLES_EN` entry, add a record to `SOURCES` in `scripts/convert.py`, run
`npm run convert`. The home screen placeholder for that level flips to available automatically
(driven by `levels` in `src/data/index.js`).
