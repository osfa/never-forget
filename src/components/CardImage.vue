<template>
    <img
      @click="newFormat()"
      class="neo-card"
      :class="{ isLoading: isLoading }"
      :key="`${URI_PREFIX}${imagePath}`"
      :src="`${URI_PREFIX}${imagePath.replace(
        '.jpg',
        URI_SUFFIXES[URI_IDX]
      )}`">
    </img>
      
</template>

<script>
import { pngLibrary } from "../data/pngLibrary.js";

export default {
  props: {
    step: Number,
  },
  data() {
    return {
      debug: true,
      imagePath: pngLibrary.indigoPlateComplete.sample(),
      idx: 0,
      isLoading: false,
      URI_PREFIX: "http://jpeg.matrix.surf/png-jpeg-flat/",
      URI_IDX: 0,
      URI_SUFFIXES: [
        ".jpg",
        // "-cmykPlus-8c-Jarvis-x0.5-dithered-idx0.png",
        // "-cmykPlus-8c-Jarvis-x1-dithered-idx0.png",
        "-websafe-16c-Jarvis-x1.0-dithered-idx0.png",
        "-auto-2c-Jarvis-x0.5-dithered-idx0.png",
        "-auto-4c-Jarvis-x0.5-dithered-idx0.png",
        "-auto-8c-Jarvis-x0.5-dithered-idx0.png",
        "-auto-8c-Jarvis-x0.25-dithered-idx0.png",
        "-auto-8c-Jarvis-x1.0-dithered-idx0.png",
        "-auto-16c-Jarvis-x0.5-dithered-idx0.png",
        "-auto-16c-Jarvis-x0.25-dithered-idx0.png",
        "-auto-16c-Jarvis-x1.0-dithered-idx0.png",
        "-c32-32c-Jarvis-x0.5-dithered-idx0.png",
        "-c32-32c-Jarvis-x0.25-dithered-idx0.png",
        "-c32-32c-Jarvis-x1.0-dithered-idx0.png",
        "-cmykPlus-8c-Jarvis-x0.5-dithered-idx0.png",
        "-cmykPlus-8c-Jarvis-x0.25-dithered-idx0.png",
        "-cmykPlus-8c-Jarvis-x1-dithered-idx0.png",
        "-websafe-8c-Jarvis-x0.5-dithered-idx0.png",
        "-websafe-8c-Jarvis-x0.25-dithered-idx0.png",
        "-websafe-8c-Jarvis-x1.0-dithered-idx0.png",
        "-websafe-16c-Jarvis-x0.5-dithered-idx0.png",
        "-websafe-16c-Jarvis-x0.25-dithered-idx0.png",
      ],
    };
  },
  methods: {
    newImage() {
      this.imagePath = pngLibrary.indigoPlateComplete.sample();
    },
    newFormat() {
      console.log('hm?')
      this.URI_IDX = (this.URI_IDX + 1) % this.URI_SUFFIXES.length;
    },
  },
  watch: {
    step() {
      this.newImage();
    },
  },
};
</script>
