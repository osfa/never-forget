<template>
  <div tabindex="-1" @keyup="keyListener" @dblclick.meta="toggleControls()">
    <img class="formats" src="/formats2.png" />
    <div v-if="showControls" class="controls">
      <!-- <div>tickInterval <input v-model="tickInterval" /></div>
      <div>slideTickInterval <input v-model="slideTickInterval" /></div> -->
      <!-- 🧙‍♀️ 🎰 🎱 🎲 🔮 ✨ ✅ 🌟 -->
      <div class="btn action" @click="showBlacklist = !showBlacklist">🎱</div>
    </div>

    <div v-if="showBlacklist" class="main-sequence-container">
      <div class="fade-in-image chapter-bkg" v-for="(imgPath, idx) in blackList" :style="{ backgroundImage: 'url(' + imgPath + ')' }">
        <div class="action-bar"><span @click="reinstate(idx)" class="action">🟢</span></div>
      </div>
    </div>

    <div v-if="!showBlacklist" class="main-sequence-container">
      <transition-group name="fade" mode="out-in">
        <div
          @dblclick="hotSwapCard(idx, undefined, true)"
          @click="hotSwapCard(idx, undefined, false)"
          class="chapter-bkg"
          ref="sequences"
          v-for="(chapter, idx) in timelines"
          :key="`${chapter.imgPath}-${idx}`"
          :style="{ backgroundImage: 'url(' + chapter.imgPath + ')' }">
          <div v-if="showControls" class="action-bar">
            <span @click="blackListCard(idx)" class="action">⚫</span><span @click="superStarCard(idx)" class="action">✨</span><span v-if="isRatingMode">{{ chapter.stars || "not rated" }}</span>
          </div>
          <div v-if="showControls" class="meta-bar">
            <span class="action">{{ imgIdx }} / {{ batch.length }}</span>
            <span class="action">{{ previouslyRated }}</span>
          </div>
        </div>
      </transition-group>
    </div>
    <BarebonesTone ref="audioModule" automaticFade :debug="debug" />
    <!-- <div class="subtitles">
      <div class="sub_fb">{{ currentText }}</div>
    </div> -->
  </div>
</template>
<script>
import { imgLibrary2 } from "../imgLibrary2.js";
import BarebonesTone from "./BarebonesTone.vue";

const parseInputs = (array, subdir) => {
  return array[subdir].map((x) => "./memories/" + x.replace(subdir + "/", subdir + "/_fried-q10-sharpen0/") + "-fried.jpg");
};

// 911
const batch1 = parseInputs(imgLibrary2, "911-anime-500k").concat(parseInputs(imgLibrary2, "911-anime-500k"));
const batch2 = []; // parseInputs(imgLibrary2, "911-caspar-500k").concat(parseInputs(imgLibrary2, "911-caspar-500k"));
const batch3 = parseInputs(imgLibrary2, "911-secondlife-500k").concat(parseInputs(imgLibrary2, "911-secondlife-500k"));

// ava frames
const batch4 = parseInputs(imgLibrary2, "ava-anime-500k");
const batch5 = parseInputs(imgLibrary2, "ava-caspar-500k"); // pikc out bangers
const batch6 = parseInputs(imgLibrary2, "ava-secondlife-500k");

// vip
const batch7 = []; //parseInputs(imgLibrary2, "vip-caspar-500k").concat(parseInputs(imgLibrary2, "vip-caspar-500k"));
const batch8 = parseInputs(imgLibrary2, "vip-secondlife-500k").concat(parseInputs(imgLibrary2, "vip-secondlife-500k"));
const batch9 = parseInputs(imgLibrary2, "vip-anime-500k").concat(parseInputs(imgLibrary2, "911-anime-500k"));

// fixed, no ts:ed fried stuff
const allVariations = imgLibrary2["vip-1997"];
const variationFiltered = allVariations.filter(function (value, index) {
  return index % 6 == 0;
});

// const concatted = variationFiltered; //
// const concatted = batch5.concat(batch7);
const concatted = batch1.concat(batch2).concat(batch3).concat(batch4).concat(batch5).concat(batch6).concat(batch7).concat(batch8).concat(batch9);

const texts = [
  "After the man completes his voice-over, he takes a moment to collect himself. \n He gazes about the motion capture studio, his mind struggling to comprehend the depth of the experience.",
  "He begins to remove the motion capture suit, the material peeling off his skin with a sickening squelch. \n His flesh glistens in the dim light, its color and texture altered by the eldritch power of the virtual world.",
];

export default {
  components: {
    BarebonesTone,
  },
  data() {
    return {
      debug: false,

      timelines: [],
      batch: concatted,
      chapters: [],

      isRatingMode: false,
      imgIdx: 0,
      previouslyRated: 0,

      isPaused: false,
      showControls: false,

      lastNow: null,
      ticks: 0,
      tickInterval: 1000,
      slideTickInterval: 8,

      currentText: texts.sample(),

      blackList: [],
      showBlacklist: false,

      superList: [],
      showSuperList: false,
      rated: [],
    };
  },
  methods: {
    rate(stars, cardIdx) {
      if (!this.isRatingMode) return;
      console.log("rating:", stars, this.timelines[cardIdx].imgPath);
      this.timelines[cardIdx].stars = stars;
      this.rated.push(this.timelines[cardIdx]);
      this.hotSwapCard(cardIdx);
      this.exportRated();
    },
    keyListener(e) {
      // console.log("keyListener", e);
      if (e.key === "1") {
        this.rate(1, 0);
        return;
      } else if (e.key === "2") {
        this.rate(2, 0);
        return;
      } else if (e.key === "3") {
        this.rate(3, 0);
        return;
      } else if (e.key === "4") {
        this.rate(4, 0);
        return;
      } else if (e.key === "5") {
        this.rate(5, 0);
        // this.superStarCard(0);
        return;
      } else if (e.key === "f") {
        this.superStarCard(0);
        return;
      } else if (e.key === "b") {
        this.blackListCard(0);
        return;
      }
    },
    scrollToSequence(idx) {
      this.$refs.sequences[idx].scrollIntoView({ behavior: "smooth" });
    },
    toggleControls() {
      console.log("toggleControls");
      this.showControls = !this.showControls;
    },
    hotSwapCard(cardIdx, chapterCard, doubleClick) {
      // console.log("hotSwapCard", cardIdx, imgPath);

      if (this.isRatingMode && !doubleClick) {
        return;
      }

      if (!chapterCard) {
        const image = new window.Image();
        if (this.isRatingMode) {
          this.imgIdx += 1;
          chapterCard = this.batch[this.imgIdx];
        } else {
          chapterCard = this.batch.sample();
        }
        image.src = chapterCard.imgPath;
        image.onload = () => {
          // console.log("loaded into:", imgPath, cardIdx);
          // const chapter = this.createChapter(imgPath);
          this.timelines.splice(cardIdx, 1, chapterCard);
        };
      } else {
        this.timelines.splice(cardIdx, 1, chapterCard);
      }
    },
    blackListCard(cardIdx) {
      console.log("blackListCard:", cardIdx);
      this.blackList.push(this.timelines[cardIdx].imgPath);
      this.exportBlackList();
    },
    superStarCard(cardIdx) {
      console.log("superStarCard:", cardIdx);
      this.superList.push(this.timelines[cardIdx].imgPath);
      this.exportSuperList();
    },
    reinstate(cardIdx) {
      console.log("reinstate:", cardIdx);
      this.blackList.splice(cardIdx, 1);
      // @todo force explicit? also have hard coded blacklist..
      // this.exportBlackList();
    },
    newCard() {
      this.timelines.push(this.batch.sample());
    },
    seed() {
      if (this.isRatingMode) {
        this.timelines.push(this.batch[this.imgIdx]);
      } else {
        this.newCard();
        this.newCard();
        this.newCard();
      }
    },
    exportBlackList() {
      const s = JSON.stringify(this.blackList);
      console.log("exportBlackList:", s);
      localStorage.setItem("blackList", s);
    },
    exportSuperList() {
      const s = JSON.stringify(this.superList);
      console.log("exportSuperList:", s);
      localStorage.setItem("superList", s);
    },
    exportRated() {
      const s = JSON.stringify(this.rated);
      // console.log("exportRated:", s);
      localStorage.setItem("rated", s);
    },
    storyTick() {
      const image = new window.Image();
      const chapterCard = this.batch.sample();
      image.src = chapterCard.imgPath;
      const sequenceIdx = this.randomInt(0, this.timelines.length);
      image.onload = () => {
        console.log("loaded into:", sequenceIdx);
        this.hotSwapCard(sequenceIdx, chapterCard);
        this.scrollToSequence(sequenceIdx);
        this.slideTickInterval = [4, 8, 16].sample();
        // this.slideTickInterval = [4].sample();
      };
      // if (this.$refs.audioModule) {
      // % 16 storytick?
      // this.$refs.audioModule.narrationSwap();
      // }
      this.currentText = texts.sample();
    },
    tick() {
      this.ticks += 1;
      if (this.$refs.audioModule) this.$refs.audioModule.playTick();

      if (this.ticks % this.slideTickInterval === 0) {
        this.storyTick();
      }
    },
    frame() {
      if (this.isPaused || this.isRatingMode) {
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
    // console.log(this.$route);
  },
  created() {
    this.superList = JSON.parse(localStorage.getItem("superList") || "[]");
    this.blackList = JSON.parse(localStorage.getItem("blackList") || "[]");
    this.rated = JSON.parse(localStorage.getItem("rated") || "[]");
    // console.log("loaded rated:", this.rated.length);
    // console.log("loaded rated:", this.rated);

    // console.log("before blacklist", this.batch.length);
    // this.batch = this.batch.filter((x) => !this.blackList.includes(x));
    // console.log("after blacklist", this.batch.length);

    this.batch = this.batch.map((x) => {
      const rating = this.rated.filter((r) => r.imgPath === x)[0];
      // console.log("rating:", rating?.stars);
      return {
        imgPath: x,
        stars: rating ? rating.stars : null,
        // only stars? or keep this concept?
        blackList: false,
        starList: false,
        variants: 8,
      };
    });

    if (this.isRatingMode) {
      this.previouslyRated = this.batch.filter((x) => x.stars !== null).length;
      this.batch = this.batch.filter((x) => x.stars === null);
    }

    this.seed();
  },
};
</script>

<style>
.sub_fb {
  font-family: sans-serif;
  font-weight: bold;
  font-size: 2vmin;
  color: rgba(255, 255, 100, 1);
  color: rgba(255, 255, 0, 1);
  text-shadow: 0 0 0.2em rgba(0, 0, 0, 0.5);
  white-space: pre;
}

.subtitles {
  position: fixed;
  bottom: 4rem;
  width: 100vw;
  text-align: center;
  display: flex;
  justify-content: center;
}

.subtitles > div {
  max-width: 60vw;
}

.action-bar {
  position: absolute;
  top: 1rem;
  left: 0;
  /* padding: 1rem; */
  font-size: 1rem;
  z-index: 10000;
}

.meta-bar {
  position: absolute;
  bottom: 1rem;
  right: 0;
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

.formats {
  display: none;
  position: fixed;
  z-index: 3000;
  bottom: 0.5rem;
  right: 2rem;
  width: 15vw;
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
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  animation: fadeIn 250ms;
}
.fade-leave {
  opacity: 1;
}
.fade-leave-active {
  animation: fadeIn 250ms reverse;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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

.btn {
  cursor: pointer;
  text-decoration: underline;
}
</style>
