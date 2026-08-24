---
version: alpha
name: HSK Flashcards（HSK 分课单词闪卡）
description: A warm, encouraging language-learning app for English-speaking beginners studying Chinese by HSK lesson. The mood is bright and motivating — Duolingo-style friendliness without the childishness. A warm Coral→Orange gradient (#ff6b6b → #ff8e53) is the brand voltage: it powers the flashcard front, primary CTAs, and progress fills. Mint (#4ecdc4) is the calm secondary for audio and links. Everything is generously rounded (cards at 22–28px, buttons pill-shaped), sits on a warm off-white canvas (#fffaf6), and floats on soft coral-tinted shadows. The single most important element is the flashcard: front shows the Chinese character ONLY (huge, on the coral gradient); back reveals tone-colored pinyin, English meaning, and two bilingual example sentences. Pinyin is colored by tone using the Pleco-standard scheme (1 red / 2 green / 3 blue / 4 purple / neutral gray) as a learning aid. All chrome is bilingual (Chinese label + smaller English sub-label, e.g. "翻面 Flip") because students' Chinese is weak and most study unsupervised.

colors:
  primary: "#ff6b6b"
  primary-active: "#ff5252"
  primary-strong: "#f0453f"
  primary-soft: "#ffe3dd"
  primary-disabled: "#ffc7bd"
  gradient-front-start: "#ff6b6b"
  gradient-front-end: "#ff8e53"
  accent: "#4ecdc4"
  accent-active: "#38b2ac"
  accent-soft: "#d7f5f2"
  success: "#22c55e"
  success-soft: "#dcfce7"
  review: "#f59e0b"
  review-soft: "#fef3c7"
  star: "#fbbf24"
  star-soft: "#fef9c3"
  error: "#ef4444"
  ink: "#2b2b33"
  body: "#4b4b55"
  muted: "#7c7c88"
  muted-soft: "#a8a8b3"
  hairline: "#eee7e2"
  hairline-soft: "#f5f0ec"
  border-strong: "#d9cfc8"
  canvas: "#fffaf6"
  surface-card: "#ffffff"
  surface-soft: "#fff3ec"
  surface-strong: "#ffe9df"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  scrim: "#2b2b33"
  tone1: "#e53935"
  tone2: "#43a047"
  tone3: "#1e88e5"
  tone4: "#8e24aa"
  tone-neutral: "#9e9e9e"

typography:
  hanzi-hero:
    fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: 96px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: 2px
  hanzi-focus:
    fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: 140px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: 2px
  hanzi-back:
    fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: 34px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: 0
  pinyin-lg:
    fontFamily: "'Nunito', -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.3px
  pinyin-peek:
    fontFamily: "'Nunito', -apple-system, system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.3px
  display-xl:
    fontFamily: "'Nunito', -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: 32px
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: -0.3px
  display-lg:
    fontFamily: "'Nunito', -apple-system, system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: -0.2px
  title-md:
    fontFamily: "'Nunito', -apple-system, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0
  meaning:
    fontFamily: "'Nunito', -apple-system, system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: 0
  example-zh:
    fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: 17px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0
  example-en:
    fontFamily: "'Nunito', -apple-system, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-md:
    fontFamily: "'Nunito', -apple-system, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "'Nunito', -apple-system, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: 0
  caption:
    fontFamily: "'Nunito', -apple-system, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  button-md:
    fontFamily: "'Nunito', -apple-system, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.2px
  button-sm:
    fontFamily: "'Nunito', -apple-system, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.2px
  badge:
    fontFamily: "'Nunito', -apple-system, system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: 0.4px
    textTransform: uppercase
  en-sublabel:
    fontFamily: "'Nunito', -apple-system, system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: 0.2px

rounded:
  none: 0px
  xs: 6px
  sm: 10px
  md: 16px
  lg: 22px
  xl: 28px
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
  card: "0 4px 16px rgba(43,43,51,0.06)"
  card-hover: "0 10px 28px rgba(255,107,107,0.18)"
  front-card: "0 8px 24px rgba(255,107,107,0.30)"
  popover: "0 8px 30px rgba(43,43,51,0.12)"

components:
  app-header:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    height: 60px
  level-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.xl}"
    padding: 24px
    elevation: "{elevation.card}"
  level-card-locked:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.muted}"
    rounded: "{rounded.xl}"
    padding: 24px
  lesson-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 20px
    elevation: "{elevation.card}"
  flashcard-front:
    backgroundImage: "linear-gradient(135deg, {colors.gradient-front-start} 0%, {colors.gradient-front-end} 100%)"
    textColor: "{colors.on-primary}"
    typography: "{typography.hanzi-hero}"
    rounded: "{rounded.xl}"
    elevation: "{elevation.front-card}"
  flashcard-back:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.pinyin-lg}"
    rounded: "{rounded.xl}"
    elevation: "{elevation.card}"
    borderTop: "4px solid {colors.primary}"
  badge-core:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    typography: "{typography.badge}"
    rounded: "{rounded.pill}"
    padding: 3px 10px
  badge-supplement:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-active}"
    typography: "{typography.badge}"
    rounded: "{rounded.pill}"
    padding: 3px 10px
  badge-level:
    backgroundImage: "linear-gradient(135deg, {colors.gradient-front-start} 0%, {colors.gradient-front-end} 100%)"
    textColor: "{colors.on-primary}"
    typography: "{typography.badge}"
    rounded: "{rounded.pill}"
    padding: 4px 12px
  icon-button:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    height: 40px
  icon-button-on-gradient:
    backgroundColor: "rgba(255,255,255,0.22)"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    height: 40px
  button-primary:
    backgroundImage: "linear-gradient(135deg, {colors.gradient-front-start} 0%, {colors.gradient-front-end} 100%)"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
    height: 48px
    elevation: "{elevation.card-hover}"
  button-secondary:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: 11px 23px
    height: 48px
    border: "1.5px solid {colors.primary-soft}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.pill}"
    padding: 8px 14px
  mark-known:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.pill}"
    padding: 8px 14px
  mark-known-active:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
  mark-review:
    backgroundColor: "{colors.review-soft}"
    textColor: "{colors.review}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.pill}"
    padding: 8px 14px
  mark-review-active:
    backgroundColor: "{colors.review}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
  mark-star:
    backgroundColor: transparent
    textColor: "{colors.star}"
    rounded: "{rounded.pill}"
  search-input:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.pill}"
    padding: 12px 18px
    height: 46px
    border: "1.5px solid {colors.hairline}"
  filter-chip:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.body}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.pill}"
    padding: 7px 14px
  filter-chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
  mode-toggle:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.body}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.pill}"
    padding: 4px
  progress-ring:
    trackColor: "{colors.hairline}"
    fillColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
  progress-bar:
    trackColor: "{colors.surface-strong}"
    fillColor: "linear-gradient(90deg, {colors.gradient-front-start}, {colors.gradient-front-end})"
    rounded: "{rounded.pill}"
    height: 8px
  quiz-option:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.hanzi-back}"
    rounded: "{rounded.lg}"
    padding: 18px
    border: "1.5px solid {colors.hairline}"
    elevation: "{elevation.card}"
  quiz-option-correct:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.ink}"
    border: "2px solid {colors.success}"
    rounded: "{rounded.lg}"
  quiz-option-wrong:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.ink}"
    border: "2px solid {colors.primary}"
    rounded: "{rounded.lg}"
  toolbar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
  breadcrumb:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.caption}"
  focus-bottom-bar:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    elevation: "{elevation.popover}"
    height: 64px
---

## Overview

This is a flashcard app for **English-speaking beginners learning Chinese**, organized **HSK level → lesson → word**. Two audiences share it: a teacher walking a class through words (projector), and — most of the time — students studying alone. The design must therefore be **self-explanatory to someone whose Chinese is weak**, and **encouraging** enough to sustain solo practice.

The base canvas is a **warm off-white** (`{colors.canvas}` — #fffaf6), not stark white, to feel soft and friendly. The brand voltage is a **Coral→Orange gradient** (`{colors.gradient-front-start}` #ff6b6b → `{colors.gradient-front-end}` #ff8e53) that carries the flashcard front, primary CTAs, active filter chips, level badges, and progress fills. **Mint** (`{colors.accent}` — #4ecdc4) is the calm secondary, reserved for audio/TTS affordances and links so "listen" reads as distinct from "act".

The shape language is **very soft**: cards round at 22–28px (`{rounded.lg}`/`{rounded.xl}`), every button and chip is a pill (`{rounded.pill}`), and depth comes from **warm coral-tinted shadows** rather than hard borders. Hover lifts cards with a colored glow (`{elevation.card-hover}`) — small dopamine, on purpose.

**Key Characteristics:**
- **Character-first flashcard.** The front shows the 汉字 ONLY, huge, white-on-coral-gradient (`{component.flashcard-front}`). No pinyin, no English up front — recognition is the exercise. A 🔊 button and a "👁 拼音 peek" button let learners get help without flipping.
- **Tone-colored pinyin as a teaching aid.** On the back, pinyin is colored by tone using the Pleco-standard scheme (`{colors.tone1}`–`{colors.tone4}` + `{colors.tone-neutral}`). This is a load-bearing pedagogical decision, not decoration.
- **Bilingual chrome.** Every button/nav carries a Chinese label with a smaller English sub-label beneath (`{typography.en-sublabel}`), e.g. "翻面 / Flip". Students self-serve and incidentally learn UI vocabulary.
- **Encouraging progress everywhere.** Per-lesson and per-level `{component.progress-ring}` / `{component.progress-bar}` in the coral gradient make advancement visible and motivating during solo study.
- **Two study layouts.** A grid overview (all cards of a lesson at once) and a one-at-a-time focus mode, one-tap switchable via `{component.mode-toggle}`.
- **Soft, single-family depth.** Three shadow tiers only (`{elevation.card}`, `{elevation.card-hover}`, `{elevation.front-card}`) plus `{elevation.popover}`; most surfaces are flat on the warm canvas.

## Colors

### Brand & Accent
- **Coral** (`{colors.primary}` — #ff6b6b): The core brand color. Primary CTA base, active filter chips, level badges, progress fills, the flashcard-back top border. Paired into a gradient with Orange for hero surfaces.
- **Orange** (`{colors.gradient-front-end}` — #ff8e53): The warm end of the brand gradient. Only appears inside the Coral→Orange gradient (`{component.flashcard-front}`, `{component.button-primary}`, `{component.badge-level}`), never as a solid fill alone.
- **Coral Active** (`{colors.primary-active}` — #ff5252) / **Strong** (`{colors.primary-strong}` — #f0453f): Press states and high-emphasis text on light surfaces.
- **Coral Soft** (`{colors.primary-soft}` — #ffe3dd): Pale tint for secondary-button borders and the "wrong answer" quiz surface.
- **Mint** (`{colors.accent}` — #4ecdc4): Secondary voltage, scoped to **audio/TTS** icons and inline links. Keeps "listen" visually separate from "do".

### Status (learning progress)
- **Success / Got it** (`{colors.success}` — #22c55e, soft #dcfce7): "已掌握 / Got it" mark, `{component.badge-core}`, correct quiz answers.
- **Review** (`{colors.review}` — #f59e0b, soft #fef3c7): "需复习 / Review" mark and its filter chip.
- **Star** (`{colors.star}` — #fbbf24, soft #fef9c3): "⭐ 收藏 / Saved" state.

### Pinyin Tone Colors (pedagogical — do not restyle per theme)
A fixed, recognizable scheme (Pleco/learner-standard). Applied to each pinyin syllable by its tone:
- **Tone 1** (`{colors.tone1}` — #e53935, red) — high level ˉ
- **Tone 2** (`{colors.tone2}` — #43a047, green) — rising ˊ
- **Tone 3** (`{colors.tone3}` — #1e88e5, blue) — dipping ˇ
- **Tone 4** (`{colors.tone4}` — #8e24aa, purple) — falling ˋ
- **Neutral** (`{colors.tone-neutral}` — #9e9e9e, gray) — toneless ·

Tone coloring is a user setting (default ON). When OFF, pinyin renders in `{colors.ink}`.

### Surface
- **Canvas** (`{colors.canvas}` — #fffaf6): Warm off-white page floor. No dark mode in alpha.
- **Surface Card** (`{colors.surface-card}` — #ffffff): The one pure-white surface — flashcard backs, cards, inputs, quiz options; it pops gently off the warm canvas.
- **Surface Soft** (`{colors.surface-soft}` — #fff3ec) / **Strong** (`{colors.surface-strong}` — #ffe9df): Warm tinted fills for icon buttons, chips, progress tracks, locked level cards.

### Text
- **Ink** (`{colors.ink}` — #2b2b33): Headlines, hanzi on light surfaces, primary text. Warm near-black, never pure #000.
- **Body** (`{colors.body}` — #4b4b55): Running text, secondary labels.
- **Muted** (`{colors.muted}` — #7c7c88) / **Muted Soft** (`{colors.muted-soft}` — #a8a8b3): Breadcrumbs, hints ("点击翻转"), disabled text, English example lines.
- **On Primary** (`{colors.on-primary}` — #ffffff): Text/icons on coral gradient surfaces.

### Hairlines
- **Hairline** (`{colors.hairline}` — #eee7e2) / **Soft** (#f5f0ec): Warm 1px separators and input borders. **Border Strong** (#d9cfc8) for focused inputs.

## Typography

### Font Families
- **Latin / UI / pinyin:** `Nunito` — a rounded, friendly sans that matches the encouraging mood — falling back to `-apple-system, system-ui, "Segoe UI", Roboto, sans-serif`. Nunito renders pinyin tone diacritics cleanly.
- **Chinese:** `"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`. Used for all 汉字 and Chinese example sentences.

Load Nunito + Noto Sans SC via the build (self-hosted or Google Fonts); always degrade to the system stack.

### Hierarchy

| Token | Size | Weight | Use |
|---|---|---|---|
| `{typography.hanzi-focus}` | 140px | 700 | The character in one-at-a-time **focus mode** |
| `{typography.hanzi-hero}` | 96px | 700 | The character on the **grid flashcard front** |
| `{typography.hanzi-back}` | 34px | 700 | Hanzi on the card back + quiz option characters |
| `{typography.display-xl}` | 32px | 800 | Page hero titles (Home "HSK 单词闪卡") |
| `{typography.display-lg}` | 24px | 800 | Section / level card titles |
| `{typography.meaning}` | 20px | 700 | English meaning on card back (the payoff line) |
| `{typography.pinyin-lg}` | 24px | 700 | Tone-colored pinyin on card back |
| `{typography.pinyin-peek}` | 20px | 700 | Pinyin shown by the front "peek" toggle |
| `{typography.title-md}` | 18px | 700 | Lesson titles, card headers |
| `{typography.example-zh}` | 17px | 500 | Chinese example sentence |
| `{typography.example-en}` | 14px | 400 | English translation under each example (muted) |
| `{typography.body-md}` | 16px | 400 | Default running text, inputs |
| `{typography.body-sm}` | 14px | 500 | Meta, toolbar labels |
| `{typography.caption}` | 13px | 600 | Hints, breadcrumbs, progress numbers |
| `{typography.button-md}` | 15px | 700 | Primary/secondary button labels |
| `{typography.button-sm}` | 13px | 700 | Chips, mark buttons, ghost buttons |
| `{typography.badge}` | 11px | 800 | core/supplement/level badges (uppercase) |
| `{typography.en-sublabel}` | 11px | 600 | English sub-label under a Chinese button label |

### Principles
The character is the loudest thing on every screen — 96px on the grid, 140px in focus mode — because recognition is the whole point. The English **meaning** (20px/700) is the second-loudest moment: it's the reward for flipping, so it gets weight. Everything else (pinyin, examples, chrome) stays quiet and supportive.

## Layout

### Spacing System
4px base scale: `{spacing.xxs}` 2 · `{spacing.xs}` 4 · `{spacing.sm}` 8 · `{spacing.md}` 12 · `{spacing.base}` 16 · `{spacing.lg}` 24 · `{spacing.xl}` 32 · `{spacing.xxl}` 48 · `{spacing.section}` 64.
- Card internal padding: `{spacing.lg}` (24px) for level/flashcard, `{spacing.base}` (16px) for lesson cards.
- Grid gutters: `{spacing.base}` (16px) between flashcards.
- Page band padding: `{spacing.xl}`–`{spacing.section}` vertical.

### Grid & Container
- **Max content width:** ~1120px centered; toolbars and grids live inside it.
- **Home level grid:** 2–3 wide cards (HSK1–5), HSK4/5 rendered with `{component.level-card-locked}` ("敬请期待 / Coming soon").
- **Lesson list:** responsive card grid, `minmax(220px, 1fr)`.
- **Flashcard grid (lesson study):** `repeat(auto-fill, minmax(150px, 1fr))`, cards ~180px tall.
- **Focus mode:** single centered card (max ~440px wide), prev/next controls flanking, progress dots below.

### Whitespace Philosophy
Generous but not sparse — this is a study tool, so cards sit close enough to scan a whole lesson, while the hero and toolbars breathe. Warmth (canvas tint + rounded corners + soft shadows) does the "friendly" work so we don't need huge empty space.

## Elevation
Warm, coral-tinted, three tiers plus a popover:
- **`{elevation.card}`** — resting cards (lesson, level, flashcard back). Soft neutral.
- **`{elevation.card-hover}`** — hover/press lift with a coral glow; also the resting shadow of `{component.button-primary}`.
- **`{elevation.front-card}`** — the flashcard front's coral glow, making it feel liftable and tappable.
- **`{elevation.popover}`** — the mobile focus-mode bottom bar and any dropdown.
Most surfaces are flat on the canvas; depth signals interactivity.

## Components

### Flashcard (the heart)
**`flashcard-front`** — Coral→Orange gradient, `{rounded.xl}`, `{elevation.front-card}`. Contents: the 汉字 ONLY in `{typography.hanzi-hero}` (white), a small mint-tinted 🔊 button (`{component.icon-button-on-gradient}`), a "👁 拼音 / peek" button that overlays the pinyin in `{typography.pinyin-peek}` WITHOUT flipping, and a bottom hint "点击翻转 / tap to flip" in white 70%. Tapping the card body flips it via CSS `rotateY(180deg)` on a `preserve-3d` inner with `backface-visibility: hidden`.

**`flashcard-back`** — White, `{rounded.xl}`, `{elevation.card}`, 4px coral top border. Stack: hanzi (`{typography.hanzi-back}`) + tone-colored pinyin (`{typography.pinyin-lg}`) on one row, with a 🔊 button; a core/supplement badge if present; the English **meaning** (`{typography.meaning}`); then up to two examples, each = Chinese (`{typography.example-zh}`) with an inline 🔊 + English (`{typography.example-en}`); an optional note line; and a mark row (`{component.mark-known}` / `{component.mark-review}` / `{component.mark-star}`).

### Badges
**`badge-core`** (green soft) "核心 CORE" and **`badge-supplement`** (mint soft) "补充 SUPP." — the HSK1 词汇类型. **`badge-level`** — coral-gradient pill "HSK 1" used on home/breadcrumbs.

### Buttons
**`button-primary`** — coral-gradient pill, white label, resting coral glow; for "开始学习 / Start", "自测 / Quiz", quiz "下一题 / Next". **`button-secondary`** — white pill, coral label, soft coral border. **`button-ghost`** — transparent, body text; for low-emphasis nav. **`icon-button`** — soft round 40px (mint icon) for TTS/peek on light surfaces; **`icon-button-on-gradient`** — translucent white on the card front.

Bilingual labeling: a button stacks its Chinese label in `{typography.button-md}` over an English sub-label in `{typography.en-sublabel}` (muted / 80% on gradient). Keep the two tight (2px gap).

### Marks (progress)
**`mark-known`** / **`mark-review`** are soft-tinted pills that fill solid (`-active`) when set; **`mark-star`** is an outline star that fills gold when saved. State persists in localStorage and drives filter chips + progress rings.

### Lesson & Level cards
**`level-card`** — white `{rounded.xl}` card: coral-gradient level badge, "HSK 1", lesson & word counts, a `{component.progress-ring}`, and a "开始 / Start" affordance; hover uses `{elevation.card-hover}`. **`level-card-locked`** for HSK4/5. **`lesson-card`** — white `{rounded.lg}` card: "第 1 课", Chinese title + English title (muted), word count, and a slim `{component.progress-bar}`.

### Study controls
**`mode-toggle`** — a pill segmented control: "网格 Grid ⇄ 专注 Focus". **`filter-chip`** row — "全部 All / 需复习 Review / 已掌握 Got it / ⭐ Saved"; active chip fills coral. **`search-input`** — white pill with a leading magnifier; placeholder "搜索汉字/拼音/英文… Search…". **`focus-bottom-bar`** (mobile) — sticky bottom bar with prev/next + progress dots.

### Quiz
**`quiz-option`** — white `{rounded.lg}` tile holding a hanzi (`{typography.hanzi-back}`) or a choice; on answer it becomes `{component.quiz-option-correct}` (green) or `{component.quiz-option-wrong}` (coral). A progress bar tops the runner; the result screen shows a score and a "复习错词 / Review missed" primary button.

### Progress
**`progress-ring}`** — SVG ring, coral fill on a hairline track, percentage in the center; used on level/lesson cards. **`progress-bar`** — 8px coral-gradient bar on `{colors.surface-strong}`.

## Responsive Behavior

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Flashcard grid 2-up; toolbar wraps, filter chips scroll horizontally; focus mode is full-width with a `{component.focus-bottom-bar}`; level cards 1-up; bilingual labels keep both lines. |
| Tablet | 640–1024px | Flashcard grid 3–4-up; level cards 2-up; toolbar single row. |
| Desktop | > 1024px | Content caps ~1120px; flashcard grid 4–6-up; focus card centered with flanking prev/next; hover glows active. |

### Touch Targets
- All buttons, chips, marks, and icon buttons ≥ 44×44px effective (mobile-first — students mostly study on phones).
- Flashcard whole surface is the flip target; 🔊 and peek buttons stop propagation so they don't trigger a flip.
- Focus prev/next controls ≥ 48px.

## Do's and Don'ts

**Do**
- Keep the front character-only; make help (🔊, peek) available but secondary.
- Use the coral gradient sparingly for "hero/act" moments; let the warm canvas + white cards carry most surfaces.
- Always color pinyin by tone (unless the user turns it off) and keep the tone palette fixed.
- Pair every Chinese UI label with an English sub-label.
- Celebrate progress: fills, rings, and a positive quiz result screen.

**Don't**
- Don't put pinyin or English on the flashcard front by default.
- Don't use pure white (#ffffff) as the page background — the canvas is warm.
- Don't restyle tone colors to match the theme; they are a learning contract.
- Don't use hard corners or gray box-shadows; corners are soft, shadows are warm.
- Don't rely on Chinese-only chrome — solo students must self-serve.

## Responsive / Accessibility Notes
- Tone colors must never be the ONLY signal — the pinyin diacritic itself still marks tone, so colorblind users retain the information.
- Maintain AA contrast: white-on-coral-gradient passes for large hanzi; body text uses `{colors.ink}`/`{colors.body}` on white, not muted, for anything essential.

## Known Gaps
- **Dark mode:** not defined in alpha.
- **Audio:** relies on the browser `speechSynthesis` zh-CN voice; quality/availability varies by device — no bundled audio files or waveform UI yet.
- **HSK4/5:** visual placeholders (`{component.level-card-locked}`) only; data not yet available.
- **Illustration/mascot:** the "encouraging" mood is carried by color/shape/motion; no character mascot is specified.
- **Motion tokens:** flip (~0.4s ease) and hover-lift are described in prose; a full motion/easing token set is not yet formalized.
