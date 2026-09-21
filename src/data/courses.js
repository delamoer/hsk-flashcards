// Course registry — the single source of truth for what courses exist.
// Adding a new course: append an entry here + add its source in scripts/convert.py.
// The UI (HomeView, CourseUnitCard) is driven entirely by this list.

// Classical (典籍·线装) presentation fields consumed by LibraryView / SeriesBooksView:
//   seal{cn,en}  朱红印章字   · seriesColor  --sc accent   · colorClass  书封色
//   kicker/heroSub/heroEn/desc/descEn  门面文案 · volUnit  册数单位 · levelWord 书封小字
//   single: 单册系列（总览点击直达课次，跳过选册）· badgeHtml 系列徽标（如 3.0/NEW）
export const COURSE_REGISTRY = [
  {
    id: "hsk",
    name: "标准 HSK 标准系列",
    nameEn: "HSK Standard Course",
    gradA: "#e5533d",
    gradB: "#b23a28",
    theme: {
      "--primary": "#e5533d",
      "--primary-active": "#c8442f",
      "--primary-strong": "#a5341f",
      "--primary-soft": "#f6ddd4",
      "--grad-a": "#e5533d",
      "--grad-b": "#b23a28",
      "--sh-hover": "0 10px 28px rgba(229, 83, 61, 0.2)",
      "--sh-front": "0 8px 24px rgba(229, 83, 61, 0.3)",
    },
    seal: { cn: "标", en: "HSK" },
    seriesColor: "#e5533d",
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
    gradA: "#6d5ce6",
    gradB: "#4a38c0",
    theme: {
      "--primary": "#6d5ce6",
      "--primary-active": "#5a48d6",
      "--primary-strong": "#4a38c0",
      "--primary-soft": "#e7e3fb",
      "--grad-a": "#6d5ce6",
      "--grad-b": "#4a38c0",
      "--sh-hover": "0 10px 28px rgba(109, 92, 230, 0.2)",
      "--sh-front": "0 8px 24px rgba(109, 92, 230, 0.3)",
    },
    seal: { cn: "新", en: "3.0" },
    seriesColor: "#6d5ce6",
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
    gradA: "#12a594",
    gradB: "#0b7568",
    theme: {
      "--primary": "#12a594",
      "--primary-active": "#0e8b7d",
      "--primary-strong": "#0b7568",
      "--primary-soft": "#d3f2ec",
      "--grad-a": "#12a594",
      "--grad-b": "#0b7568",
      "--sh-hover": "0 10px 28px rgba(17, 153, 142, 0.2)",
      "--sh-front": "0 8px 24px rgba(17, 153, 142, 0.3)",
    },
    seal: { cn: "话", en: "360" },
    seriesColor: "#12a594",
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
    gradA: "#d98324",
    gradB: "#9a5b12",
    theme: {
      "--primary": "#d98324",
      "--primary-active": "#c2731c",
      "--primary-strong": "#9a5b12",
      "--primary-soft": "#f9e6c9",
      "--grad-a": "#d98324",
      "--grad-b": "#9a5b12",
      "--sh-hover": "0 10px 28px rgba(217, 131, 36, 0.2)",
      "--sh-front": "0 8px 24px rgba(217, 131, 36, 0.3)",
    },
    seal: { cn: "生", en: "通" },
    seriesColor: "#d98324",
    colorClass: "c-amber",
    single: true,
    kicker: "Survival Chinese · A Single Volume",
    heroTitle: "生存汉语一本通",
    heroSub: "点菜 · 问路 · 看病…真实生存场景",
    heroEn: "Survive daily life in China",
    desc: "点菜·问路·看病…真实生存场景",
    descEn: "Survive daily life in China",
    volUnit: "Volume · 36课",
    levelWord: "",
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
