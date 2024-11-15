<template>
  <div class="filter-bar">
    <div id="social-media-bar" class="model-section">
      <a
        href="https://www.youtube.com/@NeverForgetNow"
        class="btn-layer btn-platform youtube"
        ><img src="/img/icons/yt.svg"
      /></a>
      <a
        href="https://www.tiktok.com/@neverforgetnow"
        class="btn-layer btn-platform tiktok"
        ><img src="/img/icons/tiktok.svg"
      /></a>
      <a
        href="https://www.instagram.com/neverforget.pics"
        class="btn-layer btn-platform instagram"
        ><img src="/img/icons/insta.svg"
      /></a>
    </div>
    <div class="model-section">
      <div
        v-for="(model, idx) in Object.keys(MODEL_META_MAP)"
        class="btn-layer"
        :class="{ active: selectedModels.includes(model) }"
        :style="{ backgroundColor: MODEL_META_MAP[model]?.hexColor }"
        @click="setPlateFilter(model)">
        {{ MODEL_META_MAP[model]?.unicode }}
      </div>
    </div>
  </div>
</template>

<script>
import { MODEL_META_MAP, PROMPT_MAP } from "../maps";

export default {
  data() {
    return {
      MODEL_META_MAP,
      PROMPT_MAP,
      selectedModels: [Object.keys(MODEL_META_MAP).random()],
    };
  },
  methods: {
    setPlateFilter(model) {
      if (this.selectedModels.includes(model)) {
        this.selectedModels = this.selectedModels.filter((m) => m !== model);
      } else {
        this.selectedModels.push(model);
      }
      this.$emit("update:selectedModels", this.selectedModels);
    },
  },
};
</script>
<style scoped>
@import "../assets/dzi-filterbar.css";
@import "../assets/dzi-socialmediabar.css";
</style>
