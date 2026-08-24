// Split pinyin into syllables and wrap each in a tone-colored span.
// Tone palette (Pleco-standard) is defined in main.css: .t1–.t4 + .t0 (neutral).

const TONE = {
  "ā": 1, "ē": 1, "ī": 1, "ō": 1, "ū": 1, "ǖ": 1,
  "á": 2, "é": 2, "í": 2, "ó": 2, "ú": 2, "ǘ": 2,
  "ǎ": 3, "ě": 3, "ǐ": 3, "ǒ": 3, "ǔ": 3, "ǚ": 3,
  "à": 4, "è": 4, "ì": 4, "ò": 4, "ù": 4, "ǜ": 4,
};

// Greedy syllable matcher: optional initial + vowel cluster + optional coda.
const SYL =
  /([bpmfdtnlgkhjqxzcsryw]|[zcs]h)?([iuüv]?[aeiouüvāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]+)(ng|n|r)?/gi;

export function toneOf(syllable) {
  for (const ch of syllable) {
    if (TONE[ch]) return TONE[ch];
  }
  return 0;
}

/** Return HTML string with each syllable wrapped in a tone-color span. */
export function colorPinyin(pinyin) {
  if (!pinyin) return "";
  return pinyin.replace(/\S+/g, (chunk) =>
    chunk.replace(SYL, (m) => (m ? `<span class="t${toneOf(m)}">${m}</span>` : m))
  );
}
