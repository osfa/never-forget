<template>
  <div class="chapter-card">
    <img :src="showFried ? image.srcFried : show1pass ? image.src1pass : image.src" :alt="`Image ${image.id}`" />
    <div class="meta-bar">
      <!-- <div>
        <button v-for="n in 5" :key="n" @click="rate(n)">
          {{ n }}
        </button>
      </div> -->
      <div class="badge">{{ image.model }}</div>
      <!-- <div>{{ image.inputImage }}</div> -->
      <div class="badge">{{ image.promptUsed }}</div>
    </div>
    <div v-if="rating" class="rating">{{ rating }}</div>
  </div>
</template>

<script>
export default {
  props: {
    image: Object,
    rating: Number,
    showFried: Boolean,
    show1pass: Boolean,
  },
  methods: {
    rate(rating) {
      this.$emit("rate", this.image.id, rating);
    },
  },
};
</script>

<style>
.chapter-card {
  width: 49vw;
  height: 50vh;
  position: relative;
  cursor: pointer;
  background-color: #000;
}

.chapter-card img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.selected .meta-bar {
  /* box-sizing: border-box; */
  /* border: 0.25rem solid yellow; */
  visibility: visible;

  /* text-shadow: white 1px 0 5px; */
}
.selected {
  box-sizing: border-box;
  /* border: 0.25rem solid white; */
  padding: 0.25rem;
  background-color: white;
}

.meta-bar {
  position: absolute;
  top: 0.25rem;
  left: 0.75rem;
  font-size: 0.5rem;
  z-index: 1000;
  display: none;
  pointer-events: none;
  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
  /* visibility: hidden; */
}

.meta-bar div {
  /* margin-top: 0.25rem;
  margin-left: 0.75rem; */
  text-shadow: black 1px 0 5px;
  text-shadow: black 1px 2px 5px;
}

.rating {
  position: absolute;
  top: 0.25rem;
  right: 0.75rem;
  font-size: 0.75rem;
  font-weight: bold;
}

.chapter-card:hover .meta-bar {
  visibility: visible;
}

.badge {
  background-color: #333;
  padding: 0.1rem 0.25rem;
  border-radius: 0.5rem;
  margin-right: 4px;
}
.rating {
  padding: 0.25rem 0.75rem;
  background-color: yellow;
  border-radius: 1rem;
  color: black;
}
</style>
