<template>
  <div>
    <div class="weights" @dblclick="isEditingMap = !isEditingMap">
      <div
        class="weight"
        v-for="category in Object.keys(categoryMap)"
        :key="category"
        :value="category"
        :style="{
          backgroundColor: categoryMap[category]?.hexColor,
          width: `${categoryMap[category]?.weight * 100}vw`,
        }">
        {{ category }}
        <input
          v-show="isEditingMap"
          type="number"
          step="0.01"
          min="0.0001"
          :id="category"
          @change="updateCategoryWeight(category, $event)"
          :value="categoryMap[category].weight" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    categoryMap: Object,
  },
  data() {
    return {
      isEditingMap: false,
    };
  },
  methods: {
    updateCategoryWeight(category, event) {
      console.log(category, event);
      this.$emit("updateCategoryWeight", category, event.target.value);
    },
  },
};
</script>

<style scoped>
input {
  width: 50px;
}
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
