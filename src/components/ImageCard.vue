<template>
  <div class="chapter-card" :class="{ 'full-size': fullSize }">
    <img :src="showFried ? image.srcFried : show1pass ? image.src1pass : image.src" :alt="`Image ${image.id}`" />
    <div class="meta-bar">
      <div class="badge">{{ image.id }}</div>
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
    fullSize: Boolean,
  },
  methods: {
    rate(rating) {
      this.$emit("rate", this.image.id, rating);
    },
  },
};
</script>

<style scoped>
.chapter-card.full-size {
  width: 100vw;
  height: auto;
}
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
  visibility: hidden;
}

.meta-bar .badge {
  background-color: transparent;
}

.meta-bar div {
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
