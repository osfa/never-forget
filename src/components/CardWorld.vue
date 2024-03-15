<template>
  <div tabindex="-1">
    <img class="formats" src="/formats2.png" />

    <div class="grid-container">
      <!-- <div class="grid-row" v-for="(r, i) in rows" :key="`${r}-${i}`"> -->
      <div class="grid-item" v-for="(c, i) in cols * rows" :key="`${c}-${i}`">
        <CardImage :step="items[i]" />
      </div>
      <!-- </div> -->
    </div>
    <BarebonesTone ref="audioModule" automaticFade :debug="false" />
    <div id="subs-container">
      <div id="subs-text">{{ subtitles }}</div>
      <audio
        id="my-audio-player"
        loop
        src="/audio/narration/nf-test-feb5-h-v1-audio-bounce.mp3">
        <track
          kind="captions"
          src="/audio/narration/nf-test-feb5-h-v1-audio-bounce.vtt"
          srclang="en"
          label="English"
          default />
      </audio>
    </div>
  </div>
</template>
<script>
import { pngLibrary } from "../data/pngLibrary.js";
import BarebonesTone from "./BarebonesTone.vue";
import CardImage from "./CardImage.vue";

const DEFAULT_COLS = 2;
const DEFAULT_ROWS = 2;

export default {
  components: {
    BarebonesTone,
    CardImage,
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,

      debug: true,

      imgPool: pngLibrary.indigoPlate,

      cols: DEFAULT_COLS,
      rows: DEFAULT_ROWS,

      items: [0, 0, 0, 0, 0, 0, 0, 0, 0],

      subtitles: "",

      isPaused: false,

      lastNow: null,
      ticks: 0,
      tickInterval: 1000,
      slideTickInterval: 8,
      tickDown: 8,

      isLoading: false,
    };
  },
  methods: {
    storyTick() {
      // console.log("storyTick");
      const image = new window.Image();
      const imgPath = this.imgPool.sample();
      image.src = imgPath;
      image.onload = () => {
        // this.hotSwapCard(sequenceIdx, imgPath);

        this.slideTickInterval = this.randomInt(6, 16);
        this.tickDown = this.slideTickInterval;
      };
    },
    tick() {
      this.ticks += 1;
      this.tickDown -= 1;
      if (this.$refs.audioModule) this.$refs.audioModule.playTick();

      if (this.ticks % this.slideTickInterval === 0) {
        this.storyTick();
      }
    },
    frame() {
      if (this.isPaused) {
        return;
      }
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
    updateGridSize() {
      if (this.windowWidth > this.windowHeight) {
        this.cols = DEFAULT_COLS;
        this.rows = DEFAULT_ROWS;
      } else {
        this.cols = 1;
        this.rows = 3;
      }
    },
    resizeHandler(e) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
      this.updateGridSize();
    },
  },
  mounted() {
    window.addEventListener("resize", this.resizeHandler);
    this.updateGridSize();
    // this.$refs.card0.newImage();
    document
      .getElementById("my-audio-player")
      .textTracks[0].addEventListener("cuechange", (event) => {
        // console.log("cuechange", event.target.activeCues);
        if (event.target.activeCues.length > 0) {
          this.subtitles = event.target.activeCues[0].text;
          const cardIdx = this.randomInt(0, this.cols * this.rows);
          this.items[cardIdx] += 1;
          // this.pan(0.5, 0); // invert?
          // if (!this.isChatResponding) {
          //   this.chatResponds(event.target.activeCues[0].text);
          // }
        }
      });
  },
  created() {
    // window.addEventListener("resize", this.resizeHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeHandler);
  },
};
</script>

<style scoped>
@import "../assets/dzi-scroller-subs.css";

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 0px;
  height: 100vh;
  width: 100vw;
}

.grid-item {
  overflow: hidden;
  position: relative;
}

.grid-item img {
  /* position: absolute;
  top: 50%;
  left: 50%;
  height: 100%;
  width: auto;
  transform: translate(-50%, -50%); */
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.grid-item img.portrait {
  width: 100%;
  height: auto;
}

@media (orientation: portrait) {
  .grid-container {
    grid-template-columns: repeat(1, 1fr);
  }
}

/* OLD BELOW  */

.action-bar {
  position: absolute;
  top: 1rem;
  left: 0;
  font-size: 1rem;
  z-index: 10000;
}

.meta-bar {
  position: absolute;
  bottom: 1rem;
  right: 0;
  font-size: 1rem;
  z-index: 10000;
}
.action {
  padding: 1rem;
  cursor: pointer;
}
.action:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

html,
body {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.formats {
  display: none;
  position: fixed;
  z-index: 3000;
  bottom: 0.5rem;
  right: 2rem;
  width: 15vw;
}

.tick-info {
  position: fixed;
  z-index: 3000;
  bottom: 0.5rem;
  right: 2rem;
  font-size: 1.5rem;
  text-shadow: 0px 0px 3px rgb(0, 0, 0);
}

.controls {
  position: fixed;
  top: 75px;
  right: 0px;
  z-index: 3000;
}

.controls .btn {
  margin: 1rem 0;
}

.main-sequence-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-x: hidden;
  justify-content: center;
  background-color: #0f0;
}

.sequences-container {
  width: 100vw;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-x: hidden;
  justify-content: center;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.chapter-bkg {
  width: 100vw;
  height: 100vh;
  position: relative;
  cursor: pointer;
}

.btn {
  cursor: pointer;
  text-decoration: underline;
}

.isLoading {
  opacity: 0.75;
  background-color: #0f0;
}
</style>
