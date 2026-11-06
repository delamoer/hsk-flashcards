import { createRouter, createWebHashHistory } from "vue-router";
import { stop as stopAudio } from "@/utils/tts";
import { useAuth } from "@/composables/useAuth";
import { applySeo } from "@/seo";

// Hash history — works on static hosting (GitHub Pages) without server rewrites.
// Canonical route pattern: /course/:series/:unit/lesson/:lesson
// Legacy /hsk/:level/... routes redirect to the canonical form.

const courseProps = (route) => ({
  series: route.params.series,
  unit: route.params.unit,
});

const lessonProps = (route) => ({
  series: route.params.series,
  unit: route.params.unit,
  lesson: route.params.lesson,
});

const routes = [
  { path: "/", name: "home", component: () => import("@/views/HomeGate.vue") },
  { path: "/courses", name: "courses", component: () => import("@/views/CoursesView.vue") },
  { path: "/search", name: "search", component: () => import("@/views/SearchView.vue") },
  { path: "/login", name: "login", component: () => import("@/views/LoginView.vue") },
  { path: "/account", name: "account", component: () => import("@/views/AccountView.vue") },
  { path: "/my-words", name: "mywords", component: () => import("@/views/MyWordsView.vue") },
  { path: "/pinyin", name: "pinyin", component: () => import("@/views/PinyinView.vue") },
  { path: "/reading", name: "reading", component: () => import("@/views/ReadingShelfView.vue") },
  { path: "/reading/:book", name: "reading-book", component: () => import("@/views/ReadingBookView.vue"), props: true },
  {
    path: "/reading/:book/:n",
    name: "reading-lesson",
    component: () => import("@/views/ReadingView.vue"),
    props: (route) => ({ book: route.params.book, n: Number(route.params.n) }),
  },
  { path: "/grammar", name: "grammar", component: () => import("@/views/GrammarIndexView.vue") },
  { path: "/music", name: "music", component: () => import("@/views/MusicView.vue") },
  { path: "/poems", name: "poems", component: () => import("@/views/PoemsView.vue") },
  { path: "/poems/:slug", name: "poem", component: () => import("@/views/PoemView.vue"), props: true },
  { path: "/admin", name: "admin", component: () => import("@/views/AdminView.vue") },

  // ── 课文 Texts ──────────────────────────────────────────────────────────
  { path: "/texts", name: "texts", component: () => import("@/views/TextsHomeView.vue") },
  {
    path: "/texts/:series/:unit",
    name: "texts-unit",
    component: () => import("@/views/TextsUnitView.vue"),
    props: courseProps,
  },
  {
    path: "/texts/:series/:unit/:lesson/:n",
    name: "text",
    component: () => import("@/views/TextView.vue"),
    props: (route) => ({
      series: route.params.series,
      unit: route.params.unit,
      lesson: route.params.lesson,
      n: route.params.n,
    }),
  },

  // ── Canonical routes ────────────────────────────────────────────────────
  {
    path: "/course/:series",
    name: "series",
    component: () => import("@/views/SeriesBooksView.vue"),
    props: (route) => ({ series: route.params.series }),
  },
  {
    path: "/course/:series/:unit",
    name: "lessons",
    component: () => import("@/views/LessonListView.vue"),
    props: courseProps,
  },
  {
    path: "/course/:series/:unit/lesson/:lesson",
    name: "lesson",
    component: () => import("@/views/LessonHubView.vue"),
    props: lessonProps,
  },
  {
    path: "/course/:series/:unit/lesson/:lesson/quiz",
    name: "quiz",
    component: () => import("@/views/QuizView.vue"),
    props: lessonProps,
  },
  {
    path: "/course/:series/:unit/lesson/:lesson/print",
    name: "print",
    component: () => import("@/views/PrintView.vue"),
    props: lessonProps,
  },

  // ── Legacy /hsk/:level/... redirects (preserve existing bookmarks) ──────
  {
    path: "/hsk/:level",
    redirect: (r) => `/course/hsk/${r.params.level}`,
  },
  {
    path: "/hsk/:level/lesson/:lesson",
    redirect: (r) => `/course/hsk/${r.params.level}/lesson/${r.params.lesson}`,
  },
  {
    path: "/hsk/:level/lesson/:lesson/quiz",
    redirect: (r) => `/course/hsk/${r.params.level}/lesson/${r.params.lesson}/quiz`,
  },
  {
    path: "/hsk/:level/lesson/:lesson/print",
    redirect: (r) => `/course/hsk/${r.params.level}/lesson/${r.params.lesson}/print`,
  },

  { path: "/:pathMatch(.*)*", redirect: "/" },
];

// On a prerendered public page (/pinyin/ …, see scripts/prerender.py and index.html) the hash URLs are
// rooted at the site root, not at that page's folder — otherwise leaving it gives /pinyin/#/grammar.
// (vue-router only uses this path when the page has a <base> tag, which the prerendered copies carry.)
function siteBase() {
  const page = document.querySelector('meta[name="prerender-route"]')?.content;
  if (!page || page === "/") return undefined; // default: the current path
  return location.pathname.replace(new RegExp(`${page.slice(1)}/(?:index\\.html)?$`), "");
}

const router = createRouter({
  history: createWebHashHistory(siteBase()),
  routes,
  scrollBehavior(to, from) {
    // Switching songs only changes ?song= — keep the scroll position.
    if (to.name === "music" && from.name === "music") return false;
    // 语法汇总 mirrors its filters into ?q=… — typing must not jump to the top.
    if (to.name === "grammar" && from.name === "grammar") return false;
    // 古诗词 mirrors its view / filters into ?view=&q=… — same.
    if (to.name === "poems" && from.name === "poems") return false;
    // In-page anchors (landing page "#book" etc.) — wait for the lazy view to render.
    if (to.hash) {
      return new Promise((resolve) => setTimeout(() => resolve({ el: to.hash, top: 72, behavior: "smooth" }), 350));
    }
    return { top: 0 };
  },
});

// Each page is its own lazy chunk. After a deploy the old chunk names are gone, so a tab still running the
// previous build fails to load the next page (also on a flaky connection) — the click did nothing until a
// manual refresh. Load the target URL fresh instead, once (a sessionStorage stamp prevents a reload loop).
router.onError((err, to) => {
  if (!/dynamically imported module|Importing a module script failed|Failed to fetch|error loading dynamically/i.test(err?.message || "")) return;
  const key = "hsk-chunk-reload";
  const last = Number(sessionStorage.getItem(key) || 0);
  if (Date.now() - last < 10000) return; // just reloaded for this — don't loop
  sessionStorage.setItem(key, String(Date.now()));
  location.assign(router.resolve(to.fullPath).href);
  location.reload();
});

// Leaving a page silences whatever it was playing.
router.afterEach(() => stopAudio());

// Pages anyone can open without an account: the landing page ("/" for signed-out
// visitors, see HomeGate.vue) and the free tools. Everything else needs a login.
// Grammar exercises live only inside lessons, so the public grammar index exposes none.
const PUBLIC_ROUTES = new Set(["login", "home", "pinyin", "grammar", "music", "poems", "poem"]);

// Login wall: when Supabase is configured, every route except PUBLIC_ROUTES requires auth.
// Waits for the initial session restore so a refresh doesn't bounce a logged-in user.
router.beforeEach(async (to) => {
  const { isConfigured, isLoggedIn, isAdmin, ready } = useAuth();
  if (!isConfigured) return true; // no auth backend → don't gate (app stays usable)
  await ready;
  if (!isLoggedIn.value && !PUBLIC_ROUTES.has(to.name)) {
    return { name: "login", query: { redirect: to.fullPath } };
  }
  if (isLoggedIn.value && to.name === "login") {
    return { path: "/" };
  }
  if (to.name === "admin" && !isAdmin.value) {
    return { path: "/" }; // non-admins can't reach the admin console
  }
  return true;
});

// Title / description / canonical for the public pages (see src/seo.js). After the login
// guard, so isLoggedIn is settled: "/" is the landing page only for signed-out visitors.
router.afterEach((to) => {
  const { isConfigured, isLoggedIn } = useAuth();
  applySeo(to.name, to.name !== "home" || (isConfigured && !isLoggedIn.value));
});

export default router;
