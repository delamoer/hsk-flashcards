# CLAUDE.md

Guidance for AI agents working in this repo. Keep it current when architecture changes.

## What this is

A Vue 3 + Vite web app for **English-speaking beginners learning Chinese**, branded **「学中文 Learn Chinese」**.
It began as a pure flashcard app (organized **course → lesson → word**) and has grown into a small
multi-section learning platform. Top-level sections (see the nav in `AppHeader.vue`):
- **词汇闪卡 Flashcards** (`/`, the home) — the original vocab decks (HSK + 会话 courses).
- **拼音 Pinyin** (`/pinyin`) — an interactive pinyin chart with native audio (see below).
- **课文 Texts** (`/texts`) — per-lesson dialogue texts with a "double cloze" exercise
  (生词挖空 word-bank fill + 连词成句 whole-dialogue reordering), tied to the same
  series/unit/lesson taxonomy as the flashcards (旧版→`hsk`, 新版→`newhsk3`).
- **我的词 My words** (`/my-words`) — cross-course roundup of studied/starred words.

Two audiences: a teacher in class (projector) and — most of the time — students self-studying,
so the UI must be self-explanatory to weak-Chinese users and is **bilingual (中文 + English)** throughout.
Future sections (e.g. 课文 texts) plug into the same nav + a route.

Live: https://delamoer.github.io/hsk-flashcards/ · Repo: `delamoer/hsk-flashcards` (public, gh-pages).

## Commands

```bash
npm run dev        # dev server (localhost:5173)
npm run build      # production build → dist/
npm run convert    # regenerate word data src/data/hsk*.json etc. from xlsx (uv + openpyxl)
npm run deploy     # build + publish dist to gh-pages branch

# Pinyin section (not npm scripts — run via uv directly):
uv run --with openpyxl python3 scripts/convert_pinyin.py            # xlsx → src/data/pinyin.json
uv run --with openpyxl --with httpx python3 scripts/convert_pinyin.py --download   # + fetch audio → audio-src/pinyin/
SUPABASE_URL=… SUPABASE_SERVICE_KEY=sb_secret_… \
  uv run --with httpx python3 scripts/upload_pinyin.py             # upload audio-src/pinyin/ → Storage pinyin/
#   upload_pinyin.py --only ne1 chi1   # force re-upload specific stems (upsert)
```

## Architecture / data flow

- **Data is generated, not hand-written.** Source of truth = the three `HSK*_按课次词汇闪卡表.xlsx`
  in the repo root. `scripts/convert.py` normalizes them into `src/data/hsk{1,2,3}.json`.
  **Never edit `src/data/*.json` by hand** — edit the xlsx (and English titles in `convert.py`'s
  `TITLES_EN`), then run `npm run convert`.
- **Course data is lazy-loaded, one chunk per unit.** `src/data/index.js` uses
  `import.meta.glob("./*-*.json")` so each `{series}-{unit}.json` is a separate chunk fetched on
  demand (kept out of the main bundle). Because of this, the data accessors are **async**:
  `getUnit` / `getLesson` / `allWords` / `everyWord()` / `searchAll()` all return Promises — views
  `await` them into a ref (with a small `loading` state). `matchWord()` stays sync/pure.
  Word shape: `{ id, num, hanzi, pinyin, meaning, pos, type("core"|"supplement"|null), note, examples:[{zh,en}] }`.
- **词性 (part of speech) is hand-curated, not in the xlsx.** `scripts/pos.tsv` (`hanzi<TAB>code`) is
  the source of truth — ~4700 words tagged by hand (codes: `n v mv a adv pron num mw prep conj part
  intj idiom`; bilingual labels in `src/data/pos.js`). `convert.py` reads it and sets each word's `pos`
  (None when untagged — the card shows nothing rather than a wrong guess). `scripts/gen_pos_draft.py`
  is a one-off bootstrap (auto-buckets closed-class words + "to …" verbs, leaves the rest for manual
  review); edit `pos.tsv` by hand, not the draft. FlashCard shows `pos` as a bilingual chip (back, top-right).
- **`src/data/meta.json` is generated too** (by `convert.py`): `{ "{series}-{unit}": { lessonCount,
  wordCount, idPrefix } }`. It's tiny and statically imported, so the home grid, progress rings, and
  Account/Admin totals render **without loading any word data**. `courseRegistry` (sync) is built from
  it. Progress rings avoid loading words via `useProgress().percentKnownByPrefix(idPrefix, wordCount)` /
  `countByPrefixes([...])`, which tally localStorage progress by word-id prefix (ids look like
  `{idPrefix}l{n}-{i}`). Only 我的词 (`everyWord`) and search (`searchAll`) pull full data — both lazy routes.
- **Pinyin data is also generated, not hand-written.** Source = `sources/汉语拼音…网站数据.xlsx`.
  `scripts/convert_pinyin.py` normalizes it into `src/data/pinyin.json` (initials / finals / syllables /
  grid) **and** injects the bilingual pedagogy (English pronunciation analogues, place/manner EN,
  example words) which lives *in that script's maps* — edit the script, not the JSON, then re-run.
  `PinyinView.vue` imports `pinyin.json` directly (lazy-loaded route, so it's not in the main bundle).
- **课文 (Texts) data is generated too.** Source = the six `sources/{新版|旧版}HSK{1,2,3}_逐篇课文双重挖空练习_*.xlsx`.
  `scripts/convert_texts.py` normalizes them into `src/data/texts/{series}-{unit}.json` (+ `texts/meta.json`),
  lazy-loaded via `src/data/texts.js` (its own `import.meta.glob`, kept in a subfolder so the flashcard
  glob never picks it up). Each text carries: `original` (dialogue), `vocab` (numbered-blank cloze +
  answers), `grammar` (a designated clause), `sentences` (every line tokenized for 连词成句), `note`
  (whole-lesson grammar list — identical across a lesson's texts, shown as shared reference), and
  `lines` (per-line reading view `{name, zh, py, en}`). **拼音 + 英文翻译 are hand-authored, not in the
  xlsx** — `scripts/text_gloss.tsv` (`汉字<TAB>拼音<TAB>英文`, keyed by the exact speech line, speaker
  stripped) is the hand-owned truth; `convert_texts.py` merges it into each line's `py`/`en` (blank when
  a line isn't glossed yet). Pinyin is tone-marked (与闪卡一致, colored via `colorPinyin`). TextView shows
  two off-by-default 拼音/En reveal pills in 读原文 (only when that text has gloss). Roll out to more units
  by appending rows to the TSV (dedup is automatic — identical lines across courses share one entry) and
  re-running `npm run convert`; currently covers newhsk3-1. **连词成句
  tokenization uses NO jieba**: `convert_texts.py` max-matches against a lexicon built from the flashcard
  vocabulary + the hand-vetted `scripts/grammar_segments.tsv` (358 grammar clauses, manually segmented —
  edit the TSV, not generated output). 课文 audio (dialogue lines) is generated via
  `gen_audio.py --texts` and uploaded to the same Storage `audio` bucket.
- **Routing** (`src/router/index.js`): hash history (`createWebHashHistory`) so the static build
  works on GitHub Pages without server rewrites. Routes: `/`, `/pinyin`, `/my-words`, `/search`,
  `/login`, `/account`, `/admin`, the course flow `/course/:series/:unit[/lesson/:lesson[/quiz|print]]`,
  and the 课文 flow `/texts`, `/texts/:series/:unit`, `/texts/:series/:unit/:lesson/:n`
  (legacy `/hsk/:level/...` redirects preserved). All routes are behind a login wall when Supabase is configured.
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
- **Audio** (`src/utils/tts.js`) has two independent tiers, both from a **public Supabase Storage
  bucket `audio`** (not bundled in the build):
  - *Words*: pre-generated edge-tts MP3s keyed by md5(hanzi) via a `manifest.json` (`speak(text)`),
    falling back to browser `speechSynthesis` when missing. `scripts/gen_audio.py` + `upload_audio.py`.
  - *Pinyin*: **real human recordings** (hugolpz/audio-cmn, CC-BY-SA — credit shown in PinyinView footer)
    under the `pinyin/` prefix, named `{syllable}{tone}.mp3` (ü→v). Played by filename via
    `playPinyin(stem)` — no manifest. `ne1`/`chi1` come from davin (public domain) as hugolpz's were bad.
  - Both degrade silently. **All backend (Auth, progress sync, audio) is on Supabase, hosted abroad —
    mainland-China devices without a VPN may see intermittent audio/login failures. Not a code bug.**
- **Top nav lives in `AppHeader.vue`** (词汇闪卡 / 拼音 / 我的词, current section highlighted; wraps to a
  scrollable row on mobile). It measures its own height into the CSS var `--appbar-h`; sticky content that
  must sit below the bar (e.g. the pinyin chart's detail card) offsets with `calc(var(--appbar-h) + …)`.
  Account/Admin/Sign-out are in the right-side user-chip dropdown.
- **`.claude/` is gitignored.** It holds a local symlink to the `huashu-design` skill (used only for
  design work) — not part of the app, must not enter the public repo. Also gitignored: **`audio-src/`**
  (generated MP3s that live in Storage, incl. `audio-src/pinyin/`) and **`design-demos/`** (throwaway HTML mockups).
- **`prototype/index.html`** is the original single-file hi-fi prototype (design reference / artifact),
  NOT production code. The Vue app is the real thing.

## Deploy

`git push` updates the source repo; `npm run deploy` (separately) rebuilds and pushes `dist/` to the
`gh-pages` branch, which GitHub Pages serves. Both are needed to fully ship a change.

## Adding HSK 4/5

Add the xlsx + its `TITLES_EN` entry, add a record to `SOURCES` in `scripts/convert.py`, run
`npm run convert`. The home screen placeholder for that level flips to available automatically
(driven by `levels` in `src/data/index.js`).

## Adding a top-level section (e.g. 课文 texts)

Add a `<router-link>` to `mainnav` in `AppHeader.vue`, a route in `src/router/index.js`, and the view.
If the section highlights when active, extend the active-route logic in `AppHeader.vue`
(`COURSE_ROUTES` set / per-item `route.name` checks). Keep labels bilingual (中文 + small English).
