<template>
  <header v-if="!hideChrome" class="appbar">
    <router-link to="/" class="logo">HSK <span>单词闪卡</span></router-link>

    <div v-if="isConfigured" class="account">
      <div v-if="isLoggedIn" class="usermenu" ref="menuRef">
        <button class="userchip" :class="{ open }" @click="open = !open">
          <span class="ava">{{ avatarChar }}</span>
          <span class="uname">{{ nameLabel }}</span>
          <span class="chev">▾</span>
        </button>
        <div v-if="open" class="menu">
          <div class="mhead">
            <span class="ava lg">{{ avatarChar }}</span>
            <div class="mtxt">
              <div class="mn">{{ nameLabel }}</div>
              <div class="me">{{ user.email }}</div>
            </div>
          </div>
          <router-link to="/account" class="mi" @click="open = false">账号 <i>Account</i></router-link>
          <router-link v-if="isAdmin" to="/admin" class="mi" @click="open = false">管理 <i>Admin</i></router-link>
          <button class="mi danger" @click="handleSignOut">退出 <i>Sign out</i></button>
        </div>
      </div>
      <router-link v-else to="/login" class="acctbtn primary">登录 <i>Sign in</i></router-link>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const { user, isLoggedIn, isAdmin, isConfigured, displayName, signOut } = useAuth();
const route = useRoute();
const router = useRouter();

const open = ref(false);
const menuRef = ref(null);

function onDocClick(e) {
  if (open.value && menuRef.value && !menuRef.value.contains(e.target)) open.value = false;
}
onMounted(() => document.addEventListener("click", onDocClick));
onUnmounted(() => document.removeEventListener("click", onDocClick));
watch(() => route.fullPath, () => { open.value = false; });

async function handleSignOut() {
  open.value = false;
  await signOut();
  router.push("/login");
}
const hideChrome = computed(() => route.name === "print" || route.name === "login");

const emailName = computed(() => (user.value?.email || "").split("@")[0]);
// Chip label: display name if set, else a trimmed email prefix.
const nameLabel = computed(() => {
  const n = displayName.value?.trim();
  if (n) return n;
  const e = emailName.value;
  return e.length > 14 ? e.slice(0, 12) + "…" : e;
});
const avatarChar = computed(() => {
  const n = displayName.value?.trim();
  return (n ? [...n][0] : emailName.value.charAt(0) || "?").toUpperCase();
});
</script>

<style scoped>
.appbar {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 20px;
  background: rgba(255, 250, 246, 0.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--hairline);
}
.logo {
  font-weight: 800;
  font-size: 17px;
  color: var(--primary-strong);
  letter-spacing: 0.3px;
}
.logo span {
  color: var(--ink);
}
.account {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.userchip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 4px;
  border-radius: var(--r-pill);
  background: var(--soft);
  transition: background 0.15s;
}
.userchip:hover {
  background: var(--strong);
}
.userchip .ava {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-family: var(--han);
  font-size: 13px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, var(--grad-a), var(--grad-b));
}
.userchip .uname {
  font-size: 13px;
  font-weight: 800;
  color: var(--body);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.userchip .chev {
  font-size: 10px;
  color: var(--muted);
  transition: transform 0.15s;
}
.userchip.open .chev {
  transform: rotate(180deg);
}

/* dropdown */
.usermenu {
  position: relative;
}
.menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  background: var(--card);
  border-radius: var(--r-md);
  box-shadow: var(--sh-pop);
  border: 1px solid var(--hairline);
  padding: 6px;
  z-index: 50;
}
.mhead {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px 10px;
  border-bottom: 1px solid var(--hairline-soft);
  margin-bottom: 6px;
}
.mhead .ava.lg {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-family: var(--han);
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, var(--grad-a), var(--grad-b));
  flex-shrink: 0;
}
.mtxt {
  min-width: 0;
}
.mn {
  font-size: 14px;
  font-weight: 800;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.me {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mi {
  display: flex;
  align-items: baseline;
  gap: 6px;
  width: 100%;
  text-align: left;
  padding: 9px 12px;
  border-radius: var(--r-sm);
  font-size: 13px;
  font-weight: 800;
  color: var(--body);
  transition: background 0.12s;
}
.mi i {
  font-style: normal;
  font-size: 10px;
  font-weight: 600;
  opacity: 0.7;
}
.mi:hover {
  background: var(--soft);
}
.mi.danger {
  color: var(--error);
}
.mi.danger:hover {
  background: var(--primary-soft);
}
.acctbtn {
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  border-radius: var(--r-pill);
  padding: 6px 14px;
  font-weight: 800;
  font-size: 13px;
  background: var(--soft);
  color: var(--body);
  transition: background 0.15s, transform 0.15s;
}
.acctbtn i {
  font-style: normal;
  font-size: 10px;
  font-weight: 600;
  opacity: 0.75;
}
.acctbtn:hover {
  background: var(--strong);
}
.acctbtn.primary {
  background: linear-gradient(135deg, var(--grad-a), var(--grad-b));
  color: #fff;
}
.acctbtn.primary:hover {
  transform: translateY(-1px);
}
</style>
