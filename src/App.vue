<script setup>
// import HelloWorld from "./components/HelloWorld.vue";
// import ScrapBook from "./components/ScrapBook.vue";
import AudioVisualBook from "./components/AudioVisualBook.vue";
import BarebonesTone from "./components/BarebonesTone.vue";
Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};
</script>

<template>
  <!-- <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div> -->
  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <!-- <img src="/00007-2017427528_44.png" class="logo" alt="Vite logo" /> -->
  <router-link to="/">Home</router-link>
  <AudioVisualBook />
  <!-- <ScrapBook /> -->
  <BarebonesTone />
  <!-- <AudioModule /> -->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
