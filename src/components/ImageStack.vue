<template>
  <div class="image-list">
    <div
      v-for="(stack, index) in imageStacks"
      :key="index"
      class="image-stack"
      @click="loadNextImage(index)"
      ref="imageStacks">
      <div class="loading-indicator" v-if="stack.isLoading">
        <div class="spinner"></div>
      </div>
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
              alt="Stack image"
              @load="handleImageLoad($event, index)"
              @error="handleImageError(index)" />
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { MODEL_META_MAP } from "../plateMap.js";

export default {
  name: "ImageStack",
  data() {
    return {
      modelName: "aniverse_v15Pruned",
      imageStacks: [],
      autoSwapInterval: null,
      currentAutoIndex: 0,
      heightTransitions: {},
      jpegQuality: 10,
    };
  },
  async created() {
    // Initialize stacks with initial images
    this.imageStacks = await Promise.all(
      Array.from({ length: 9 }, async () => ({
        displayedImages: [await this.getRandomImageUrl()],
        isTransitioning: false,
        isLoading: false,
        height: 0,
      }))
    );

    // this.startAutoSwap();
  },
  beforeDestroy() {
    this.stopAutoSwap();
  },
  methods: {
    getRandomImageUrl() {
      // const width = Math.floor(Math.random() * 400) + 800; // Random width between 800-1200
      // const height = Math.floor(Math.random() * 800) + 400; // Random height between 400-1200
      // const random = Math.floor(Math.random() * 1000); // Random image seed
      const cdn_path = "https://jpeg.matrix.surf/";
      const poolImagePath = MODEL_META_MAP[this.modelName].plate
        .sample()
        .replace("MP-1.0", "MP-1");
      const sizeMultiplier = "1.0";
      const jpegPath = `${poolImagePath
        .replace("2pass", "jpegged")
        .slice(0, -4)}-q${this.jpegQuality}x${sizeMultiplier}.jpg`;
      return `${cdn_path}${jpegPath}`;
      // return `https://picsum.photos/${width}/${height}?random=${random}`;
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
      }, 5000);
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
      // If image fails to load, try loading a new one
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
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 600);
          });
        };

        img.onerror = () => {
          stack.isLoading = false;
          stack.isTransitioning = false;
          this.loadNextImage(stackIndex); // Try again with a new image
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
}

.image-container:first-child {
  position: relative;
  pointer-events: none;
}

.image-wrapper {
  width: 100%;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: auto;
  display: block;
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

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

/* Transition classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
  position: absolute;
  width: 100%;
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
