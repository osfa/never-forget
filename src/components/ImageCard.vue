<template>
  <div
    class="chapter-card"
    :class="{ 'full-size': fullSize, third: cardSize === '3', single: cardSize === '1', fourth: cardSize === '4', fifth: cardSize === '5', sixth: cardSize === '6', vertical: isVertical }">
    <img :src="showFried ? image.srcFried : show1pass ? image.src1pass : image.src" :alt="`Image ${image.id}`" :class="{ cover: imageDisplay === 'cover' }" />
    <div class="meta-bar">
      <div class="badge">{{ image.id }}</div>
    </div>
    <div v-if="rating" class="rating-container"><div v-for="n in parseInt(rating)" class="rating"></div></div>
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
    cardSize: String,
    isVertical: Boolean,
    imageDisplay: String,
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
  width: 100vw !important;
  height: auto;
}
.chapter-card.single {
  width: 98vw;
  height: auto;
  aspect-ratio: 16/9;
}
.chapter-card.third {
  width: 32vw;
  height: auto;
  aspect-ratio: 16/9;
  /* height: 50vh; */
}
.chapter-card.fourth {
  width: 24vw;
  height: auto;
  aspect-ratio: 16/9;
}
.chapter-card.fifth {
  width: 19vw;
  height: auto;
  aspect-ratio: 16/9;
}
.chapter-card.sixth {
  width: 15vw;
  height: auto;
  aspect-ratio: 16/9;
}

.chapter-card.vertical {
  aspect-ratio: 9/16;
  max-width: 540px;
}

.chapter-card {
  width: 49vw;
  aspect-ratio: 16/9;

  position: relative;
  cursor: pointer;
  background-color: #000;
}

.chapter-card img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.chapter-card img.cover {
  object-fit: cover;
  /* object-position: left; */
}

.meta-bar {
  position: absolute;
  top: 1.5rem;
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
  padding: 0.25rem;
  background-color: yellow;
  border-radius: 1rem;
  box-shadow: #fff 1px 1px 5px;
  /* margin-bottom: 0.1rem; */
}

.rating-container {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 0.5rem;
  font-weight: bold;
  display: flex;
  flex-direction: row;
}
</style>
