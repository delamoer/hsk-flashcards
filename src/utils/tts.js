// TTS with two tiers:
//   1. Pre-generated MP3 (edge-tts neural voice) hosted on Supabase Storage —
//      looked up via manifest.json, fetched from the public bucket URL.
//   2. Browser speechSynthesis fallback (robotic but universal).
//
// Audio is NOT bundled in the build; it lives in a public Supabase Storage bucket
// (`audio`). Manifest is loaded once on first use. Words without a pre-generated
// file fall through to speechSynthesis silently.

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

function playUrl(url, rate = 1) {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    // Speed up / slow down the pre-generated MP3 while keeping pitch natural
    // (preservesPitch is on by default in modern browsers; set it explicitly
    // for Safari/Firefox prefixed variants).
    audio.playbackRate = rate;
    audio.preservesPitch = true;
    audio.mozPreservesPitch = true;
    audio.webkitPreservesPitch = true;
    audio.onended = resolve;
    audio.onerror = reject;
    audio.play().catch(reject);
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

function speakFallback(text, rate) {
  if (!text || !("speechSynthesis" in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = rate;
    const v = pickVoice();
    if (v) u.voice = v;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    /* TTS is a nice-to-have */
  }
}

// ── Public API ────────────────────────────────────────────────────────────

export function isTTSAvailable() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text, { rate = 0.85 } = {}) {
  if (!text) return;
  loadManifest().then(() => {
    const url = urlFor(text);
    if (url) {
      playUrl(url, rate).catch(() => speakFallback(text, rate));
    } else {
      speakFallback(text, rate);
    }
  });
}
