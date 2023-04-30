<template>
  <div>
    <!-- <div class="controls"><input v-model="tickInterval" /></div> -->
    <div class="slide-background" :style="{ backgroundImage: 'url(' + imgPaths[0] + ')' }"></div>
  </div>
</template>

<script>
import { imgLibrary } from "../imgLibrary.js";

export default {
  data() {
    return {
      imgPaths: imgLibrary.testBatch,
      itemRefs: [],
      lastNow: null,
      ticks: 0,
      tickInterval: 3000,
    };
  },
  methods: {
    tick() {
      this.ticks += 1;
      // this.addMemory(this.imgPaths.sample());
      // console.log(this.$refs.layer);
    },
    frame() {
      const now = Date.now();
      if (!this.lastNow || now - this.lastNow >= this.tickInterval) {
        this.lastNow = now;
        this.tick();
      }
      requestAnimationFrame(() => {
        this.frame();
      });
    },
    randomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    },
    randomFloat(min, max) {
      const r = Math.random() * (max - min) + min;
      return r;
    },
  },
  mounted() {
    // this.imgPaths.forEach((element) => {
    //   this.addMemory(element);
    // });
    this.frame();
  },
  created() {
    // const image = new window.Image();
    // image.src = "./00001-2017427526_46.jpg";
    // image.onload = () => {
    //   // set image only when it is loaded
    //   console.log("loaded");
    //   this.image = image;
    // };
  },
};
</script>

<style>
@keyframes bg-scrolling {
  0% {
    background-position: 50px 50px;
  }
}
@keyframes bg-scrolling-reverse {
  100% {
    background-size: 40%;
  }
}

@keyframes slidein {
  from {
    background-position: top;
    background-size: 102%;
  }
  to {
    background-position: top;
    background-size: 115%;
  }
}

.slide-background {
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  /* background-size: contain; */
  /* animation: bg-scrolling-reverse 10s infinite;
  animation-timing-function: linear; */

  background-size: cover;
  animation: slidein 30s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
body {
  margin: 0;
  padding: 0;
}
.controls {
  position: fixed;
  top: 50px;
  right: 0px;
  z-index: 1000;
}
</style>
