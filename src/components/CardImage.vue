<template>
  <!-- <div
    class="chapter-bkg"
    :class="{ isLoading: isLoading }"
    ref="sequences"
    :key="`${imagePath}-${idx}`"
    :style="{ backgroundImage: 'url(' + URL_PREFIX + imagePath + ')' }"></div> -->
  <img
    @click="newFormat()"
    class="neo-card"
    :class="{ isLoading: isLoading }"
    :key="`${URI_PREFIX}${imagePath}`"
    :src="`${URI_PREFIX}${imagePath.replace('.jpg', URI_SUFFIXES[URI_IDX])}`" />
</template>

<script>
import { pngLibrary } from "../data/pngLibrary.js";

// index = (index + arrayLength) % arrayLength

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
        "-cmykPlus-8c-Jarvis-x0.5-dithered-idx0.png",
        "-cmykPlus-8c-Jarvis-x1-dithered-idx0.png",
      ],
    };
  },
  methods: {
    newImage() {
      this.imagePath = pngLibrary.indigoPlateComplete.sample();
    },
    newFormat() {
      console.log("newFormat");
      // this.URI_SUFFIX = "-cmykPlus-8c-Jarvis-x1-dithered-idx0.png";
      this.URI_IDX = (this.URI_IDX + 1) % this.URI_SUFFIXES.length;
      // this.URI_SUFFIX =
      //   this.URI_SUFFIXES[
      //     (this.URI_IDX + this.URI_SUFFIXES.length) % this.URI_SUFFIXES.length
      //   ];

      // this.URI_SUFFIX = "-cmykPlus-8c-Jarvis-x0.5-dithered-idx0.png";

      // this.URL_PREFIX = "http://jpeg.matrix.surf/png-jpeg-flat/";
      // 1-resize-crunched-1920x1080-q25-resampling-BILINEAR--2f419dd4-d8a4-11ee-b9b5-120e0458f973
      // 478-resize-crunched-1920x1080-q25-resampling-BILINEAR--ad0d91fa-d8a4-11ee-b9b5-120e0458f973.jpg
      // -cmykPlus-8c-Jarvis-x1-dithered-idx0.png
    },
  },
  watch: {
    step() {
      this.newImage();
    },
  },
};
</script>
