import { createRouter, createWebHashHistory } from "vue-router";

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

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});
