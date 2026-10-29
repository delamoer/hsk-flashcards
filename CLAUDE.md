# CLAUDE.md

Guidance for AI agents working in this repo. Keep it current when architecture changes.

## What this is

A Vue 3 + Vite web app for **English-speaking beginners learning Chinese**, branded **「学中文 Learn Chinese」**.
It began as a pure flashcard app and is now a **lesson-centric** learning platform with a
**中式典籍·线装 (classical parchment)** visual language (design origin: `design-demos/direction-B.html`;
the whole app's tokens/fonts/paper texture live in `src/styles/main.css`).

**Information architecture — four levels** (see `design-demos/direction-approved.md`):
1. **课程总览 Library** (`/`, `LibraryView.vue`) — its 「01 教材」 section is `TextbookCarousel.vue`: a 3D coverflow
   shelf + ink-wash background swap, driven entirely by `courseRegistry` (no per-course code; a series without a
   cover / band image falls back to a series-color cover / wash; >7 series swaps the dots for a 「03 / 12」 counter).
   All home sections share one height (`--sec-h` on `.sec`, sized for the shelf) — raise it rather than squeezing
   the shelf. Pick a course series (书函卡): 标准HSK / 新HSK3.0 /
   会话360 / 生存汉语 / 新时代汉语口语 / 走遍中国. (A series may set `single:true` to jump straight to its lessons, skipping 选册;
   currently none do — 生存汉语 is now a normal multi-book series with one book so far.)
2. **选册/级 Books** (`/course/:series`, `SeriesBooksView.vue`) — series-specific 门面 hero + book/level
   covers (its units). Per-series accent color from `courses.js`.
3. **选课 Lessons** (`/course/:series/:unit`, `LessonListView.vue`) — lesson cards + range segmentation;
   per-lesson progress badge (已掌握/学过 X%) from `useProgress`.
4. **课内 hub** (`/course/:series/:unit/lesson/:lesson`, `LessonHubView.vue`) — one lesson, six tabs:
   课文 Read (`ReadPanel`) · 生词表·闪卡 (`FlashcardsPanel`, 网格/专注双模式, reuses `FlashCard.vue`) ·
   词汇详解 (`VocabPanel`, 常见搭配 list) · 语法 (`GrammarNotesPanel`) · 练习 (`ExercisesPanel` = 生词挖空 + 连词成句 + 语法) ·
   话题讨论 (`DiscussionPanel`). 课文/生词挖空/连词成句 pull from the 课文 data (`getTextUnit`); the 语法 tab and the
   练习 tab's 语法 mode pull from the grammar data (`getGrammarLesson`, see below) — the latter is independent of
   课文, so 练习 shows up even for lessons with no text (e.g. hsk-4/5), defaulting to 语法 mode there. 话题讨论 is
   independent too (`getDiscussionLesson`), so it also works for text-less units. Each tab
   gracefully shows a "本课暂无…" placeholder when its data is missing.

Top nav (`AppHeader.vue`): **选书 Books** (`/`) · **拼音 Pinyin** (`/pinyin`) · **语法 Grammar** (`/grammar`) · **中国风 Music** (`/music`) · **我的词 My words** (`/my-words`),
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
#   ORDER MATTERS: convert_texts.py rewrites texts/meta.json from scratch (dropping the huihua360
#   entries); convert_360.py merges them back. Always run 360 after texts, never texts alone.
uv run --with openpyxl python3 scripts/convert_grammar.py          # xlsx → src/data/grammar/*.json
uv run --with openpyxl --with pypinyin python3 scripts/convert_discussion.py  # xlsx → src/data/discussion/*.json (话题讨论)

# Pinyin section (not npm scripts — run via uv directly):
uv run --with openpyxl python3 scripts/convert_pinyin.py            # xlsx → src/data/pinyin.json
uv run --with openpyxl --with httpx python3 scripts/convert_pinyin.py --download   # + fetch audio → audio-src/pinyin/
SUPABASE_URL=… SUPABASE_SERVICE_KEY=sb_secret_… \
  uv run --with httpx python3 scripts/upload_pinyin.py             # upload audio-src/pinyin/ → Storage pinyin/
#   upload_pinyin.py --only ne1 chi1   # force re-upload specific stems (upsert)
```

## Architecture / data flow

- **Data is generated, not hand-written.** Source of truth = the xlsx files in `sources/`, named
  **`{系列}_{册}_{类型}.xlsx`** so a series' branches sort together and a missing branch is obvious at a
  glance. 系列/册: `HSK{1..6}` · `新HSK3.0_第{一,二,三}册` + `新HSK3.0_第四册{上,下}`（教材第四册分上下两本，站内合为一册）·
  `标准汉语会话360句{1..4}` · `生存汉语一本通` · `新时代汉语口语_初级{上,下}`（series `kouyu`，unit 1/2，今后的课文/语法/聊天问题照此命名）· `新时代汉语口语_中级{上,下}`（unit 3/4）· `走遍中国_第四册`（series `zoubian`, unit = 册号）· `汉语拼音`. 类型 (exactly seven): `词汇闪卡表` ·
  `课文挖空练习` · `课文原文`（只有正文、没有挖空，HSK5/6、走遍中国、生存汉语）· `语法主表` · `语法零基础版` · `聊天问题` ·
  `常见搭配`（新HSK3.0 第一/二/三册 + HSK5；same layout as the 闪卡表 + 搭配 in col 11 — `convert.py`'s `COLLOC_SOURCES`
  matches it onto the 闪卡表 words by (课次, 汉字, 拼音), so ids stay the 闪卡表's; unmatched rows are warned.
  `HSK5_常见搭配.xlsx` is also hand-sorted in textbook order, so it's in `ORDER_BY_COLLOC`: its row order
  becomes the display order — the old 闪卡表 is kept only so word ids don't move）. **Keep this convention when adding a book** —
  the grammar/discussion converters map filename → (series, unit) by regex and **silently skip** a name
  they don't recognize. **Several books may map to ONE unit** (新HSK3.0 第四册上 = 课次1–10, 第四册下 =
  11–20): all four converters group sources by (series, unit) and merge their lessons before writing,
  so a second file for the same unit extends it instead of silently overwriting it. `scripts/convert.py` normalizes the 词汇闪卡表 files into `src/data/{series}-{unit}.json`.
  **Never edit `src/data/*.json` by hand** — edit the xlsx (and English titles in `convert.py`'s
  `TITLES_EN`), then run `npm run convert`.
  **Word order = textbook order.** Some 词汇闪卡表 list words alphabetically by pinyin (all of 新HSK3.0 第一册 /
  HSK5, most of HSK4 / 新HSK3.0 第四册 — machine-sorted, 汉语/汉字 even land last because of the capital H).
  Units in `convert.py`'s `REORDER_BY_TEXT` get their words re-sorted by first appearance in the lesson's
  课文 (`src/data/texts/{key}.json`, so regenerate texts first if they changed); a short word inside a longer
  lesson word (证 in 签证) is skipped, `屋(子)` matches 屋子/屋, words absent from the text stay at the end.
  **Ids are assigned before sorting** — progress is keyed by id, so never renumber ids when reordering.
  When adding a book, check its word order against the text and add the unit to the set if it's alphabetical.
- **Course data is lazy-loaded, one chunk per unit.** `src/data/index.js` uses
  `import.meta.glob("./*-*.json")` so each `{series}-{unit}.json` is a separate chunk fetched on
  demand (kept out of the main bundle). Because of this, the data accessors are **async**:
  `getUnit` / `getLesson` / `allWords` / `everyWord()` / `searchAll()` all return Promises — views
  `await` them into a ref (with a small `loading` state). `matchWord()` stays sync/pure.
  Word shape: `{ id, num, hanzi, pinyin, meaning, pos, type("core"|"supplement"|null), note, examples:[{zh,en}] }`.
  Some courses add optional fields: **`collocations:[…]`** (常见搭配, 3 per word) — 生存汉语 (`survival`,
  its own 闪卡表 col "最常见词语搭配", via `col.colloc` in `convert.py`'s SOURCES) and 新HSK3.0 第一/二/三册
  (separate `*_常见搭配.xlsx`, via `COLLOC_SOURCES`). Shown ONLY in the 词汇详解 tab (`VocabPanel`: one
  row per word — 词头 left, the 3 collocations side by side as tappable chips (tap = play, no 🔊 icons), the
  head word marked 朱红 inside each). 备注 is NOT shown there — in these units it's mostly editorial
  (「教材词语表另见：第8课」「教材标*专名」); the card back deliberately doesn't show collocations (kept clean). Lessons whose words have none show a "本课暂无常见搭配" placeholder.
  **新时代汉语口语 (`kouyu`)**: its 备注 column is editorial ("上册·课文词语表｜PDF第13页｜…") — read only as
  the core/supplement type (课文词语/拓展词语, `classify_type`), never shown as a note. Its 例句2 was rewritten by
  hand in Oct 2026 (the source's were pronoun-swapped copies of 例句1) and many are two-line exchanges
  `A：…B：…`: FlashCard renders one line per turn (`turns()`) and speaks them with the A/B labels stripped
  (`speechOf()`); `gen_audio.py`'s `example_speech()` strips them the same way so the manifest key matches.
  A unit can set `lvl` in `courses.js` to override the book-cover numeral (kouyu shows 上/下), and
  `levelWord` to override the series' small label above it (kouyu 3/4 = 中级 vs the series' 初级).
  **走遍中国 (`zoubian`, Discover China; only 第四册 so far, 12 单元 = 12 lessons)**: the three source files came
  from OCR of the book and were repaired by hand/AI in Oct 2026 — every change is logged IN the workbooks
  (词表「词汇闪卡」sheet 校对备注 column; 课文 and 语法 each have a 「网站校对记录」 sheet), so check there before
  "fixing" something. The 词表 (`闪卡导入版` sheet) has no 课名 column (titles in `TITLES_ZH`/`TITLES_EN`),
  its 3 collocations sit in their own columns (`col.colloc` may be a LIST of column indexes), and its two
  例句 columns were written for the site (the book has none). 12 OCR fragment/duplicate rows were deleted
  (627 → 615 words). Row-level ⚠ notes mark entries worth checking against the printed book.
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
- **课文 (Texts) data is generated too.** Source = the nine `sources/HSK{1,2,3,4}_课文挖空练习.xlsx` + `sources/新HSK3.0_第{一,二,三}册|第四册{上,下}_课文挖空练习.xlsx`
  (teacher sheet 「教师答案版」, columns located **by header text** — the HSK4 file has an extra 「册」 column
  and HSK1/新一册 spell the grammar column 「语法/核心句式挖空」; add an alias to `COLS` if a new file varies),
  plus `sources/HSK{5,6}_课文原文.xlsx` (`PROSE_SOURCES`, `convert_prose`): essays with no cloze at all — one
  text per lesson, one paragraph per reading line, no speaker parsing (a leading 「老鼠说：」 is narration),
  `vocab`/`grammar` = null, so they get only 读原文 + 连词成句. `ExercisesPanel` hides 生词挖空 for a text
  without `vocab` and `fixMode()` falls through to the first sub-mode the lesson actually has.
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
  re-running `npm run convert`. **All 14 课文 units are fully glossed** (3594 of 3596 lines; the 2
  gaps are newhsk3-2 lines that are literally 「……」 in the textbook). hsk-5/6 lines are whole essay
  paragraphs (one TSV row each, up to ~300 chars); their speaker-like prefixes (记者：/乔布斯：) are part
  of the text and are glossed too. hsk-4/5/6 (985 lines) were hand-written in Oct 2026 and cross-checked
  against pypinyin the same way as the grammar pinyin. Idioms are written as two words
  (`chéngqiān shàngwàn`), not hyphenated; approximate numbers keep the hyphen (`qī-bā`). None of the xlsx carry 拼音/英文
  columns for newhsk3-4 — its 371 lines were authored into the TSV by hand. `hasPy`/`hasEn` are computed
  per text in the component (`lines.some(l => l.py)`), not stored, so the pills appear as soon as a
  line is glossed. **Do NOT bulk-generate this pinyin with pypinyin** — it splits per character rather
  than per word (`wǒ men` vs `Wǒmen`), skips sentence/proper-noun capitals, keeps full-width punctuation
  and gets 一/不 sandhi wrong (`bù tài` for 不太). The TSV convention is word-grouped, capitalized,
  half-width punctuation, erhua attached, neutral tones unmarked, sandhi applied.
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
  output), minus `LEX_EXCLUDE` — a short hand-kept set of real flashcard words that only ever appear
  inside a longer phrase in our texts, where greedy left-to-right matching would eat the wrong prefix
  (不便宜 → 不便|宜). Adding a book can introduce such a word; check the 连词成句 diff of OTHER units
  after a conversion and list the offender there once you've confirmed it never occurs standalone. After max-match,
  `merge_tiles()` post-processes machine-segmented sentences (hand `grammar_segments.tsv` rows are final and
  skip it): adjacent tiles that spell an entry of the hand-vetted **`scripts/merge_words.txt`** become one
  (规|模 → 规模, 周|瑜 → 周瑜 — real words / names the lexicon lacks), then a lone 儿 joins the tile before it
  and digit runs join. It only JOINS whole tiles, so it can't create a tile straddling a word boundary.
  Grammar collocations (V+结果补语, 动宾, 数量, 不X) are deliberately NOT in that list — split tiles are the
  practice. `PUNCT` must hold the FULL-WIDTH quotes “”‘’ (it once had ASCII ones, so quotes became tiles).
  The Oct 2026 audit method (re-run after adding a book): segment-compare every `sentences[].tokens` against
  jieba (reference only) — a tile that partially overlaps a jieba word is a crossing error (有时|间, 要不|要,
  每 个人) → fix per sentence in grammar_segments.tsv; runs of single-char tiles that form a CC-CEDICT word
  are merge_words.txt candidates — review each against its sentence before adding (的|话, 好|在 are traps). 课文 audio (读原文 dialogue lines + every 连词成句 `sentences[].text`) is generated via
  `gen_audio.py --texts` (`collect_text_lines`) and uploaded to the same Storage `audio` bucket; split
  sub-sentences without a pre-generated MP3 fall back to browser TTS until audio is regenerated.
- **走遍中国 课文** (`convert_texts.py`'s `DC_SOURCES` → `convert_dc`): `走遍中国_第四册_课文原文.xlsx`, sheet
  「课文主表」 (one row per text) + 「逐段明细」 (one row per paragraph, keyed by text_id). Each 单元 = one lesson with
  the Lesson 1 listening dialogue (speaker lines) + 1–3 Lesson 2 readings (letters, notices, postcards — `prose`).
  No cloze, so 读原文 + 连词成句 only. **Unlike every other book its 拼音/英文 are NOT in `text_gloss.tsv`**: they are
  the 「拼音」「英文」 columns of 逐段明细 (speech only, speaker stripped) — edit them there. The 12 dialogues were
  proofread against the book; the 21 readings were OCR wrecks rebuilt from context (no PDF to compare) — gaps are
  shown as 「……」 and every guess is listed in the 「网站校对记录」 sheet. Speaker names join the lexicon for this
  book so 永民/史蒂夫 tile whole.
- **生存汉语 课文** (`TURN_SOURCES` → `convert_turns`): `生存汉语一本通_课文原文.xlsx`, sheet 「对话逐句」 = one row
  per speaking turn (课号/课名/说话人/中文发言 + 「拼音」「英文」 columns — the gloss lives there, not in text_gloss.tsv).
  课号 4–39 = the flashcard lesson nums (1–3 are pinyin lessons with no dialogue); one 「情境对话」 text per lesson.
  Speakers were checked against the book; the wording was proofread from context only (Oct 2026, 108 fixes, ⚠ ones
  in the 「网站校对记录」 sheet) — the book's own 「最终验收」 is still 待终校, so check there before trusting a line.
- **会话360 课文 come from a DIFFERENT converter** (`scripts/convert_360.py`, not `convert_texts.py`). Source =
  the four `sources/标准汉语会话360句{1,2,3,4}_课文挖空练习.xlsx` → `src/data/texts/huihua360-{1,2,3,4}.json`
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
- **语法 (Grammar) data is generated too.** Sources = the eleven `sources/*_语法主表.xlsx` (HSK1–6 +
  新HSK3.0 第一/二/三册 + 第四册上/下) **plus nine `sources/*_语法零基础版.xlsx`** (HSK1/2 + 新HSK3.0 第一/二/三册 + 标准汉语会话360句1–4).
  会话360 has ONLY a 零基础版 (no 主表); its 基本结构 English sits in its own column 「Basic Structure (English)」
  (`col_index` → `structureEn`) instead of a newline-packed cell, and its examples carry NO pinyin — those
  197 lines live in `grammar_example_pinyin.tsv` like the hsk-3+ ones. Its 例句 were audited in Oct 2026
  (4.6.1 如果…就… had been a word-for-word copy of 3.4.2 要是…就…, now rewritten).
  The 零基础 files are an enriched rewrite of the SAME point sets (counts match exactly), adding pinyin to
  every example and an English gloss to 基本结构 — both packed into one cell separated by a **newline**,
  split by `split_bilingual()` into `examples[].py` and `structureEn`. Version choice is made per BOOK
  (filename minus the 类型 suffix), not per unit, so 第四册上 getting a 零基础版 later won't knock out 第四册下.
  hsk-3/4/5/6 and newhsk3-4 have no 零基础版 (and huihua360's has no example pinyin), so those two fields come from **hand-authored TSVs** instead:
  `scripts/grammar_structure_en.tsv` (431 结构英文) and `scripts/grammar_example_pinyin.tsv` (1486 例句拼音),
  both 中文<TAB>译文, loaded by `load_zh_en_tsv()` and used **only as a fallback** — a 零基础版's own values
  always win. Every point now has structureEn and every example has pinyin (744 points / 2232 examples).
  Same rule as 课文: do NOT bulk-generate this pinyin with pypinyin (per-character, no sandhi, no capitals,
  wrong readings like 谁 shuí / 参加 shēnjiā / 行不通 háng). It was written by hand and then cross-checked
  syllable-by-syllable against pypinyin, reviewing every disagreement (440 for hsk-3/4/5 + newhsk3-4, 157 for hsk-6, ~100 for huihua360 — all neutral tone / sandhi / erhua / 得děi) — the script for that lives
  nowhere, but the check is: normalise both to a letters-only string and diff. `scripts/convert_grammar.py` reads each file's first sheet (「语法总表」/「语法语言点总表」,
  one row per grammar point keyed by 课次 = our lesson `num`), grouping points by lesson into
  `src/data/grammar/{series}-{unit}.json` (+ `grammar/meta.json`), lazy-loaded via `src/data/grammar.js`
  (own `import.meta.glob("./grammar/*-*.json")`, dash pattern excludes meta). Run:
  `uv run --with openpyxl python3 scripts/convert_grammar.py`. Each point: `{ id, name, pinyin, type,
  tier?(HSK4), explainEn, structure, structureEn?, examples:[{zh,en,py?}], exercises:[{q,a}], note, source }`.
  走遍中国 第四册 (`走遍中国_第四册_语法零基础版.xlsx`, 48 points) is keyed by 「单元」 (aliased to 课次), keeps its
  example pinyin in 「例句k（拼音）」 columns and note English in 「教学备注（英文）」 (both read straight from the xlsx),
  and its exercises are all 英译汉 — an English prompt + Chinese 参考答案, tagged `instr: 翻译`.
  **进阶练习 (harder tap-to-answer items)**: students found the books' own 练习 too easy (~600 填空 blanks were the
  heading word itself, 46% of answers copied the examples, distractors like 了/吗). A grammar workbook may carry an
  optional sheet 「进阶练习」 (语法编号 · 题型 辨析/完成/找错/翻译 · 题干 · 选项A–D · 答案 · 解析（中文/英文）; `load_advanced`).
  When a point has rows there they REPLACE its non-translation 练习; its 翻译 is kept unless a 翻译 row replaces it.
  Choice items become `{kind:"choice", options, answer, explain, explainEn}`; `ExercisesPanel` then shows tap-to-answer
  cards (instant check + bilingual explanation, options shuffled per session, 重练错题), defaulting to 综合练习 (all
  shuffled, grammar-point heading HIDDEN — it gives a 辨析 answer away) with 分项练习 as the grouped view. Units without
  the sheet keep the old reveal + self-check UI. **All 15 grammar units have it** (Oct 2026: 2376 choice items = 3 per
  point, + ~560 replacement translations; written by agents, then a correctness + "too easy" review — no distractor may
  be eliminable without knowing the point — and a final uniqueness check). The sheet lives in the workbook the converter
  actually reads (零基础版 where one exists, else 主表; 第四册上/下 each hold their own points). **Difficulty is
  level-matched**, not uniform: T1 (HSK1 / 新一册 / 360-1) ≤12-char sentences from the book's own vocab, T2 (HSK2 /
  新二册 / 360-2·3) ≤16, T3 (HSK3 / 新三册 / 360-4) ≤20, T4 (HSK4 / 新四册 / 走遍中国) ≤25, HSK5/6 formal near-synonyms.
  T1/T2 辨析/完成 rows carry an optional 「题干（英文）」 column (`stemEn`, shown under the stem) so beginners can follow
  the sentence. Contested rules (的/地/得 spelling, colloquial variants) were deliberately avoided as the sole key.
  **Exception — the six beginner books (HSK1/2, 新HSK3.0 第一/二册, 会话360 1/2) are translation-ONLY** (`TRANSLATE_ONLY` in
  `convert_grammar.py`): the teacher found even level-matched choice items too hard for them. Their 「进阶练习」 sheet holds
  each point's COMPLETE 英译汉 list (2–3 per point, covering every point, brief English hints like "(use 两)"), no choice
  rows; the converter drops every non-translation exercise for these units. After a student found a wrong key, all 1743
  remaining choice items got a blind solve (answer hidden) + an adversarial "refute the key" pass; 15 items were fixed.
  When editing items by script, assert the OLD cell text before replacing — a fix script once overwrote the correct
  option instead of a distractor.
  Coverage: hsk-1..6 + newhsk3-1..4 + huihua360-1..4 + zoubian-4 (792 points); other series/units
  gracefully show placeholders. Two bilingual
  fields are hand-authored inside `convert_grammar.py` and merged at build time: `noteEn` (English for each
  中文 备注, from `scripts/grammar_note_en.tsv`) and `typeEn` (English for each 语法类型, from the in-script
  `TYPE_EN` map covering all 165 type strings). Both the 语法 tab chip and 练习 语法-mode heading show 中文 + English. The 语法 tab
  (`GrammarNotesPanel`) renders these as cards (讲解/结构/例句 + expandable 练习 with reveal-answer); falls back
  to the 课文 `note` list only when a lesson has no grammar data. The 练习 tab's 语法 mode (`ExercisesPanel`,
  `mode:'gp'` — note the pre-existing `mode:'grammar'` is 连词成句/Reorder, NOT grammar points) lists the same
  exercises as **no-typing** cards: 看答案 reveal → self-assess 会了/再练 (progress counts 会了). Beginners can't
  type well, so there's no input. Each exercise's Chinese instruction prefix (填空/翻译/排序…) is shown bilingually
  via `instr`/`instrEn`/`body` (split in `convert_grammar.py` using the in-script `Q_INSTR_EN` map, 58 prefixes;
  the ~4% unmapped/compound instructions fall back to the raw Chinese question).
- **语法汇总 Grammar index** (`/grammar`, `GrammarIndexView.vue`) — every grammar point of every book in one place:
  教材/册/课/类型 filters + fuzzy search (中文 · 拼音 with or without tones · English; 省略号 is a wildcard so 越来越
  finds 越…越…; optional 「也搜例句」). No query → grouped by 书·课 in book order; with a query → one list ranked by
  `rank()` (name starts with the term first). Filters are mirrored in `?q=&s=&b=&l=&t=&eg=` so 返回 from a lesson lands
  on the same view. Desktop (>1000px): list on the left flowing with the page (deliberately NO inner scroll box) + a
  sticky 展台 on the right showing the selected card (↑↓ / 上一条·下一条); narrow screens tap a row to expand it in place.
  「全部展开」 needs a book picked. **The card is `GrammarCard.vue`, shared with the lesson hub's 语法 tab** (only the
  「出自…去这一课学习」 footer slot and the `large` size are index-only) — change the card there, both follow. The
  list/search runs on `src/data/grammar/index.json` (~110 KB gz, list fields only, dynamic-imported by
  `src/utils/grammarSearch.js`), **written by `convert_grammar.py` in the same run** — adding a book's grammar needs no
  extra step; full point data is lazy-loaded per book when a card opens. 「去这一课学习」 links
  `…/lesson/:n?tab=grammar` (`LessonHubView` honors `?tab=`). No audio on grammar examples (taught in class).
- **话题讨论 (Discussion) data is generated too.** Source = the fourteen `sources/*_聊天问题.xlsx`
  (HSK1–5 + 新HSK3.0 第一/二/三册 + 第四册上/下 + 标准汉语会话360句1–4). `scripts/convert_discussion.py` → `src/data/discussion/{series}-{unit}.json`
  (+ `discussion/meta.json`), lazy-loaded via `src/data/discussion.js` (same glob/meta shape as grammar).
  One row = one 课文, grouped by 课次: `{ num, name, vol?, group?, texts:[{ title, kind?, topic?,
  questions:[{zh,py}], hints:[] }] }`. Coverage: hsk-1..5 + newhsk3-1..4 + huihua360-1..4 — 1938 questions.
  **Filename → (series, unit) is decided by `parse_target`; an unmatched name is silently skipped**, so a
  source must follow the `sources/` naming convention: `HSK{n}_聊天问题` / `新HSK3.0_第{一二三四}册[上下]?_聊天问题`
  / `标准汉语会话360句{n}_聊天问题`.
  The 360 sheets label the topic column 「课文场景 / 话题（教师用）」 — already aliased in `col_index`. Two deliberate
  omissions: the source's **「教学提示」 column is never exported** (it's written for the teacher —
  "不询问学生私人婚姻计划…" — and must not reach the student UI), and there is **no English** (not in the
  source; not generated). 拼音 IS generated with pypinyin (`to_pinyin`, same format as `convert_360.py`),
  surfaced behind an off-by-default 拼音 pill in `DiscussionPanel`, matching the ReadPanel convention.
  Header rows sit on sheet row 4 (title + blurb + blank above), and some sheets trail 说明/URL rows —
  `header_row()` finds the header and non-integer 课次 rows are skipped.
- **中国风 Music** (`/music`, `MusicView.vue`) — 43 Chinese-style pop songs as **embedded YouTube MVs**
  (`youtube-nocookie.com`, official artist/label channels only). We host NO audio/video: the songs are
  commercially copyrighted (a public repo/site must not serve them — and a DMCA on GitHub would take the
  whole site down), and embedding costs our Supabase/GitHub bandwidth nothing. Don't hide the player to
  make it "audio only" — YouTube's API policy forbids separating audio from video. Data =
  **`src/data/music.json`, hand-owned** (the one `src/data` JSON that is NOT generated — edit it directly):
  `groups` (周杰伦 12 / 更多歌手 16 / 仙侠·武侠影视 15) → `songs`, numbered straight through (`cn()` → 一…四十三; ?song= indexes
  that flat order, so inserting a song shifts later numbers). Per song YouTube `id`, optional `live`
  (shows a 现场版 tag — 大鱼/半壶纱 have no official studio upload), 中/拼音/English title, artist, bilingual `note`/`noteZh` (fact-checked against
  Wikipedia, Oct 2026), and 3 「歌里的词」 `words` that play via `speak()` — run `gen_audio.py --music`
  after editing them. Full lyrics are copyrighted too: quote single words/lines only, never whole lyrics.
  Layout: sticky 曲目册 left + 卷轴播放台 right (竖排题签 + 印章), collapsing to a chip strip on mobile;
  `?song=N` (1-based) deep-links a song, picking one autoplays it (never on first load). The player is
  a poster (MV cover + 朱红 play seal) until pressed, then ONE YouTube IFrame Player API player is reused
  (`loadVideoById`); its ENDED event drives the play modes 播完停止 (default — the teacher talks after
  each song) / 顺序播放 / 单曲循环 / 随机播放 (unheard-first), remembered in localStorage
  `hsk-music-mode-v1`. If `iframe_api` fails to load (8 s timeout) it falls back to a plain embed with
  no mode button. When adding a
  song, check the video allows embedding (`youtube.com/oembed?url=…` returns 200) and prefer the artist's
  verified channel; the 牡丹江 MV is on its label's channel (阿尔发音乐), 苏公堤 has no official upload
  (a verified lyric channel is used). Rejected for lack of an official upload: 银临《牵丝戏》.
  **Deliberate exceptions (the user's call — a nice MV beats an official-but-dull upload):** 卷珠帘 (#28) uses an ink-wash animation upload (`34UrxssTJs4`);
  the **仙侠·武侠影视** group (#29–43: wuxia/xianxia TV, film and animation songs — 仙剑一/三, 神雕
  1995/2006, 倚天 1994, 新流星蝴蝶剑 1993, 笑傲江湖 1990, 秦时明月 animation) deliberately uses **drama/film-clip MVs** (the user wants
  the footage; 沧海一声笑 = the 黄霑·徐克·罗大佑 trio version over varied film footage — a pinyin-subbed upload was rejected because it's one static frame). Mandarin
  only: 神话·情话 is the Cantonese HK theme, so its Mandarin twin 天下有情人 is used; 归去来 (胡兵) was that series' mainland theme. Not every song here is
  中国风 in the strict sense (爱似流星, 六月的雨 are drama ballads) — the user picked them by name — official only where the label's MV IS drama footage (华研's
  逍遥叹/六月的雨); the rest are fan cuts. Swap-ins if one is taken down: 杀破狼 → 华研 `8EOikv7M-hg`, 一直很安静 →
  华研 `OC6k-fm09CQ` (both show the singers, not the drama). New songs/groups are appended last so earlier
  ?song= numbers stay put; 大鱼 uses the film-animation MV from a personal channel
  (LucasMusic, `Rk_KPf934aA`) because the official MV was never posted by the studio/artist — if it gets
  taken down, fall back to ZhouShen Official's live `MKprukYXPiQ` (+ `"live": true`). 三生三世 is 苏运莹's
  live cover from her verified channel (a static show-cover image, not an MV); 张杰's original is
  `wHmBpg_oq7I` (太合音乐).
- **Routing** (`src/router/index.js`): hash history (`createWebHashHistory`) so the static build
  works on GitHub Pages without server rewrites. Course flow (four levels): `/` (LibraryView) →
  `/course/:series` (SeriesBooksView) → `/course/:series/:unit` (LessonListView) →
  `/course/:series/:unit/lesson/:lesson` (LessonHubView), plus `.../quiz` `.../print`. Also `/pinyin`,
  `/music`, `/my-words`, `/search`, `/login`, `/account`, `/admin`, the legacy 课文 flow `/texts[/:series/:unit[/:lesson/:n]]`
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
    **Whenever you add content with a 🔊, add a collector and regenerate** — the scopes are
    `--all` (words + examples), `--texts` (课文 lines + every 连词成句 sentence; globs `texts/*-*.json`,
    so a new 课文 unit needs no code change), `--discussion` (话题讨论 questions), `--collocations`
    (词汇详解 搭配; any unit whose words carry `collocations`) and `--music` (中国风 「歌里的词」). Generating only
    writes to the gitignored `audio-src/`; the site keeps falling back to robot TTS until
    `upload_audio.py` pushes the new MP3s + manifest to Storage (idempotent, skips existing).
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
