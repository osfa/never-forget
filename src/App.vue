<template>
  <router-view />
</template>

<script>
Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};

let isUserScrolling = false;
let scrollTimeout;
let timeoutTime = 500;

window.addEventListener("touchstart", () => {
  isUserScrolling = true;
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isUserScrolling = false;
  }, timeoutTime);
});

window.addEventListener("touchend", () => {
  isUserScrolling = false;
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isUserScrolling = false;
  }, timeoutTime);
});

window.setInterval(() => {
  if (!isUserScrolling) {
    // if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    //   // window.scrollTo(0, 0);
    // } else {
    // window.scrollBy(0, 1);
    window.scrollBy(0, -1);
    // }
  }
}, 25);
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: black;
}
html {
  background-color: black;
}
body {
  animation: fadeInAnimation ease 3s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  background-color: black;
}

@keyframes fadeInAnimation {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
