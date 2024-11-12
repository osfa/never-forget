<template>
  <div
    tabindex="-1"
    :class="{
      'one-one': rows == 1 && cols == 1,
      'two-two': rows == 2 && cols == 2,
      'three-three': rows == 3 && cols == 3,
    }">
    <!-- <img class="formats" src="/formats2.png" /> -->
    <div class="filter-bar right">
      <!-- <div class="model-section">
        <div
          class="btn-layer"
          :class="{ active: sizeMultiplier === s }"
          @click="setS(s)"
          v-for="s in sizeMultipliers">
          {{ sizeLabelMap[s] }}
        </div>
        <div
          v-if="showDitherOption"
          class="btn-layer"
          :class="{ active: ditherPalette === dp }"
          @click="ditherPalette = dp"
          v-for="dp in ['cmykPlus', 'auto', 'websafe', 'bw']">
          {{ dp.slice(0, 1) }}
        </div>
        <div
          v-if="showDitherOption"
          class="btn-layer"
          :class="{ active: ditherColors === cc }"
          @click="ditherColors = cc"
          v-for="cc in ['2', '4', '8', '16']">
          {{ cc }}
        </div>
      </div> -->
      <div class="action-section">
        <div
          class="btn-layer fried"
          :class="{ active: plateFried }"
          @click="plateFried = !plateFried">
          ◡
        </div>
        <div
          class="btn-layer"
          :class="{ active: jpegQuality === q }"
          @click="setQ(q)"
          v-for="q in jpegQualities">
          {{ qLabelMap[q] }}
        </div>
        <div
          @click="setGrid(1, 1)"
          :class="{ active: cols === 1 && rows === 1 }"
          class="btn-layer">
          Ⅰ
        </div>
        <div
          @click="setGrid(2, 2)"
          :class="{ active: cols === 2 && rows === 2 }"
          class="btn-layer">
          Ⅱ
        </div>
        <div
          v-if="false"
          class="btn-layer"
          :class="{ active: infoModalOpen }"
          @click="infoModalOpen = !infoModalOpen">
          ⓘ
        </div>
      </div>
    </div>

    <div class="filter-bar">
      <div class="model-section">
        <div
          v-for="(model, idx) in Object.keys(MODEL_META_MAP)"
          class="btn-layer"
          :class="{ active: selectedModels.includes(model) }"
          :style="{ backgroundColor: MODEL_META_MAP[model]?.hexColor }"
          @click="setPlateFilter(model)">
          {{ MODEL_META_MAP[model]?.unicode }}
        </div>
      </div>
    </div>

    <!-- <div class="grid-container"> -->
    <transition-group
      :name="animationName"
      tag="div"
      class="grid-container"
      mode="out-in">
      <CardImage
        @click.native="moveStory"
        v-for="(c, i) in cols * rows"
        :key="`${c}-${i}`"
        :imageOperation="plateFried ? 'fry' : 'dither'"
        :jpegQuality="jpegQuality"
        :ditherPalette="ditherPalette"
        :ditherColors="ditherColors"
        :sizeMultiplier="String(sizeMultiplier)"
        :modelName="selectedModels[0]"
        :step="items[i]" />
    </transition-group>
    <!-- </div> -->
    <BarebonesTone ref="audioModule" automaticFade :debug="false" />
    <div id="subs-container">
      <div id="subs-text" :class="{ fried: plateFried }">
        <div id="typewriter"></div>
        <span>{{ subtitles }}</span>
      </div>
      <audio
        id="my-audio-player"
        loop
        src="https://jpeg.matrix.surf/audio/narration/bush-bad-video-streaming-66-amount.mp3">
        <track
          kind="captions"
          src="/audio/narration/bush.vtt"
          srclang="en"
          label="English"
          default />
      </audio>
    </div>
    <SmallClock :offset="randomInt(-25, 25) * offsetSeed" />
    <!-- <Chat
      @click.native="showChat = !showChat"
      :class="{ active: showChat }"
      :ticks="ticks"
      :storyTicks="ticks" /> -->
    <!-- <Clock :offset="randomInt(-25, 25) * offsetSeed" /> -->
  </div>
</template>
<script>
// import { zalgofy } from "../zalgo.js";
import BarebonesTone from "./BarebonesTone.vue";
import CardImage from "./CardImage.vue";
import SmallClock from "./SmallClock.vue";
import Clock from "./Clock.vue";
import Chat from "./Chat.vue";
import Typewriter from "typewriter-effect/dist/core";
import { MODEL_META_MAP } from "../plateMap.js";

const DEFAULT_COLS = 1;
const DEFAULT_ROWS = 1;

export default {
  components: {
    BarebonesTone,
    CardImage,
    SmallClock,
    Clock,
    Chat,
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,

      debug: true,
      showChat: true,

      // imgPool: pngLibrary.indigoPlate,

      cols: DEFAULT_COLS,
      rows: DEFAULT_ROWS,

      items: [0, 0, 0, 0, 0, 0, 0, 0, 0],

      subtitles: "",
      currentSubs: [],

      isPaused: false,

      lastNow: null,
      ticks: 0,
      cueTicks: 0,
      tickInterval: 1000,
      slideTickInterval: 4,
      tickDown: 8,

      isLoading: false,
      offsetSeed: 1,

      typewriter: null,
      infoModalOpen: false,
      MODEL_META_MAP,

      selectedModels: [Object.keys(MODEL_META_MAP).random()],

      showDitherOption: false,
      plateFried: true,

      jpegQuality: 1,
      jpegQualities: [1, 5, 10, 50],

      ditherPalette: "cmykPlus",
      ditherColors: "8",
      sizeMultiplier: 1.0,
      sizeMultipliers: [0.25, 0.5, 1.0],
      sizeLabelMap: { 0.25: "∮", 0.5: "∬", 1.0: "∭", 2.0: "2" },
      qLabelMap: { 50: "⟚", 10: "⟐", 5: "⟈", 1: "⟥" },
      animationName: "fade",
    };
  },
  methods: {
    moveStory() {
      console.log("moveStory");
      const nextSub = this.currentSubs[this.cueTicks + 1];
      // this.cueTicks += 1;
      this.scrobble(nextSub.startTime);
    },
    swipeStory(touchType, event) {
      console.log("swipeStory", touchType, event);
    },
    storyTick() {
      console.log("storyTick");
      // const image = new window.Image();
      // const imgPath = this.imgPool.sample();
      // image.src = imgPath;
      // image.onload = () => {
      //   // this.hotSwapCard(sequenceIdx, imgPath);
      //   this.slideTickInterval = this.randomInt(6, 16);
      //   this.tickDown = this.slideTickInterval;
      // };

      if (this.cueTicks % 2 === 0) {
        const cardIdx = this.randomInt(0, this.cols * this.rows);
        this.items[cardIdx] += 1;
        this.rollNewSettings();
        return;
      }

      let rolledNewLayout = false;
      if (this.cueTicks % 3 === 0) {
        this.rollNewLayout();
        rolledNewLayout = true;
      }

      if (this.cols === 1 && this.rows === 1 && rolledNewLayout) {
        this.items[0] += 1;
      }
    },
    tick() {
      // console.log("tick");
      this.ticks += 1;
      this.tickDown -= 1;
      if (this.$refs.audioModule) this.$refs.audioModule.playTick();

      // if (this.ticks % this.slideTickInterval === 0) {
      //   this.storyTick();
      // }
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
    rollNewSettings() {
      this.setPlateFilter(Object.keys(MODEL_META_MAP).sample());
      this.jpegQuality = [1, 5, 10, 50].sample();
      this.sizeMultiplier = [0.25, 0.5, 1.0, 1.0, 1.0, 1.0].sample();
      this.plateFried = [true, true, false].sample();
    },
    rollNewLayout(cueTicks) {
      // layout roll
      const confs = [
        [1, 1],
        [2, 2],
      ];
      const conf = confs.sample();
      this.cols = conf[0];
      this.rows = conf[1];
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
    setGrid(cols, rows) {
      this.cols = cols;
      this.rows = rows;
    },
    resizeHandler(e) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
      // this.updateGridSize();
    },
    setPlateFilter(model) {
      console.log("setplatefilter", model);
      this.selectedModels = [model];
      // if (this.selectedModels.includes(model)) {
      //   this.selectedModels = this.selectedModels.filter((m) => m !== model);
      // } else {
      //   this.selectedModels.push(model);
      // }
    },
    setQ(q) {
      this.jpegQuality = q;
    },
    setS(s) {
      this.sizeMultiplier = s;
    },
    scrobble(position_in_seconds) {
      document.getElementById("my-audio-player").currentTime =
        position_in_seconds;
    },
  },
  mounted() {
    window.addEventListener("resize", this.resizeHandler);
    this.updateGridSize();
    this.frame();
    // this.$refs.card0.newImage();
    this.currentSubs = [];

    // have gradually spede up?
    // document.getElementById("my-audio-player").playbackRate = 2;
    document
      .getElementById("my-audio-player")
      .textTracks[0].addEventListener("cuechange", (event) => {
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

        if (this.currentSubs.length === 0) {
          for (let i = 0; i < event.target.cues.length; i++) {
            const cue = event.target.cues[i];
            this.currentSubs.push(cue);
          }
        }

        if (event.target.activeCues.length > 0) {
          const srtText = event.target.activeCues[0].text;
          console.log("cuechange: ", event.target.activeCues[0].text);

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

          // this.subtitles = zalgofy(srtText);
          this.subtitles = srtText;
          // this.ticks += 1;
          this.cueTicks += 1;
          this.storyTick();
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
@import "../assets/dzi-filterbar.css";
@import "@asika32764/vue-animate/dist/vue-animate.css";

.cards-enter-active,
.cards-leave-active {
  transition: opacity 1s;
}
.cards-enter,
.cards-leave-to {
  opacity: 0;
  /* transform: translateY(30px); */
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

.filter-bar {
  z-index: 3001;
}
</style>
