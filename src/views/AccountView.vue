<template>
  <div class="wrap">
    <div class="crumb">
      <router-link to="/">首页 Home</router-link>
      <span class="sep">/</span>
      <span class="cur">账号 Account</span>
    </div>

    <!-- 1 · 资料头部 -->
    <div class="hero">
      <div class="brush">学</div>
      <div class="avatar">{{ avatarText }}</div>
      <div class="hi">
        <div class="name">{{ displayName || emailName }}</div>
        <div class="email">{{ user?.email }}</div>
        <div class="meta">
          <span class="badge">{{ roleLabel }}</span>
          <span v-if="memberSince" class="metaitem"><b>注册</b>{{ memberSince }}</span>
          <span v-if="lastSignIn" class="metaitem"><b>最近登录</b>{{ lastSignIn }}</span>
        </div>
      </div>
    </div>

    <!-- 2 · 学习看板 -->
    <div class="sec">学习进度 · My progress</div>
    <div class="dashcard">
      <div class="dashtop">
        <div class="ring" :style="ringStyle">
          <div class="v"><b>{{ overall.percent }}%</b><span>掌握率</span></div>
        </div>
        <div class="statgrid">
          <router-link class="stat known" :to="{ name: 'mywords', query: { filter: 'known' } }"><b>{{ overall.known }}</b><span><i class="dot"></i>已掌握</span></router-link>
          <router-link class="stat review" :to="{ name: 'mywords', query: { filter: 'review' } }"><b>{{ overall.review }}</b><span><i class="dot"></i>需复习</span></router-link>
          <router-link class="stat star" :to="{ name: 'mywords', query: { filter: 'star' } }"><b>{{ overall.star }}</b><span><i class="dot"></i>收藏</span></router-link>
        </div>
      </div>
      <div class="courses">
        <div v-for="c in courseStats" :key="c.id" class="crow">
          <div class="chead">
            <span class="cname">{{ c.name }}</span>
            <span class="cnum">{{ c.known }} / {{ c.total }}</span>
          </div>
          <div class="pbar">
            <i :style="{ width: c.percent + '%', background: `linear-gradient(90deg, ${c.gradA}, ${c.gradB})` }"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 3 + 4 · 偏好设置 / 账号安全 -->
    <div class="cols">
      <div class="panel">
        <h3>偏好设置 <i>Preferences</i></h3>
        <div class="pref">
          <div class="pl">
            <div class="pt">显示名 Display name</div>
            <div class="ps">用于头像和称呼</div>
          </div>
          <div class="nameedit">
            <input
              v-model="nameInput"
              type="text"
              maxlength="20"
              placeholder="起个名字"
              @keyup.enter="saveName"
            />
            <button class="btn secondary sm" @click="saveName" :disabled="savingName || nameInput.trim() === (displayName || '')">
              {{ savingName ? "…" : "保存" }}
            </button>
          </div>
        </div>
        <p v-if="nameMsg" class="msg small" :class="nameOk ? 'ok' : 'err'">{{ nameMsg }}</p>
        <div class="pref">
          <div class="pl">
            <div class="pt">声调配色 Tone colors</div>
            <div class="ps">拼音按声调着色（红/绿/蓝/紫）</div>
          </div>
          <button
            class="switch"
            :class="{ on: settings.toneColors }"
            role="switch"
            :aria-checked="settings.toneColors"
            @click="settings.toneColors = !settings.toneColors"
          >
            <span class="knob"></span>
          </button>
        </div>
        <div class="pref">
          <div class="pl">
            <div class="pt">朗读语速 Speech rate</div>
            <div class="ps">播放单词时的语速</div>
          </div>
          <div class="rate">
            <input type="range" min="0.5" max="1.2" step="0.05" v-model.number="settings.ttsRate" />
            <span class="rr">{{ settings.ttsRate.toFixed(2) }}×</span>
            <button class="iconbtn" title="试听" @click="preview">🔊</button>
          </div>
        </div>
      </div>

      <div class="panel">
        <h3>账号安全 <i>Security</i></h3>
        <form @submit.prevent="submit">
          <label class="f">
            <span>新密码 New password</span>
            <input v-model="pw1" type="password" autocomplete="new-password" placeholder="至少 6 位" required />
          </label>
          <label class="f">
            <span>确认新密码 Confirm</span>
            <input v-model="pw2" type="password" autocomplete="new-password" placeholder="再输一遍" required />
          </label>
          <p v-if="msg" class="msg" :class="ok ? 'ok' : 'err'">{{ msg }}</p>
          <button class="btn primary" type="submit" :disabled="busy">
            {{ busy ? "提交中…" : "保存新密码 Save" }}
          </button>
        </form>
        <div class="signout">
          <button class="btn ghost" @click="doSignOut">退出登录 Sign out</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/composables/useAuth";
import { useProgress } from "@/composables/useProgress";
import { useSettings } from "@/composables/useSettings";
import { courseRegistry, allWords } from "@/data";
import { speak } from "@/utils/tts";

const router = useRouter();
const { user, isAdmin, displayName, signOut, updateDisplayName } = useAuth();
const { summarize } = useProgress();
const { settings } = useSettings();

// ── 资料头部 ────────────────────────────────────────────────
const emailName = computed(() => (user.value?.email || "?").split("@")[0]);
// Avatar shows the first character of the display name (a single CJK char reads
// well), or the first two letters of the email prefix as a fallback.
const avatarText = computed(() => {
  const n = displayName.value?.trim();
  if (n) return [...n][0].toUpperCase();
  return emailName.value.slice(0, 2).toUpperCase();
});
const roleLabel = computed(() => (isAdmin.value ? "管理员 Admin" : "学员 Student"));

// ── 显示名编辑 ──────────────────────────────────────────────
const nameInput = ref("");
const savingName = ref(false);
const nameMsg = ref("");
const nameOk = ref(false);
watch(displayName, (n) => { nameInput.value = n || ""; }, { immediate: true });

async function saveName() {
  const val = nameInput.value.trim();
  if (val === (displayName.value || "")) return;
  savingName.value = true;
  nameMsg.value = "";
  const { error } = await updateDisplayName(val);
  savingName.value = false;
  nameOk.value = !error;
  nameMsg.value = error ? "保存失败：" + error.message : "已保存 · Saved";
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const memberSince = computed(() => fmtDate(user.value?.created_at));
const lastSignIn = computed(() => fmtDate(user.value?.last_sign_in_at));

// ── 学习看板 ────────────────────────────────────────────────
const courseStats = computed(() =>
  courseRegistry.map((series) => {
    const words = series.units
      .filter((u) => u.available)
      .flatMap((u) => allWords(series.id, u.id));
    const s = summarize(words);
    return {
      id: series.id,
      name: series.name,
      gradA: series.gradA,
      gradB: series.gradB,
      total: s.total,
      known: s.known,
      review: s.review,
      star: s.star,
      percent: s.total ? Math.round((s.known / s.total) * 100) : 0,
    };
  })
);

const overall = computed(() => {
  const acc = { total: 0, known: 0, review: 0, star: 0 };
  for (const c of courseStats.value) {
    acc.total += c.total;
    acc.known += c.known;
    acc.review += c.review;
    acc.star += c.star;
  }
  return { ...acc, percent: acc.total ? Math.round((acc.known / acc.total) * 100) : 0 };
});

const ringStyle = computed(() => ({
  background: `conic-gradient(var(--primary) ${overall.value.percent}%, var(--hairline) 0)`,
}));

// ── 偏好设置 ────────────────────────────────────────────────
function preview() {
  speak("你好", { rate: settings.ttsRate });
}

// ── 账号安全 ────────────────────────────────────────────────
const pw1 = ref("");
const pw2 = ref("");
const busy = ref(false);
const msg = ref("");
const ok = ref(false);

async function submit() {
  msg.value = "";
  if (pw1.value.length < 6) {
    ok.value = false;
    msg.value = "密码至少 6 位 · Password must be at least 6 characters";
    return;
  }
  if (pw1.value !== pw2.value) {
    ok.value = false;
    msg.value = "两次输入不一致 · Passwords do not match";
    return;
  }
  busy.value = true;
  const { error } = await supabase.auth.updateUser({ password: pw1.value });
  busy.value = false;
  if (error) {
    ok.value = false;
    msg.value = "修改失败：" + error.message;
    return;
  }
  ok.value = true;
  msg.value = "密码已更新 · Password updated";
  pw1.value = "";
  pw2.value = "";
}

async function doSignOut() {
  await signOut();
  router.push("/login");
}
</script>

<style scoped>
.wrap {
  max-width: 920px;
}

/* hero */
.hero {
  position: relative;
  overflow: hidden;
  border-radius: var(--r-xl);
  background: linear-gradient(135deg, var(--grad-a), var(--grad-b));
  color: #fff;
  padding: 30px 32px;
  display: flex;
  align-items: center;
  gap: 22px;
  box-shadow: var(--sh-hover);
  margin-bottom: 26px;
}
.hero .brush {
  position: absolute;
  right: 24px;
  bottom: -34px;
  font-family: "Ma Shan Zheng", "Noto Sans SC", cursive;
  font-size: 180px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.14);
  pointer-events: none;
  user-select: none;
}
.avatar {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-size: 26px;
  font-weight: 900;
  color: var(--primary-strong);
  background: #fff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  border: 3px solid rgba(255, 255, 255, 0.6);
}
.hi {
  position: relative;
  z-index: 1;
  min-width: 0;
}
.hi .name {
  font-size: 22px;
  font-weight: 900;
  line-height: 1.1;
}
.hi .email {
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  word-break: break-all;
  margin-top: 3px;
}
.hi .meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}
.badge {
  font-size: 12px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: var(--r-pill);
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
  backdrop-filter: blur(4px);
}
.metaitem {
  font-size: 12.5px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}
.metaitem b {
  opacity: 0.7;
  margin-right: 3px;
}

/* section label */
.sec {
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.5px;
  color: var(--muted);
  text-transform: uppercase;
  margin: 0 4px 12px;
}

/* dashboard */
.dashcard {
  background: var(--card);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-card);
  padding: 26px;
  margin-bottom: 26px;
}
.dashtop {
  display: flex;
  align-items: center;
  gap: 26px;
  flex-wrap: wrap;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--hairline-soft);
  margin-bottom: 22px;
}
.ring {
  position: relative;
  width: 104px;
  height: 104px;
  border-radius: 50%;
  flex-shrink: 0;
  display: grid;
  place-items: center;
}
.ring::before {
  content: "";
  position: absolute;
  inset: 9px;
  border-radius: 50%;
  background: var(--card);
}
.ring .v {
  position: relative;
  text-align: center;
}
.ring .v b {
  display: block;
  font-size: 26px;
  font-weight: 900;
  line-height: 1;
}
.ring .v span {
  font-size: 10px;
  font-weight: 800;
  color: var(--muted);
}
.statgrid {
  flex: 1;
  min-width: 260px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.stat {
  text-align: center;
  padding: 8px 4px;
  border-radius: var(--r-md);
  transition: background 0.15s, transform 0.15s;
}
.stat:hover {
  background: var(--soft);
  transform: translateY(-2px);
}
.stat b {
  display: block;
  font-size: 28px;
  font-weight: 900;
  line-height: 1;
}
.stat span {
  font-size: 12px;
  font-weight: 800;
  color: var(--muted);
}
.stat .dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: 1px;
}
.stat.known b {
  color: var(--success);
}
.stat.known .dot {
  background: var(--success);
}
.stat.review b {
  color: var(--review);
}
.stat.review .dot {
  background: var(--review);
}
.stat.star b {
  color: #d97706;
}
.stat.star .dot {
  background: var(--star);
}

.courses {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.chead {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 7px;
}
.cname {
  font-size: 14px;
  font-weight: 800;
  color: var(--ink);
}
.cnum {
  font-size: 12px;
  font-weight: 800;
  color: var(--muted);
}
.pbar {
  height: 9px;
  border-radius: var(--r-pill);
  background: var(--strong);
  overflow: hidden;
}
.pbar > i {
  display: block;
  height: 100%;
  border-radius: var(--r-pill);
  transition: width 0.4s ease;
}

/* two-column bottom */
.cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}
.panel {
  background: var(--card);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-card);
  padding: 26px;
}
.panel h3 {
  font-size: 16px;
  font-weight: 900;
  margin-bottom: 18px;
}
.panel h3 i {
  font-style: normal;
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
  margin-left: 6px;
}

.pref {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 0;
  border-top: 1px solid var(--hairline-soft);
}
.pref:first-of-type {
  border-top: none;
  padding-top: 0;
}
.pt {
  font-size: 14px;
  font-weight: 800;
}
.ps {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  margin-top: 2px;
}
.switch {
  width: 48px;
  height: 28px;
  border-radius: var(--r-pill);
  background: var(--border-strong);
  position: relative;
  flex-shrink: 0;
  transition: background 0.18s;
}
.switch.on {
  background: var(--success);
}
.switch .knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.18s;
}
.switch.on .knob {
  transform: translateX(20px);
}
.nameedit {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.nameedit input {
  width: 120px;
  font-family: var(--ui);
  font-size: 14px;
  color: var(--ink);
  border: 1.5px solid var(--hairline);
  border-radius: var(--r-pill);
  padding: 8px 14px;
  outline: none;
  transition: border-color 0.15s;
}
.nameedit input:focus {
  border-color: var(--primary);
}
.btn.secondary {
  background: var(--card);
  color: var(--primary);
  border: 1.5px solid var(--primary-soft);
}
.btn.secondary:hover {
  background: var(--soft);
}
.btn.sm {
  font-size: 13px;
  padding: 8px 14px;
}
.rate {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.rate input[type="range"] {
  width: 96px;
  accent-color: var(--primary);
}
.rr {
  font-size: 13px;
  font-weight: 800;
  color: var(--primary-strong);
  min-width: 42px;
}
.iconbtn {
  font-size: 16px;
  line-height: 1;
  padding: 4px;
  border-radius: var(--r-sm);
}
.iconbtn:hover {
  background: var(--soft);
}

.f {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}
.f > span {
  font-size: 13px;
  font-weight: 800;
}
.f input {
  font-family: var(--ui);
  font-size: 15px;
  color: var(--ink);
  background: var(--card);
  border: 1.5px solid var(--hairline);
  border-radius: var(--r-pill);
  padding: 11px 16px;
  outline: none;
  transition: border-color 0.15s;
}
.f input:focus {
  border-color: var(--primary);
}
.msg {
  font-size: 13px;
  font-weight: 700;
  padding: 9px 12px;
  border-radius: var(--r-sm);
  margin-bottom: 14px;
}
.msg.ok {
  background: var(--success-soft);
  color: var(--success);
}
.msg.err {
  background: var(--primary-soft);
  color: var(--error);
}
.msg.small {
  font-size: 12px;
  padding: 6px 10px;
  margin: -4px 0 10px;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: var(--r-pill);
  font-weight: 800;
  font-size: 14px;
  padding: 11px 18px;
}
.btn.primary {
  background: linear-gradient(135deg, var(--grad-a), var(--grad-b));
  color: #fff;
  box-shadow: var(--sh-hover);
  width: 100%;
}
.btn.primary:disabled {
  opacity: 0.6;
}
.btn.ghost {
  background: transparent;
  color: var(--muted);
  font-size: 13px;
}
.btn.ghost:hover {
  color: var(--error);
}
.signout {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--hairline-soft);
  text-align: center;
}

@media (max-width: 720px) {
  .cols {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 480px) {
  .hero {
    padding: 22px 20px;
    gap: 16px;
  }
  .hero .brush {
    font-size: 130px;
    bottom: -20px;
    right: 12px;
  }
  .avatar {
    width: 56px;
    height: 56px;
    font-size: 20px;
  }
  .hi .name {
    font-size: 19px;
  }
  .statgrid {
    gap: 4px;
  }
  .stat b {
    font-size: 22px;
  }
}
</style>
