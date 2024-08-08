<template>
  <div class="grid-item">
    <!-- <vue-topprogress color="#fff" :height=1 ref="topProgress" :speed=100></vue-topprogress> -->
    <!-- <transition name="fade" mode="out-in">
      
    </transition> -->
    <!-- <transition name="fade"> -->
    <div v-if="isLoading" class="loading-card"></div>
    <!-- </transition> -->
    <!-- <transition name="fade" mode="out"> -->
      <img
      v-if="!isLoading"
      :class="{ fried: imageOperation === 'fry', dithered: imageOperation === 'dither'}"
      :key="remotePath"
      :src="remotePath">
      </img>
    <!-- </transition> -->

    <img v-if="bufferImagePath !== undefined"  class="buffer-card" :src="bufferImagePath" :class="{ fried: imageOperation === 'fry', dithered: imageOperation === 'dither'}"/>

    <div class="date-bar">{{ date_stamp() }}</div>
  </div>
</template>

<script>
import { MODEL_META_MAP } from "../plateMap.js";
import { vueTopprogress } from 'vue-top-progress'

export default {
  components: {
    vueTopprogress
  },
  props: {
    step: Number,
    jpegQuality: Number,
    modelName: String,
    imageOperation: String,
    ditherPalette: String,
    ditherColors: String,
    sizeMultiplier: String
  },
  data() {
    return {
      transitionName: 'fade',
      // transitions: ['fadeLeft', 'fadeRight', 'fadeUp', 'fadeDown'],
      transitions: ['fade'],
      placeHolderPath:  'https://placehold.co/600x400/EEE/31343C',
      poolImagePath: MODEL_META_MAP[this.modelName].plate.sample().replace('MP-1.0', 'MP-1'),
      bufferImagePath: null,
      remotePath: null,
      idx: 0,
      isLoading: false,
      palettes: ['cmykPlus', 'cmyk', 'auto', 'bw', 'websafe', 'rgbbw', 'c32'],
      date_stamp() {
        const startYear = 1997;
        const endYear = 2024;
        const year =
          Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
        const month = String(Math.floor(Math.random() * 12) + 1).padStart(
          2,
          "0"
        );
        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
        const hour = String(Math.floor(Math.random() * 24)).padStart(2, "0");
        const minute = String(Math.floor(Math.random() * 60)).padStart(2, "0");
        return `${year}-${month}-${day} ${hour}:${minute}`;
      },
    };
  },
  methods: {
    setQ(q) {
      this.jpegQuality = q
    },
    newImage() {
      if(this.isLoading) return
      this.transitionName = this.transitions.sample()
      console.log("newImage")
      this.poolImagePath =  MODEL_META_MAP[this.modelName].plate.sample().replace("MP-1.0", "MP-1")
      this.loadCdnImage()
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
    loadCdnImage() {

      console.log("loadCdnImage")
      const cdn_path ="https://jpeg.matrix.surf/"
      let fullPath;

      const sizeMultiplier = this.sizeMultiplier === '1' ? '1.0' : String(this.sizeMultiplier)
      if(this.imageOperation === 'fry'){
        const jpegPath = `${this.poolImagePath.replace('2pass', 'jpegged').slice(0, -4)}-q${this.jpegQuality}x${sizeMultiplier}.jpg`;
        fullPath = `${cdn_path}${jpegPath}`
      }
      else {
        const dithSuffix = `-cmykPlus-8c-Jarvis-x${sizeMultiplier}-dith.png`
        const dithPath = `${this.poolImagePath.replace('2pass', 'dithered').slice(0, -4)}${dithSuffix}`;
        fullPath = `${cdn_path}${dithPath}`
      }
      let img = new Image();
      img.src = fullPath;
      this.isLoading = true;
      this.bufferImagePath = this.remotePath;
      if(this.$refs.topProgress) this.$refs.topProgress.start();
      img.onload = (e) => {
        this.isLoading = false;
        this.remotePath = fullPath;
        if(this.$refs.topProgress) this.$refs.topProgress.done();
      };
    },

  },
  watch: {
    step() {
      console.log('step re-render')
      this.newImage();
    },
  },
  mounted(){
    this.loadCdnImage()
  }
};
</script>
<style scoped>
@import "../assets/grid-layouts.css";
@import "@asika32764/vue-animate/dist/vue-animate.css";

@keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}

@keyframes shine {
  to {
    background-position-x: -200%;
  }
}

/* @import "@asika32764/vue-animate/dist/vue-animate.css"; */

.buffer-card {
  position: absolute;
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.loading-card {
  position: absolute;
  /* background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background: linear-gradient(-45deg, #000, #111, #333, #666);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite; */

  background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
  background: linear-gradient(110deg, #000 8%, #333 18%, #000 33%);
  background: linear-gradient(110deg, #000 8%, #222 18%, #000 33%);
  /* background: linear-gradient(110deg, #000 0%, #333 18%, #000 23%); */
  background-size: 200% 100%;
  animation: 2.5s shine linear infinite;
  /* animation-delay: 2s; */
  height: 100%;
  width: 100%;
  opacity: 0.5;
}

.q-bar {
  position: absolute;
  bottom: 3px;
  left: 3px;
  z-index: 1000;
  font-size: 8px;
  display: none;
}

.q-button {
  padding: 0.25rem;
  cursor: pointer;
  /* border: 1px solid white; */
  background: rgba(255, 255, 255, 0.25);
}

.date-bar {
  position: absolute;
  color: rgb(255, 184, 52);
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 0.5rem;
  z-index: 1000;
  mix-blend-mode: hard-light;
  text-shadow: 0 0 3px rgb(255, 184, 52);
  opacity: 0.75
}

.top-progress {
  position: absolute !important;
}

/* img.isLoading {
  animation: fadeout 5000ms;
}

img {
  animation: fadein 5000ms;
} */

/* img { */
  /* opacity: 1 */
/* } */

.fade-enter-active, .fade-leave-active {
  transition: opacity 150ms;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

/* 
@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeout {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
} */
</style>