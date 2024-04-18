<template>
  <div
    class="chapter-card"
    :class="{
      'full-size': fullSize,
      third: cardSize === '3',
      single: cardSize === '1',
      fourth: cardSize === '4',
      fifth: cardSize === '5',
      sixth: cardSize === '6',
      vertical: isVertical,
    }">
    <img
      :src="imagePath"
      :alt="`Image ${image.id}`"
      :class="{ cover: imageDisplay === 'cover', isPortrait }" />
    <div class="meta-bar">
      <div class="badge">{{ image.id }}</div>
    </div>
    <div v-if="!showRating" class="date-bar">{{ date_stamp() }}</div>
    <div v-if="rating && showRating" class="rating-container">
      <div v-for="n in parseInt(rating)" class="rating"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: Object,
    rating: Number,
    showRating: Boolean,
    imageQuality: String,
    fullSize: Boolean,
    cardSize: String,
    isVertical: Boolean,
    imageDisplay: String,
    BASE_URI: String,
  },
  data() {
    return {
      isPortrait: false,
      date_stamp() {
        const startYear = 1997;
        const endYear = 2024;
        const year =
          Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
        const month = String(Math.floor(Math.random() * 12) + 1).padStart(
          2,
          "0"
        );
        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
        const hour = String(Math.floor(Math.random() * 24)).padStart(2, "0");
        const minute = String(Math.floor(Math.random() * 60)).padStart(2, "0");
        return `${year}-${month}-${day} ${hour}:${minute}`;
      },
    };
  },
  computed: {
    imagePath() {
      let path = "";
      switch (this.imageQuality) {
        case "fried":
          path = this.image.srcFried;
          break;
        case "1pass":
          path = this.image.src1pass;
          break;
        case "jpegged":
          path =
            this.image.src.replace("2pass", "2passjpegged50").slice(0, -3) +
            "jpg";
          break;
        default:
          path = this.image.src;
      }

      const quality = 85;
      // const operation_type = "fry";
      const operation_type = "";
      const size_multiplier = "1.0";

      const saturation = 1.8;
      const brightness = 1.0;
      const sharpen = 2.0;
      const contrast = 1.3;
      const fry_conf = `&saturation=${saturation}&brightness=${brightness}&sharpen=${sharpen}&contrast=${contrast}`;
      let qs = `?quality=${quality}&operation_type=${operation_type}&size_multiplier=${size_multiplier}${fry_conf}`;

      if (!this.BASE_URI.includes("image?url=/")) {
        qs = "";
      }

      return `${this.BASE_URI}${path.replace("MP-1.0", "MP-1")}${qs}`;
    },
  },
  methods: {
    rate(rating) {
      this.$emit("rate", this.image.id, rating);
    },
  },
  mounted() {
    let img = new Image();
    img.src = this.imagePath;
    // console.log(img.naturalWidth, img.naturalHeight);
    if (img.naturalWidth >= img.naturalHeight) {
      this.isPortrait = false;
    } else {
      this.isPortrait = true;
    }
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
  aspect-ratio: 3/2;
}
.chapter-card.third {
  width: 32vw;
  height: auto;
  aspect-ratio: 16/9;
  aspect-ratio: 3/2;
  /* height: 50vh; */
}
.chapter-card.fourth {
  width: 24vw;
  height: auto;
  aspect-ratio: 16/9;
  aspect-ratio: 3/2;
}
.chapter-card.fifth {
  width: 19vw;
  height: auto;
  aspect-ratio: 16/9;
  aspect-ratio: 3/2;
}
.chapter-card.sixth {
  width: 15vw;
  height: auto;
  aspect-ratio: 16/9;
  aspect-ratio: 3/2;
}

.chapter-card.vertical {
  aspect-ratio: 9/16;
  aspect-ratio: 2/3;
  max-width: 540px;
}

.chapter-card {
  width: 49vw;
  aspect-ratio: 16/9;
  aspect-ratio: 3/2;

  position: relative;
  cursor: pointer;
  background-color: #000;
}

.chapter-card img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: black;
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

.left-page .date-bar {
  padding-right: 17rem;
}
.date-bar {
  position: absolute;
  color: rgb(255, 184, 52);
  bottom: 1.5rem;
  right: 1.5rem;
  font-size: 0.75rem;
  z-index: 1000;
  mix-blend-mode: hard-light;
  text-shadow: 0 0 3px rgb(255, 184, 52);
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

/* .album-sequence-container .isPortrait { */
/* transform: rotate(90deg) translateY(-100%);
  transform-origin: top left; */
/* } */
</style>
