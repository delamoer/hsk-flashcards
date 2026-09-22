---
version: beta
name: 学中文 Learn Chinese（典籍·线装 · classical parchment）
description: A lesson-centric web app for English-speaking beginners studying Chinese, dressed in a 中式典籍·线装 (Chinese classical thread-bound book) visual language — warm parchment (#f5efe6), 朱红 cinnabar (#c0392b) seals, 描金 gold (#c8962a) frames, and 石青/青玉 jade (#2d6a4f) accents. The mood is quiet, literary, and dignified rather than childish or neon. Chinese headings are set in a serif (Noto Serif SC); English chrome uses Cormorant Garamond (italic sub-labels) + Cinzel (small-caps kickers). The paper floor carries a faint fractal-noise 宣纸 texture and vertical 帘纹 lines. The single most important element is still the flashcard: front shows the 汉字 ONLY (huge serif, on parchment with a gold inner frame); back reveals tone-colored pinyin, English meaning, examples, and — for courses that carry them — 常见搭配 collocations. Pinyin is colored by tone using the Pleco-standard scheme (1 red / 2 green / 3 blue / 4 purple / neutral gray). All chrome is bilingual (中文 label + smaller English sub-label). Per-series accent colors (标准HSK 朱 / 新HSK3.0 紫 / 会话360 青 / 生存汉语 琥珀) recolor --primary on top of the shared classical base.

colors:
  primary: "#c0392b"
  primary-active: "#a52c20"
  primary-strong: "#8b2a1f"
  primary-soft: "#f3e1d0"
  gradient-front-start: "#c0392b"
  gradient-front-end: "#8b2a1f"
  accent: "#a9791a"
  accent-active: "#8a641f"
  accent-soft: "#f1e4c8"
  success: "#2d6a4f"
  success-soft: "#dbeee2"
  review: "#b8862f"
  review-soft: "#f6ecd2"
  star: "#c8962a"
  star-soft: "#f7eccf"
  error: "#c0392b"
  ink: "#1a1208"
  body: "#4a3d2a"
  muted: "#75674f"
  muted-soft: "#9a8a6e"
  hairline: "#d9cbb0"
  hairline-soft: "#e3d7bf"
  border-strong: "#c9b78f"
  canvas: "#f5efe6"
  surface-card: "#fbf7ee"
  surface-soft: "#efe6d6"
  surface-strong: "#e8dcc6"
  gold: "#c8962a"
  gold-lt: "#e8b84b"
  gold-deep: "#a9791a"
  cinnabar: "#c0392b"
  cinnabar-dk: "#8b2a1f"
  jade: "#2d6a4f"
  jade-lt: "#52b788"
  line: "#d9cbb0"
  line-soft: "#e3d7bf"
  on-primary: "#fbeecf"
  on-dark: "#fbeecf"
  scrim: "#1a1208"
  tone1: "#e53935"
  tone2: "#43a047"
  tone3: "#1e88e5"
  tone4: "#8e24aa"
  tone-neutral: "#9e9e9e"

typography:
  hanzi-hero:
    fontFamily: "'Noto Serif SC', serif"
    fontSize: 88px
    fontWeight: 900
    lineHeight: 1.0
    letterSpacing: 2px
  hanzi-focus:
    fontFamily: "'Noto Serif SC', serif"
    fontSize: 132px
    fontWeight: 900
    lineHeight: 1.0
    letterSpacing: 2px
  hanzi-back:
    fontFamily: "'Noto Serif SC', serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: 0
  page-title:
    fontFamily: "'Noto Serif SC', serif"
    fontSize: 52px
    fontWeight: 900
    lineHeight: 1.0
    letterSpacing: 4px
  section-title:
    fontFamily: "'Noto Serif SC', serif"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 2px
  kicker:
    fontFamily: "'Cinzel', serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 5px
    textTransform: uppercase
  en-serif:
    fontFamily: "'Cormorant Garamond', serif"
    fontStyle: italic
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 1px
  pinyin-lg:
    fontFamily: "'Nunito', system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.3px
  meaning:
    fontFamily: "'Nunito', system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.35
  example-zh:
    fontFamily: "'Noto Serif SC', serif"
    fontSize: 17px
    fontWeight: 500
    lineHeight: 1.6
  example-en:
    fontFamily: "'Cormorant Garamond', serif"
    fontStyle: italic
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.5
  body-md:
    fontFamily: "'Nunito', system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "'Nunito', system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.45
  caption:
    fontFamily: "'Nunito', system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.3
  button-md:
    fontFamily: "'Noto Serif SC', serif"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.2
  en-sublabel:
    fontFamily: "'Cinzel', serif"
    fontSize: 9px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: 1.5px
    textTransform: uppercase

rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 10px
  lg: 16px
  xl: 22px
  pill: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 64px

elevation:
  flat: "none"
  card: "0 4px 16px rgba(45,30,10,0.10)"
  card-hover: "0 10px 28px rgba(45,30,10,0.16)"
  front-card: "0 8px 24px rgba(139,42,31,0.28)"
  popover: "0 8px 30px rgba(45,30,10,0.18)"

motifs:
  paper-noise: "body::before — SVG fractalNoise, opacity 0.045, mix-blend multiply (宣纸)"
  curtain-lines: "body::after — repeating vertical hairlines every 26px (帘纹)"
  seal: "朱红 rounded square, gold inner double-frame, serif 学/壹/贰… character (印章)"
  stitch: "book-spine dots down the left of a 书封 cover (线装订孔)"
  gold-frame: "1px gold inset frame on covers / flashcard fronts (描金)"
  diamond-rule: "◇ ◇ ◇ centered divider under page heroes"
---

## Overview

This is a **lesson-centric** learning platform for **English-speaking beginners learning Chinese**, branded **学中文 Learn Chinese**. It began as a pure flashcard app; the current design language is **中式典籍·线装 (Chinese classical thread-bound book)** — parchment paper, 朱红 cinnabar seals, 描金 gold frames, 青玉 jade accents (design origin: `design-demos/direction-B.html`). Two audiences share it: a teacher in class (projector) and — most of the time — students self-studying alone. The design must be **self-explanatory to weak-Chinese users** and is **bilingual (中文 + English) throughout**.

The base canvas is **warm parchment** (`{colors.canvas}` — #f5efe6), never stark white, carrying a faint `{motifs.paper-noise}` and `{motifs.curtain-lines}` texture so every surface reads as aged paper. The brand voltage is **朱红 cinnabar** (`{colors.cinnabar}` — #c0392b), used for seals, the logo, active/hero surfaces, and the flashcard-front→back gradient; **描金 gold** (`{colors.gold}` — #c8962a) draws frames, rules, kickers, and dividers; **青玉 jade** (`{colors.jade}` — #2d6a4f) marks "已掌握 / done" success. Depth comes from **warm brown-tinted shadows** and gold hairlines rather than hard gray borders.

The shape language is **restrained and squared** compared to the old coral era: covers and cards round at 10–22px, seals are near-square (4–8px), only chips/pills stay fully round. The typographic contrast is the star of the style: **serif Chinese** (Noto Serif SC, heavy weights for headings) over **italic Cormorant Garamond** English and **Cinzel small-caps** kickers.

**Key Characteristics:**
- **Character-first flashcard.** Front shows the 汉字 ONLY, huge serif, on parchment inside a gold inner frame (`{component.flashcard-front}`). 🔊 + 👁 peek help without flipping.
- **Tone-colored pinyin as a teaching aid.** On the back, pinyin is colored by tone (Pleco scheme, `{colors.tone1}`–`{colors.tone4}` + `{colors.tone-neutral}`). Load-bearing pedagogy, fixed across all themes — never restyled.
- **Bilingual chrome.** Every nav/button carries a 中文 label with a smaller English sub-label (Cinzel caps or Cormorant italic), e.g. "翻面 Flip".
- **Four-level information architecture** (below) so a lesson — not a flashcard deck — is the unit of study.
- **Per-series accent.** `App.vue` applies `seriesTheme(route.params.series)` to recolor `--primary`/`--grad-a/b`/`--primary-soft` on top of the shared classical base; the parchment/gold/serif chassis is constant.
- **Seals, stitches, frames, diamond rules** (`{motifs}`) are the recurring ornaments that make the style read as 典籍 rather than generic "warm".

## Information Architecture (four levels)

1. **课程总览 Library** (`/`, `LibraryView.vue`) — pick a course series as a 书函卡 (slipcase card): 标准HSK · 新HSK3.0 · 会话360 · 生存汉语. Each card shows a 朱红 seal (标/新/话/生), volume count, bilingual description, and a mini book-spine motif tinted with the series color. Single-volume series (生存汉语, `single:true`) jump straight to lessons.
2. **选册/级 Books** (`/course/:series`, `SeriesBooksView.vue`) — a series-specific 门面 hero (seal + name + description in the series accent) over a `.shelf` of `.book` covers (its units), each with a spine, `{motifs.stitch}` holes, a `{motifs.gold-frame}`, a 朱红 level `.label`, and a progress readout.
3. **选课 Lessons** (`/course/:series/:unit`, `LessonListView.vue`) — a `.title-block` (level name + 壹/贰… seal) over a `.lcard` grid; lessons >12 split into a `.seg` range control (Lesson 01–10 / 11–20…). Each card shows a vertical 第 n 课, serif title, English title, and a progress badge (`{component.progress-badge}`).
4. **课内 hub** (`/course/:series/:unit/lesson/:lesson`, `LessonHubView.vue`) — ONE lesson, six gold-edged tabs: **课文 Read** (`ReadPanel`) · **生词表·闪卡 Flashcards** (`FlashcardsPanel`, 网格/专注 dual mode, reuses `FlashCard.vue`) · **词汇详解 Vocabulary** (placeholder) · **语法 Grammar** (`GrammarNotesPanel`) · **练习 Exercises** (`ExercisesPanel` = 生词挖空 + 连词成句) · **话题讨论 Discussion** (placeholder). 课文/练习/语法 pull from the 课文 dataset (`getTextUnit`) and gracefully show a "本课暂无… · Coming soon" placeholder when a lesson has no text (only hsk-1/2/3 + newhsk3-1/2/3 carry texts).

Top nav (`AppHeader.vue`): **选书 Books** (`/`) · **拼音 Pinyin** (`/pinyin`) · **我的词 My words** (`/my-words`), with a 朱红印章 学 logo. 课文 is no longer a top-level entry (it lives inside each hub); legacy `/texts/...` routes still work but aren't linked. 我的词 doubles as global search (范围切换: 我的词 / 所有课程).

## Colors

### Brand & Ornament
- **朱红 Cinnabar** (`{colors.cinnabar}` — #c0392b): The core brand color. Seals, the 学 logo, active tabs/chips, the flashcard front→back gradient, primary CTAs, error. Paired with its dark end (#8b2a1f) for gradients.
- **描金 Gold** (`{colors.gold}` — #c8962a; light #e8b84b, deep #a9791a): Frames, hairline rules, `{typography.kicker}` text, `{motifs.diamond-rule}`, cover frames, the flashcard's inner frame, progress accents on covers. The "precious" line color — used generously but always thin.
- **青玉 Jade** (`{colors.jade}` — #2d6a4f; light #52b788): "已掌握 / Done" success state, done badges/rings.
- **Per-series accent** overrides `--primary`: 标准HSK #e5533d (朱) · 新HSK3.0 #6d5ce6 (紫) · 会话360 #12a594 (青) · 生存汉语 #d98324 (琥珀). Applied via `seriesTheme()`; the parchment/gold chassis never changes.

### Status (learning progress)
- **Success / 已掌握** (`{colors.success}` — #2d6a4f jade, soft #dbeee2).
- **Review / 需复习** (`{colors.review}` — #b8862f, soft #f6ecd2).
- **Star / 收藏** (`{colors.star}` — #c8962a gold, soft #f7eccf).

### Pinyin Tone Colors (pedagogical — do not restyle per theme)
Fixed Pleco/learner-standard scheme, applied per syllable by tone:
- **Tone 1** (#e53935, red) high ˉ · **Tone 2** (#43a047, green) rising ˊ · **Tone 3** (#1e88e5, blue) dipping ˇ · **Tone 4** (#8e24aa, purple) falling ˋ · **Neutral** (#9e9e9e, gray) toneless.
Tone coloring is a user setting (default ON, `useSettings.toneColors`). When OFF, pinyin renders in `{colors.ink}`. The diacritic itself still marks tone, so colorblind users retain the information.

### Surface (parchment tiers)
- **Canvas / 纸** (`{colors.canvas}` — #f5efe6): the page floor, textured with `{motifs.paper-noise}` + `{motifs.curtain-lines}`.
- **Card** (`{colors.surface-card}` — #fbf7ee): warm card base; most cards use a subtle `linear-gradient(160deg,#fbf6ec,#f3ead9)` on top of it.
- **Soft / Strong** (`{colors.surface-soft}` #efe6d6 / `{colors.surface-strong}` #e8dcc6): tinted fills for chips, segmented controls, progress tracks.

### Text (ink)
- **Ink** (`{colors.ink}` — #1a1208): headings, hanzi, primary text. Warm near-black.
- **Body / Ink-soft** (`{colors.body}` — #4a3d2a): running text, secondary labels.
- **Muted** (`{colors.muted}` — #75674f) / **Muted-soft** (#9a8a6e): breadcrumbs, hints, English lines, placeholders.
- **On-primary** (`{colors.on-primary}` — #fbeecf): warm cream text/icons on 朱红 seals & gradients (NOT pure white — cream reads as ink-on-vermilion-paper).

### Lines
- **Line / Hairline** (`{colors.line}` — #d9cbb0) / **soft** (#e3d7bf): 1px separators, input borders. **Border-strong** (#c9b78f) for focus. Gold (#c8962a) is used for *decorative* rules and frames, line color for *structural* ones.

## Typography

### Font Families
- **Chinese headings & literary text:** `Noto Serif SC` (`{typography.page-title}`, section titles, card titles, hanzi, example-zh). Heavy weights (700–900) for the 典籍 gravitas.
- **Chinese body / buttons:** Noto Serif SC for labels; `Noto Sans SC` (`--han`) remains available for dense running Chinese.
- **English sub-labels & literary English:** `Cormorant Garamond` italic (`{typography.en-serif}`, `{typography.example-en}`).
- **English kickers / caps:** `Cinzel` (`{typography.kicker}`, `{typography.en-sublabel}`) — all-caps, wide letter-spacing.
- **Latin UI & pinyin:** `Nunito` (`--ui`) for numbers, meanings, pinyin, running UI — it renders tone diacritics cleanly.

Load all five via Google Fonts in `index.html`; always degrade to serif/sans/system stacks.

### Hierarchy

| Token | Size | Weight | Use |
|---|---|---|---|
| `{typography.hanzi-focus}` | 132px | 900 | Character in 专注 focus mode |
| `{typography.hanzi-hero}` | 88px | 900 | Character on the 网格 flashcard front |
| `{typography.page-title}` | 52px | 900 | Page/level heroes (级名, 我的词) — serif, wide tracking |
| `{typography.hanzi-back}` | 32px | 700 | Hanzi on the card back |
| `{typography.section-title}` | 28px | 700 | Section / placeholder headings |
| `{typography.meaning}` | 20px | 700 | English meaning on card back (the payoff) |
| `{typography.pinyin-lg}` | 24px | 700 | Tone-colored pinyin on card back |
| `{typography.example-zh}` | 17px | 500 | Chinese example (serif) |
| `{typography.en-serif}` | 16px | 500 italic | Bilingual sub-titles, hero English |
| `{typography.example-en}` | 15px | 500 italic | English under examples (Cormorant) |
| `{typography.body-md}` | 16px | 400 | Running text, inputs |
| `{typography.caption}` | 13px | 600 | Hints, breadcrumbs, progress numbers |
| `{typography.button-md}` | 15px | 600 | Button labels (serif) |
| `{typography.kicker}` | 12px | 600 caps | Cinzel kickers above heroes (letter-spacing 5px) |
| `{typography.en-sublabel}` | 9px | 600 caps | Cinzel English under a Chinese nav/button label |

### Principles
The character is the loudest thing on study screens (88px grid / 132px focus). On browse screens the **serif page title + Cinzel kicker + ◇ diamond rule + Cormorant italic sub** form the signature masthead. English is deliberately quieter and *literary* (italic Cormorant / caps Cinzel), never a loud second voice. The tone-colored pinyin and English meaning remain the payoff on the card back.

## Layout

### Spacing
4px scale (`{spacing}`): 2 · 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64. Page band padding `{spacing.xl}`–`{spacing.section}`; card padding `{spacing.lg}`; grid gutters ~18px.

### Grid & Container
- **Max content width:** ~1120–1180px centered.
- **Library series grid:** `repeat(auto-fill, minmax(…))` of 书函卡, 2–4 wide.
- **Books shelf:** `.book` covers, 2–4 wide.
- **Lessons:** `.lcard` grid `minmax(310px, 1fr)`; >12 lessons → `.seg` range tabs.
- **Flashcard grid:** `minmax(150–210px, 1fr)`; focus mode = single centered card with flanking prev/next.

### Whitespace
Generous around heroes (kicker + title + rule breathe), tighter in card grids so a whole lesson/series scans at once. The paper texture + gold frames do the "richness" work, so we don't need vast emptiness.

## Elevation
Warm brown-tinted, three tiers + popover: `{elevation.card}` resting · `{elevation.card-hover}` hover lift · `{elevation.front-card}` the flashcard front's cinnabar glow · `{elevation.popover}` dropdowns. Covers/cards lift `translateY(-4px)` and brighten their gold frame on hover.

## Components

### Flashcard (the heart) — `FlashCard.vue`
**front** — parchment gradient, `{rounded.xl}`, a **gold inner frame** (`::after`, 1px inset), the 汉字 ONLY in serif `{typography.hanzi-hero}` (ink), a small level tag + 🔊/👁 icon buttons (gold circles), and a "点击翻转 tap to flip" hint. Flip = CSS `rotateY(180deg)` on a `preserve-3d` inner **plus an opacity swap at the flip midpoint** (`transition: opacity 0s .22s`) — the opacity swap is deliberate (backface-visibility alone bled through some renderers); the two faces MUST carry `fc-face` and avoid `overflow:hidden`. Don't "simplify" this.
**back** — parchment, gold divider, `{rounded.xl}`. Stack: hanzi + tone-colored pinyin + 🔊; a bilingual `pos` chip (top-right) + core/supplement badge if present; the English **meaning**; up to two examples (serif zh + 🔊 + Cormorant en); an optional note; a **常见搭配 collocations** row (`.collocs`, only for courses that carry them — currently 生存汉语); and a mark row (已掌握 / 需复习 / ⭐).

### Seal (印章) — the signature motif
A near-square 朱红 tile (`linear-gradient(145deg,#c0392b,#8b2a1f)`), `{rounded.sm}`, a cream (`{colors.on-primary}`) serif character (学 / 壹-拾 / 标新话生), an inset gold double-frame (`::after`), and `inset 0 0 0 2px rgba(251,238,207,.5)` + a soft cinnabar shadow. Used for the logo, level markers, series marks.

### Book cover (书封/书函) — `SeriesBooksView` / `LibraryView`
Parchment card with a colored spine (`::before`), `{motifs.stitch}` dots, a `{motifs.gold-frame}`, a 朱红 `.label`, bilingual title, and progress. Hover lifts + brightens the gold.

### Tabs (hub) — `LessonHubView`
A gold-bottom-bordered row; the active tab is a parchment gradient panel outlined in gold with its bottom border erased (a "current page" tab). Each tab stacks a 中文 label over a Cinzel English caption.

### Breadcrumb — `.crumb`
Four-level path (总览 ◇ 系列 ◇ 册 ◇ 课), gold ◇ separators, dotted-underline hover in cinnabar.

### Progress badge — `LessonListView`
`.ptag.done` = jade "已掌握 Done"; `.ptag.learning` = gold-deep "学过 X%"; none shown at 0%.

### Segmented control — `.seg`
Range/mode toggle: parchment track, gold hairline, active segment = 朱红 gradient with cream text.

### Buttons, chips, inputs
**Primary** = 朱红 gradient pill, cream label, resting shadow. **Secondary** = card fill, cinnabar label, soft border. **Filter chip** = card pill, gold fill when active. **Search input** = parchment pill/box, gold focus ring. Keep every label bilingual (serif 中文 + small caps/italic English).

### Progress ring / bar
Ring: SVG, series-accent fill on a line track, % in center (drives Library/Books via `percentKnownByPrefix` — no word data loaded). Bar: 8px accent-gradient on `{colors.surface-strong}`.

## Responsive Behavior

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Card grids 1–2-up; nav wraps to a scrollable row; flashcard grid 2-up; focus mode full-width; page titles scale down (52→40px). Bilingual labels keep both lines. |
| Tablet | 640–1024px | Grids 2–3-up; hero + toolbar single row. |
| Desktop | > 1024px | Content caps ~1180px; grids 3–4-up; hover glows/lifts active. |

### Touch Targets
All buttons/chips/marks ≥ 44×44px. The flashcard surface is the flip target; 🔊/👁 stop propagation. Focus prev/next ≥ 48px.

## Do's and Don'ts

**Do**
- Keep the front character-only (serif, gold frame); make help (🔊, 👁) available but secondary.
- Use 朱红 for seals/hero/act moments and 描金 for frames & rules — let parchment carry most surfaces.
- Always color pinyin by tone (unless the user turns it off); keep the tone palette fixed.
- Pair every Chinese label with a smaller English sub-label (Cinzel caps or Cormorant italic).
- Reuse the motifs (`{motifs}`): seal, stitch, gold-frame, diamond rule — they *are* the style.

**Don't**
- Don't put pinyin/English on the flashcard front by default.
- Don't use pure white (#ffffff) as a background — the floor is warm parchment with texture.
- Don't use pure white (#ffffff) as cream text on cinnabar — use `{colors.on-primary}` #fbeecf.
- Don't restyle tone colors per theme; they are a learning contract.
- Don't reintroduce the old coral gradient / fully-rounded neon look; the style is squared, serif, and literary.

## Known Gaps
- **词汇详解 / 话题讨论** hub tabs are placeholders ("敬请期待 · Coming soon").
- **拼音 / 账号 / 管理 / 测验 / 打印** pages inherit the classical tokens (colors/fonts) but their bespoke layouts aren't fully re-composed to the 典籍 masthead system yet.
- **Dark mode:** not defined.
- **课文 coverage:** texts exist only for hsk-1/2/3 + newhsk3-1/2/3; other lessons show graceful placeholders.
- **Audio:** Supabase Storage MP3s (words: edge-tts by md5; pinyin: human recordings) with browser-TTS fallback; degrades silently, may fail on mainland-China devices without a VPN.
- **Motion tokens:** flip (~0.4s) + hover-lift described in prose; no formal easing token set.
