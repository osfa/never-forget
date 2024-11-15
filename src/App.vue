<template>
  <router-view><h2 clas="loader">LOADER</h2></router-view>
</template>

<script>
Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};
// import AudioVisualBook from "./components/AudioVisualBook.vue";
// export default {
//   components: {
//     AudioVisualBook,
//   },
// };
window.setInterval(() => {
  // If at page bottom, scroll by to top
  window.scrollBy(0, 1);
}, 25);
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

:root {
  --animate-duration: 350ms;
  --animate-delay: 0;
}
</style>
