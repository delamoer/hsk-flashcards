// TTS with two tiers:
//   1. Pre-generated MP3 (edge-tts neural voice) — looked up via manifest.json
//   2. Browser speechSynthesis fallback (robotic but universal)
//
// Manifest is loaded once on first use. Words without a pre-generated file
// fall through to speechSynthesis silently.

// ── Pre-generated audio ───────────────────────────────────────────────────

let manifest = null;

function loadManifest() {
  if (manifest !== null) return Promise.resolve(manifest);
  return fetch("./audio/manifest.json")
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}))
    .then((data) => {
      manifest = data;
      return manifest;
    });
}

// Preload manifest in the background as soon as the module is imported.
loadManifest();

function playFile(filename) {
  return new Promise((resolve, reject) => {
    const audio = new Audio(`./audio/${filename}`);
    audio.onended = resolve;
    audio.onerror = reject;
    audio.play().catch(reject);
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
  loadManifest().then((m) => {
    const filename = m[text];
    if (filename) {
      playFile(filename).catch(() => speakFallback(text, rate));
    } else {
      speakFallback(text, rate);
    }
  });
}
