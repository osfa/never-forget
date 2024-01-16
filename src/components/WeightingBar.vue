<template>
  <div>
    <div class="weights">
      <div
        class="weight"
        v-for="category in availableCategories"
        :key="category"
        :value="category"
        :style="{ backgroundColor: CATEGORY_MAP[category]?.hexColor, width: `${CATEGORY_MAP[category]?.weight * 100}vw` }">
        {{ category }}
      </div>
    </div>
  </div>
</template>

<script>
import { CATEGORY_MAP } from "../maps";

export default {
  props: {
    availableCategories: Array,
  },
  data() {
    return {
      CATEGORY_MAP,
    };
  },
};
</script>

<style scoped>
.weights {
  position: fixed;
  top: 2rem;
  left: 0;
  width: 100vw;
  height: 1rem;
  display: flex;
  flex-direction: row;
  z-index: 1000;
}
.weight {
  padding: 0.25rem 0;
  font-size: 0.5rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
</style>
