<template>
  <div class="wrap">
    <div class="crumb">
      <router-link to="/">首页 Home</router-link>
      <span class="sep">/</span>
      <span class="cur">管理后台 Admin</span>
    </div>

    <h2 class="title">学生管理 <i>Student management</i></h2>

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
      <p v-if="createMsg" class="msg" :class="createOk ? 'ok' : 'err'">{{ createMsg }}</p>
    </div>

    <!-- list -->
    <div class="listhead">
      <h3>学生列表 <i>Students · {{ students.length }}</i></h3>
      <button class="mini" @click="reload" :disabled="loading">刷新 Refresh</button>
    </div>

    <p v-if="loading" class="muted">加载中… Loading</p>
    <p v-else-if="loadErr" class="msg err">{{ loadErr }}</p>
    <div v-else class="tablewrap">
      <table class="tbl">
        <thead>
          <tr>
            <th>标识 Identifier</th>
            <th>角色 Role</th>
            <th class="num">掌握 Got it</th>
            <th class="num">复习 Review</th>
            <th class="num">收藏 Saved</th>
            <th>操作 Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in students" :key="s.id">
            <td class="id">{{ s.label }}</td>
            <td><span class="rolechip" :class="s.role">{{ s.role }}</span></td>
            <td class="num">{{ s.known }}</td>
            <td class="num">{{ s.review }}</td>
            <td class="num">{{ s.star }}</td>
            <td class="acts">
              <button class="mini" @click="openReset(s)">改密</button>
              <button class="mini danger" :disabled="s.id === myId" @click="removeStudent(s)">删号</button>
            </td>
          </tr>
          <tr v-if="!students.length">
            <td colspan="6" class="muted center">还没有学生账号</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- reset password modal -->
    <div v-if="resetTarget" class="modal" @click.self="resetTarget = null">
      <div class="modalcard">
        <h3>重置密码 <i>Reset password</i></h3>
        <p class="modalsub">{{ resetTarget.label }}</p>
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
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/composables/useAuth";

const { user } = useAuth();
const myId = user.value?.id;

const students = ref([]);
const loading = ref(true);
const loadErr = ref("");

// create form
const nEmail = ref("");
const nPassword = ref("");
const nName = ref("");
const creating = ref(false);
const createMsg = ref("");
const createOk = ref(false);

// reset modal
const resetTarget = ref(null);
const resetPw = ref("");
const resetting = ref(false);
const resetMsg = ref("");
const resetOk = ref(false);

function randomPw() {
  // readable 8-char password
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

async function reload() {
  loading.value = true;
  loadErr.value = "";
  try {
    const [{ data: profiles, error: pErr }, { data: progress, error: gErr }] = await Promise.all([
      supabase.from("profiles").select("id, role, display_name, created_at").order("created_at"),
      supabase.from("progress").select("user_id, data"),
    ]);
    if (pErr) throw pErr;
    if (gErr) throw gErr;
    const byUser = new Map((progress ?? []).map((r) => [r.user_id, r.data]));
    students.value = (profiles ?? []).map((p) => ({
      id: p.id,
      label: p.display_name || p.id.slice(0, 8),
      role: p.role,
      ...countBlob(byUser.get(p.id)),
    }));
  } catch (e) {
    loadErr.value = "加载失败：" + (e.message || e);
  } finally {
    loading.value = false;
  }
}

async function invoke(body) {
  const { data, error } = await supabase.functions.invoke("admin-users", { body });
  // functions.invoke surfaces non-2xx as error; try to read the message
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

async function createStudent() {
  creating.value = true;
  createMsg.value = "";
  const { data, error } = await invoke({
    action: "create",
    email: nEmail.value.trim(),
    password: nPassword.value,
    display_name: nName.value.trim(),
  });
  creating.value = false;
  if (error) {
    createOk.value = false;
    createMsg.value = "创建失败：" + error;
    return;
  }
  createOk.value = true;
  createMsg.value = `已创建 ${data.user.email}，初始密码：${nPassword.value}`;
  nEmail.value = "";
  nPassword.value = "";
  nName.value = "";
  reload();
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
  if (!confirm(`确定删除 ${s.label}？此操作不可恢复。`)) return;
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
  margin-bottom: 12px;
}
.listhead h3 {
  font-size: 16px;
  font-weight: 800;
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
.tbl td.id {
  font-weight: 700;
  color: var(--ink);
}
.tbl td.num {
  text-align: center;
  font-weight: 700;
}
.tbl td.center {
  text-align: center;
  padding: 28px;
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
.modalacts {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 18px;
}
</style>
