// Course registry — the single source of truth for what courses exist.
// Adding a new course: append an entry here + add its source in scripts/convert.py.
// The UI (HomeView, CourseUnitCard) is driven entirely by this list.

export const COURSE_REGISTRY = [
  {
    id: "hsk",
    name: "HSK 词汇",
    nameEn: "HSK Vocabulary",
    // CSS gradient variable pair defined in main.css
    gradA: "var(--grad-a)",
    gradB: "var(--grad-b)",
    // theme omitted → uses the default coral tokens from main.css
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
    name: "新HSK 3.0 词汇",
    nameEn: "New HSK 3.0 Vocabulary",
    gradA: "#4776e6",
    gradB: "#8e54e9",
    theme: {
      "--primary": "#6d5ce6",
      "--primary-active": "#5a48d6",
      "--primary-strong": "#4a38c0",
      "--primary-soft": "#e7e3fb",
      "--grad-a": "#4776e6",
      "--grad-b": "#8e54e9",
      "--sh-hover": "0 10px 28px rgba(109, 92, 230, 0.2)",
      "--sh-front": "0 8px 24px rgba(109, 92, 230, 0.3)",
    },
    units: [
      { id: 1, label: "HSK 1", available: true },
      { id: 2, label: "HSK 2", available: true },
      { id: 3, label: "HSK 3", available: true },
    ],
  },
  {
    id: "huihua360",
    name: "标准汉语会话360句",
    nameEn: "Standard Chinese Conversation 360",
    gradA: "#11998e",
    gradB: "#38ef7d",
    theme: {
      "--primary": "#12a594",
      "--primary-active": "#0e8b7d",
      "--primary-strong": "#0b7568",
      "--primary-soft": "#d3f2ec",
      "--grad-a": "#11998e",
      "--grad-b": "#38ef7d",
      "--sh-hover": "0 10px 28px rgba(17, 153, 142, 0.2)",
      "--sh-front": "0 8px 24px rgba(17, 153, 142, 0.3)",
    },
    units: [
      { id: 1, label: "Book 1", available: true },
      { id: 2, label: "Book 2", available: true },
      { id: 3, label: "Book 3", available: true },
      { id: 4, label: "Book 4", available: true },
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
