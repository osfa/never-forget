<template>
  <div class="image-list">
    <SmallClock :offset="randomInt(-25, 25) * offsetSeed" />
    <PrettyFilterBar />
    <div
      v-for="(stack, index) in imageStacks"
      :key="index"
      class="image-stack"
      @click="loadNextImage(index)"
      ref="imageStacks">
      <transition name="fade">
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
          v-for="(image, stackIndex) in stack.displayedImages"
          :key="image"
          class="image-container">
          <div class="image-wrapper">
            <img
              :src="image"
              alt="never forget"
              @load="handleImageLoad($event, index)"
              @error="handleImageError(index)" />
          </div>
        </div>
      </transition-group>
    </div>
    <SubsPlayer />
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
      modelName: "aniverse_v15Pruned",
      imageStacks: [],
      autoSwapInterval: null,
      currentAutoIndex: 0,
      heightTransitions: {},
      jpegQuality: 5,
      offsetSeed: 1,
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

    this.startAutoSwap();
  },
  beforeDestroy() {
    this.stopAutoSwap();
  },
  methods: {
    randomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    },
    getRandomImageUrl() {
      const cdn_path = "https://jpeg.matrix.surf/";
      let fullPath;

      // wip images get higher quality rolls?
      const sizeMultiplier = ["0.5", "0.25"].sample();
      const jpegQuality = 5;
      const modelName = "aniverse_v15Pruned";

      const poolImagePath = MODEL_META_MAP[modelName].plate
        .sample()
        .replace("MP-1.0", "MP-1");

      const imageOperation = ["fry", "dither"].sample();

      if (imageOperation === "fry") {
        const jpegPath = `${poolImagePath
          .replace("2pass", "jpegged")
          .slice(0, -4)}-q${jpegQuality}x${sizeMultiplier}.jpg`;
        fullPath = `${cdn_path}${jpegPath}`;
      } else {
        const dithSuffix = `-cmykPlus-8c-Jarvis-x${sizeMultiplier}-dith.png`;
        const dithPath = `${poolImagePath
          .replace("2pass", "dithered")
          .slice(0, -4)}${dithSuffix}`;
        fullPath = `${cdn_path}${dithPath}`;
      }
      return fullPath;
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
    startAutoSwap() {
      this.autoSwapInterval = setInterval(() => {
        if (!this.imageStacks[this.currentAutoIndex].isTransitioning) {
          this.loadNextImage(this.currentAutoIndex);
          this.currentAutoIndex = (this.currentAutoIndex + 1) % 9;
        }
      }, 1000);
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
    async loadNextImage(stackIndex) {
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
  },
};
</script>

<style scoped>
.image-list {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100vw;
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

.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

/* .spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
} */

.spinner {
  --spinner-size: 50px;
  width: var(--spinner-size);
  height: var(--spinner-size);
  border: calc(var(--spinner-size) / 2) solid rgba(0, 0, 0, 0.75);

  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
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
