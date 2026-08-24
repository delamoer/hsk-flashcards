import { createRouter, createWebHashHistory } from "vue-router";

// Hash history so the built site works on static hosting (e.g. GitHub Pages)
// without server rewrite rules.
const routes = [
  { path: "/", name: "home", component: () => import("@/views/HomeView.vue") },
  {
    path: "/hsk/:level",
    name: "lessons",
    component: () => import("@/views/LessonListView.vue"),
    props: true,
  },
  {
    path: "/hsk/:level/lesson/:lesson",
    name: "lesson",
    component: () => import("@/views/LessonView.vue"),
    props: true,
  },
  {
    path: "/hsk/:level/lesson/:lesson/quiz",
    name: "quiz",
    component: () => import("@/views/QuizView.vue"),
    props: true,
  },
  {
    path: "/hsk/:level/lesson/:lesson/print",
    name: "print",
    component: () => import("@/views/PrintView.vue"),
    props: true,
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
