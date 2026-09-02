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
