<template>
  <div class="image-list">
    <SmallClock :offset="randomInt(-25, 25) * offsetSeed" />
    <div id="social-media-bar" class="model-section">
      <a
        href="https://www.youtube.com/@NeverForgetNow"
        target="_blank"
        class="btn-layer btn-platform youtube"
        ><img src="/img/icons/yt.svg"
      /></a>
      <a
        href="https://www.tiktok.com/@neverforgetnow"
        target="_blank"
        class="btn-layer btn-platform tiktok"
        ><img src="/img/icons/tiktok.svg"
      /></a>
      <a
        href="https://www.instagram.com/neverforget.pics"
        target="_blank"
        class="btn-layer btn-platform instagram"
        ><img src="/img/icons/insta.svg"
      /></a>
    </div>
    <PrettyFilterBar @update:selectedModels="handleSelectedModelsUpdate" />
    <div
      v-for="(stack, index) in imageStacks"
      :key="index"
      class="image-stack"
      @click="loadNextImage(index, true)"
      ref="imageStacks">
      <transition name="fade" duration="500">
        <div class="loading-indicator" v-if="stack.isLoading">
          <div class="spinner"></div>
        </div>
      </transition>
      <transition-group
        name="fade"
        tag="div"
        class="transition-wrapper"
        @enter="onEnter"
        @leave="onLeave">
        <div
          v-for="image in stack.displayedImages"
          :key="image"
          class="image-container">
          <div class="image-wrapper">
            <img
              :src="image"
              alt="never forget"
              @load="handleImageLoad($event, index)"
              @error="handleImageError(index)" />
            <div class="date-bar">{{ date_stamp() }}</div>
          </div>
        </div>
      </transition-group>
    </div>

    <SubsPlayer
      ref="subsPlayer"
      @story-tick="autoSwap"
      :subsStyle="subsStyle" />
    <BarebonesTone ref="audioModule" automaticFade :debug="false" />
  </div>
</template>

<script>
import { MODEL_META_MAP } from "../plateMap.js";
import SubsPlayer from "./SubsPlayer.vue";
import BarebonesTone from "./BarebonesTone.vue";
import SmallClock from "./SmallClock.vue";
import PrettyFilterBar from "./PrettyFilterBar.vue";

export default {
  components: {
    SubsPlayer,
    BarebonesTone,
    SmallClock,
    PrettyFilterBar,
  },
  name: "ImageStack",
  data() {
    return {
      selectedModels: [Object.keys(MODEL_META_MAP).random()],
      imageStacks: [],
      currentModel: "",
      autoSwapInterval: null,
      currentAutoIndex: 0,
      heightTransitions: {},
      jpegQuality: 5,
      offsetSeed: 1,
      subsStyle: "plain",
      showChat: false,
      ticks: 0,
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
  async created() {
    this.imageStacks = await Promise.all(
      Array.from({ length: 9 }, async () => ({
        displayedImages: [await this.getRandomImageUrl()],
        isTransitioning: false,
        isLoading: false,
        height: 0,
      }))
    );
    // if (this.$route.params.id) {
    //   console.log(this.$route.params.id);
    //   // 0002-H-A-C-0256--2012-06-24T18-02-23Z
    //   this.imageStacks[0].displayedImages = [
    //     "https://jpeg.matrix.surf/NF-03-5/ava/aniverse_v15Pruned/jpegged/NF-03-5--aniverse_v15Pruned--avatar12-00037-2x.jpg_prompt-unheimlich_support_prompt-9-11_MP-1_cfg-18_ss-15_seed-1000195145_cnet_d-0.9_cnet_c-0_00001_-q10x0.25.jpg",
    //   ];
    // }
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
    this.stopAutoSwap();
  },
  methods: {
    // onStoryTick() {
    //   this.loadNextImage(this.randomInt(0, 9));
    // },
    handleSelectedModelsUpdate(models) {
      this.selectedModels = models;
    },
    randomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    },
    getRandomImageUrl() {
      const cdn_path = "https://jpeg.matrix.surf/memories";
      const sizeMultiplier = ["1.0", "0.5", "0.25"].sample();
      const jpegQuality = [10, 5].sample();
      const modelName = this.selectedModels.sample();
      const poolImagePath = MODEL_META_MAP[modelName].plate.sample();
      const modelPrefix = poolImagePath.split("-")[0];
      const imageOperation = ["fry", "fry", "dither"].sample();

      if (imageOperation === "fry") {
        // B-A-A-0001--2005-02-06T23-48-37Z-Q1-X0.5
        const suffix = `-Q${jpegQuality}-X${sizeMultiplier}.JPEG`;
        const jpegPath = poolImagePath.replace(".JPEG", suffix);
        return `${cdn_path}/${modelPrefix}/${jpegPath}`;
      } else {
        // B-A-A-0001--2005-02-06T23-48-37Z-CMYK-X1.0
        const suffix = `-CMYK-X${sizeMultiplier}.PNG`;
        const dithPath = poolImagePath.replace(".JPEG", suffix);
        return `${cdn_path}/${modelPrefix}/${dithPath}`;
      }
    },
    onEnter(el) {
      const wrapper = el.closest(".image-stack");
      const img = el.querySelector("img");

      if (img.complete) {
        this.updateStackHeight(wrapper, img);
      } else {
        img.addEventListener(
          "load",
          () => this.updateStackHeight(wrapper, img),
          { once: true }
        );
      }
    },
    onLeave(el) {
      const wrapper = el.closest(".image-stack");
      wrapper.style.height = `${wrapper.offsetHeight}px`;
    },
    updateStackHeight(wrapper, img) {
      const ratio = img.naturalHeight / img.naturalWidth;
      const newHeight = wrapper.offsetWidth * ratio;

      requestAnimationFrame(() => {
        wrapper.style.height = `${newHeight}px`;
      });
    },
    autoSwap() {
      if (!this.imageStacks[this.currentAutoIndex].isTransitioning) {
        this.loadNextImage(this.currentAutoIndex);
        this.currentAutoIndex = (this.currentAutoIndex + 1) % 9;
      }
      this.subsStyle = ["fried", "plain", "png", "papyrus"].sample();
      console.log("subs style:", this.subsStyle);
    },
    startAutoSwap() {
      this.autoSwapInterval = setInterval(this.autoSwap, 1000);
    },
    stopAutoSwap() {
      if (this.autoSwapInterval) {
        clearInterval(this.autoSwapInterval);
        this.autoSwapInterval = null;
      }
    },
    handleImageLoad(event, index) {
      const img = event.target;
      const wrapper = img.closest(".image-stack");
      this.updateStackHeight(wrapper, img);
      this.imageStacks[index].isLoading = false;
    },
    handleImageError(index) {
      this.imageStacks[index].isLoading = false;
      // if image fails to load, try loading a new one
      this.loadNextImage(index);
    },
    async loadNextImage(stackIndex, scrobbleStory = false) {
      if (scrobbleStory) {
        // if (this.$refs.audioModule) this.$refs.audioModule.playTick();
        if (this.$refs.subsPlayer) this.$refs.subsPlayer.scrobbleStory();
      }

      const stack = this.imageStacks[stackIndex];
      if (stack.isTransitioning || stack.isLoading) return;

      stack.isTransitioning = true;
      stack.isLoading = true;

      try {
        const newImageUrl = await this.getRandomImageUrl();
        const img = new Image();

        img.onload = () => {
          stack.displayedImages.unshift(newImageUrl);

          this.$nextTick(() => {
            setTimeout(() => {
              stack.displayedImages.pop();
              stack.isTransitioning = false;
              const element = this.$refs.imageStacks[stackIndex];
              // element.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
          });
        };

        img.onerror = () => {
          stack.isLoading = false;
          stack.isTransitioning = false;
          this.loadNextImage(stackIndex); // try again
        };

        img.src = newImageUrl;
      } catch (error) {
        console.error("Failed to load new image:", error);
        stack.isLoading = false;
        stack.isTransitioning = false;
      }
    },
    async handleScroll() {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        // if previous stack is not loading, add a new stack?
        // is isLoading set here?
        // timeout throttle insteaD?
        // since they animate in....
        if (!this.imageStacks[this.imageStacks.length - 1].isLoading) {
          await this.addNewStack();
        }
      }
    },
    async addNewStack() {
      console.log("adding new stack");
      if (this.imageStacks.length >= 9) {
        this.imageStacks.shift();
      }

      const newStack = {
        displayedImages: [await this.getRandomImageUrl()],
        isTransitioning: false,
        isLoading: false,
        height: 0,
      };
      this.imageStacks.push(newStack);

      console.log("scrolly top");

      const element = this.$refs.imageStacks[0];
      element.scrollIntoView({ behavior: "smooth", block: "start" });

      // diff type of throttle?
      // window.scrollBy(0, -window.innerHeight);
    },
  },
};
</script>

<style scoped>
@import "../assets/dzi-socialmediabar.css";

.date-bar {
  position: absolute;
  color: rgb(255, 184, 52);
  color: white;
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 3rem;
  z-index: 1000;
  mix-blend-mode: hard-light;
  text-shadow: 0 0 3px rgb(255, 184, 52);
  opacity: 0.75;
  display: none;
  mix-blend-mode: difference;
}
@media (orientation: portrait) {
  .date-bar {
    display: block;
    font-size: 2rem;
  }
}
.image-list {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  width: 100vw;
  animation: oscillate 45s ease-in-out infinite;
}

@keyframes oscillate {
  0%,
  100% {
    max-width: 100%;
  }
  50% {
    max-width: 1440px;
  }
}

.image-stack {
  position: relative;
  width: 100%;
  cursor: pointer;
  overflow: hidden;
  transition: height 0.6s ease-in-out;
  will-change: height;
}

.transition-wrapper {
  position: relative;
  height: 100%;
}

.image-container {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  will-change: opacity;
  height: 100%;
}

.image-container:first-child {
  position: relative;
  pointer-events: none;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  animation: zoomInOut 10s ease-in-out infinite;
  will-change: transform;
}

.image-stack:hover .date-bar {
  display: block;
}

.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  pointer-events: none;
  mix-blend-mode: difference;
}

.spinner {
  --spinner-size: 25vw;
  width: var(--spinner-size);
  height: var(--spinner-size);
  border: calc(var(--spinner-size) / 2) solid rgba(0, 0, 0, 0.75);

  border-radius: 50%;
  border-top-color: rgba(255, 255, 255, 1);
  animation: spin 5s ease-in-out infinite;
  mix-blend-mode: difference;
  background-image: url("/img/clock.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.fade-enter {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}

@keyframes zoomInOut {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
