<template>
  <div class="filter-bar">
    <div class="model-section">
      <div
        v-for="(model, idx) in Object.keys(MODEL_META_MAP)"
        class="btn-layer"
        :class="{ active: selectedModels.map((m) => m).includes(model) }"
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
    };
  },
  props: {
    selectedModels: {
      type: Array,
      default: () => [Object.keys(MODEL_META_MAP).random()],
    },
  },
  methods: {
    setPlateFilter(model) {
      // console.log(this.selectedModels);
      // if (this.selectedModels.includes(model)) {
      //   this.selectedModels = this.selectedModels.filter((m) => m !== model);
      // } else {
      //   this.selectedModels.push(model);
      // }
      this.$emit("update:selectedModels", model);
    },
  },
};
</script>
<style scoped>
@import "../assets/dzi-filterbar.css";
</style>
