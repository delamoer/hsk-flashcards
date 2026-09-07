<template>
  <div class="stage">
    <!-- LEFT — brand hero -->
    <div class="hero">
      <div class="orb o1"></div><div class="orb o2"></div><div class="orb o3"></div>
      <div class="brushmark">学</div>

      <div class="logo">HSK <b>单词闪卡</b></div>

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
      <div class="corner"><i class="a"></i><i class="b"></i><i class="c"></i><i class="d"></i></div>
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

/* ── LEFT — brand hero ── */
.hero {
  position: relative;
  overflow: hidden;
  padding: 44px 48px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background:
    radial-gradient(120% 90% at 80% 8%, rgba(255, 255, 255, 0.22), transparent 46%),
    radial-gradient(90% 90% at 12% 100%, rgba(240, 69, 63, 0.4), transparent 55%),
    linear-gradient(145deg, #ff7a6b 0%, var(--grad-a) 42%, var(--grad-b) 100%);
}
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(48px);
  z-index: 0;
  pointer-events: none;
}
.orb.o1 {
  width: 340px;
  height: 340px;
  background: rgba(255, 180, 120, 0.55);
  top: -80px;
  left: -60px;
  animation: drift1 16s ease-in-out infinite;
}
.orb.o2 {
  width: 260px;
  height: 260px;
  background: rgba(255, 90, 90, 0.5);
  bottom: -40px;
  right: 20px;
  animation: drift2 19s ease-in-out infinite;
}
.orb.o3 {
  width: 150px;
  height: 150px;
  background: rgba(78, 205, 196, 0.28);
  top: 44%;
  right: 20%;
  animation: drift1 22s ease-in-out infinite;
}
@keyframes drift1 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(26px, -22px); }
}
@keyframes drift2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-30px, 18px); }
}
/* grain texture */
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.5;
  mix-blend-mode: overlay;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
}
/* dotted mask texture */
.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.4;
  pointer-events: none;
  background-image: radial-gradient(rgba(255, 255, 255, 0.16) 1.3px, transparent 1.3px);
  background-size: 24px 24px;
  -webkit-mask-image: linear-gradient(160deg, #000, transparent 68%);
  mask-image: linear-gradient(160deg, #000, transparent 68%);
}
.brushmark {
  position: absolute;
  z-index: 0;
  font-family: "Ma Shan Zheng", cursive;
  font-size: 460px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.1);
  bottom: -130px;
  right: -40px;
  user-select: none;
  pointer-events: none;
}
.logo {
  position: relative;
  z-index: 3;
  font-weight: 800;
  font-size: 18px;
  letter-spacing: 0.3px;
}
.logo b { font-weight: 900; }

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
  background: rgba(255, 255, 255, 0.5);
  filter: blur(60px);
  z-index: 0;
}
.fc {
  position: absolute;
  width: 228px;
  border-radius: var(--r-xl);
  background: #fff;
  color: var(--ink);
  box-shadow: 0 24px 60px rgba(43, 43, 51, 0.26);
  padding: 24px 24px 22px;
}
.fc.back2 { transform: rotate(9deg) translate(42px, 16px) scale(0.9); opacity: 0.5; }
.fc.back1 { transform: rotate(-7deg) translate(-34px, 8px) scale(0.95); opacity: 0.78; }
.fc.front {
  transform: rotate(-2deg);
  border-top: 4px solid var(--primary);
  animation: floatcard 6s ease-in-out infinite;
}
@keyframes floatcard {
  0%, 100% { transform: rotate(-2deg) translateY(0); }
  50% { transform: rotate(-2deg) translateY(-12px); }
}
.fc .top { display: flex; align-items: center; justify-content: space-between; }
.fc .lvl {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1px;
  color: var(--muted);
  text-transform: uppercase;
}
.fc .spk {
  width: 30px;
  height: 30px;
  border-radius: var(--r-pill);
  background: var(--accent-soft);
  color: var(--accent);
  display: grid;
  place-items: center;
  font-size: 14px;
}
.fc .char {
  font-family: var(--han);
  font-weight: 900;
  font-size: 92px;
  line-height: 1.08;
  text-align: center;
  margin: 2px 0 8px;
}
.fc .py { text-align: center; font-weight: 800; font-size: 22px; }
.fc .py .t2 { color: var(--tone2); }
.fc .mean {
  text-align: center;
  font-weight: 700;
  font-size: 15px;
  color: var(--body);
  margin-top: 4px;
}
.fc .pdots { display: flex; gap: 5px; justify-content: center; margin-top: 16px; }
.fc .pdots i { width: 6px; height: 6px; border-radius: 50%; background: var(--hairline); }
.fc .pdots i.on { width: 18px; border-radius: var(--r-pill); background: var(--primary); }

.herofoot { position: relative; z-index: 3; }
.tagline { font-size: 16px; font-weight: 800; line-height: 1.5; }
.tagline span {
  display: block;
  font-size: 12px;
  font-weight: 600;
  opacity: 0.85;
  margin-top: 4px;
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
.corner { position: absolute; top: 30px; right: 34px; display: flex; gap: 6px; }
.corner i { width: 9px; height: 9px; border-radius: 50%; }
.corner .a { background: var(--tone1); }
.corner .b { background: var(--tone2); }
.corner .c { background: var(--tone3); }
.corner .d { background: var(--tone4); }
.form { width: 100%; max-width: 340px; }
.welcome { font-size: 29px; font-weight: 900; letter-spacing: -0.2px; }
.welcome i {
  display: block;
  font-style: normal;
  font-size: 14px;
  font-weight: 600;
  color: var(--muted);
  margin-top: 4px;
}
.fields { margin-top: 28px; display: flex; flex-direction: column; gap: 16px; }
.f { display: flex; flex-direction: column; gap: 6px; }
.f .lab { font-size: 13px; font-weight: 800; color: var(--ink); }
.f .lab em { font-style: normal; color: var(--muted); font-weight: 600; margin-left: 4px; }
.f input {
  width: 100%;
  font-family: var(--ui);
  font-size: 15px;
  color: var(--ink);
  background: var(--card);
  border: 1.5px solid var(--hairline);
  border-radius: var(--r-pill);
  padding: 13px 18px;
  outline: none;
  transition: border-color 0.18s, box-shadow 0.18s;
}
.f input::placeholder { color: var(--muted-soft); }
.f input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-soft); }
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
  border-radius: var(--r-pill);
  background: linear-gradient(135deg, var(--grad-a), var(--grad-b));
  color: #fff;
  font-weight: 800;
  font-size: 16px;
  box-shadow: var(--sh-hover);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform 0.15s, opacity 0.15s;
}
.submit i { font-style: normal; font-size: 12px; font-weight: 600; opacity: 0.85; }
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
  font-size: 13px;
  font-weight: 700;
  color: var(--body);
  line-height: 1.5;
}
.hint span { font-size: 11px; font-weight: 600; color: var(--muted); }

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; }
}
@media (max-width: 820px) {
  .stage { grid-template-columns: 1fr; }
  .hero { display: none; }
}
</style>
