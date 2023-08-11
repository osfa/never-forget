import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
// import Landing from "./Landing.vue";

// from vue3? borken?
export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: App,
    },
    // {
    //   path: "/about",
    //   component: Landing,
    // },
    // {
    //   path: "/about",
    //   component: () => import("@/views/About.vue"),
    // },
    // {
    //   path: "/contact",
    //   component: () => import("@/views/Contact.vue"),
    // },
  ],
});
