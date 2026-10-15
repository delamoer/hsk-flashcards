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
}

// Plays on behalf of the run started at `my`; a stop() in between makes it a no-op.
function playUrl(url, rate, my) {
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
      finish(my);
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
export function speak(text, { rate = 0.85 } = {}) {
  if (!text) return;
  if (nowPlaying.value === text) return stop();
  stop();
  const my = token;
  nowPlaying.value = text; // show ⏹ right away, even while the manifest loads
  loadManifest().then(() => {
    const url = urlFor(text);
    if (url) {
      playUrl(url, rate, my).catch(() => speakFallback(text, rate, my));
    } else {
      speakFallback(text, rate, my);
    }
  });
}
