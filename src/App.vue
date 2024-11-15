<template>
  <router-view><h2 clas="loader">LOADER</h2></router-view>
</template>

<script>
Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};
window.setInterval(() => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight)
    window.scrollTo(0, 0);
  else window.scrollBy(0, 1);
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
