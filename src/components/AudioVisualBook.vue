<template>
  <div>
    <div v-if="showControls" class="controls" @dblclick="hideControls()">
      <!-- <div>tickInterval <input v-model="tickInterval" /></div>
      <div>slideTickInterval <input v-model="slideTickInterval" /></div> -->
      <!-- <div class="btn" @click="newCard">new card</div> -->
      <div class="btn" @click="newSequence">finish sequence</div>
      <h4 style="margin-bottom: 5px">storage</h4>
      <div class="btn" @click="exportSequences">save sequences to storage</div>
      <div class="btn" @click="clearStoredSequences">clear sequences from storage</div>
      <div class="btn" @click="toggleCardStyle">toggle card style</div>
    </div>

    <div class="sequence-container">
      <div v-show="fullCards" class="fade-in-image chapter-bkg" v-for="(chapter, idx) in currentSequence" :key="idx" :style="{ backgroundImage: 'url(' + chapter.imgPath + ')' }" />
      <img v-show="!fullCards" @click="hotSwapCard(idx)" class="fade-in-image chapter-card" v-for="(chapter, idx) in currentSequence" :key="idx" :src="chapter.imgPath" />
    </div>

    <div class="sequences-container" v-for="(sequence, sequenceIdx) in sequences">
      <div v-show="fullCards" class="fade-in-image chapter-bkg" v-for="(chapter, idx) in sequence" :key="idx" :style="{ backgroundImage: 'url(' + chapter.imgPath + ')' }" />
      <img v-show="!fullCards" class="fade-in-image chapter-card" @dblclick="hotSwapStoredCard(sequenceIdx, cardIdx)" v-for="(chapter, cardIdx) in sequence" :key="idx" :src="chapter.imgPath" />
    </div>
    <BarebonesTone ref="audioModule" automaticFade />
  </div>
</template>
<script>
import { imgLibrary } from "../imgLibrary.js";
import BarebonesTone from "./BarebonesTone.vue";

const anime911 = imgLibrary.anime911.map((x) => "./memories/batch-911-anime-sel1-500k/" + x);
const secondelife911 = imgLibrary.secondlife911.map((x) => "./memories/batch-911-second-life-sel1-500k/" + x);
const batch1 = imgLibrary.batch1.map((x) => "./memories/batch-1-500k/" + x);
const batch2 = imgLibrary.batch2.map((x) => "./memories/batch-2-depth-500k/" + x);

export default {
  components: {
    BarebonesTone,
  },
  data() {
    return {
      isPaused: false,
      showControls: true,
      fullCards: true,

      // imgPaths: imgLibrary.testBatch,
      itemRefs: [],
      lastNow: null,
      ticks: 0,
      tickInterval: 1000,
      slideTickInterval: 4,
      imgIdx: 0,

      chapters: [],
      batch: batch2.concat(batch1).concat(anime911).concat(secondelife911),

      sequenceLength: 4,
      currentSequenceCursor: 0,
      currentSequence: [],
      sequences: [],
    };
  },
  methods: {
    toggleCardStyle() {
      this.fullCards = !this.fullCards;
    },
    hideControls() {
      this.showControls = false;
    },
    hotSwapCard(cardIdx) {
      const chapter = {
        imgPath: this.batch.sample(),
        audioClip: null,
      };
      this.currentSequence.splice(cardIdx, 1, chapter);
    },
    hotSwapStoredCard(sequenceIdx, cardIdx) {
      const chapter = {
        imgPath: this.batch.sample(),
        audioClip: null,
      };
      this.sequences[sequenceIdx].splice(cardIdx, 1, chapter);
    },
    newCard() {
      const chapter = {
        imgPath: this.batch.sample(),
        audioClip: null,
      };
      this.currentSequence.push(chapter);
    },
    seed() {
      this.newCard();
      this.newCard();
      this.newCard();
      this.newCard();
    },
    finishSequence() {
      this.sequences.push(this.currentSequence);
      this.currentSequence = [];
      this.seed();
    },
    newSequence() {
      this.finishSequence();
    },
    setCursor(idx) {
      this.currentSequenceCursor = idx;
    },
    updateAtCursor() {
      const chapter = {
        imgPath: this.batch.sample(),
        audioClip: null,
      };
      this.currentSequence.splice(this.currentSequenceCursor, 1, chapter);
    },
    clearStoredSequences() {
      localStorage.removeItem("savedSequences");
    },
    exportSequences() {
      const s = JSON.stringify(this.sequences);
      console.log("exportSequences:", s);
      localStorage.setItem("savedSequences", s);
    },
    tick() {
      this.ticks += 1;
      this.$refs.audioModule.playTick();

      if (this.ticks % this.slideTickInterval === 0) {
        // this.$emit('tick16')
        const image = new window.Image();
        const imgPath = this.batch.sample();
        // image.src = this.imgPaths[this.imgIdx + 1];
        image.src = imgPath;
        image.onload = () => {
          console.log("loaded");
          this.imgIdx += 1;
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
  },
  mounted() {
    this.frame();
    console.log(this.$route);
  },
  created() {
    this.seed();
    this.sequences = JSON.parse(localStorage.getItem("savedSequences") || "[]");
    console.log("parsed sequences:", this.sequences);
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
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
  background-color: black;
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

  /* position: fixed;
  top: 0;
  left: 0; */
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

.btn {
  cursor: pointer;
  text-decoration: underline;
}
</style>
