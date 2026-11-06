// Search-engine metadata for the public pages (the ones a signed-out visitor can open).
// Applied on every navigation (router.afterEach) and baked into the static copies that
// scripts/prerender.py writes to real paths (/pinyin/ …) — Google ignores everything after
// "#", so those copies are what gets indexed. The app itself keeps routing by hash, so
// students' bookmarks (#/course/…) are untouched.

export const SITE = "https://delamoer.github.io/hsk-flashcards/";
const DEFAULT_TITLE = "学中文 · Learn Chinese";

// key = route name; path = the page's real URL under SITE (also its prerendered location)
export const SEO_PAGES = {
  home: {
    path: "",
    title: "学中文 Learn Chinese — free pinyin chart, grammar, songs and poems, with a real teacher",
    description:
      "Lesson-by-lesson Chinese courses with a full-time teacher, plus free tools: a grammar index you can search in English, Chinese songs with their MVs, classical poems with pinyin and English, and a pinyin chart with native-speaker recordings.",
  },
  pinyin: {
    path: "pinyin/",
    title: "Pinyin chart with audio — every syllable by a native speaker · 学中文 Learn Chinese",
    description:
      "Free interactive pinyin chart: 399 syllables, 21 initials and 24 finals, each recorded by a native speaker, with English sound-alikes and the four tones. No sign-up.",
  },
  grammar: {
    path: "grammar/",
    title: "Chinese grammar index — 792 points from HSK 1–6 and more · 学中文 Learn Chinese",
    description:
      "Search 792 Chinese grammar points from 15 textbooks (HSK 1–6, New HSK 3.0, Conversational Chinese 360, Discover China) in English, Chinese or pinyin. Each has its structure, examples, pinyin and English. Free, no sign-up.",
  },
  music: {
    path: "music/",
    title: "Learn Chinese with songs — 43 Chinese-style pop songs with MVs · 学中文 Learn Chinese",
    description:
      "43 中国风 Chinese-style pop songs, from Jay Chou’s “Blue and White Porcelain” to classic kung fu and fantasy drama themes — each with its MV, an English note and key words you can tap to hear. Free, no sign-up.",
  },
  poems: {
    path: "poems/",
    title: "Classical Chinese poems with pinyin and English translation — from the Book of Songs to the Qing · 学中文 Learn Chinese",
    description:
      "92 classical Chinese poems on one handscroll, from the Book of Songs to the Qing dynasty — Li Bai, Du Fu, Su Shi, Li Qingzhao and more. Each poem has pinyin, a line-by-line English translation, word meanings and its imagery explained. Free, no sign-up.",
  },
};

// One page per poem (/poems/:slug) — set by PoemView once the poem has loaded.
const DYNASTY_EN = { 先秦: "Pre-Qin", 汉: "Han", 魏晋南北朝: "Six Dynasties", 唐: "Tang", 宋: "Song", 元: "Yuan", 明清: "Ming–Qing" };
export function poemSeo(p) {
  const by = p.authorEn ? ` by ${p.authorEn}` : "";
  return {
    path: `poems/${p.slug}/`,
    // short enough that Google shows it whole; the English title goes into the description
    title: `${p.title} ${p.titlePy}${p.authorEn ? ` — ${p.authorEn}` : ""}: pinyin & English translation`,
    description:
      `${p.title} (${p.titleEn})${by}, ${DYNASTY_EN[p.dynasty] || p.dynasty} dynasty: the Chinese text with pinyin, ` +
      `a line-by-line English translation, word meanings and the poem’s imagery explained. ${p.intro || ""}`.trim(),
  };
}

function setTag(selector, create, attr, value) {
  let el = document.head.querySelector(selector);
  if (value == null) return el?.remove();
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}
const meta = (key, name) => () => Object.assign(document.createElement("meta"), { [key]: name });

// `isPublicView` is false for "/" when signed in (that's the library, not the landing page).
export function applySeo(routeName, isPublicView = true) {
  setPage(isPublicView ? SEO_PAGES[routeName] : null);
}

export function applyPoemSeo(poem) {
  setPage(poem ? poemSeo(poem) : null);
}

function setPage(page) {
  document.title = page?.title || DEFAULT_TITLE;
  const url = page ? SITE + page.path : null;
  setTag('meta[name="description"]', meta("name", "description"), "content", page?.description);
  setTag('link[rel="canonical"]', () => Object.assign(document.createElement("link"), { rel: "canonical" }), "href", url);
  setTag('meta[property="og:title"]', meta("property", "og:title"), "content", page?.title);
  setTag('meta[property="og:description"]', meta("property", "og:description"), "content", page?.description);
  setTag('meta[property="og:url"]', meta("property", "og:url"), "content", url);
  setTag('meta[property="og:type"]', meta("property", "og:type"), "content", page ? "website" : null);
  setTag('meta[property="og:site_name"]', meta("property", "og:site_name"), "content", page ? "学中文 Learn Chinese" : null);
}
