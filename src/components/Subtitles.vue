<template>
  <div class="subtitles">
    <div class="sub_fb">{{ currentText }}</div>
  </div>
</template>

<script>
export default {
  name: "Subtitles",
  props: {
    currentText: { type: String, default: "" },
  },
};
</script>

<style scoped>
.sub_fb {
  font-family: sans-serif;
  font-weight: bold;
  font-size: 2.5vmin;
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
</style>
