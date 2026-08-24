// Thin wrapper around the browser Web Speech API (speechSynthesis), zh-CN.
// Free, no API key. Voice availability varies by device/browser.

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

// Voices load asynchronously in some browsers.
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickVoice();
  };
}

export function isTTSAvailable() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text, { rate = 0.85 } = {}) {
  if (!text || !isTTSAvailable()) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = rate;
    const v = pickVoice();
    if (v) u.voice = v;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch (e) {
    /* no-op: TTS is a nice-to-have */
  }
}
