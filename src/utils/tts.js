// TTS with two tiers:
//   1. Pre-generated MP3 (edge-tts neural voice) hosted on Supabase Storage —
//      looked up via manifest.json, fetched from the public bucket URL.
//   2. Browser speechSynthesis fallback (robotic but universal).
//
// Audio is NOT bundled in the build; it lives in a public Supabase Storage bucket
// (`audio`). Manifest is loaded once on first use. Words without a pre-generated
// file fall through to speechSynthesis silently.
//
// Only ONE sound plays at a time: every new play stops the previous one, tapping the
// 🔊 of what's playing stops it (`speak` toggles), Esc stops it, and the router /
// lesson tabs call `stop()` on navigation. `nowPlaying` holds the text (or pinyin
// stem) being played so buttons can swap 🔊 → ⏹.

import { ref } from "vue";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const STORAGE_BASE = SUPABASE_URL
  ? `${SUPABASE_URL}/storage/v1/object/public/audio/`
  : null;

// ── Pre-generated audio (Supabase Storage) ────────────────────────────────

let manifest = null;

function loadManifest() {
  if (manifest !== null) return Promise.resolve(manifest);
  if (!STORAGE_BASE) {
    manifest = {};
    return Promise.resolve(manifest);
  }
  return fetch(`${STORAGE_BASE}manifest.json`)
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}))
    .then((data) => {
      manifest = data;
      return manifest;
    });
}

// Preload manifest in the background as soon as the module is imported.
loadManifest();

function urlFor(text) {
  const file = manifest?.[text];
  return file ? `${STORAGE_BASE}${file}` : null;
}

// ── Single shared player ──────────────────────────────────────────────────

export const nowPlaying = ref(null);
// index of the item playing inside speakSequence (-1 otherwise) — lets a page light up the current line
export const nowIndex = ref(-1);
let current = null; // { audio, done } for the MP3 in flight
let token = 0; // bumped on every stop; stale callbacks compare against it

export function stop() {
  token++;
  if (current) {
    current.audio.pause();
    current.done(); // settle the caller's promise (PinyinView chains on it)
    current = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
  nowPlaying.value = null;
  nowIndex.value = -1;
}

if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nowPlaying.value !== null) stop();
  });
}

function finish(my) {
  if (my !== token) return;
  current = null;
  nowPlaying.value = null;
  nowIndex.value = -1;
}

// Plays on behalf of the run started at `my`; a stop() in between makes it a no-op.
function playUrl(url, rate, my, last = true) {
  return new Promise((resolve, reject) => {
    if (my !== token) return resolve();
    const audio = new Audio(url);
    // Speed up / slow down the pre-generated MP3 while keeping pitch natural
    // (preservesPitch is on by default in modern browsers; set it explicitly
    // for Safari/Firefox prefixed variants).
    audio.playbackRate = rate;
    audio.preservesPitch = true;
    audio.mozPreservesPitch = true;
    audio.webkitPreservesPitch = true;
    current = { audio, done: resolve };
    audio.onended = () => {
      if (last) finish(my); // inside speakSequence only the last clip ends the run
      else if (my === token) current = null;
      resolve();
    };
    audio.onerror = (e) => {
      if (my === token) current = null;
      reject(e);
    };
    audio.play().catch((e) => {
      if (my === token) current = null;
      reject(e);
    });
  });
}

// Warm the browser cache for a batch of texts (e.g. a lesson's words) so the
// first 🔊 tap plays instantly. Fire-and-forget, throttled, deduped.
const preloaded = new Set();
export function preload(texts) {
  loadManifest().then((m) => {
    const urls = [];
    for (const t of texts) {
      if (preloaded.has(t)) continue;
      preloaded.add(t);
      const file = m[t];
      if (file) urls.push(`${STORAGE_BASE}${file}`);
    }
    // limited concurrency so we don't flood the network
    let i = 0;
    const pump = () => {
      if (i >= urls.length) return;
      const url = urls[i++];
      fetch(url).catch(() => {}).finally(pump);
    };
    for (let k = 0; k < 6; k++) pump();
  });
}

// ── Pinyin syllable audio (human recordings, hugolpz/audio-cmn CC-BY-SA) ──
// Stored flat under the same public bucket at pinyin/<stem>.mp3 (e.g. pinyin/ba1.mp3).
// Played by filename stem — no manifest needed. Returns a promise that resolves
// when playback ends (so callers can chain 播放→停顿→跟读).

export function pinyinUrl(stem) {
  return STORAGE_BASE && stem ? `${STORAGE_BASE}pinyin/${stem}.mp3` : null;
}

export function playPinyin(stem, rate = 1) {
  const url = pinyinUrl(stem);
  if (!url) return Promise.reject(new Error("no pinyin audio configured"));
  stop();
  const my = token;
  nowPlaying.value = stem;
  return playUrl(url, rate, my).catch((e) => {
    finish(my);
    throw e;
  });
}

// ── speechSynthesis fallback ──────────────────────────────────────────────

let cachedVoice = null;

function pickVoice() {
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis?.getVoices?.() || [];
  cachedVoice =
    voices.find((v) => v.lang === "zh-CN") ||
    voices.find((v) => /^zh/i.test(v.lang)) ||
    null;
  return cachedVoice;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickVoice();
  };
}

// Plays several clips one after another under one id (古诗词「朗读全诗」= each line's own clip, so the page
// can light up the line being read via nowIndex; a short gap between lines). Tapping again stops it.
export function speakSequence(id, texts, { rate = 0.85, recited = false, gap = 450 } = {}) {
  if (!texts?.length) return;
  if (nowPlaying.value === id) return stop();
  stop();
  const my = token;
  nowPlaying.value = id;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  loadManifest().then(async () => {
    for (let i = 0; i < texts.length; i++) {
      if (my !== token) return;
      nowIndex.value = i;
      const url = urlFor(texts[i]);
      try {
        if (!url) throw new Error("no clip");
        await playUrl(url, recited ? 1 : rate, my, false);
      } catch {
        await sayOnce(texts[i], rate, my);
      }
      if (i < texts.length - 1) await wait(gap);
    }
    finish(my);
  });
}

// browser voice for one text, resolving when it ends (speakSequence's fallback)
function sayOnce(text, rate, my) {
  return new Promise((resolve) => {
    if (my !== token || !("speechSynthesis" in window)) return resolve();
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "zh-CN";
      u.rate = rate;
      const v = pickVoice();
      if (v) u.voice = v;
      u.onend = u.onerror = () => resolve();
      window.speechSynthesis.speak(u);
    } catch {
      resolve();
    }
  });
}

function speakFallback(text, rate, my) {
  if (my !== token) return;
  if (!text || !("speechSynthesis" in window)) return finish(my);
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = rate;
    const v = pickVoice();
    if (v) u.voice = v;
    u.onend = u.onerror = () => finish(my);
    window.speechSynthesis.speak(u);
  } catch {
    /* TTS is a nice-to-have */
    finish(my);
  }
}

// ── Public API ────────────────────────────────────────────────────────────

export function isTTSAvailable() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// Tapping the 🔊 of the text that's already playing stops it instead of restarting.
// Options: `key` looks the MP3 up under another manifest key (古诗词 words are recorded per poem voice as
// "poem-m|故乡", apart from the shared 故乡 clip) — it falls back to `text`'s clip, then to the browser
// voice reading `text`. `recited`: the MP3 was already made slow (古诗词) — play it at its own speed.
export function speak(text, { rate = 0.85, key = null, recited = false } = {}) {
  if (!text) return;
  const id = key || text; // what nowPlaying reports, so a button can tell it's the one playing
  if (nowPlaying.value === id) return stop();
  stop();
  const my = token;
  nowPlaying.value = id; // show ⏹ right away, even while the manifest loads
  loadManifest().then(() => {
    const url = (key && urlFor(key)) || urlFor(text);
    if (url) {
      playUrl(url, recited ? 1 : rate, my).catch(() => speakFallback(text, rate, my));
    } else {
      speakFallback(text, rate, my);
    }
  });
}
