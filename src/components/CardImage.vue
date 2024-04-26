<template>
  <div class="grid-item">
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
    <div  class="date-bar">{{ date_stamp() }}</div>

  </div>
</template>

<script>
import { MODEL_META_MAP } from "../plateMap.js";

export default {
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
      imagePath: MODEL_META_MAP[this.modelName].plate.sample(),
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

  computed: {
    imagePathFlask() {
      // http://localhost:5000/image?url=/NF-03-5/911/3dAnimationDiffusion_v10/2passjpegged50/NF-03-5--3dAnimationDiffusion_v10--911-00000-2x.jpg_prompt-2001_support_prompt-blue_MP-1_cfg-18_ss-15_seed-1000195145_cnet_d-0.9_cnet_c-0_00001_.jpg
      // http://localhost:5000/image?url=/NF-03-5/jetee/aniverse_v15Pruned/fried/NF-03-5--aniverse_v15Pruned--jetee-00077.jpg_prompt-2001_support_prompt-9-11-avatar_MP-1_cfg-18_ss-15_seed-1000195145_cnet_d-0.9_cnet_c-0-fried_w1968_q10_00001-fried.jpg&jpeg_quality=1&operation_type=dither&size_multiplier=0.5&saturation=1.8&brightness=1&sharpen=2&contrast=1.3
      // https://flask-fryer.vercel.app/image?sharpen=2&brightness=1&size_multiplier=1.0&contrast=1.3&url=%2FNF-03-5%2F911%2Faniverse_v15Pruned%2F2passjpegged50%2FNF-03-5--aniverse_v15Pruned--911-00088-2x.jpg_prompt-2001_support_prompt-blue_MP-1_cfg-18_ss-15_seed-1000195145_cnet_d-0.9_cnet_c-0_00001_.jpg&operation_type=fry&jpeg_quality=1&saturation=1.6
      // const flask_path ="http://localhost:5000/image?url=/"
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

      const jpegPath = this.imagePath.replace('2pass', '2passjpegged50').slice(0, -3) + "jpg";
      const suffix = this.imageOperation === 'fry' ? fry_suffix : dither_suffix
      const fullPath = `${flask_path}${jpegPath}${suffix}`

      // console.log("imagePathFlask:", fullPath)
      return fullPath
    },
  },
  methods: {
    setQ(q) {
      this.jpegQuality = q
    },
    newImage() {
      console.log("newImage")
      this.imagePath =  MODEL_META_MAP[this.modelName].plate.sample()
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
  watch: {
    step() {
      this.newImage();
    },
    modelName() {
      this.newImage();
    },
  },
  created(){

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

</style>