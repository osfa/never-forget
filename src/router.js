import Vue from "vue";
import VueRouter from "vue-router";

// import AudioVisualBook from "./components/AudioVisualBook.vue";
// import RatingBook from "./components/RatingBook.vue";
// import Landing from "./components/Landing.vue";
import DziViewer from "./components/DziViewer.vue";
import CardWorld from "./components/CardWorld.vue";
import ImageStack from "./components/ImageStack.vue";

Vue.use(VueRouter);

const routes = [
  // { path: "/dzi", component: DziViewer },
  // { path: "/landing", component: Landing },
  // { path: "/legacy", component: AudioVisualBook },
  // { path: "/console", component: RatingBook },
  // { path: "/", component: ImageStack },
  {
    path: "/:id",
    component: ImageStack,
    props: (route) => ({ id: route.params.id }),
  },
  { path: "/", component: ImageStack },
];

const router = new VueRouter({
  routes,
  // mode: "history", // Use 'history' mode for clean URLs (requires server configuration)
});

export default router;
