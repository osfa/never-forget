import Vue from "vue";
import router from "./router";
import App from "./App.vue";

import "./style.css";

// const router = new VueRouter({
//   routes,
// });

// new Vue({
//   router,
//   render: (h) => h(App),
// }).$mount("#app");

// new Vue({
//   el: "#app",
//   router: router,
// }).$mount("#app");

new Vue({
  el: "#app",
  router, // Attach the router to the Vue instance
  render: (h) => h(App),
});
