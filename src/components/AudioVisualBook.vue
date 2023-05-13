<template>
  <div>
    <div v-if="showControls" class="controls" @dblclick="hideControls()">
      <!-- <div>tickInterval <input v-model="tickInterval" /></div>
      <div>slideTickInterval <input v-model="slideTickInterval" /></div> -->
      <!-- <div class="btn" @click="newCard">🎲</div> -->
      <!-- <div class="btn" @click="newSequence">finish sequence</div>
      <h4 style="margin-bottom: 5px">storage</h4> -->
      <!-- 🧙‍♀️ 🎰 🎱 🎲 🔮 ✨ ✅ 🌟 -->
      <div class="btn action" @click="exportSequences">💾</div>
      <div class="btn action" @click="clearStoredSequences">❌</div>
      <!-- <div class="btn" @click="fullCards = !fullCards">toggle card style</div> -->
      <!-- <div class="btn" @click="scrollToBottom">scroll</div> -->
      <div class="btn action" @click="showBlacklist = !showBlacklist">🎱</div>
    </div>

    <div v-if="showBlacklist" class="main-sequence-container">
      <div class="fade-in-image chapter-bkg" v-for="(imgPath, idx) in blackList" :style="{ backgroundImage: 'url(' + imgPath + ')' }">
        <div class="action-bar"><span @click="reinstate(idx)" class="action">🟢</span></div>
      </div>
    </div>

    <div v-if="!showBlacklist" class="main-sequence-container">
      <div
        v-show="fullCards"
        @click="hotSwapCard(idx)"
        class="fade-in-image chapter-bkg"
        ref="sequences"
        v-for="(chapter, idx) in currentSequence"
        :style="{ backgroundImage: 'url(' + chapter.imgPath + ')' }">
        <div class="action-bar"><span @click="blackListCard(idx)" class="action">⚫</span> <span @click="superStarCard(idx)" class="action">✨</span></div>
      </div>
      <!-- <img v-show="!fullCards" @click="hotSwapCard(idx)" class="fade-in-image chapter-card" v-for="(chapter, idx) in currentSequence" :src="chapter.imgPath" /> -->
      <!-- <div v-show="!fullCards" @click="hotSwapCard(idx)" class="fade-in-image chapter-card" v-for="(chapter, idx) in currentSequence">
        <img :src="chapter.imgPath" />
      </div> -->
    </div>

    <!-- <div class="sequences-container" v-for="(sequence, sequenceIdx) in sequences">
      <div v-show="fullCards" class="fade-in-image chapter-bkg" v-for="(chapter, idx) in sequence" :style="{ backgroundImage: 'url(' + chapter.imgPath + ')' }" />
      <img v-show="!fullCards" class="fade-in-image chapter-card" @dblclick="hotSwapStoredCard(sequenceIdx, cardIdx)" v-for="(chapter, cardIdx) in sequence" :src="chapter.imgPath" />
    </div> -->
    <BarebonesTone ref="audioModule" automaticFade />
  </div>
</template>
<script>
import { imgLibrary } from "../imgLibrary.js";
import { imgLibrary2 } from "../imgLibrary2.js";
import BarebonesTone from "./BarebonesTone.vue";
// .slice().reverse()
const anime911 = imgLibrary.anime911.map((x) => "./memories/batch-911-anime-sel1-500k/" + x);
const secondlife911 = imgLibrary.secondlife911.map((x) => "./memories/batch-911-second-life-sel1-500k/" + x);
// const batch1 = imgLibrary.batch1.map((x) => "./memories/batch-1-500k/" + x);
// const batch2 = imgLibrary.batch2.map((x) => "./memories/batch-2-depth-500k/" + x);

const parseInputs = (array, subdir) => {
  return array[subdir].map((x) => "./memories/" + x.replace(subdir + "/", subdir + "/_fried-q10-sharpen0/") + "-fried.jpg");
};

// imgLibrary2["911-anime-500k"].map((x) => "./memories/" + x.replace("911-anime-500k/", "911-anime-500k/_fried-q10-sharpen0/") + "-fried.jpg");
const batch1 = parseInputs(imgLibrary2, "911-anime-500k").concat(parseInputs(imgLibrary2, "911-anime-500k"));
const batch2 = parseInputs(imgLibrary2, "911-caspar-500k").concat(parseInputs(imgLibrary2, "911-caspar-500k"));
const batch3 = parseInputs(imgLibrary2, "911-secondlife-500k").concat(parseInputs(imgLibrary2, "911-secondlife-500k"));
const batch4 = parseInputs(imgLibrary2, "ava-anime-500k");
const batch5 = parseInputs(imgLibrary2, "ava-caspar-500k");
const batch6 = parseInputs(imgLibrary2, "ava-secondlife-500k");
const batch7 = parseInputs(imgLibrary2, "vip-caspar-500k").concat(parseInputs(imgLibrary2, "vip-caspar-500k"));
const batch8 = parseInputs(imgLibrary2, "vip-secondlife-500k").concat(parseInputs(imgLibrary2, "vip-secondlife-500k"));
const batch9 = parseInputs(imgLibrary2, "vip-anime-500k").concat(parseInputs(imgLibrary2, "911-anime-500k"));

const concatted = batch1.concat(batch2).concat(batch3).concat(batch4).concat(batch5).concat(batch6).concat(batch7).concat(batch8).concat(batch9);

export default {
  components: {
    BarebonesTone,
  },
  data() {
    return {
      blackList: [],
      showBlacklist: false,

      isPaused: false,
      showControls: true,
      fullCards: true,

      // imgPaths: imgLibrary.testBatch,
      itemRefs: [],
      lastNow: null,
      ticks: 0,
      tickInterval: 1000,
      slideTickInterval: 8,
      // imgIdx: 0,

      currentSequence: [],
      batch: concatted,
      // batch: batch2.concat(batch1).concat(anime911).concat(secondlife911),

      // sequenceLength: 4,
      // currentSequenceCursor: 0,
      currentSequence: [],
      sequences: [],
    };
  },
  methods: {
    scrollToSequence(idx) {
      this.$refs.sequences[idx].scrollIntoView({ behavior: "smooth" });
    },
    hideControls() {
      // this.showControls = false;
    },
    hotSwapCard(cardIdx, imgPath) {
      if (!imgPath) {
        console.log("hot swap not loaded:", cardIdx);
        const image = new window.Image();
        imgPath = this.batch.sample();
        image.src = imgPath;
        image.onload = () => {
          console.log("loaded into:", imgPath, cardIdx);
          const chapter = {
            imgPath,
            audioClip: null,
          };
          this.currentSequence.splice(cardIdx, 1, chapter);
        };
      } else {
        console.log("hot swap w loaded:", cardIdx, imgPath);
        const chapter = {
          imgPath,
          audioClip: null,
        };
        this.currentSequence.splice(cardIdx, 1, chapter);
      }
    },
    blackListCard(cardIdx) {
      console.log("blackListCard:", cardIdx);
      this.blackList.push(this.currentSequence[cardIdx].imgPath);
      this.exportBlackList();
    },
    reinstate(cardIdx) {
      console.log("reinstate:", cardIdx);
      this.blackList.splice(cardIdx, 1);
      // @todo force explicit? also have hard coded blacklist..
      // this.exportBlackList();
    },
    // hotSwapStoredCard(sequenceIdx, cardIdx) {
    //   const chapter = {
    //     imgPath: this.batch.sample(),
    //     audioClip: null,
    //   };
    //   this.sequences[sequenceIdx].splice(cardIdx, 1, chapter);
    // },
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
    },
    finishSequence() {
      this.sequences.push(this.currentSequence);
      this.currentSequence = [];
      this.seed();
    },
    newSequence() {
      this.finishSequence();
    },
    // setCursor(idx) {
    //   this.currentSequenceCursor = idx;
    // },
    // updateAtCursor() {
    //   const chapter = {
    //     imgPath: this.batch.sample(),
    //     audioClip: null,
    //   };
    //   this.currentSequence.splice(this.currentSequenceCursor, 1, chapter);
    // },
    clearStoredSequences() {
      localStorage.removeItem("savedSequences");
      // localStorage.removeItem("blackList");
    },
    exportBlackList() {
      const s = JSON.stringify(this.blackList);
      console.log("exportBlackList:", s);
      localStorage.setItem("blackList", s);
    },
    exportSequences() {
      const s = JSON.stringify(this.sequences);
      console.log("exportSequences:", s);
      localStorage.setItem("savedSequences", s);
    },
    storyTick() {
      const image = new window.Image();
      const imgPath = this.batch.sample();
      image.src = imgPath;
      const sequenceIdx = this.randomInt(0, this.currentSequence.length);
      image.onload = () => {
        console.log("loaded into:", imgPath, sequenceIdx);
        // const chapter = {
        //   imgPath,
        //   audioClip: null,
        // };
        // this.currentSequence.push(chapter);
        this.hotSwapCard(sequenceIdx, imgPath);
        this.scrollToSequence(sequenceIdx);
        this.slideTickInterval = [4, 8, 16].sample();
      };
    },
    tick() {
      this.ticks += 1;
      if (this.$refs.audioModule) this.$refs.audioModule.playTick();

      if (this.ticks % this.slideTickInterval === 0) {
        // this.$emit('tick16')
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
  },
  mounted() {
    this.frame();
    console.log(this.$route);
  },
  created() {
    this.seed();
    this.sequences = JSON.parse(localStorage.getItem("savedSequences") || "[]");
    this.sequences = [];
    this.blackList = JSON.parse(localStorage.getItem("blackList") || "[]");
    console.log("before", this.batch.length);
    this.batch = this.batch.filter((x) => !this.blackList.includes(x));
    console.log("after", this.batch.length);
    console.log("parsed sequences:", this.sequences);
  },
};
</script>

<style>
.action-bar {
  position: absolute;
  top: 1rem;
  left: 0;
  /* padding: 1rem; */
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
  margin: 0;
  padding: 0;
  overflow-x: hidden;
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
  background-color: white;
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
  background-color: red;
}

.chapter-card {
  width: 48vw;
  width: 49vw;
  height: 49vh;
  z-index: 2000;
  margin: 0;
  padding: 0;
}
.chapter-card img {
  width: 100%;
  object-fit: contain;
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
  position: relative;
  /* opacity: 0; */
  /* pointer-events: none; */
  /* position: fixed;
  top: 0;
  left: 0; */
}

@media (orientation: landscape) {
  .chapter-bkg {
    background-size: cover;
    background-size: contain;
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
