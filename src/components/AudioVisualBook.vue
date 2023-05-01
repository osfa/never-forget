<template>
  <div>
    <!-- <div class="controls"><input v-model="tickInterval" /></div> -->
    <!-- <div class="slide-background fadeIn" ></div> -->
    <!-- <img class="fade-in-image chapter" v-for="(chapter, idx) in chapters" :key="idx" :src="chapter.imgPath" /> -->
    <div class="fade-in-image chapter-bkg" v-for="(chapter, idx) in chapters" :key="idx" :style="{ backgroundImage: 'url(' + chapter.imgPath + ')' }" />
  </div>
</template>

<script>
import { imgLibrary } from "../imgLibrary.js";
// const basePath = "./memories/batch-1-500k/";
const basePath = "./memories/batch-2-depth-500k/";

export default {
  data() {
    return {
      imgPaths: imgLibrary.testBatch,
      itemRefs: [],
      lastNow: null,
      ticks: 0,
      tickInterval: 1000,
      slideTickInterval: 10,
      imgIdx: 0,

      chapters: [],
      // batch: imgLibrary.batch2,
      batch: imgLibrary.batch2.map((x) => "./memories/batch-2-depth-500k/" + x).concat(imgLibrary.batch1.map((x) => "./memories/batch-1-500k/" + x)),
    };
  },
  methods: {
    tick() {
      this.ticks += 1;
      // this.addMemory(this.imgPaths.sample());
      // console.log(this.$refs.layer);
      if (this.ticks % this.slideTickInterval === 0) {
        // this.$emit('tick16')
        const image = new window.Image();
        image.src = this.imgPaths[this.imgIdx + 1];
        image.onload = () => {
          console.log("loaded");
          this.imgIdx += 1;
          // this.createChapter(this.imgPaths[this.imgIdx]);
          const imgPath = this.batch.sample();
          this.createChapter(imgPath);
        };
      }
    },
    createChapter(imgPath) {
      const chapter = {
        imgPath,
        audioClip: null,
      };
      this.chapters.push(chapter);
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
    // this.createChapter(this.imgPaths[this.imgIdx]);
    const imgPath = this.batch.sample();
    this.createChapter(imgPath);
    this.frame();
  },
  created() {},
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
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.fade-in-image {
  animation: fadeIn 1s;
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
.chapter {
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
}
.chapter-bkg {
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
}
@media (orientation: landscape) {
  .chapter-bkg {
    background-size: cover;
  }
}
@media (orientation: portrait) {
  .chapter-bkg {
    background-size: contain;
  }
}
</style>
