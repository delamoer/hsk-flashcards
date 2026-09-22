# CLAUDE.md

Guidance for AI agents working in this repo. Keep it current when architecture changes.

## What this is

A Vue 3 + Vite web app for **English-speaking beginners learning Chinese**, branded **「学中文 Learn Chinese」**.
It began as a pure flashcard app and is now a **lesson-centric** learning platform with a
**中式典籍·线装 (classical parchment)** visual language (design origin: `design-demos/direction-B.html`;
the whole app's tokens/fonts/paper texture live in `src/styles/main.css`).

**Information architecture — four levels** (see `design-demos/direction-approved.md`):
1. **课程总览 Library** (`/`, `LibraryView.vue`) — pick a course series (书函卡): 标准HSK / 新HSK3.0 /
   会话360 / 生存汉语. (A series may set `single:true` to jump straight to its lessons, skipping 选册;
   currently none do — 生存汉语 is now a normal multi-book series with one book so far.)
2. **选册/级 Books** (`/course/:series`, `SeriesBooksView.vue`) — series-specific 门面 hero + book/level
   covers (its units). Per-series accent color from `courses.js`.
3. **选课 Lessons** (`/course/:series/:unit`, `LessonListView.vue`) — lesson cards + range segmentation;
   per-lesson progress badge (已掌握/学过 X%) from `useProgress`.
4. **课内 hub** (`/course/:series/:unit/lesson/:lesson`, `LessonHubView.vue`) — one lesson, six tabs:
   课文 Read (`ReadPanel`) · 生词表·闪卡 (`FlashcardsPanel`, 网格/专注双模式, reuses `FlashCard.vue`) ·
   词汇详解 (placeholder) · 语法 (`GrammarNotesPanel`) · 练习 (`ExercisesPanel` = 生词挖空 + 连词成句 + 语法) ·
   话题讨论 (placeholder). 课文/生词挖空/连词成句 pull from the 课文 data (`getTextUnit`); the 语法 tab and the
   练习 tab's 语法 mode pull from the grammar data (`getGrammarLesson`, see below) — the latter is independent of
   课文, so 练习 shows up even for lessons with no text (e.g. hsk-4/5), defaulting to 语法 mode there. Each tab
   gracefully shows a "本课暂无…" placeholder when its data is missing.

Top nav (`AppHeader.vue`): **选书 Books** (`/`) · **拼音 Pinyin** (`/pinyin`) · **我的词 My words** (`/my-words`),
朱红印章 logo. 课文 is no longer a top-level nav item — it lives inside each lesson hub; the legacy
`/texts/...` routes still exist (`TextsHomeView`/`TextsUnitView`/`TextView`) but aren't linked from nav.
**我的词** doubles as global search (范围切换: 我的词 / 所有课程).

Two audiences: a teacher in class (projector) and — most of the time — students self-studying,
so the UI must be self-explanatory to weak-Chinese users and is **bilingual (中文 + English)** throughout.

Live: https://delamoer.github.io/hsk-flashcards/ · Repo: `delamoer/hsk-flashcards` (public, gh-pages).

## Commands

```bash
npm run dev        # dev server (localhost:5173)
npm run build      # production build → dist/
npm run convert    # regenerate word data src/data/hsk*.json etc. from xlsx (uv + openpyxl)
npm run deploy     # build + publish dist to gh-pages branch

# Texts + Grammar (not npm scripts — run via uv directly):
uv run --with openpyxl python3 scripts/convert_texts.py            # xlsx → src/data/texts/*.json (hsk/newhsk3)
uv run --with openpyxl --with pypinyin python3 scripts/convert_360.py   # xlsx → src/data/texts/huihua360-*.json (会话360)
uv run --with openpyxl python3 scripts/convert_grammar.py          # xlsx → src/data/grammar/*.json

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
  Some courses add optional fields: **`collocations:[…]`** (常见搭配, 3 per word) — currently only the
  生存汉语 (`survival`) series carries it (from its xlsx col "最常见词语搭配"); FlashCard shows it as a
  compact row on the card back (`.collocs`), hidden for words without it. Add a per-course extra column via
  `col.colloc` in `convert.py`'s SOURCES.
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
  re-running `npm run convert`; now covers all six 课文 units (hsk-1/2/3 + newhsk3-1/2/3, ~1697 lines).
  The **生词挖空 word-bank tiles** carry pinyin + English too, via `vocab.tiles` (`{word:{py,en}}`) baked in
  by `convert_texts.py` from the full flashcard vocab (all units) + the hand-owned `scripts/word_gloss.tsv`
  (fills the ~55 cloze answers that aren't standalone flashcard entries — compounds/single chars/phrases);
  tiles surface it as a hover tooltip (`拼音 · English`), not inline. Both 读原文 and 生词挖空 have the
  off-by-default 拼音/En reveal pills; in 生词挖空 they reveal the **cloze 课文正文** per line (rendered in the
  same speaker|speech two-column layout as 读原文, via `TextView.splitSpeaker`). The pinyin of each blanked
  answer is masked to `____` (`TextView.clozePyHtml`, tone-insensitive match so sandhi/caps align) so the
  拼音 pill doesn't spoil answers; English is shown whole (sentence-level gloss can't be aligned to a blank).
  **`convert_texts.py` never blanks a speaker name** (`heal_name_blanks`): the source cloze blanks the FIRST
  occurrence of an answer, which sometimes lands in a name (王一[雪]：, 周[太太]：) — that blank is un-blanked
  there and either relocated to the word's speech-body occurrence or, if the word only ever appears as a name,
  dropped entirely (blanks then renumbered). **连词成句 items are one SENTENCE each, not one
  whole line** (`build_sentences`): each speech line is split by sentence-final punctuation (。！？；;
  a hand-vetted `grammar_segments.tsv` clause is kept whole), so narratives — a single 40–70-tile monster
  otherwise — become several doable sentences. Sentences that tokenize to <2 or >`MAX_SENT_TOKENS` (15)
  tiles are dropped; sentences containing a 生词挖空 answer word are surfaced FIRST (练完挖空再排句). Each
  sentence has a 听一听 audio-hint button (`say(curSentence.text)`). **连词成句 tokenization uses NO jieba**:
  `convert_texts.py` max-matches against a lexicon built from the flashcard vocabulary + the hand-vetted
  `scripts/grammar_segments.tsv` (358 grammar clauses, manually segmented — edit the TSV, not generated
  output). 课文 audio (读原文 dialogue lines + every 连词成句 `sentences[].text`) is generated via
  `gen_audio.py --texts` (`collect_text_lines`) and uploaded to the same Storage `audio` bucket; split
  sub-sentences without a pre-generated MP3 fall back to browser TTS until audio is regenerated.
- **会话360 课文 come from a DIFFERENT converter** (`scripts/convert_360.py`, not `convert_texts.py`). Source =
  the four `sources/汉语标准会话360句{1,2,3,4}_课文挖空练习整理_第1-8课*.xlsx` → `src/data/texts/huihua360-{1,2,3,4}.json`
  (+ merged into `texts/meta.json`, HSK/newhsk3 entries kept), so `huihua360` gets the same 读原文 (`ReadPanel`)
  + 生词挖空/连词成句 (`ExercisesPanel`) as HSK — no component changes. The 4 files have a **heterogeneous schema**
  (different sheet names 挖空练习/练习内容; 句1/2 carry dialogue 拼音, 句3/4 don't; 句3/4 use `{{blank1}}`
  website templates; 句4 has no 练习类型 column), so the converter does **not** trust the pre-blanked cloze text —
  it REBUILDS both layers from the clean dialogue (对话原文 sheet) + the answer list: **生词挖空** blanks the
  WORD/PHRASE answers over the full dialogue (an exercise counts as word-level when its mean answer length
  ≤ `WORD_AVG`=4; longer = 整句挖空, left to 连词成句), first-occurrence + speaker-name-safe; **连词成句** is
  derived via the SAME `convert_texts.build_sentences` engine (imported), with speaker names added to the
  lexicon so a name-only line drops instead of fragmenting into single chars. Pinyin is zipped line-by-line
  from the source for 句1/2; **句3/4 have no pinyin column, so it's generated with `pypinyin`** (tone-marked,
  `to_pinyin()`) — all four units are now 100% pinyin. **English is hand/AI-authored** in `scripts/text_gloss_360.tsv`
  (`汉字<TAB>English`, keyed by the exact speech line, speaker stripped; ~512 lines) and merged into each line's
  `en` — the 360 source has zero English, so this TSV is the owned truth (edit it, not the JSON, then re-run).
  Both `拼音`/`EN` reveal pills in `ReadPanel` (and 拼音 in 生词挖空) are shown **only when that text actually has
  the data** (`t.hasPy`/`t.hasEn`), so there are no dead toggles. 生词挖空 tiles still get py/en from the flashcard
  wordmap where a cloze answer is a flashcard word. One text = one 会话 (对话); a 课次 has ~2–4 会话 → ~2–4 「课文 N」
  in the picker. 课次 1–8 == our lesson num, matching the flashcard units. Coverage: huihua360-1..4, all 8 lessons each.
- **语法 (Grammar) data is generated too.** Source = the eight `sources/*_语法预习复习主表.xlsx` (HSK1–5 +
  新HSK3.0 第一/二/三册). `scripts/convert_grammar.py` reads each file's first sheet (「语法总表」/「语法语言点总表」,
  one row per grammar point keyed by 课次 = our lesson `num`), grouping points by lesson into
  `src/data/grammar/{series}-{unit}.json` (+ `grammar/meta.json`), lazy-loaded via `src/data/grammar.js`
  (own `import.meta.glob("./grammar/*-*.json")`, dash pattern excludes meta). Run:
  `uv run --with openpyxl python3 scripts/convert_grammar.py`. Each point: `{ id, name, pinyin, type,
  tier?(HSK4), explainEn, structure, examples:[{zh,en}], exercises:[{q,a}], note, source }`. Coverage:
  hsk-1..5 + newhsk3-1..3 (~495 points); other series/units gracefully show placeholders. Two bilingual
  fields are hand-authored inside `convert_grammar.py` and merged at build time: `noteEn` (English for each
  中文 备注, from `scripts/grammar_note_en.tsv`) and `typeEn` (English for each 语法类型, from the in-script
  `TYPE_EN` map covering all 157 type strings). Both the 语法 tab chip and 练习 语法-mode heading show 中文 + English. The 语法 tab
  (`GrammarNotesPanel`) renders these as cards (讲解/结构/例句 + expandable 练习 with reveal-answer); falls back
  to the 课文 `note` list only when a lesson has no grammar data. The 练习 tab's 语法 mode (`ExercisesPanel`,
  `mode:'gp'` — note the pre-existing `mode:'grammar'` is 连词成句/Reorder, NOT grammar points) lists the same
  exercises as **no-typing** cards: 看答案 reveal → self-assess 会了/再练 (progress counts 会了). Beginners can't
  type well, so there's no input. Each exercise's Chinese instruction prefix (填空/翻译/排序…) is shown bilingually
  via `instr`/`instrEn`/`body` (split in `convert_grammar.py` using the in-script `Q_INSTR_EN` map, 47 prefixes;
  the ~4% unmapped/compound instructions fall back to the raw Chinese question).
- **Routing** (`src/router/index.js`): hash history (`createWebHashHistory`) so the static build
  works on GitHub Pages without server rewrites. Course flow (four levels): `/` (LibraryView) →
  `/course/:series` (SeriesBooksView) → `/course/:series/:unit` (LessonListView) →
  `/course/:series/:unit/lesson/:lesson` (LessonHubView), plus `.../quiz` `.../print`. Also `/pinyin`,
  `/my-words`, `/search`, `/login`, `/account`, `/admin`, the legacy 课文 flow `/texts[/:series/:unit[/:lesson/:n]]`
  (kept working, not in nav), and legacy `/hsk/:level/...` redirects. All routes are behind a login wall
  when Supabase is configured. **App-shell theming** (`App.vue`) still applies `seriesTheme(route.params.series)`
  per-series accent on top of the global classical base. **Dead code from the pre-redesign flow**
  (`HomeView.vue`, `LessonView.vue`, `LessonCard.vue`, `CourseUnitCard.vue`) is unused/unrouted — safe to delete.
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
  pinyin into syllables and wraps each in `.t1`–`.t4`/`.t0`. The palette (`--tone1..4`/`--tone0` in
  `main.css`) is an **earthy/muted set** (朱砂红/青绿/黛蓝/黛紫/暖褐灰) retuned to sit in the classical
  scheme — still 4 distinct hues for the pedagogy, not the bright Pleco/Material colors. **Default OFF**
  (`useSettings.toneColors: false` — users opt in; existing on-users keep their stored choice, no forced
  migration). Colors are fixed across themes; togglable via `useSettings.toneColors`.

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
- **Top nav lives in `AppHeader.vue`** (选书 Books / 拼音 / 我的词, 朱红印章 logo; current section highlighted
  — `COURSE_ROUTES` set covers the whole course flow incl. `series`; wraps to a scrollable row on mobile).
  It measures its own height into the CSS var `--appbar-h`; sticky content that must sit below the bar
  (e.g. the pinyin chart's detail card) offsets with `calc(var(--appbar-h) + …)`.
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
