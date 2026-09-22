// Course registry — the single source of truth for what courses exist.
// Adding a new course: append an entry here + add its source in scripts/convert.py.
// The UI (LibraryView, SeriesBooksView) is driven entirely by this list.

// Classical (典籍·线装) presentation fields consumed by LibraryView / SeriesBooksView:
//   seal{cn,en}  朱红印章字   · seriesColor  --sc accent   · colorClass  书封色
//   kicker/heroSub/heroEn/desc/descEn  门面文案 · volUnit  册数单位 · levelWord 书封小字
//   single: 单册系列（总览点击直达课次，跳过选册）· badgeHtml 系列徽标（如 3.0/NEW）
export const COURSE_REGISTRY = [
  {
    id: "hsk",
    name: "标准 HSK 标准系列",
    nameEn: "HSK Standard Course",
    gradA: "#c8433a",
    gradB: "#8f2f24",
    theme: {
      "--primary": "#c8433a",
      "--primary-active": "#b23a2f",
      "--primary-strong": "#932a20",
      "--primary-soft": "#f6ddd7",
      "--grad-a": "#c8433a",
      "--grad-b": "#8f2f24",
      "--sh-hover": "0 10px 28px rgba(200, 67, 58, 0.2)",
      "--sh-front": "0 8px 24px rgba(200, 67, 58, 0.3)",
    },
    seal: { cn: "标", en: "HSK" },
    seriesColor: "#c8433a",
    colorClass: "c-coral",
    kicker: "Chinese Proficiency Test · Standard",
    heroTitle: "HSK 标准系列",
    heroSub: "权威考试教程 · 从零到流利",
    heroEn: "The authoritative HSK exam curriculum",
    desc: "权威考试教程，从零到流利",
    descEn: "The authoritative HSK exam curriculum",
    volUnit: "Volumes",
    levelWord: "Level",
    units: [
      { id: 1, label: "HSK 1", available: true },
      { id: 2, label: "HSK 2", available: true },
      { id: 3, label: "HSK 3", available: true },
      { id: 4, label: "HSK 4", available: true },
      { id: 5, label: "HSK 5", available: true },
      { id: 6, label: "HSK 6", available: true },
    ],
  },
  {
    id: "newhsk3",
    name: "新 HSK 3.0 新系列",
    nameEn: "New HSK 3.0",
    gradA: "#6a4c93",
    gradB: "#463060",
    theme: {
      "--primary": "#6a4c93",
      "--primary-active": "#5c4080",
      "--primary-strong": "#463060",
      "--primary-soft": "#e6e0f0",
      "--grad-a": "#6a4c93",
      "--grad-b": "#463060",
      "--sh-hover": "0 10px 28px rgba(106, 76, 147, 0.2)",
      "--sh-front": "0 8px 24px rgba(106, 76, 147, 0.3)",
    },
    seal: { cn: "新", en: "3.0" },
    seriesColor: "#6a4c93",
    colorClass: "c-violet",
    badgeHtml: '<span class="tag-30">3.0</span><span class="tag-new">NEW</span>',
    kicker: "New Standards 2021 · Levels 1–4",
    heroTitle: "新 HSK 3.0",
    heroSub: "2021 新标准 · 三级九等新大纲",
    heroEn: "New 2021 standard, Levels 1–4",
    desc: "2021 新标准 · 三级九等新大纲",
    descEn: "New 2021 standard, Levels 1–4",
    volUnit: "Volumes",
    levelWord: "Level",
    units: [
      { id: 1, label: "HSK 1", available: true },
      { id: 2, label: "HSK 2", available: true },
      { id: 3, label: "HSK 3", available: true },
      { id: 4, label: "HSK 4", available: true },
    ],
  },
  {
    id: "huihua360",
    name: "标准汉语会话 360 句",
    nameEn: "Conversational Chinese 360",
    gradA: "#2f8f7a",
    gradB: "#1b5245",
    theme: {
      "--primary": "#2f8f7a",
      "--primary-active": "#277a68",
      "--primary-strong": "#1b5245",
      "--primary-soft": "#d5ebe5",
      "--grad-a": "#2f8f7a",
      "--grad-b": "#1b5245",
      "--sh-hover": "0 10px 28px rgba(47, 143, 122, 0.2)",
      "--sh-front": "0 8px 24px rgba(47, 143, 122, 0.3)",
    },
    seal: { cn: "话", en: "360" },
    seriesColor: "#2f8f7a",
    colorClass: "c-jade",
    kicker: "Everyday Conversation · 360 Sentences",
    heroTitle: "会话 360 句",
    heroSub: "生活场景口语速成",
    heroEn: "360 everyday conversation sentences",
    desc: "生活场景口语速成",
    descEn: "360 everyday conversation sentences",
    volUnit: "Books",
    levelWord: "Book",
    units: [
      { id: 1, label: "Book 1", available: true },
      { id: 2, label: "Book 2", available: true },
      { id: 3, label: "Book 3", available: true },
      { id: 4, label: "Book 4", available: true },
    ],
  },
  {
    id: "survival",
    name: "生存汉语一本通",
    nameEn: "Survival Chinese",
    gradA: "#bf7a2a",
    gradB: "#7d5216",
    theme: {
      "--primary": "#bf7a2a",
      "--primary-active": "#a86921",
      "--primary-strong": "#7d5216",
      "--primary-soft": "#f4e4cb",
      "--grad-a": "#bf7a2a",
      "--grad-b": "#7d5216",
      "--sh-hover": "0 10px 28px rgba(191, 122, 42, 0.2)",
      "--sh-front": "0 8px 24px rgba(191, 122, 42, 0.3)",
    },
    seal: { cn: "生", en: "通" },
    seriesColor: "#bf7a2a",
    colorClass: "c-amber",
    kicker: "Survival Chinese · Real-life Scenarios",
    heroTitle: "生存汉语",
    heroSub: "点菜 · 问路 · 看病…真实生存场景",
    heroEn: "Survive daily life in China",
    desc: "点菜·问路·看病…真实生存场景",
    descEn: "Survive daily life in China",
    volUnit: "Books",
    levelWord: "Book",
    units: [
      { id: 1, label: "生存汉语", available: true },
    ],
  },
];

export function getSeries(seriesId) {
  return COURSE_REGISTRY.find((c) => c.id === seriesId) || null;
}

// CSS-variable overrides that repaint a course's pages in its own color.
// Returns {} for unknown series or ones without a theme (→ default coral tokens).
export function seriesTheme(seriesId) {
  return getSeries(seriesId)?.theme || {};
}
