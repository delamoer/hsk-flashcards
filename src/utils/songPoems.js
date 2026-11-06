// 中国风 ↔ 古诗词 links. They live in the hand-owned music.json, on each song:
//   poems: [{ slug, line, hl:[…], lyric, rel }]   rel = quote (引用原句) | adapt (化用) | full (诗词新唱: the lyric IS the poem)
// `line` is the index into the poem's lines and `hl` the characters of that line the lyric echoes.
// MusicView reads them per song; PoemView reads them backwards through songsOfPoem().

export const REL = {
  quote: { seal: "引", zh: "引用原句", en: "Quoted" },
  adapt: { seal: "化", zh: "化用", en: "Adapted" },
  full: { seal: "唱", zh: "整首谱曲", en: "Sung in full" },
};

// split a poem line into [{t, on}] runs, `on` where a character belongs to one of the echoed words
// (first occurrence of each, counted over Chinese characters only)
export function markLine(zh, hl = []) {
  const chars = [...zh];
  const hanIdx = chars.map((c, i) => (/\p{Script=Han}/u.test(c) ? i : -1)).filter((i) => i >= 0);
  const han = hanIdx.map((i) => chars[i]).join("");
  const on = new Set();
  for (const w of hl) {
    const at = han.indexOf(w);
    if (at >= 0) for (let j = 0; j < w.length; j++) on.add(hanIdx[at + j]);
  }
  const out = [];
  chars.forEach((c, i) => {
    const o = on.has(i);
    if (out.length && out[out.length - 1].on === o) out[out.length - 1].t += c;
    else out.push({ t: c, on: o });
  });
  return out;
}

// compact labels for the narrow 出自古诗词 column: 江城子·乙卯正月二十日夜记梦 → 江城子 (long subtitles only),
// 佚名（《诗经·秦风》） → 《诗经·秦风》
export const shortTitle = (t) => (t.length > 7 ? t.split(/[·（]/)[0] : t);
export const shortAuthor = (a) => a.match(/^佚名（(.+)）$/)?.[1] || a;

// every song that links to a poem: [{ n (1-based ?song= number), song, link }]
let _bySlug = null;
export function songsOfPoem(slug) {
  _bySlug ??= import("@/data/music.json").then(({ default: data }) => {
    const map = {};
    data.groups.flatMap((g) => g.songs).forEach((song, i) => {
      for (const link of song.poems || []) (map[link.slug] ??= []).push({ n: i + 1, song, link });
    });
    return map;
  });
  return _bySlug.then((map) => map[slug] || []);
}
