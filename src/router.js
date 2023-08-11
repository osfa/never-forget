import Vue from "vue";
import VueRouter from "vue-router";

import AudioVisualBook from "./components/AudioVisualBook.vue";
import Landing from "./components/Landing.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: AudioVisualBook },
  { path: "/landing", component: Landing },
];

const router = new VueRouter({
  routes,
  mode: "history", // Use 'history' mode for clean URLs (requires server configuration)
});

export default router;
