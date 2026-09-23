<template>
  <div class="stage">
    <!-- LEFT — brand hero (朱红函套) -->
    <div class="hero">
      <div class="frame"></div>
      <div class="brushmark">学</div>

      <div class="logo"><span class="seal">學</span><span class="wm">学中文<b>Learn Chinese</b></span></div>

      <div class="deck">
        <div class="halo"></div>
        <div class="fc back2"><div class="top"><span class="lvl">HSK 1</span></div><div class="char">好</div></div>
        <div class="fc back1"><div class="top"><span class="lvl">HSK 1</span></div><div class="char">你</div></div>
        <div class="fc front">
          <div class="top"><span class="lvl">HSK 1 · 第 1 课</span><span class="spk">🔊</span></div>
          <div class="char">学</div>
          <div class="py"><span class="t2">xué</span></div>
          <div class="mean">to learn · 学习</div>
          <div class="pdots"><i class="on"></i><i></i><i></i></div>
        </div>
      </div>

      <div class="herofoot">
        <div class="tagline">
          按课学中文，一次一个字
          <span>Learn Chinese lesson by lesson, one character at a time</span>
        </div>
      </div>
    </div>

    <!-- RIGHT — form -->
    <div class="panel">
      <form class="form" @submit.prevent="submit">
        <div class="welcome">欢迎回来<i>Welcome back</i></div>

        <div class="fields">
          <label class="f">
            <span class="lab">邮箱 <em>Email</em></span>
            <input v-model="email" type="email" autocomplete="email" placeholder="you@example.com" required />
          </label>
          <label class="f">
            <span class="lab">密码 <em>Password</em></span>
            <div class="pwwrap">
              <input
                v-model="password"
                :type="showPw ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
                required
              />
              <button type="button" class="peek" @click="showPw = !showPw" :title="showPw ? '隐藏' : '显示'">
                {{ showPw ? "🙈" : "👁" }}
              </button>
            </div>
          </label>
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <button class="submit" type="submit" :disabled="busy">
          {{ busy ? "登录中…" : "登录" }}
          <i v-if="!busy">Sign in</i>
        </button>

        <p class="hint">
          没有账号？请联系老师开通<br />
          <span>No account? Ask your teacher to create one.</span>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const route = useRoute();
const { signIn, isLoggedIn } = useAuth();

const email = ref("");
const password = ref("");
const showPw = ref(false);
const busy = ref(false);
const error = ref("");

// If already logged in, bounce to home (or the intended redirect).
watch(
  isLoggedIn,
  (v) => {
    if (v) router.replace(route.query.redirect || "/");
  },
  { immediate: true }
);

async function submit() {
  error.value = "";
  busy.value = true;
  const { error: err } = await signIn(email.value.trim(), password.value);
  busy.value = false;
  if (err) {
    error.value = translateError(err.message);
  }
  // On success, onAuthStateChange flips isLoggedIn → the watcher redirects.
}

function translateError(msg) {
  if (/invalid login credentials/i.test(msg)) return "邮箱或密码错误 · Invalid email or password";
  if (/email not confirmed/i.test(msg)) return "邮箱未验证 · Email not confirmed";
  return msg;
}
</script>

<style scoped>
.stage {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  min-height: 100vh;
}

/* ── LEFT — brand hero (朱红函套) ── */
.hero {
  position: relative;
  overflow: hidden;
  padding: 44px 48px;
  color: #fbeecf;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background:
    radial-gradient(120% 90% at 82% 6%, rgba(255, 236, 200, 0.12), transparent 48%),
    linear-gradient(150deg, rgba(64, 50, 36, 0.82) 0%, rgba(44, 34, 24, 0.62) 46%, rgba(28, 22, 16, 0.74) 100%),
    url("../assets/img/hero/hero-main.webp") center / cover no-repeat;
}
/* 宣纸纹理 */
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.5;
  mix-blend-mode: overlay;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
}
/* 金色双线函套框 */
.frame {
  position: absolute;
  inset: 18px;
  z-index: 2;
  border: 1px solid rgba(232, 184, 75, 0.55);
  border-radius: 6px;
  pointer-events: none;
}
.frame::after {
  content: "";
  position: absolute;
  inset: 5px;
  border: 1px solid rgba(232, 184, 75, 0.28);
  border-radius: 4px;
}
.brushmark {
  position: absolute;
  z-index: 0;
  font-family: var(--serif-cn);
  font-weight: 900;
  font-size: 460px;
  line-height: 1;
  color: rgba(255, 236, 200, 0.08);
  bottom: -120px;
  right: -30px;
  user-select: none;
  pointer-events: none;
}
.logo {
  position: relative;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.logo .seal {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: linear-gradient(145deg, var(--seal-a), var(--seal-b));
  color: #fbe7d4;
  display: grid;
  place-items: center;
  font-family: var(--serif-cn);
  font-weight: 900;
  font-size: 22px;
  box-shadow: inset 0 0 0 1.5px rgba(251, 231, 212, 0.55), 0 2px 5px rgba(0, 0, 0, 0.3);
}
.logo .wm {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  font-family: var(--serif-cn);
  font-weight: 700;
  font-size: 19px;
  letter-spacing: 2px;
}
.logo .wm b {
  font-family: var(--caps);
  font-weight: 500;
  font-size: 10px;
  letter-spacing: 3px;
  color: rgba(251, 238, 207, 0.7);
  text-transform: uppercase;
}

/* flashcard stack */
.deck {
  position: relative;
  z-index: 2;
  margin: auto 0;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.halo {
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: rgba(255, 236, 200, 0.4);
  filter: blur(60px);
  z-index: 0;
}
.fc {
  position: absolute;
  width: 228px;
  border-radius: 14px;
  background: linear-gradient(160deg, #fbf7ee, #efe4d0);
  color: var(--ink);
  border: 1px solid var(--line);
  box-shadow: 0 24px 60px rgba(45, 30, 10, 0.4);
  padding: 22px 22px 20px;
}
.fc.back2 { transform: rotate(9deg) translate(42px, 16px) scale(0.9); opacity: 0.5; }
.fc.back1 { transform: rotate(-7deg) translate(-34px, 8px) scale(0.95); opacity: 0.78; }
.fc.front {
  transform: rotate(-2deg);
  animation: floatcard 6s ease-in-out infinite;
}
/* gold inner frame */
.fc.front::after {
  content: "";
  position: absolute;
  inset: 10px;
  border: 1px solid var(--gold-lt);
  border-radius: 9px;
  opacity: 0.6;
  pointer-events: none;
}
@keyframes floatcard {
  0%, 100% { transform: rotate(-2deg) translateY(0); }
  50% { transform: rotate(-2deg) translateY(-12px); }
}
.fc .top { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 2; }
.fc .lvl {
  font-family: var(--caps);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: var(--gold-deep);
  text-transform: uppercase;
}
.fc .spk {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--paper);
  border: 1px solid var(--line);
  color: var(--gold-deep);
  display: grid;
  place-items: center;
  font-size: 13px;
}
.fc .char {
  font-family: var(--serif-cn);
  font-weight: 700;
  font-size: 88px;
  line-height: 1.08;
  letter-spacing: 4px;
  text-align: center;
  margin: 4px 0 6px;
  color: var(--ink);
  text-shadow: 1px 1px 0 var(--gold-lt);
  position: relative;
  z-index: 2;
}
.fc .py { text-align: center; font-family: var(--ui); font-weight: 700; font-size: 22px; position: relative; z-index: 2; }
.fc .py .t2 { color: var(--tone2); }
.fc .mean {
  text-align: center;
  font-weight: 600;
  font-size: 15px;
  color: var(--ink-soft, #4a3d2a);
  margin-top: 4px;
  position: relative;
  z-index: 2;
}
.fc .pdots { display: flex; gap: 5px; justify-content: center; margin-top: 16px; position: relative; z-index: 2; }
.fc .pdots i { width: 6px; height: 6px; border-radius: 50%; background: var(--line); }
.fc .pdots i.on { width: 18px; border-radius: var(--r-pill); background: var(--cinnabar); }

.herofoot { position: relative; z-index: 3; }
.tagline { font-family: var(--serif-cn); font-size: 17px; font-weight: 600; letter-spacing: 1px; line-height: 1.5; }
.tagline span {
  display: block;
  font-family: var(--serif-en);
  font-style: italic;
  font-size: 13px;
  font-weight: 500;
  opacity: 0.82;
  margin-top: 4px;
  letter-spacing: 0.5px;
}

/* ── RIGHT — form ── */
.panel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: var(--canvas);
}
.form { width: 100%; max-width: 340px; }
.welcome { font-family: var(--serif-cn); font-size: 32px; font-weight: 900; letter-spacing: 2px; color: var(--ink); }
.welcome i {
  display: block;
  font-family: var(--serif-en);
  font-style: italic;
  font-size: 15px;
  font-weight: 500;
  color: var(--muted);
  margin-top: 4px;
}
.fields { margin-top: 28px; display: flex; flex-direction: column; gap: 16px; }
.f { display: flex; flex-direction: column; gap: 6px; }
.f .lab { font-family: var(--serif-cn); font-size: 13px; font-weight: 700; color: var(--ink); }
.f .lab em { font-style: normal; font-family: var(--caps); font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); font-weight: 500; margin-left: 5px; }
.f input {
  width: 100%;
  font-family: var(--ui);
  font-size: 15px;
  color: var(--ink);
  background: linear-gradient(160deg, #fbf7ee, #f3ead9);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 13px 18px;
  outline: none;
  transition: border-color 0.18s, box-shadow 0.18s;
}
.f input::placeholder { color: var(--muted-soft); }
.f input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px var(--primary-soft); }
.pwwrap { position: relative; }
.pwwrap input { padding-right: 48px; }
.peek {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: var(--r-pill);
  display: grid;
  place-items: center;
  font-size: 16px;
}
.error {
  margin-top: 16px;
  font-size: 13px;
  font-weight: 700;
  color: var(--error);
  background: var(--primary-soft);
  border-radius: var(--r-sm);
  padding: 9px 12px;
  text-align: center;
}
.submit {
  position: relative;
  overflow: hidden;
  margin-top: 24px;
  width: 100%;
  height: 52px;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  background: linear-gradient(145deg, var(--seal-a), var(--seal-b));
  color: #fbeecf;
  font-family: var(--serif-cn);
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 2px;
  box-shadow: inset 0 0 0 1px rgba(251, 231, 212, 0.25), 0 6px 16px -6px rgba(139, 42, 31, 0.5);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.15s, opacity 0.15s;
}
.submit i { font-style: normal; font-family: var(--caps); font-size: 11px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; opacity: 0.85; }
.submit:hover:not(:disabled) { transform: translateY(-2px); }
.submit:disabled { opacity: 0.7; cursor: default; }
.submit::after {
  content: "";
  position: absolute;
  top: 0;
  left: -60%;
  width: 40%;
  height: 100%;
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.45), transparent);
  transform: skewX(-20deg);
  animation: shine 4.5s ease-in-out infinite;
}
@keyframes shine {
  0%, 60% { left: -60%; }
  80%, 100% { left: 130%; }
}
.hint {
  margin-top: 26px;
  text-align: center;
  font-family: var(--serif-cn);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-soft, #4a3d2a);
  line-height: 1.6;
}
.hint span { font-family: var(--serif-en); font-style: italic; font-size: 12px; font-weight: 500; color: var(--muted); }

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; }
}
@media (max-width: 820px) {
  .stage { grid-template-columns: 1fr; }
  .hero { display: none; }
}
</style>
