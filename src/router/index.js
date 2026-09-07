import { createRouter, createWebHashHistory } from "vue-router";
import { useAuth } from "@/composables/useAuth";

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
  { path: "/", name: "home", component: () => import("@/views/HomeView.vue") },
  { path: "/search", name: "search", component: () => import("@/views/SearchView.vue") },
  { path: "/login", name: "login", component: () => import("@/views/LoginView.vue") },
  { path: "/account", name: "account", component: () => import("@/views/AccountView.vue") },
  { path: "/admin", name: "admin", component: () => import("@/views/AdminView.vue") },

  // ── Canonical routes ────────────────────────────────────────────────────
  {
    path: "/course/:series/:unit",
    name: "lessons",
    component: () => import("@/views/LessonListView.vue"),
    props: courseProps,
  },
  {
    path: "/course/:series/:unit/lesson/:lesson",
    name: "lesson",
    component: () => import("@/views/LessonView.vue"),
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

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// Login wall: when Supabase is configured, every route requires auth except /login.
// Waits for the initial session restore so a refresh doesn't bounce a logged-in user.
router.beforeEach(async (to) => {
  const { isConfigured, isLoggedIn, isAdmin, ready } = useAuth();
  if (!isConfigured) return true; // no auth backend → don't gate (app stays usable)
  await ready;
  if (!isLoggedIn.value && to.name !== "login") {
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

export default router;
