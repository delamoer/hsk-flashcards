<template>
  <div class="wrap">
    <div class="crumb">
      <router-link to="/">首页 Home</router-link>
      <span class="sep">/</span>
      <span class="cur">管理后台 Admin</span>
    </div>

    <h2 class="title">学生管理 <i>Student management</i></h2>

    <!-- KPIs -->
    <div class="kpis">
      <div class="kpi">
        <b>{{ kpis.count }}</b>
        <span>学生数 Students</span>
      </div>
      <div class="kpi">
        <b>{{ kpis.active }}</b>
        <span>7 天活跃 Active</span>
      </div>
      <div class="kpi" :class="{ warn: kpis.pending > 0 }">
        <b>{{ kpis.pending }}</b>
        <span>待跟进 Needs follow-up</span>
      </div>
    </div>

    <!-- create -->
    <div class="card create">
      <h3>新建学生账号 <i>Create student</i></h3>
      <form class="createform" @submit.prevent="createStudent">
        <label class="f">
          <span>邮箱 Email</span>
          <input v-model="nEmail" type="text" placeholder="student01@hsk.local" required />
        </label>
        <label class="f">
          <span>初始密码 Password</span>
          <div class="pwrow">
            <input v-model="nPassword" type="text" placeholder="至少 6 位" required />
            <button type="button" class="mini" @click="nPassword = randomPw()">随机</button>
          </div>
        </label>
        <label class="f">
          <span>显示名 Name（可选）</span>
          <input v-model="nName" type="text" placeholder="张三" />
        </label>
        <button class="btn primary" type="submit" :disabled="creating">
          {{ creating ? "创建中…" : "创建 Create" }}
        </button>
      </form>

      <!-- credential card after a successful create -->
      <div v-if="lastCreated" class="cred">
        <div class="credhead">
          <span>✅ 账号已创建，把下面凭证发给学生</span>
          <button class="mini" @click="lastCreated = null">×</button>
        </div>
        <div class="credgrid">
          <div class="credrow">
            <span class="ck">邮箱</span>
            <code>{{ lastCreated.email }}</code>
            <button class="mini" @click="copy(lastCreated.email, 'email')">{{ copied === 'email' ? '已复制' : '复制' }}</button>
          </div>
          <div class="credrow">
            <span class="ck">密码</span>
            <code>{{ lastCreated.password }}</code>
            <button class="mini" @click="copy(lastCreated.password, 'pw')">{{ copied === 'pw' ? '已复制' : '复制' }}</button>
          </div>
        </div>
        <button class="mini wide" @click="copy(`邮箱 ${lastCreated.email}\n密码 ${lastCreated.password}`, 'both')">
          {{ copied === 'both' ? '已复制全部' : '一键复制邮箱+密码' }}
        </button>
      </div>
      <p v-else-if="createMsg" class="msg err">{{ createMsg }}</p>
    </div>

    <!-- list toolbar -->
    <div class="listhead">
      <h3>学生列表 <i>Students · {{ filtered.length }}</i></h3>
      <div class="tools">
        <input v-model="q" class="search" type="text" placeholder="🔍 搜名字 / 邮箱" />
        <select v-model="roleFilter" class="sel">
          <option value="all">全部角色</option>
          <option value="student">仅学生</option>
          <option value="admin">仅管理员</option>
        </select>
        <select v-model="sortBy" class="sel">
          <option value="created">按注册时间</option>
          <option value="known">按掌握词数</option>
          <option value="recent">按最近登录</option>
        </select>
        <button class="mini" @click="reload" :disabled="loading">刷新 Refresh</button>
      </div>
    </div>

    <p v-if="loading" class="muted">加载中… Loading</p>
    <p v-else-if="loadErr" class="msg err">{{ loadErr }}</p>
    <div v-else class="tablewrap">
      <table class="tbl">
        <thead>
          <tr>
            <th>学生 Student</th>
            <th>角色 Role</th>
            <th>学习进度 Progress</th>
            <th class="num">复习 Review</th>
            <th class="num">收藏 Saved</th>
            <th>最近登录 Last seen</th>
            <th>操作 Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in filtered" :key="s.id">
            <td class="id">
              <div class="stu">
                <span class="ava">{{ avatarOf(s) }}</span>
                <div class="stutxt">
                  <div class="pname">{{ s.name || "（未设名）" }}</div>
                  <div class="pemail">{{ s.email }}</div>
                </div>
              </div>
            </td>
            <td><span class="rolechip" :class="s.role">{{ s.role }}</span></td>
            <td class="prog">
              <div class="progtop"><b>{{ s.percent }}%</b><span>{{ s.known }} 词</span></div>
              <div class="pbar"><i :style="{ width: s.percent + '%' }"></i></div>
            </td>
            <td class="num">{{ s.review }}</td>
            <td class="num">{{ s.star }}</td>
            <td class="seen" :class="{ never: !s.lastSignIn }">{{ lastSeen(s.lastSignIn) }}</td>
            <td class="acts">
              <button class="mini" @click="openRename(s)">改名</button>
              <button class="mini" @click="openReset(s)">改密</button>
              <button class="mini danger" :disabled="s.id === myId" @click="removeStudent(s)">删号</button>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td colspan="7" class="muted center">
              {{ students.length ? "没有匹配的学生" : "还没有学生账号，用上面的表单创建第一个" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- rename modal -->
    <div v-if="renameTarget" class="modal" @click.self="renameTarget = null">
      <div class="modalcard">
        <h3>修改显示名 <i>Rename</i></h3>
        <p class="modalsub">{{ renameTarget.email }}</p>
        <input v-model="renameVal" class="modalinput" type="text" maxlength="20" placeholder="显示名" @keyup.enter="doRename" />
        <p v-if="renameMsg" class="msg" :class="renameOk ? 'ok' : 'err'">{{ renameMsg }}</p>
        <div class="modalacts">
          <button class="btn secondary" @click="renameTarget = null">取消 Cancel</button>
          <button class="btn primary" :disabled="renaming" @click="doRename">
            {{ renaming ? "提交中…" : "保存 Save" }}
          </button>
        </div>
      </div>
    </div>

    <!-- reset password modal -->
    <div v-if="resetTarget" class="modal" @click.self="resetTarget = null">
      <div class="modalcard">
        <h3>重置密码 <i>Reset password</i></h3>
        <p class="modalsub">{{ resetTarget.name ? resetTarget.name + " · " : "" }}{{ resetTarget.email }}</p>
        <div class="pwrow">
          <input v-model="resetPw" type="text" placeholder="新密码（至少 6 位）" />
          <button type="button" class="mini" @click="resetPw = randomPw()">随机</button>
        </div>
        <p v-if="resetMsg" class="msg" :class="resetOk ? 'ok' : 'err'">{{ resetMsg }}</p>
        <div class="modalacts">
          <button class="btn secondary" @click="resetTarget = null">取消 Cancel</button>
          <button class="btn primary" :disabled="resetting" @click="doReset">
            {{ resetting ? "提交中…" : "确认 Confirm" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/composables/useAuth";
import { courseRegistry, allWords } from "@/data";

const { user } = useAuth();
const myId = user.value?.id;

// Total words across all available courses — denominator for each student's %.
const TOTAL_WORDS = courseRegistry.reduce(
  (n, s) => n + s.units.filter((u) => u.available).reduce((m, u) => m + allWords(s.id, u.id).length, 0),
  0
);

const students = ref([]);
const loading = ref(true);
const loadErr = ref("");

// create form
const nEmail = ref("");
const nPassword = ref("");
const nName = ref("");
const creating = ref(false);
const createMsg = ref("");
const lastCreated = ref(null); // { email, password }
const copied = ref("");

// filters
const q = ref("");
const roleFilter = ref("all");
const sortBy = ref("created");

// rename modal
const renameTarget = ref(null);
const renameVal = ref("");
const renaming = ref(false);
const renameMsg = ref("");
const renameOk = ref(false);

// reset modal
const resetTarget = ref(null);
const resetPw = ref("");
const resetting = ref(false);
const resetMsg = ref("");
const resetOk = ref(false);

function randomPw() {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function countBlob(data) {
  const c = { known: 0, review: 0, star: 0 };
  if (!data) return c;
  for (const v of Object.values(data)) {
    if (v?.s === "known") c.known++;
    else if (v?.s === "review") c.review++;
    if (v?.star) c.star++;
  }
  return c;
}

function avatarOf(s) {
  const n = (s.name || "").trim();
  return (n ? [...n][0] : s.email.charAt(0) || "?").toUpperCase();
}

function lastSeen(iso) {
  if (!iso) return "从未 Never";
  const d = new Date(iso);
  const days = Math.floor((Date.now() - d.getTime()) / 864e5);
  if (days === 0) return "今天 Today";
  if (days === 1) return "昨天";
  if (days < 7) return `${days} 天前`;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function copy(text, key) {
  try {
    await navigator.clipboard.writeText(text);
    copied.value = key;
    setTimeout(() => { if (copied.value === key) copied.value = ""; }, 1400);
  } catch {
    /* clipboard may be blocked — ignore */
  }
}

const kpis = computed(() => {
  const now = Date.now();
  const studentsOnly = students.value.filter((s) => s.role === "student");
  return {
    count: studentsOnly.length,
    active: studentsOnly.filter((s) => s.lastSignIn && now - new Date(s.lastSignIn).getTime() < 7 * 864e5).length,
    // students who have not studied anything yet — the ones worth nudging
    pending: studentsOnly.filter((s) => s.known === 0 && s.review === 0 && s.star === 0).length,
  };
});

const filtered = computed(() => {
  let list = students.value;
  const query = q.value.trim().toLowerCase();
  if (query) {
    list = list.filter(
      (s) => (s.name || "").toLowerCase().includes(query) || s.email.toLowerCase().includes(query)
    );
  }
  if (roleFilter.value !== "all") list = list.filter((s) => s.role === roleFilter.value);
  const arr = [...list];
  if (sortBy.value === "known") arr.sort((a, b) => b.known - a.known);
  else if (sortBy.value === "recent") arr.sort((a, b) => (b.lastSignIn || "").localeCompare(a.lastSignIn || ""));
  return arr;
});

async function invoke(body) {
  const { data, error } = await supabase.functions.invoke("admin-users", { body });
  if (error) {
    let msg = error.message;
    try {
      const ctx = await error.context?.json?.();
      if (ctx?.error) msg = ctx.error;
    } catch {
      /* ignore */
    }
    return { error: msg };
  }
  return { data };
}

async function reload() {
  loading.value = true;
  loadErr.value = "";
  try {
    // auth.users (via Edge Function) is authoritative for email + display name;
    // profiles supplies role, progress supplies the per-student counts.
    const listRes = await invoke({ action: "list" });
    if (listRes.error) throw new Error(listRes.error);
    const [{ data: profiles, error: pErr }, { data: progress, error: gErr }] = await Promise.all([
      supabase.from("profiles").select("id, role"),
      supabase.from("progress").select("user_id, data"),
    ]);
    if (pErr) throw pErr;
    if (gErr) throw gErr;
    const roleById = new Map((profiles ?? []).map((p) => [p.id, p.role]));
    const byUser = new Map((progress ?? []).map((r) => [r.user_id, r.data]));
    students.value = (listRes.data.users ?? [])
      .map((u) => {
        const counts = countBlob(byUser.get(u.id));
        return {
          id: u.id,
          name: u.display_name || null,
          email: u.email || "",
          role: roleById.get(u.id) || "student",
          createdAt: u.created_at,
          lastSignIn: u.last_sign_in_at,
          ...counts,
          percent: TOTAL_WORDS ? Math.round((counts.known / TOTAL_WORDS) * 100) : 0,
        };
      })
      .sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
  } catch (e) {
    loadErr.value = "加载失败：" + (e.message || e);
  } finally {
    loading.value = false;
  }
}

async function createStudent() {
  creating.value = true;
  createMsg.value = "";
  lastCreated.value = null;
  const email = nEmail.value.trim();
  const password = nPassword.value;
  const { data, error } = await invoke({
    action: "create",
    email,
    password,
    display_name: nName.value.trim(),
  });
  creating.value = false;
  if (error) {
    createMsg.value = "创建失败：" + error;
    return;
  }
  lastCreated.value = { email: data.user.email || email, password };
  nEmail.value = "";
  nPassword.value = "";
  nName.value = "";
  reload();
}

function openRename(s) {
  renameTarget.value = s;
  renameVal.value = s.name || "";
  renameMsg.value = "";
}

async function doRename() {
  renaming.value = true;
  renameMsg.value = "";
  const { error } = await invoke({
    action: "set_name",
    user_id: renameTarget.value.id,
    display_name: renameVal.value.trim(),
  });
  renaming.value = false;
  if (error) {
    renameOk.value = false;
    renameMsg.value = "失败：" + error;
    return;
  }
  renameOk.value = true;
  renameMsg.value = "已保存";
  reload();
  setTimeout(() => { renameTarget.value = null; }, 600);
}

function openReset(s) {
  resetTarget.value = s;
  resetPw.value = "";
  resetMsg.value = "";
}

async function doReset() {
  if (!resetPw.value) {
    resetMsg.value = "请输入新密码";
    resetOk.value = false;
    return;
  }
  resetting.value = true;
  const { error } = await invoke({
    action: "reset_password",
    user_id: resetTarget.value.id,
    password: resetPw.value,
  });
  resetting.value = false;
  if (error) {
    resetOk.value = false;
    resetMsg.value = "失败：" + error;
    return;
  }
  resetOk.value = true;
  resetMsg.value = `密码已重置为：${resetPw.value}`;
}

async function removeStudent(s) {
  if (!confirm(`确定删除 ${s.name || s.email}？此操作不可恢复。`)) return;
  const { error } = await invoke({ action: "delete", user_id: s.id });
  if (error) {
    alert("删除失败：" + error);
    return;
  }
  reload();
}

onMounted(reload);
</script>

<style scoped>
.title {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 18px;
}
.title i {
  font-style: normal;
  font-size: 14px;
  font-weight: 600;
  color: var(--muted);
  margin-left: 8px;
}

/* KPIs */
.kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 22px;
}
.kpi {
  background: var(--card);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-card);
  padding: 18px 20px;
}
.kpi b {
  display: block;
  font-size: 30px;
  font-weight: 900;
  line-height: 1;
  color: var(--primary-strong);
}
.kpi span {
  font-size: 12px;
  font-weight: 800;
  color: var(--muted);
}
.kpi.warn b {
  color: var(--review);
}

.card {
  background: var(--card);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-card);
  padding: 20px;
  margin-bottom: 24px;
}
.card h3 {
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 14px;
}
.card h3 i,
.listhead h3 i {
  font-style: normal;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  margin-left: 6px;
}
.createform {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: flex-end;
}
.f {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  min-width: 160px;
}
.f > span {
  font-size: 12px;
  font-weight: 800;
  color: var(--ink);
}
.f input {
  font-family: var(--ui);
  font-size: 14px;
  color: var(--ink);
  background: var(--card);
  border: 1.5px solid var(--hairline);
  border-radius: var(--r-pill);
  padding: 10px 14px;
  outline: none;
}
.f input:focus {
  border-color: var(--primary);
}
.pwrow {
  display: flex;
  gap: 6px;
}
.pwrow input {
  flex: 1;
  font-family: var(--ui);
  font-size: 14px;
  border: 1.5px solid var(--hairline);
  border-radius: var(--r-pill);
  padding: 10px 14px;
  outline: none;
}
.mini {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 800;
  padding: 7px 12px;
  border-radius: var(--r-pill);
  background: var(--soft);
  color: var(--body);
}
.mini:hover {
  background: var(--strong);
}
.mini.danger {
  color: var(--error);
}
.mini:disabled {
  opacity: 0.4;
  cursor: default;
}
.mini.wide {
  width: 100%;
  margin-top: 10px;
  padding: 9px;
}

/* credential card */
.cred {
  margin-top: 16px;
  border: 1.5px dashed var(--success);
  background: var(--success-soft);
  border-radius: var(--r-md);
  padding: 14px 16px;
}
.credhead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 800;
  color: var(--success);
  margin-bottom: 10px;
}
.credgrid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.credrow {
  display: flex;
  align-items: center;
  gap: 10px;
}
.credrow .ck {
  font-size: 12px;
  font-weight: 800;
  color: var(--muted);
  width: 36px;
}
.credrow code {
  flex: 1;
  font-family: ui-monospace, monospace;
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
  background: var(--card);
  border-radius: var(--r-sm);
  padding: 7px 12px;
}

.msg {
  margin-top: 12px;
  font-size: 13px;
  font-weight: 700;
  padding: 9px 12px;
  border-radius: var(--r-sm);
}
.msg.ok {
  background: var(--success-soft);
  color: var(--success);
}
.msg.err {
  background: var(--primary-soft);
  color: var(--error);
}

.listhead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.listhead h3 {
  font-size: 16px;
  font-weight: 800;
}
.tools {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.search {
  font-family: var(--ui);
  font-size: 13px;
  border: 1.5px solid var(--hairline);
  border-radius: var(--r-pill);
  padding: 8px 14px;
  outline: none;
  min-width: 180px;
}
.search:focus {
  border-color: var(--primary);
}
.sel {
  font-family: var(--ui);
  font-size: 13px;
  font-weight: 700;
  color: var(--body);
  border: 1.5px solid var(--hairline);
  border-radius: var(--r-pill);
  padding: 8px 12px;
  outline: none;
  background: var(--card);
  cursor: pointer;
}

.tablewrap {
  overflow-x: auto;
  background: var(--card);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-card);
}
.tbl {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.tbl th {
  text-align: left;
  font-size: 11px;
  font-weight: 800;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  padding: 12px 14px;
  border-bottom: 2px solid var(--hairline);
  white-space: nowrap;
}
.tbl th.num {
  text-align: center;
}
.tbl td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--hairline);
  vertical-align: middle;
}
.tbl td.num {
  text-align: center;
  font-weight: 700;
}
.tbl td.center {
  text-align: center;
  padding: 28px;
}

.stu {
  display: flex;
  align-items: center;
  gap: 10px;
}
.stu .ava {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-family: var(--han);
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, var(--grad-a), var(--grad-b));
}
.pname {
  font-size: 14px;
  font-weight: 800;
  color: var(--ink);
}
.pemail {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  margin-top: 2px;
}

.prog {
  min-width: 130px;
}
.progtop {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 5px;
}
.progtop b {
  font-size: 14px;
  font-weight: 900;
  color: var(--ink);
}
.progtop span {
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
}
.pbar {
  height: 7px;
  border-radius: var(--r-pill);
  background: var(--strong);
  overflow: hidden;
}
.pbar > i {
  display: block;
  height: 100%;
  border-radius: var(--r-pill);
  background: linear-gradient(90deg, var(--grad-a), var(--grad-b));
  transition: width 0.4s ease;
}

.seen {
  font-size: 13px;
  font-weight: 700;
  color: var(--body);
  white-space: nowrap;
}
.seen.never {
  color: var(--muted-soft);
}

.rolechip {
  font-size: 11px;
  font-weight: 800;
  padding: 3px 9px;
  border-radius: var(--r-pill);
  background: var(--soft);
  color: var(--body);
  text-transform: uppercase;
}
.rolechip.admin {
  background: var(--accent-soft);
  color: var(--accent-active);
}
.acts {
  display: flex;
  gap: 6px;
}

/* modal */
.modal {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(43, 43, 51, 0.4);
  display: grid;
  place-items: center;
  padding: 20px;
}
.modalcard {
  background: var(--card);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-pop);
  padding: 26px;
  width: 100%;
  max-width: 380px;
}
.modalcard h3 {
  font-size: 18px;
  font-weight: 800;
}
.modalcard h3 i {
  font-style: normal;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  margin-left: 6px;
}
.modalsub {
  font-size: 13px;
  color: var(--muted);
  font-weight: 700;
  margin: 4px 0 14px;
}
.modalinput {
  width: 100%;
  font-family: var(--ui);
  font-size: 15px;
  border: 1.5px solid var(--hairline);
  border-radius: var(--r-pill);
  padding: 11px 16px;
  outline: none;
}
.modalinput:focus {
  border-color: var(--primary);
}
.modalacts {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 18px;
}

@media (max-width: 640px) {
  .kpis {
    gap: 10px;
  }
  .kpi {
    padding: 14px;
  }
  .kpi b {
    font-size: 24px;
  }
}
</style>
