<template>
  <div class="fade-in-image chapter-bkg" :key="idx" :style="{ backgroundImage: 'url(' + imgPath + ')' }"></div>
</template>

<script>
export default {
  props: {
    idx: String,
    imgPath: String,
  },
  data() {
    return {
      count: 0,
    };
  },
};
</script>

<style scoped>
/* .chapter-bkg {
  width: 100vw;
  height: 100vh;
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
} */
</style>
