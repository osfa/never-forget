<template>
  <div
    tabindex="-1"
    :class="{
      '1-1': rows == 1 && cols == 1,
      '2-2': rows == 2 && cols == 2,
      '3-3': rows == 3 && cols == 3,
    }">
    <img class="formats" src="/formats2.png" />
    <div id="grid-bar"></div>
    <div class="grid-container">
      <!-- <div class="grid-row" v-for="(r, i) in rows" :key="`${r}-${i}`"> -->
      <div class="grid-item" v-for="(c, i) in cols * rows" :key="`${c}-${i}`">
        <CardImage :step="items[i]" />
      </div>
      <!-- </div> -->
    </div>
    <BarebonesTone ref="audioModule" automaticFade :debug="false" />
    <div id="subs-container">
      <div id="subs-text">
        <div id="typewriter"></div>
        <span>{{ subtitles }}</span>
      </div>
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
    <SmallClock :offset="randomInt(-25, 25) * offsetSeed" />
    <!-- <Clock :offset="randomInt(-25, 25) * offsetSeed" /> -->
  </div>
</template>
<script>
import { pngLibrary } from "../data/pngLibrary.js";
import BarebonesTone from "./BarebonesTone.vue";
import CardImage from "./CardImage.vue";
import SmallClock from "./SmallClock.vue";
import Clock from "./Clock.vue";
import Typewriter from "typewriter-effect/dist/core";

// analog clock?
// capcut timecode?
// 1 cell video? in corner? for desktop?

const DEFAULT_COLS = 1;
const DEFAULT_ROWS = 1;

export default {
  components: {
    BarebonesTone,
    CardImage,
    SmallClock,
    Clock,
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
      offsetSeed: 1,

      typewriter: null,
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
        this.rows = 1;
        // this.rows = 3;
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
        // console.log("cuechange", event.target);

        // console.log("cuechange", event.target.cues);
        // console.log("cuechange", event.target.cues.length);
        const typewriterSpeed = 25;
        if (this.typewriter === null) {
          console.log("init typewriter");
          this.typewriter = new Typewriter("#typewriter", {
            delay: typewriterSpeed,
            deleteSpeed: 1,
            cursor: "",
            // loop: false,
            // autoStart: true,
            // strings: ["Hello", "World"],
          });
        }

        if (event.target.activeCues.length > 0) {
          this.ticks += 1;
          const srtText = event.target.activeCues[0].text;

          // const starttime = event.target.cues[0].startTime * 1000;
          // const endtime = event.target.cues[0].endTime * 1000;

          // const duration = endtime - starttime;

          // const textPrintTime =
          //   event.target.activeCues[0].text.length * typewriterSpeed;
          // console.log("textPrintTime", textPrintTime);
          // console.log(event.target.activeCues[0].text.length);
          // const pauseFor = duration - textPrintTime;
          // console.log("pauseFor:", pauseFor);

          // get next queue item here to understand how long to pause? here?
          // this.typewriter
          //   .typeString(srtText)
          //   .pauseFor(pauseFor)
          //   .callFunction(() => {
          //     console.log("All strings were typed out");
          //     const typewriterEl = document.getElementsByClassName(
          //       "Typewriter__wrapper"
          //     )[0];
          //     if (typewriterEl) typewriterEl.innerHTML = "";
          //   })
          //   .start();

          this.subtitles = srtText;
          if (this.ticks % 3 === 0) {
            const cardIdx = this.randomInt(0, this.cols * this.rows);
            this.items[cardIdx] += 1;
          }
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
@import "../assets/grid-layouts.css";

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
