<template>
  <AudioVisualBook />
</template>

<script>
Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};
import AudioVisualBook from "./components/AudioVisualBook.vue";
export default {
  components: {
    AudioVisualBook,
  },
};
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
</style>
