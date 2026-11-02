<template>
  <div class="wrap adminwrap">
    <div class="corner-motif" :style="{ backgroundImage: `url(${motifBamboo})` }" aria-hidden="true"></div>
    <div class="crumb">
      <router-link to="/">课程总览 Library</router-link>
      <span class="sep">◇</span>
      <span class="cur">管理后台 Admin</span>
    </div>

    <div class="titlerow">
      <h2 class="title inscribe">学生管理 <i>Student management</i></h2>
      <button class="btn primary newbtn" @click="openCreate">＋ 新建学生 <i>New student</i></button>
    </div>

    <!-- KPIs -->
    <div class="kpis">
      <div class="kpi">
        <b>{{ kpis.today }}</b>
        <span>今天在学<i>Studying today</i></span>
      </div>
      <div class="kpi">
        <b>{{ kpis.active }}<small> / {{ kpis.count }}</small></b>
        <span>7 天活跃<i>Active · last 7 days</i></span>
      </div>
      <div class="kpi">
        <b v-html="fmtDurHtml(kpis.week)"></b>
        <span>近 7 天总时长<i>Class total · 7 days</i></span>
      </div>
      <div class="kpi" :class="{ warn: kpis.nudge > 0 }">
        <b>{{ kpis.nudge }}</b>
        <span>需要提醒<i>7 天没学 · No study in 7 days</i></span>
      </div>
    </div>

    <!-- 签到总表 -->
    <section class="board">
      <div class="bhead">
        <h3>签到总表 <i>Class board</i><span class="bsub">近 14 天 · {{ days[0].md }} – {{ days[13].md }} · {{ filtered.length }} 位学生</span></h3>
        <div class="tools">
          <input v-model="q" class="search" type="text" placeholder="搜名字 / 邮箱 Search" />
          <div class="seg">
            <button v-for="o in SORTS" :key="o.k" :class="{ on: sortBy === o.k }" @click="sortBy = o.k">{{ o.cn }} <i>{{ o.en }}</i></button>
          </div>
          <button class="mini" @click="reload" :disabled="loading">刷新 Refresh</button>
        </div>
      </div>

      <p v-if="loading" class="muted pad">加载中… Loading</p>
      <p v-else-if="loadErr" class="msg err">{{ loadErr }}</p>
      <div v-else class="gridwrap">
        <table class="grid">
          <thead>
            <tr class="cap">
              <th></th>
              <th :colspan="14" class="capt">每日学习分钟 <i>Minutes per day</i></th>
              <th colspan="5" class="capt sum">汇总 <i>Summary</i></th>
            </tr>
            <tr>
              <th class="namecol">学生 <i>Student</i></th>
              <th v-for="d in days" :key="d.key" class="dcol" :class="{ we: d.weekend, today: d.isToday }">
                <span class="wd">{{ d.isToday ? "今天" : d.wd }}</span>{{ d.md }}
              </th>
              <th class="wk">近 7 天 <i>7 days</i></th>
              <th>闪卡 <i>Known·Review·Star</i></th>
              <th class="c">阅读 <i>Read</i></th>
              <th>最近学习 <i>Last studied</i></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(s, ri) in filtered" :key="s.id" :class="{ sel: selId === s.id }">
              <td class="namecol">
                <button class="who" @click="select(s)">
                  <span class="ava">{{ avatarOf(s) }}</span>
                  <span class="whotxt">
                    <b>{{ s.name || "（未设名）" }}<span v-if="s.nudge" class="tag">{{ s.lastActive ? "该提醒" : "未开始" }}</span></b>
                    <em>{{ s.email }}</em>
                  </span>
                </button>
              </td>
              <td v-for="(m, i) in s.mins" :key="i" class="cell" :class="{ we: days[i].weekend, today: days[i].isToday }">
                <span :class="'lv' + level(m)" :title="`${days[i].md} · ${m} 分钟`">{{ m || "" }}</span>
              </td>
              <td class="wk">
                <b>{{ s.week }}</b> 分
                <div class="wbar"><i :style="{ width: Math.min(100, (s.week / maxWeek) * 100) + '%' }"></i></div>
              </td>
              <td class="fc">
                <template v-if="s.known || s.review || s.star">
                  <b class="k">{{ s.known }}</b> · <b class="r">{{ s.review }}</b> · <b class="s">{{ s.star }}</b>
                </template>
                <span v-else class="never">— 未开始</span>
              </td>
              <td class="c">
                <b v-if="s.readTotal">{{ s.readTotal }}</b><span v-else class="never">—</span>
              </td>
              <td class="last" :class="lastClass(s)">
                <i class="dot"></i>{{ s.lastActive ? relTime(s.lastActive) : "没学过" }}
                <span v-if="!s.lastActive && s.lastSignIn" class="lsub">登录 {{ relTime(s.lastSignIn) }}</span>
              </td>
              <td class="acts">
                <div class="menuwrap">
                  <button class="mini" @click.stop="menuFor = menuFor === s.id ? null : s.id">管理 ▾</button>
                  <div v-if="menuFor === s.id" class="menu" :class="{ up: ri >= filtered.length - 3 && ri > 1 }" @click="menuFor = null">
                    <button @click="select(s)">查看详情 Details</button>
                    <button @click="openRename(s)">改名 Rename</button>
                    <button @click="openReset(s)">改密码 Reset password</button>
                    <button class="danger" :disabled="s.id === myId" @click="removeStudent(s)">删除账号 Delete</button>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="!filtered.length">
              <td :colspan="20" class="muted center">{{ students.length ? "没有匹配的学生" : "还没有学生账号，点右上角「新建学生」创建第一个" }}</td>
            </tr>
          </tbody>
          <tfoot v-if="filtered.length">
            <tr>
              <td class="namecol"><b>全班每日合计</b><em>Class total per day</em></td>
              <td v-for="(t, i) in dayTotals" :key="i" class="tot" :class="{ we: days[i].weekend, today: days[i].isToday }">
                <b>{{ t.min || "" }}</b><em v-if="t.n">{{ t.n }} 人</em>
              </td>
              <td class="wk"><b>{{ kpis.week }}</b> 分</td>
              <td colspan="4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="legend">
        <span>每格 = 当天学习分钟</span>
        <span class="lg"><i class="lv0"></i>0 <i class="lv1"></i>1–14 <i class="lv2"></i>15–24 <i class="lv3"></i>25–34 <i class="lv4"></i>35+</span>
        <span v-if="admins.length" class="adm">管理员 {{ admins.map((a) => a.name || a.email).join("、") }} 不列入 · Admins not listed</span>
        <span>点学生名看详情 <i>Click a name for details</i></span>
      </div>
    </section>

    <!-- 学生详情 -->
    <section v-if="sel" ref="detailEl" class="detail">
      <header class="dh">
        <span class="ava big">{{ avatarOf(sel) }}</span>
        <div class="dhtxt">
          <h3>{{ sel.name || "（未设名）" }}<em>{{ sel.email }}</em></h3>
          <div class="meta">
            最近学习 <b>{{ sel.lastActive ? relTime(sel.lastActive) : "没学过" }}</b>
            <span class="sep">|</span> 注册 {{ fmtDate(sel.createdAt) }}
            <span class="sep">|</span> 登录 {{ sel.lastSignIn ? relTime(sel.lastSignIn) : "从未" }}
          </div>
        </div>
        <div class="dstats">
          <div><b>{{ sel.week }}</b>分<i>近 7 天 7 days</i></div>
          <div><b>{{ detail.total }}</b>分<i>近 90 天 90 days</i></div>
          <div><b>{{ detail.daysStudied }}</b>天<i>学习天数 Days studied</i></div>
        </div>
        <div class="dacts">
          <button class="mini" @click="openRename(sel)">改名</button>
          <button class="mini" @click="openReset(sel)">改密码</button>
          <button class="mini danger" :disabled="sel.id === myId" @click="removeStudent(sel)">删除账号</button>
          <button class="xbtn" title="关闭 Close" @click="selId = null">×</button>
        </div>
      </header>

      <p v-if="detailLoading" class="muted pad">加载中… Loading</p>
      <div v-else class="dbody">
        <!-- 90 天日历 -->
        <div class="dcol1">
          <div class="dt">近 90 天 <i>Last 90 days</i></div>
          <div class="heat">
            <div class="hmonths"><span v-for="(w, i) in detail.weeks" :key="i">{{ w.month }}</span></div>
            <div class="hbody">
              <div class="hwd"><span>一</span><span></span><span>三</span><span></span><span>五</span><span></span><span>日</span></div>
              <div class="hweeks">
                <div v-for="(w, i) in detail.weeks" :key="i" class="hw">
                  <i v-for="c in w.cells" :key="c.key" :class="[c.future ? 'fut' : 'lv' + level(c.min), { today: c.key === todayKey }]" :title="c.future ? '' : `${c.md} · ${c.min} 分钟`"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="hstats">
            <div><b>{{ detail.avg }}</b> 分<i>学习日平均 Avg per day</i></div>
            <div><b>{{ detail.streak }}</b> 天<i>连续学习 Streak</i></div>
          </div>
          <div v-if="detail.kinds.length" class="kinds">
            <div class="dt sm">常学板块 <i>Where time went</i></div>
            <div v-for="k in detail.kinds" :key="k.kind" class="krow">
              <span class="kl"><i :style="{ background: kindColor(k.kind) }"></i>{{ kindName(k.kind) }}</span>
              <span class="kb"><i :style="{ width: (k.min / detail.kinds[0].min) * 100 + '%', background: kindColor(k.kind) }"></i></span>
              <span class="kv">{{ k.min }} 分</span>
            </div>
          </div>
        </div>

        <!-- 每日明细 -->
        <div class="dcol2">
          <div class="dt">每日明细 <i>Daily log · newest first</i></div>
          <p v-if="!detail.log.length" class="muted">最近 90 天还没有学习记录 <i>No study in the last 90 days</i></p>
          <div v-for="d in shownLog" :key="d.day" class="day">
            <div class="dayh">
              <b>{{ d.md }}</b> {{ d.wd }}<span v-if="d.day === todayKey" class="tdy">今天</span>
              <span class="dmin">{{ d.min }} 分钟</span>
            </div>
            <div class="stack">
              <i v-for="p in d.places" :key="p.ctx" :style="{ flex: p.min || 0.0001, background: kindColor(p.kind) }"></i>
            </div>
            <div v-for="p in d.places" :key="p.ctx" class="pl">
              <span class="pk"><i :style="{ background: kindColor(p.kind) }"></i>{{ kindName(p.kind) }}</span>
              <span class="pp">{{ p.place }}</span>
              <span class="pm">{{ p.min ? p.min + " 分" : "" }}<em v-if="p.clicks">点 {{ p.clicks }} 次</em></span>
            </div>
            <div v-for="r in d.reads" :key="r" class="pl rdone">
              <span class="pk"><i :style="{ background: kindColor('read') }"></i>读完</span>
              <span class="pp">{{ r }} ✓</span>
              <span class="pm"></span>
            </div>
          </div>
          <button v-if="detail.log.length > logLimit" class="more" @click="logLimit += 14">展开更早 <i>Show earlier</i> ▾</button>
        </div>

        <!-- 阅读 + 闪卡 -->
        <div class="dcol3">
          <div class="dt">课外阅读已读 <i>Reading · {{ sel.readTotal }} 篇</i></div>
          <p v-if="!sel.readBooks.length" class="muted">还没有读完的文章 <i>None yet</i></p>
          <div v-for="b in sel.readBooks" :key="b.key" class="rbook">
            <div class="rbh"><b>{{ b.series }} {{ b.level }}《{{ b.title }}》</b><span>{{ b.items.length }} / {{ b.total }}</span></div>
            <div v-for="it in b.items" :key="it.n" class="rit">
              <span class="rn">{{ it.n }}</span>
              <span class="rt">{{ it.title }}</span>
              <span class="rd">{{ it.at ? fmtShort(it.at) : "—" }}</span>
            </div>
          </div>
          <div class="dt mt">闪卡 <i>Flashcards</i></div>
          <div class="fcsum">
            <div><b class="k">{{ sel.known }}</b><i>已掌握 Known</i></div>
            <div><b class="r">{{ sel.review }}</b><i>需复习 Review</i></div>
            <div><b class="s">{{ sel.star }}</b><i>收藏 Starred</i></div>
          </div>
          <div class="fcp">全部教材进度 <b>{{ sel.percent }}%</b></div>
          <div class="pbar"><i :style="{ width: sel.percent + '%' }"></i></div>
        </div>
      </div>
    </section>

    <!-- create modal -->
    <div v-if="createOpen" class="modal" @click.self="createOpen = false">
      <div class="modalcard wide">
        <h3>新建学生账号 <i>Create student</i></h3>
        <form v-if="!lastCreated" class="createform" @submit.prevent="createStudent">
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
          <p v-if="createMsg" class="msg err">{{ createMsg }}</p>
          <div class="modalacts">
            <button type="button" class="btn secondary" @click="createOpen = false">取消 Cancel</button>
            <button class="btn primary" type="submit" :disabled="creating">{{ creating ? "创建中…" : "创建 Create" }}</button>
          </div>
        </form>

        <!-- credential card after a successful create -->
        <template v-else>
          <div class="cred">
            <div class="credhead"><span>✅ 账号已创建，把下面凭证发给学生</span></div>
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
          <div class="modalacts">
            <button class="btn secondary" @click="lastCreated = null">再建一个 Another</button>
            <button class="btn primary" @click="createOpen = false">完成 Done</button>
          </div>
        </template>
      </div>
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

    <div class="foot-hills" :style="{ backgroundImage: `url(${motifMountainFar})` }" aria-hidden="true"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/composables/useAuth";
import { courseRegistry } from "@/data";
import { readingBooks } from "@/data/reading";
import { motifBamboo, motifMountainFar } from "@/assets/img.js";

const { user } = useAuth();
const myId = user.value?.id;

// Total words across all available courses — denominator for each student's %.
const TOTAL_WORDS = courseRegistry.reduce(
  (n, s) => n + s.units.filter((u) => u.available).reduce((m, u) => m + u.wordCount, 0),
  0
);

// ── dates (teacher's local calendar; activity.day is the student's local date) ──
const pad = (x) => String(x).padStart(2, "0");
const WD = ["日", "一", "二", "三", "四", "五", "六"];
const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
const now0 = new Date();
const todayKey = dayKey(now0);
const days = Array.from({ length: 14 }, (_, i) => {
  const d = addDays(now0, i - 13);
  return { key: dayKey(d), md: `${d.getMonth() + 1}/${d.getDate()}`, wd: WD[d.getDay()], weekend: d.getDay() % 6 === 0, isToday: i === 13 };
});
const week7 = new Set(days.slice(7).map((d) => d.key));

// ── state ──
const students = ref([]);
const admins = ref([]);
const loading = ref(true);
const loadErr = ref("");

const q = ref("");
const SORTS = [
  { k: "week", cn: "近 7 天时长", en: "7 days" },
  { k: "recent", cn: "最近学习", en: "Recent" },
  { k: "created", cn: "注册时间", en: "Joined" },
];
const sortBy = ref("week");
const menuFor = ref(null);
const closeMenu = () => (menuFor.value = null);

// create
const createOpen = ref(false);
const nEmail = ref("");
const nPassword = ref("");
const nName = ref("");
const creating = ref(false);
const createMsg = ref("");
const lastCreated = ref(null); // { email, password }
const copied = ref("");

// rename / reset
const renameTarget = ref(null);
const renameVal = ref("");
const renaming = ref(false);
const renameMsg = ref("");
const renameOk = ref(false);
const resetTarget = ref(null);
const resetPw = ref("");
const resetting = ref(false);
const resetMsg = ref("");
const resetOk = ref(false);

// detail
const selId = ref(null);
const detailRows = ref([]); // activity rows (90 days) of the selected student
const detailLoading = ref(false);
const logLimit = ref(14);
const detailEl = ref(null);

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

function relTime(iso) {
  if (!iso) return "从未 Never";
  const d = new Date(iso);
  const mins = Math.floor((Date.now() - d.getTime()) / 6e4);
  if (mins < 5) return "刚刚";
  if (mins < 60) return `${mins} 分钟前`;
  if (mins < 24 * 60) return `${Math.floor(mins / 60)} 小时前`;
  const n = Math.floor(mins / (24 * 60));
  if (n === 1) return "昨天";
  if (n < 7) return `${n} 天前`;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
const fmtDate = (iso) => (iso ? iso.slice(0, 10) : "—");
function fmtShort(iso) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
function fmtDurHtml(min) {
  const h = Math.floor(min / 60);
  return h ? `${h}<small>小时</small>${min % 60}<small>分</small>` : `${min}<small>分</small>`;
}
const level = (m) => (!m ? 0 : m < 15 ? 1 : m < 25 ? 2 : m < 35 ? 3 : 4);
function lastClass(s) {
  if (!s.lastActive) return "red";
  const d = (Date.now() - new Date(s.lastActive).getTime()) / 864e5;
  return d < 1 ? "green" : d < 7 ? "amber" : "red";
}

// ── places: "{kind}|{ref}" written by useActivity.js ──
const KINDS = {
  flash: ["闪卡", "#a33f2e"],
  ex: ["练习", "#b8862f"],
  text: ["课文", "#2d6a4f"],
  read: ["课外阅读", "#52b788"],
  vocab: ["词汇详解", "#c98a6a"],
  gram: ["语法", "#6a5c3f"],
  talk: ["话题讨论", "#8a7c5c"],
  quiz: ["测验", "#7a2b21"],
  pinyin: ["拼音", "#2f6d8c"],
  music: ["中国风", "#7a4f86"],
  gramidx: ["语法汇总", "#9a8a6e"],
  words: ["我的词", "#b3a582"],
  browse: ["浏览", "#d9cbb0"],
};
const kindName = (k) => KINDS[k]?.[0] || k;
const kindColor = (k) => KINDS[k]?.[1] || "#d9cbb0";
const CN = "零一二三四五六七八九";
const UNIT_NAME = {
  hsk: (u) => `HSK${u}`,
  newhsk3: (u) => `新HSK 第${CN[u]}册`,
  huihua360: (u) => `会话360 第${CN[u]}册`,
  survival: () => "生存汉语",
  kouyu: (u) => `口语 ${["", "初级上", "初级下", "中级上", "中级下"][u] || u}`,
  zoubian: (u) => `走遍中国 第${CN[u]}册`,
};
function placeName(kind, ref) {
  if (!ref) return "";
  const [unitKey, n] = ref.split("/");
  if (kind === "read") {
    const b = readingBooks.find((x) => x.key === unitKey);
    const l = b?.lessons.find((x) => x.n === +n);
    return b ? `${b.level} 第${n}篇${l ? `《${l.title}》` : ""}` : ref;
  }
  const m = unitKey.match(/^([a-z0-9]+?)-(\d+)$/);
  const f = m && UNIT_NAME[m[1]];
  return f ? `${f(+m[2])} 第${n}课` : ref;
}

// progress.reading → { readTotal, readBooks } (books in shelf order, stories by number)
function readingOf(reading) {
  const books = [];
  let total = 0;
  for (const b of readingBooks) {
    const m = reading?.[b.key];
    if (!m) continue;
    const entries = Array.isArray(m) ? m.map((n) => [String(n), null]) : Object.entries(m);
    if (!entries.length) continue;
    const items = entries
      .map(([n, at]) => ({ n: +n, at, title: b.lessons.find((l) => l.n === +n)?.title || "" }))
      .sort((a, b2) => a.n - b2.n);
    total += items.length;
    books.push({ key: b.key, series: b.series, level: b.level, title: b.title, total: b.lessons.length, items });
  }
  return { readTotal: total, readBooks: books };
}

const latest = (...isos) => isos.filter(Boolean).sort().pop() || null;

// ── board ──
const filtered = computed(() => {
  let list = students.value;
  const query = q.value.trim().toLowerCase();
  if (query) list = list.filter((s) => (s.name || "").toLowerCase().includes(query) || s.email.toLowerCase().includes(query));
  const arr = [...list];
  if (sortBy.value === "week") arr.sort((a, b) => b.week - a.week || (b.lastActive || "").localeCompare(a.lastActive || ""));
  else if (sortBy.value === "recent") arr.sort((a, b) => (b.lastActive || "").localeCompare(a.lastActive || "") || (b.lastSignIn || "").localeCompare(a.lastSignIn || ""));
  else arr.sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
  return arr;
});
const maxWeek = computed(() => Math.max(60, ...students.value.map((s) => s.week)));
const dayTotals = computed(() =>
  days.map((_, i) => {
    const xs = filtered.value.map((s) => s.mins[i]);
    return { min: xs.reduce((a, b) => a + b, 0), n: xs.filter(Boolean).length };
  })
);
const kpis = computed(() => {
  const list = students.value;
  return {
    count: list.length,
    today: list.filter((s) => s.mins[13] > 0).length,
    active: list.filter((s) => !s.nudge).length,
    week: list.reduce((n, s) => n + s.week, 0),
    nudge: list.filter((s) => s.nudge).length,
  };
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
    // auth.users (via Edge Function) is authoritative for email + display name; profiles supplies role,
    // progress the flashcard counts + reading, activity the last 14 days of minutes.
    const listRes = await invoke({ action: "list" });
    if (listRes.error) throw new Error(listRes.error);
    const [pr, gr, ar] = await Promise.all([
      supabase.from("profiles").select("id, role"),
      supabase.from("progress").select("user_id, data, reading, updated_at"),
      supabase.from("activity").select("user_id, day, minutes, updated_at").gte("day", days[0].key),
    ]);
    if (pr.error) throw pr.error;
    if (gr.error) throw gr.error;
    if (ar.error) console.warn("[admin] activity unavailable:", ar.error.message);
    const roleById = new Map((pr.data ?? []).map((p) => [p.id, p.role]));
    const progById = new Map((gr.data ?? []).map((r) => [r.user_id, r]));
    const actById = new Map();
    for (const r of ar.data ?? []) {
      if (!actById.has(r.user_id)) actById.set(r.user_id, []);
      actById.get(r.user_id).push(r);
    }
    const all = (listRes.data.users ?? []).map((u) => {
      const prog = progById.get(u.id);
      const acts = actById.get(u.id) || [];
      const byDay = new Map(acts.map((r) => [r.day, r.minutes]));
      const mins = days.map((d) => byDay.get(d.key) || 0);
      const counts = countBlob(prog?.data);
      const reading = readingOf(prog?.reading);
      const lastAct = latest(...acts.map((r) => r.updated_at));
      const lastStudy = latest(lastAct, prog?.updated_at);
      const week = acts.filter((r) => week7.has(r.day)).reduce((n, r) => n + r.minutes, 0);
      return {
        id: u.id,
        name: u.display_name || null,
        email: u.email || "",
        role: roleById.get(u.id) || "student",
        createdAt: u.created_at,
        lastSignIn: u.last_sign_in_at,
        // 最近学习 = last activity minute or progress save; sign-in is shown separately (sessions persist, so it says little)
        lastActive: lastStudy,
        mins,
        week,
        // 需要提醒 = no study minutes and no progress save in the last 7 days (or never started)
        nudge: week === 0 && !(lastStudy && Date.now() - new Date(lastStudy).getTime() < 7 * 864e5),
        ...counts,
        ...reading,
        percent: TOTAL_WORDS ? Math.round((counts.known / TOTAL_WORDS) * 100) : 0,
      };
    });
    students.value = all.filter((s) => s.role !== "admin");
    admins.value = all.filter((s) => s.role === "admin");
  } catch (e) {
    loadErr.value = "加载失败：" + (e.message || e);
  } finally {
    loading.value = false;
  }
}

// ── detail ──
const sel = computed(() => students.value.find((s) => s.id === selId.value) || null);

async function select(s) {
  selId.value = s.id;
  logLimit.value = 14;
  detailLoading.value = true;
  detailRows.value = [];
  await nextTick();
  detailEl.value?.scrollIntoView({ behavior: "smooth", block: "start" });
  const since = dayKey(addDays(now0, -90));
  const { data, error } = await supabase.from("activity").select("day, minutes, counts").eq("user_id", s.id).gte("day", since);
  if (selId.value !== s.id) return;
  if (error) console.warn("[admin] activity detail unavailable:", error.message);
  detailRows.value = data ?? [];
  detailLoading.value = false;
}

const detail = computed(() => {
  const s = sel.value;
  const rows = detailRows.value;
  const byDay = new Map(rows.map((r) => [r.day, r]));
  const since = dayKey(addDays(now0, -90));

  // 13-week heatmap, Monday-first columns ending with this week
  const monday = addDays(now0, -((now0.getDay() + 6) % 7) - 12 * 7);
  const weeks = [];
  let prevMonth = -1;
  for (let w = 0; w < 13; w++) {
    const cells = [];
    for (let i = 0; i < 7; i++) {
      const d = addDays(monday, w * 7 + i);
      const key = dayKey(d);
      cells.push({ key, md: `${d.getMonth() + 1}/${d.getDate()}`, min: byDay.get(key)?.minutes || 0, future: key > todayKey });
    }
    const m = addDays(monday, w * 7).getMonth();
    weeks.push({ cells, month: m !== prevMonth ? `${m + 1}月` : "" });
    prevMonth = m;
  }

  const studied = rows.filter((r) => r.minutes > 0);
  const total = rows.reduce((n, r) => n + r.minutes, 0);
  let streak = 0;
  for (let d = byDay.get(todayKey)?.minutes ? now0 : addDays(now0, -1); byDay.get(dayKey(d))?.minutes; d = addDays(d, -1)) streak++;

  // reading finishes per local day
  const readsByDay = new Map();
  for (const b of s?.readBooks || []) {
    for (const it of b.items) {
      if (!it.at) continue;
      const k = dayKey(new Date(it.at));
      if (!readsByDay.has(k)) readsByDay.set(k, []);
      readsByDay.get(k).push(`${b.level} 第${it.n}篇《${it.title}》`);
    }
  }

  const kindMin = {};
  const log = [...new Set([...rows.map((r) => r.day), ...readsByDay.keys()])]
    .filter((k) => k >= since)
    .sort()
    .reverse()
    .map((k) => {
      const r = byDay.get(k);
      const places = {};
      for (const [key, v] of Object.entries(r?.counts || {})) {
        const t = key.slice(0, 1);
        const ctx = key.slice(2);
        const p = (places[ctx] ||= { ctx, min: 0, clicks: 0 });
        if (t === "m") p.min += v;
        else p.clicks += v;
      }
      const list = Object.values(places)
        .map((p) => {
          const [kind, ref] = p.ctx.split("|");
          kindMin[kind] = (kindMin[kind] || 0) + p.min;
          return { ...p, kind, place: placeName(kind, ref) };
        })
        .filter((p) => p.kind !== "browse" && (p.min || p.clicks >= 3))
        .sort((a, b) => b.min - a.min || b.clicks - a.clicks);
      const d = new Date(k + "T00:00:00");
      return { day: k, md: `${d.getMonth() + 1}/${d.getDate()}`, wd: "周" + WD[d.getDay()], min: r?.minutes || 0, places: list, reads: readsByDay.get(k) || [] };
    });

  const kinds = Object.entries(kindMin)
    .filter(([k, m]) => m > 0 && k !== "browse")
    .map(([kind, min]) => ({ kind, min }))
    .sort((a, b) => b.min - a.min);

  return {
    weeks,
    total,
    daysStudied: studied.length,
    avg: studied.length ? Math.round(total / studied.length) : 0,
    streak,
    log,
    kinds,
  };
});
const shownLog = computed(() => detail.value.log.slice(0, logLimit.value));

// ── account actions ──
async function copy(text, key) {
  try {
    await navigator.clipboard.writeText(text);
    copied.value = key;
    setTimeout(() => { if (copied.value === key) copied.value = ""; }, 1400);
  } catch {
    /* clipboard may be blocked — ignore */
  }
}

function openCreate() {
  createOpen.value = true;
  lastCreated.value = null;
  createMsg.value = "";
}

async function createStudent() {
  creating.value = true;
  createMsg.value = "";
  const email = nEmail.value.trim();
  const password = nPassword.value;
  const { data, error } = await invoke({ action: "create", email, password, display_name: nName.value.trim() });
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
  const { error } = await invoke({ action: "set_name", user_id: renameTarget.value.id, display_name: renameVal.value.trim() });
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
  const { error } = await invoke({ action: "reset_password", user_id: resetTarget.value.id, password: resetPw.value });
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
  if (selId.value === s.id) selId.value = null;
  reload();
}

onMounted(() => {
  reload();
  document.addEventListener("click", closeMenu);
});
onBeforeUnmount(() => document.removeEventListener("click", closeMenu));
</script>

<style scoped>
.wrap { position: relative; overflow: hidden; }
/* the 14-day board needs more room than the global 1120px column */
.wrap.adminwrap { max-width: 1340px; }
.wrap > *:not(.corner-motif):not(.foot-hills) { position: relative; z-index: 1; }
.corner-motif { position: absolute; right: -34px; top: 40px; width: 210px; height: 280px; z-index: 0; background-size: contain; background-position: right top; background-repeat: no-repeat; opacity: .22; mix-blend-mode: multiply; pointer-events: none; }
.foot-hills { height: 130px; margin: 20px 0 -20px; background-repeat: no-repeat; background-position: center bottom; background-size: cover; opacity: .4; mix-blend-mode: multiply; pointer-events: none; -webkit-mask-image: linear-gradient(180deg, transparent, #000 70%); mask-image: linear-gradient(180deg, transparent, #000 70%); }
.muted { color: var(--muted); font-size: 13px; }
.muted i { font-family: var(--serif-en); }
.pad { padding: 20px; }
.never { color: var(--muted-soft); }

.titlerow { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.title.inscribe { display: inline-block; font-family: var(--brush); font-weight: 400; font-size: 46px; letter-spacing: 3px; color: var(--sumi); margin-bottom: 20px; }
.title.inscribe::after { content: ""; display: block; height: 2px; width: 62%; margin: 6px 0 0; background: linear-gradient(90deg, var(--ink-wash), transparent); opacity: .5; }
.title i { font-family: var(--serif-en); font-style: italic; font-size: 16px; font-weight: 500; color: var(--muted); margin-left: 10px; letter-spacing: 0; }
.newbtn { margin-top: 12px; }
.newbtn i { font-family: var(--serif-en); font-weight: 500; font-size: 13px; margin-left: 4px; opacity: .85; }

/* KPIs */
.kpis { display: grid; grid-template-columns: repeat(4, 1fr); margin-bottom: 22px; background: var(--card); border: 1px solid var(--line); border-radius: var(--r-lg); box-shadow: var(--sh-card); overflow: hidden; }
.kpi { display: flex; align-items: baseline; gap: 10px; padding: 18px 22px; border-left: 1px dashed var(--line); }
.kpi:first-child { border-left: 0; }
.kpi b { font-family: var(--serif-cn); font-size: 32px; font-weight: 900; line-height: 1; color: var(--sumi); white-space: nowrap; }
.kpi b :deep(small), .kpi b small { font-size: 14px; font-weight: 600; margin: 0 2px; color: var(--muted); }
.kpi span { font-size: 13px; font-weight: 800; color: var(--body); }
.kpi span i { display: block; font-family: var(--serif-en); font-style: italic; font-weight: 500; font-size: 12px; color: var(--muted); }
.kpi.warn { background: linear-gradient(90deg, rgba(163, 63, 46, 0.07), transparent); }
.kpi.warn b { color: var(--cinnabar); }

/* board */
.board { background: var(--card); border: 1px solid var(--line); border-radius: var(--r-lg); box-shadow: var(--sh-card); margin-bottom: 24px; }
.bhead { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 16px 20px; border-bottom: 1px solid var(--line); }
.bhead h3 { font-family: var(--serif-cn); font-size: 19px; font-weight: 700; letter-spacing: .5px; color: var(--sumi); }
.bhead h3 i { font-family: var(--serif-en); font-weight: 500; font-size: 14px; color: var(--muted); margin-left: 4px; }
.bsub { font-family: var(--han); font-size: 12.5px; font-weight: 500; color: var(--muted); margin-left: 12px; letter-spacing: 0; }
.tools { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.search { font-family: var(--ui); font-size: 13px; border: 1.5px solid var(--hairline); border-radius: var(--r-pill); padding: 8px 14px; outline: none; width: 200px; background: var(--card); }
.search:focus { border-color: var(--primary); }
.seg { display: inline-flex; padding: 3px; border-radius: var(--r-pill); background: var(--soft); }
.seg button { padding: 6px 12px; border-radius: var(--r-pill); font-size: 12.5px; font-weight: 800; color: var(--muted); }
.seg button i { font-family: var(--serif-en); font-weight: 500; font-size: 11.5px; }
.seg button.on { background: var(--card); color: var(--ink); box-shadow: 0 1px 3px rgba(45, 30, 10, .15); }

.gridwrap { overflow-x: auto; scrollbar-width: thin; scrollbar-color: var(--line) transparent; padding-bottom: 6px; }
.grid { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 13px; }
.grid th { padding: 8px 4px; font-size: 12px; font-weight: 800; color: var(--muted); text-align: left; white-space: nowrap; vertical-align: bottom; }
.grid th i { display: block; font-family: var(--serif-en); font-style: italic; font-weight: 500; font-size: 11px; color: var(--muted-soft); }
.grid tr.cap th { padding-top: 12px; padding-bottom: 0; }
.capt { color: var(--gold-deep) !important; }
.capt i { display: inline !important; margin-left: 4px; }
.capt.sum { padding-left: 16px !important; }
.grid td { padding: 3px 4px; border-top: 1px solid var(--line-soft); vertical-align: middle; }
.namecol { padding-left: 18px !important; min-width: 180px; }
.dcol { text-align: center !important; font-family: var(--han); font-weight: 600 !important; color: var(--body) !important; min-width: 38px; }
.dcol .wd { display: block; font-size: 11px; color: var(--muted-soft); }
.we { background: rgba(232, 220, 198, 0.35); }
th.today, td.today { background: rgba(163, 63, 46, 0.05); box-shadow: inset 1.5px 0 0 var(--cinnabar), inset -1.5px 0 0 var(--cinnabar); }
th.today { box-shadow: inset 1.5px 0 0 var(--cinnabar), inset -1.5px 0 0 var(--cinnabar), inset 0 1.5px 0 var(--cinnabar); border-radius: 6px 6px 0 0; }
th.today .wd { color: var(--cinnabar); font-weight: 800; }
.who { display: flex; align-items: center; gap: 10px; padding: 4px 0; background: none; border: 0; text-align: left; cursor: pointer; max-width: 230px; }
.ava { width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0; display: grid; place-items: center; background: linear-gradient(145deg, var(--seal-a), var(--seal-b)); color: #fbeecf; font-family: var(--serif-cn); font-weight: 900; font-size: 14px; }
.ava.big { width: 52px; height: 52px; font-size: 24px; }
.whotxt { display: flex; flex-direction: column; min-width: 0; }
.whotxt b { font-size: 14px; font-weight: 800; color: var(--ink); white-space: nowrap; }
.who:hover .whotxt b { color: var(--cinnabar-dk); text-decoration: underline dotted; }
.whotxt em { font-style: normal; font-size: 11.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tag { margin-left: 6px; padding: 0 5px; border: 1px solid var(--cinnabar); border-radius: 3px; font-size: 10.5px; font-weight: 800; color: var(--cinnabar); vertical-align: 1px; }
tr.sel td { background: rgba(163, 63, 46, 0.06); }
tr.sel td.namecol { box-shadow: inset 4px 0 0 var(--cinnabar); }
.cell { text-align: center; }
.cell span { display: grid; place-items: center; width: 32px; height: 30px; margin: 0 auto; border-radius: 5px; font-size: 12px; font-weight: 800; }
.lv0 { background: rgba(232, 220, 198, 0.55); }
.lv1 { background: rgba(163, 63, 46, 0.16); color: var(--cinnabar-dk); }
.lv2 { background: rgba(163, 63, 46, 0.34); color: var(--cinnabar-dk); }
.lv3 { background: rgba(163, 63, 46, 0.6); color: #fbeecf; }
.lv4 { background: rgba(122, 43, 33, 0.9); color: #fbeecf; }
.wk { padding-left: 16px !important; min-width: 100px; white-space: nowrap; color: var(--muted); font-size: 12px; }
.wk b { font-family: var(--serif-cn); font-size: 15px; color: var(--ink); }
.wbar { height: 4px; margin-top: 3px; border-radius: 99px; background: var(--soft); overflow: hidden; width: 90px; }
.wbar i { display: block; height: 100%; background: var(--cinnabar); border-radius: 99px; }
.fc { white-space: nowrap; color: var(--muted-soft); }
.fc b { font-weight: 800; }
.k { color: var(--success); }
.r { color: var(--review); }
.s { color: var(--star); }
.c { text-align: center !important; }
.last { white-space: nowrap; font-size: 12.5px; font-weight: 700; }
.last .dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; margin-right: 6px; vertical-align: 1px; }
.last.green { color: var(--success); }
.last.green .dot { background: var(--jade-lt); }
.last.amber { color: var(--body); }
.last.amber .dot { background: var(--review); }
.last.red { color: var(--cinnabar); }
.last.red .dot { background: var(--cinnabar); }
.lsub { display: block; margin-left: 13px; font-size: 11px; font-weight: 600; color: var(--muted-soft); }
.acts { text-align: right; padding-right: 14px !important; }
.menuwrap { position: relative; display: inline-block; }
.menu { position: absolute; right: 0; top: calc(100% + 6px); z-index: 20; min-width: 190px; padding: 6px; background: var(--card); border: 1px solid var(--line); border-radius: var(--r-sm); box-shadow: var(--sh-pop); text-align: left; }
.menu.up { top: auto; bottom: calc(100% + 6px); }
.menu button { white-space: nowrap; display: block; width: 100%; padding: 8px 10px; border: 0; border-radius: 6px; background: none; text-align: left; font-family: var(--ui); font-size: 13px; font-weight: 700; color: var(--body); cursor: pointer; }
.menu button:hover { background: var(--soft); }
.menu button.danger { color: var(--error); }
.menu button:disabled { opacity: .4; cursor: default; }
tfoot td { border-top: 2px solid var(--line); padding-top: 8px; padding-bottom: 8px; }
tfoot .namecol b { display: block; font-family: var(--serif-cn); font-size: 13px; color: var(--ink); }
tfoot .namecol em { font-family: var(--serif-en); font-size: 11.5px; color: var(--muted); }
.tot { text-align: center; line-height: 1.2; }
.tot b { display: block; font-size: 12.5px; color: var(--ink); }
.tot em { font-style: normal; font-size: 10.5px; color: var(--muted); }
.center { text-align: center; padding: 28px !important; }
.legend { display: flex; flex-wrap: wrap; gap: 6px 20px; padding: 10px 20px 14px; font-size: 11.5px; color: var(--muted); border-top: 1px solid var(--line-soft); }
.legend i { font-family: var(--serif-en); }
.lg { display: inline-flex; align-items: center; gap: 4px; }
.lg i { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-left: 4px; }

/* detail */
.detail { background: var(--card); border: 1px solid var(--line); border-radius: var(--r-lg); box-shadow: var(--sh-card); margin-bottom: 24px; overflow: hidden; scroll-margin-top: calc(var(--appbar-h, 64px) + 12px); border-left: 4px solid var(--cinnabar); }
.dh { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; padding: 18px 22px; border-bottom: 1px solid var(--line); }
.dhtxt { flex: 1; min-width: 220px; }
.dh h3 { font-family: var(--serif-cn); font-size: 24px; font-weight: 900; color: var(--sumi); }
.dh h3 em { font-style: normal; font-family: var(--ui); font-size: 13px; font-weight: 600; color: var(--muted); margin-left: 10px; }
.meta { font-size: 12.5px; color: var(--muted); margin-top: 2px; }
.meta b { color: var(--success); }
.meta .sep { color: var(--line); margin: 0 6px; }
.dstats { display: flex; gap: 22px; }
.dstats div { text-align: center; font-size: 12px; color: var(--muted); }
.dstats b { font-family: var(--serif-cn); font-size: 24px; color: var(--sumi); margin-right: 2px; }
.dstats i { display: block; font-style: normal; font-size: 11px; color: var(--muted-soft); }
.dacts { display: flex; align-items: center; gap: 6px; }
.xbtn { width: 30px; height: 30px; margin-left: 6px; border-radius: 50%; border: 1px solid var(--line); font-size: 18px; line-height: 1; color: var(--muted); background: var(--card); }
.xbtn:hover { color: var(--ink); background: var(--soft); }
.dbody { display: grid; grid-template-columns: 300px minmax(0, 1fr) 300px; }
.dbody > div { padding: 18px 22px; }
.dcol2 { border-left: 1px dashed var(--line); border-right: 1px dashed var(--line); }
.dt { font-family: var(--serif-cn); font-size: 16px; font-weight: 700; color: var(--sumi); margin-bottom: 12px; }
.dt i { font-family: var(--serif-en); font-weight: 500; font-size: 13px; color: var(--muted); margin-left: 4px; }
.dt.sm { font-size: 14px; margin-bottom: 8px; }
.dt.mt { margin-top: 22px; }
.heat { font-size: 10.5px; color: var(--muted); }
.hmonths { display: grid; grid-template-columns: repeat(13, 1fr); margin-left: 18px; gap: 3px; height: 14px; }
.hmonths span { white-space: nowrap; }
.hbody { display: flex; gap: 4px; }
.hwd { display: grid; grid-template-rows: repeat(7, 1fr); gap: 3px; width: 14px; }
.hwd span { line-height: 16px; }
.hweeks { flex: 1; display: grid; grid-template-columns: repeat(13, 1fr); gap: 3px; }
.hw { display: grid; grid-template-rows: repeat(7, 1fr); gap: 3px; }
.hw i { display: block; aspect-ratio: 1; border-radius: 3px; }
.hw i.fut { background: transparent; border: 1px dashed var(--line-soft); }
.hw i.today { outline: 1.5px solid var(--sumi); outline-offset: 1px; }
.hstats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 16px 0 6px; }
.hstats div { padding: 10px 12px; border-radius: var(--r-sm); background: var(--soft); font-size: 12px; color: var(--muted); }
.hstats b { font-family: var(--serif-cn); font-size: 20px; color: var(--sumi); }
.hstats i { display: block; font-style: normal; font-size: 11px; }
.kinds { margin-top: 16px; }
.krow { display: grid; grid-template-columns: 76px minmax(0, 1fr) 46px; align-items: center; gap: 8px; padding: 3px 0; font-size: 12.5px; }
.kl { white-space: nowrap; color: var(--body); }
.kl i, .pk i { display: inline-block; width: 8px; height: 8px; border-radius: 2px; margin-right: 6px; }
.kb { height: 6px; border-radius: 99px; background: var(--soft); overflow: hidden; }
.kb i { display: block; height: 100%; border-radius: 99px; }
.kv { text-align: right; font-weight: 700; color: var(--ink); }
.day { padding: 10px 0 12px; border-bottom: 1px dashed var(--line-soft); }
.day:last-of-type { border-bottom: 0; }
.dayh { display: flex; align-items: baseline; gap: 8px; font-size: 13px; color: var(--muted); }
.dayh b { font-family: var(--serif-cn); font-size: 15px; color: var(--sumi); }
.tdy { padding: 0 6px; border-radius: 99px; background: var(--primary-soft); color: var(--cinnabar-dk); font-size: 11px; font-weight: 800; }
.dmin { margin-left: auto; font-weight: 800; color: var(--cinnabar-dk); }
.stack { display: flex; gap: 2px; height: 5px; margin: 6px 0 6px; border-radius: 99px; overflow: hidden; background: var(--soft); }
.pl { display: grid; grid-template-columns: 82px minmax(0, 1fr) auto; gap: 8px; align-items: baseline; padding: 3px 8px; font-size: 13px; }
.pk { font-weight: 800; color: var(--ink); white-space: nowrap; }
.pp { color: var(--body); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pm { font-weight: 800; color: var(--ink); white-space: nowrap; text-align: right; }
.pm em { font-style: normal; font-weight: 600; font-size: 11px; color: var(--muted-soft); margin-left: 6px; }
.rdone .pp { color: var(--success); font-weight: 700; }
.more { margin-top: 10px; font-size: 12.5px; font-weight: 800; color: var(--cinnabar-dk); background: none; border: 0; cursor: pointer; }
.more i { font-family: var(--serif-en); font-weight: 500; }
.rbook { margin-bottom: 12px; }
.rbh { display: flex; justify-content: space-between; gap: 8px; padding: 6px 10px; border-radius: var(--r-sm); background: var(--accent-soft); font-size: 13px; }
.rbh b { font-family: var(--serif-cn); color: var(--sumi); }
.rbh span { font-weight: 800; color: var(--gold-deep); white-space: nowrap; }
.rit { display: grid; grid-template-columns: 22px minmax(0, 1fr) auto; gap: 8px; align-items: center; padding: 6px 4px; border-bottom: 1px dashed var(--line-soft); font-size: 13px; }
.rn { display: grid; place-items: center; width: 20px; height: 20px; border-radius: 4px; background: var(--cinnabar); color: #fbeecf; font-size: 11px; font-weight: 800; }
.rt { font-family: var(--serif-cn); color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rd { font-size: 12px; color: var(--muted); }
.fcsum { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; text-align: center; padding: 12px 6px; border-radius: var(--r-sm); background: var(--soft); }
.fcsum b { display: block; font-family: var(--serif-cn); font-size: 24px; }
.fcsum i { font-style: normal; font-size: 11px; color: var(--muted); white-space: nowrap; }
.fcp { display: flex; justify-content: space-between; margin: 10px 0 4px; font-size: 12px; color: var(--muted); }
.fcp b { color: var(--ink); }
.pbar { height: 6px; border-radius: var(--r-pill); background: var(--soft); overflow: hidden; }
.pbar > i { display: block; height: 100%; border-radius: var(--r-pill); background: linear-gradient(90deg, var(--grad-a), var(--grad-b)); }

/* shared bits (forms / modals) */
.mini { flex-shrink: 0; font-size: 12px; font-weight: 800; padding: 7px 12px; border-radius: var(--r-pill); background: var(--soft); color: var(--body); }
.mini:hover { background: var(--strong); }
.mini.danger { color: var(--error); }
.mini:disabled { opacity: .4; cursor: default; }
.mini.wide { width: 100%; margin-top: 10px; padding: 9px; }
.createform { display: flex; flex-direction: column; gap: 12px; margin-top: 14px; }
.f { display: flex; flex-direction: column; gap: 5px; }
.f > span { font-size: 12px; font-weight: 800; color: var(--ink); }
.f input, .pwrow input { font-family: var(--ui); font-size: 14px; color: var(--ink); background: var(--card); border: 1.5px solid var(--hairline); border-radius: var(--r-pill); padding: 10px 14px; outline: none; }
.f input:focus, .pwrow input:focus { border-color: var(--primary); }
.pwrow { display: flex; gap: 6px; }
.pwrow input { flex: 1; min-width: 0; }
.cred { margin-top: 16px; border: 1.5px dashed var(--success); background: var(--success-soft); border-radius: var(--r-md); padding: 14px 16px; }
.credhead { display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 800; color: var(--success); margin-bottom: 10px; }
.credgrid { display: flex; flex-direction: column; gap: 8px; }
.credrow { display: flex; align-items: center; gap: 10px; }
.credrow .ck { font-size: 12px; font-weight: 800; color: var(--muted); width: 36px; }
.credrow code { flex: 1; font-family: ui-monospace, monospace; font-size: 14px; font-weight: 700; color: var(--ink); background: var(--card); border-radius: var(--r-sm); padding: 7px 12px; }
.msg { margin-top: 12px; font-size: 13px; font-weight: 700; padding: 9px 12px; border-radius: var(--r-sm); }
.msg.ok { background: var(--success-soft); color: var(--success); }
.msg.err { background: var(--primary-soft); color: var(--error); }
.modal { position: fixed; inset: 0; z-index: 60; background: rgba(43, 43, 51, 0.4); display: grid; place-items: center; padding: 20px; }
.modalcard { background: var(--card); border-radius: var(--r-xl); box-shadow: var(--sh-pop); padding: 26px; width: 100%; max-width: 380px; }
.modalcard.wide { max-width: 440px; }
.modalcard h3 { font-family: var(--serif-cn); font-size: 18px; font-weight: 700; }
.modalcard h3 i { font-style: normal; font-size: 12px; font-weight: 600; color: var(--muted); margin-left: 6px; }
.modalsub { font-size: 13px; color: var(--muted); font-weight: 700; margin: 4px 0 14px; }
.modalinput { width: 100%; font-family: var(--ui); font-size: 15px; border: 1.5px solid var(--hairline); border-radius: var(--r-pill); padding: 11px 16px; outline: none; }
.modalinput:focus { border-color: var(--primary); }
.modalacts { display: flex; gap: 10px; justify-content: flex-end; margin-top: 18px; }

@media (max-width: 1100px) {
  .dbody { grid-template-columns: 1fr 1fr; }
  .dcol2 { grid-column: 1 / -1; grid-row: 2; border: 0; border-top: 1px dashed var(--line); }
}
@media (max-width: 760px) {
  .kpis { grid-template-columns: 1fr 1fr; }
  .kpi:nth-child(3) { border-left: 0; }
  .kpi { border-top: 1px dashed var(--line); }
  .dbody { grid-template-columns: 1fr; }
  .dcol3 { border-top: 1px dashed var(--line); }
  .namecol { position: sticky; left: 0; z-index: 2; background: var(--card); min-width: 150px; }
  .who { max-width: 160px; }
  .search { width: 100%; }
}
</style>
