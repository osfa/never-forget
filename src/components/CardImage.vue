<template>
  <div class="grid-item">
    <vue-topprogress color="#fff" :height=1 ref="topProgress" :speed=200></vue-topprogress>
    <img
      @click="newImage()"
      class="neo-card"
      :class="{ isLoading: isLoading, fried: imageOperation === 'fry', dithered: imageOperation === 'dither'}"
      :key="imagePathFlask"
      :src="imagePathFlask">
    </img>
    <div v-if="imageOperation ==='fry'" class="q-bar">
      <span @click=setQ(q) class="q-button" v-for="q in [1,5,25,50]">{{ q }}</span>
    </div>
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
      poolImagePath: MODEL_META_MAP[this.modelName].plate.sample(),
      imagePathFlask: null,
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
      console.log("newImage")
      this.poolImagePath =  MODEL_META_MAP[this.modelName].plate.sample()
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
      const cdn_path ="https://jpeg.matrix.surf/"
      let fullPath;
      const sizeMultiplier = this.sizeMultiplier === '1' ? '1.0' : String(this.sizeMultiplier)

      console.log("asfasfa", this.imageOperation)
      if(this.imageOperation === 'fry'){
        const jpegPath = `${this.poolImagePath.replace('2pass', 'jpegged').slice(0, -4)}-q${this.jpegQuality}x${sizeMultiplier}.jpg`;
        fullPath = `${cdn_path}${jpegPath}`
      }
      else {
        // _cmykPlusx1.0.png-cmykPlus-8c-Jarvis-x1.0-dith.png
        // cmykPlusx0.25.png-cmykPlus-8c-Jarvis-x0.25-dith
        const dithPath = `${this.poolImagePath.replace('2pass', 'dithered').slice(0, -4)}cmykPlusx${sizeMultiplier}.png-cmykPlus-8c-Jarvis-x${sizeMultiplier}-dith.png`;
        fullPath = `${cdn_path}${dithPath}`
      }
      console.log('loading;', fullPath)
      let img = new Image();
      img.src = fullPath;
      this.isLoading = true;

      this.$refs.topProgress.start()
      img.onload = (e) => {
        console.log(e)
        this.isLoading = false;
        this.imagePathFlask = fullPath
        this.$refs.topProgress.done()
      };
    },
    loadFlaskImage() {
      const flask_path ="https://flask-fryer.vercel.app/image?url=/"
      const size_multiplier = this.sizeMultiplier

      const color_count = this.ditherColors
      const palette = this.ditherPalette
      const dithermode = "Jarvis"

      const saturation = 1.6
      const brightness = 1.0
      const sharpen = 2.0
      const contrast = 1.3

      const fry_suffix = `&jpeg_quality=${this.jpegQuality}&operation_type=fry&size_multiplier=${size_multiplier}&saturation=${saturation}&brightness=${brightness}&sharpen=${sharpen}&contrast=${contrast}`
      const dither_suffix = `&operation_type=dither&size_multiplier=${size_multiplier}&color_count=${color_count}&palette=${palette}&dithermode=${dithermode}`

      const jpegPath = this.poolImagePath.replace('2pass', '2passjpegged50').slice(0, -3) + "jpg";
      const suffix = this.imageOperation === 'fry' ? fry_suffix : dither_suffix
      const fullPath = `${flask_path}${jpegPath}${suffix}`

      let img = new Image();
      img.src = fullPath;
      this.isLoading = true;

      this.$refs.topProgress.start()
      img.onload = (e) => {
        console.log(e)
        this.isLoading = false;
        this.imagePathFlask = fullPath
        this.$refs.topProgress.done()
      };
    },
  },
  watch: {
    step() {
      this.newImage();
    },
    jpegQuality() {
      this.newImage();
    },
    imageOperation() {
      this.newImage();
    },
    sizeMultiplier() {
      this.newImage();
    },
    modelName() {
      this.newImage();
    },
    imageOperation() {
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
img {
  cursor: pointer;
}
</style>