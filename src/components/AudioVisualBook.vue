<template>
  <div>
    <div class="controls">
      <div>tickInterval <input v-model="tickInterval" /></div>
      <div>slideTickInterval <input v-model="slideTickInterval" /></div>
      <div @click="newSequence">new sequence</div>
      <div @click="newCard">new card</div>
    </div>
    <div class="fade-in-image chapter-bkg" v-for="(chapter, idx) in chapters" :key="idx" :style="{ backgroundImage: 'url(' + chapter.imgPath + ')' }" />
    <div class="sequence-container"><img class="fade-in-image chapter-card" v-for="(chapter, idx) in chapters.reverse()" :key="idx" :src="chapter.imgPath" /></div>
    <img class="slot" @click="newSequence" v-for="(slot, idx) in slots" :key="idx" :src="slot.imgPath" />
  </div>
</template>

<script>
import { imgLibrary } from "../imgLibrary.js";
// const basePath = "./memories/batch-1-500k/";
// const basePath = "./memories/batch-2-depth-500k/";

const anime911 = imgLibrary.anime911.map((x) => "./memories/batch-911-anime-sel1-500k/" + x);
const secondelife911 = imgLibrary.secondlife911.map((x) => "./memories/batch-911-second-life-sel1-500k/" + x);
const batch1 = imgLibrary.batch1.map((x) => "./memories/batch-1-500k/" + x);
const batch2 = imgLibrary.batch2.map((x) => "./memories/batch-2-depth-500k/" + x);
export default {
  data() {
    return {
      imgPaths: imgLibrary.testBatch,
      itemRefs: [],
      lastNow: null,
      ticks: 0,
      tickInterval: 1000,
      slideTickInterval: 4,
      imgIdx: 0,

      chapters: [],
      batch: batch2.concat(batch1).concat(anime911).concat(secondelife911),

      currentSequence: [],
      sequences: [],
      slots: [],
    };
  },
  methods: {
    newCard() {
      const chapter = {
        imgPath: this.batch.sample(),
        audioClip: null,
      };
      this.currentSequence.push(chapter);
    },
    newSequence() {
      this.sequences.push(this.currentSequence);
      this.currentSequence = [];
    },
    tick() {
      this.ticks += 1;
      // console.log(this.$refs.layer);
      if (this.ticks % this.slideTickInterval === 0) {
        // this.$emit('tick16')
        const image = new window.Image();
        image.src = this.imgPaths[this.imgIdx + 1];
        image.onload = () => {
          console.log("loaded");
          this.imgIdx += 1;
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
html,
body {
  margin: 0;
  padding: 0;
}

.controls {
  position: fixed;
  top: 25px;
  left: 25px;
  z-index: 3000;
}

.sequence-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-x: hidden;
  justify-content: center;
}
.chapter-card {
  width: 30vw;
  z-index: 1000;
  margin: 0;
  padding: 0;
  margin: 10px;
}
.chapter-card {
  width: 48vw;
  z-index: 2000;
  margin: 0;
  padding: 0;
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
