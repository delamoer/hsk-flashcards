// Part-of-speech (词性) label map. Word data carries a compact `pos` code
// (from scripts/pos.tsv, hand-curated); the UI renders the bilingual label.
// pos === null/undefined → not yet tagged, shown as nothing.
export const POS_LABELS = {
  n: { zh: "名词", en: "noun" },
  v: { zh: "动词", en: "verb" },
  mv: { zh: "助动词", en: "modal verb" },
  a: { zh: "形容词", en: "adjective" },
  adv: { zh: "副词", en: "adverb" },
  pron: { zh: "代词", en: "pronoun" },
  num: { zh: "数词", en: "numeral" },
  mw: { zh: "量词", en: "measure word" },
  prep: { zh: "介词", en: "preposition" },
  conj: { zh: "连词", en: "conjunction" },
  part: { zh: "助词", en: "particle" },
  intj: { zh: "叹词", en: "interjection" },
  idiom: { zh: "成语", en: "idiom" },
};

export function posLabel(code) {
  return POS_LABELS[code] || null;
}
