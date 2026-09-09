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
  // History mode, because a hash is never sent to a server. Under /#/<id> every
  // deep link returned a byte-identical response, so nothing fetching those URLs
  // could tell one image from another — not a link preview, not a crawler, and not
  // Pinterest's RSS reader, which fetches each item's <link>. /<id> is a real URL.
  //
  // The "server configuration" this asks for is public/_redirects, which hands
  // every path to index.html so the router gets to see it. Without that file this
  // mode 404s on any reload.
  //
  // Links already published as /#/<id> keep working: ImageStack falls back to the
  // hash when the route has no id.
  mode: "history",
});

export default router;
