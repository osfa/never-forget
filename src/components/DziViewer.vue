<template>
  <div id="viewer-image" ref="image">
    <div id="overlay" :style="{ backgroundSize: `${Math.min(currentZoom * 25, 35)}%` }"></div>
    <!-- <img id="overlay" src="/grid2.svg" :style="{ scale: `${currentZoom * 150}%` }" /> -->
    <div id="action-bar-top">
      <div
        id="info"
        class="btn btn-full"
        :class="{ infoOpen: infoOpen }"
        @click="
          () => {
            infoOpen = !infoOpen;
            paused = infoOpen;
          }
        ">
        <!-- <InformationIcon /> -->
      </div>

      <BarebonesTone ref="audioModule" automaticFade :debug="true" />
    </div>
    <div id="social-media-bar">
      <a href="https://www.youtube.com/@NeverForgetNow" class="btn-platform youtube">YouTube</a>
      <a href="https://www.tiktok.com/@neverforgetnow" class="btn-platform tiktok">TikTok</a>
      <a href="https://www.instagram.com/neverforgetnow1" class="btn-platform instagram">Instagram</a>
    </div>
    <div id="filter-bar">
      <div
        v-for="(model, idx) in Object.keys(MODEL_META_MAP).slice(0, 7)"
        class="btn-layer"
        :class="{ active: model === selectedModel }"
        :style="{ backgroundColor: MODEL_META_MAP[model]?.hexColor }"
        @click="setPlateFilter(model)"></div>
    </div>
    <div id="zoom-bar">
      <div
        v-for="(zoom, idx) in zoomLevels"
        class="btn-zoom"
        :class="{ active: idx === selectedZoomLevelIdx }"
        @click="selectedZoomLevelIdx = idx"
        :style="{ backgroundColor: ZOOM_COLORS[idx] }"></div>
    </div>
  </div>
</template>
<script>
import OpenSeadragon from "openseadragon";
import { availableSchemas } from "../schemas.js";
import BarebonesTone from "./BarebonesTone.vue";
import { MODEL_META_MAP } from "../maps";
console.log("load.");

const ZOOM_COLORS = ["#000", "#111", "#222", "#333", "#666", "#999", "#ccc", "#fff"];
// const ZOOM_COLORS = ["#000", "#333", "#fff"];
// const ZOOM_COLORS = ["#000", "#333", "#666", "#ccc", "#fff"];

window.OpenSeadragon = OpenSeadragon;
export default {
  name: "DziViewer",
  components: {
    BarebonesTone,
  },
  data() {
    return {
      idx: 0,
      active_schema: availableSchemas[0],
      wrap: true,

      // zoom
      currentZoom: 0.2,
      selectedZoomLevelIdx: 0,
      zoomLevels: [1, 2, 4, 8, 16, 32],
      startZoom: 1,
      minZoom: 1, // how far you can zoom out, the smaller the more
      maxZoom: 28, // how far you can zoom in, the higher the more

      // dev mode
      favorites: [],
      devMode: true,
      infoOpen: false,
      develop: false,

      // tick stuff
      ticks: 0,
      lastNow: null,
      ticks: 0,
      tickInterval: 1000,
      slideTickInterval: 8,
      tickDown: 8,
      selectedModel: "aniverse_v15Pruned",
      MODEL_META_MAP,
      ZOOM_COLORS,
    };
  },
  watch: {
    selectedZoomLevelIdx() {
      console.log("selectedZoomLevel", this.selectedZoomLevelIdx, this.zoomLevels[this.selectedZoomLevelIdx]);
      this.viewer.viewport.zoomTo(this.zoomLevels[this.selectedZoomLevelIdx]);
      // this.viewer.viewport.zoomBy(this.zoomPerScroll);
    },
  },
  computed: {
    positionDisplay() {
      return this.getCurrentGridPos();
    },
  },
  destroyed() {
    clearTimeout(this.timer);
    clearTimeout(this.driftTimer);
  },
  created() {
    console.log("dzi created");
  },
  mounted() {
    console.log("dzi mounted");
    this.initViewer();
    this.frame();
  },
  methods: {
    tick() {
      this.ticks += 1;
      this.tickDown -= 1;
      if (this.$refs.audioModule) this.$refs.audioModule.playTick();
      // if (this.ticks % this.slideTickInterval === 0) {
      //   this.storyTick();
      // }
    },
    isTouchDevice() {
      return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    },
    randomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    },
    randomFloat(min, max) {
      const r = Math.random() * (max - min) + min;
      return r;
    },
    randomCoord() {
      return new OpenSeadragon.Point(Math.random(), Math.random());
    },
    randomCoordInVicinity(point, d) {
      const coord = new OpenSeadragon.Point(point.x + this.randomFloat(0, d), point.y + this.randomFloat(0, d));
      return coord;
    },
    triggerZoom(e) {
      console.log("trigg", this.selectedZoomLevelIdx);
      if (e.scroll > 0 && this.selectedZoomLevelIdx < this.zoomLevels.length - 1) {
        // zoom in
        this.selectedZoomLevelIdx += 1;
      } else if (e.scroll < 0 && this.selectedZoomLevelIdx >= 1) {
        // zoom out
        this.selectedZoomLevelIdx -= 1;
      }
    },
    frame() {
      const now = Date.now();
      if (!this.lastNow || now - this.lastNow >= 1000) {
        this.lastNow = now;
        this.tick();
      }
      requestAnimationFrame(() => {
        this.frame();
      });
    },
    switchSchema() {
      this.idx += 1;
      const z = this.viewer.viewport.getZoom();
      this.viewer.viewport.defaultZoomLevel = z;
      this.viewer.goToPage(this.idx % this.viewer.tileSources.length);
    },
    setPlateFilter(model) {
      this.selectedModel = model;
      // this.idx += 1;
      // const z = this.viewer.viewport.getZoom();
      // this.viewer.viewport.defaultZoomLevel = z;
      // this.viewer.goToPage(this.idx % this.viewer.tileSources.length);
      this.viewer.viewport.panTo(this.randomCoord());
    },
    initViewer() {
      console.log("init viewer:", window.innerWidth, this.startZoom, this.minZoom, this.maxZoom, availableSchemas);
      // smaller width => higher zoom?
      this.viewer = OpenSeadragon({
        id: "viewer-image",
        maxImageCacheCount: 10000,
        tileSources: availableSchemas,
        sequenceMode: true,
        showSequenceControl: false,
        imageSmoothingEnabled: true,
        // placeholderFillStyle : draw grid if not loaded?
        showNavigator: false,
        showRotationControl: false,
        animationTime: 1,
        blendTime: 0.1,
        showNavigationControl: false,
        visibilityRatio: 1, // dont allow bigger than image
        constrainDuringPan: false, // prevents bounceback anim
        autoResize: true,
        zoomPerScroll: 2,
        defaultZoomLevel: this.startZoom,
        minZoomLevel: this.minZoom,
        // maxZoomLevel: this.maxZoom,
        maxZoomPixelRatio: 1, // default 1.1 The maximum ratio to allow a zoom-in to affect the highest level pixel ratio.
        // This can be set to Infinity to allow 'infinite' zooming into the image
        wrapHorizontal: this.wrap,
        wrapVertical: this.wrap,
        scrollToZoom: false,
      });

      this.viewer.gestureSettingsMouse.clickToZoom = false;

      this.viewer.addHandler("open", () => {
        // const homeZoom = this.viewer.viewport.getHomeZoom();
        // const fullZoom = this.viewer.viewport.imageToViewportZoom(1);
        // this.viewer.zoomPerClick = Math.cbrt(fullZoom / homeZoom); // cubed
        // this.zoomPerScroll = Math.cbrt(fullZoom / homeZoom); // cubed

        this.currentCenter = this.viewer.viewport.getCenter();
        this.viewer.addHandler("zoom", () => {
          console.log("zoom", this.viewer.viewport.getZoom());
          this.currentZoom = this.viewer.viewport.getZoom();
        });
      });

      this.viewer.addHandler("canvas-scroll", (event) => {
        event.preventDefault = false;
        this.triggerZoom(event);
      });

      this.viewer.addHandler("canvas-click", (event) => {
        this.infoOpen = false;
        if (!event.quick) {
          return;
        }

        console.log("canvas-click-center:", this.viewer.viewport.getCenter(true));
        const webPoint = event.position;
        const ip = this.viewer.viewport.viewerElementToImageCoordinates(event.position);

        console.log("ip:", ip);
        const viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);
        const imagePoint = this.viewer.viewport.viewportToImageCoordinates(viewportPoint);

        console.log(webPoint.toString(), viewportPoint.toString(), imagePoint.toString());

        // this.viewer.addTiledImage({
        //   tileSource: availableSchemas[1],
        //   x: 0,
        //   y: 0,
        //   width: 1.92,
        // })
      });
    },
  },
};
</script>
<style>
.hidden {
  display: none !important;
}
html,
body,
#viewer-image {
  height: 100%;
  width: 100%;
}

#overlay {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-image: url("/grid2.svg");
  pointer-events: none;
  z-index: 2000;
  object-fit: contain;
  background-size: 15%;
  background-position: center;
  /* box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px; */
  /* filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4)); */
  opacity: 25%;
  /* mix-blend-mode: difference; */
  /* background-color: transparent; */
}

#zoom-bar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  flex-direction: column;
}

.btn-zoom {
  padding: 2rem;
  background-color: #333;
  opacity: 0.75;
  cursor: pointer;
}

.btn-zoom.active {
  opacity: 1;
  border: 0.1px solid white;
}

#filter-bar {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  flex-direction: column;
}

.btn-layer {
  padding: 2rem;
  background-color: #333;
  opacity: 0.5;
  cursor: pointer;
}

.btn-layer.active {
  opacity: 1;
  border: 0.1px solid white;
  box-sizing: border-box;
}
.layer-1 {
  background-color: #ffd700;
}
.layer-2 {
  background-color: #ff4500;
}
.layer-3 {
  background-color: #778899;
}

@media (orientation: portrait) {
  .btn-layer,
  .btn-zoom {
    padding: 1.5rem;
  }
}
#social-media-bar {
  width: 100vw;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2000;
  display: flex;
  justify-content: space-evenly;
  font-family: Papyrus, fantasy;
  font-size: 0.8rem;
}

#social-media-bar a {
  display: block;
  padding: 0.5rem 2rem;
  text-decoration: none;
  flex: 1;
  text-align: center;
}

.youtube {
  background-color: rgba(255, 0, 0, 0.3);
  color: white;
}
.youtube:hover {
  background-color: rgba(255, 0, 0, 0.8);
}
.instagram {
  background-color: rgba(193, 53, 132, 0.3);
  color: white;
}
.instagram:hover {
  background-color: rgba(193, 53, 132, 0.8);
}
.tiktok {
  background-color: rgba(255, 0, 80, 0.3);
  color: black;
  color: white;
}
.tiktok:hover {
  background-color: rgba(255, 0, 80, 0.8);
  color: black;
}
</style>

<!-- "3dAnimationDiffusion_v10": { friendlyName: "3D Anim", hexColor: "#DA70D6" }, // Orchid
aniverse_v15Pruned: { friendlyName: "Aniverse", hexColor: "#FFD700" }, // Gold
counterfeitV30_v30: { friendlyName: "Counterfeit", hexColor: "#FF4500" }, // Orange Red
divineanimemix_V2: { friendlyName: "Divine Anime", hexColor: "#BA55D3" }, // Medium Orchid
divineelegancemix_V9: { friendlyName: "Divine Elegance", hexColor: "#DB7093" }, // Pale Violet Red
"dreamlike-photoreal-2.0": { friendlyName: "Dreamlike", hexColor: "#ADD8E6" }, // Light Blue
dreamshaper_8: { friendlyName: "Dreamshaper", hexColor: "#20B2AA" }, // Light Sea Green
epicrealism_naturalSinRC1VAE: { friendlyName: "Epic Realism", hexColor: "#778899" }, // Light Slate Gray
indigoComic_v10withvae: { friendlyName: "Indigo Comic", hexColor: "#4B0082" }, // Indigo
meinamix_meinaV11: { friendlyName: "Meinamix", hexColor: "#FF69B4" }, // Hot Pink
realisticVisionV51_v51VAE: { friendlyName: "Realistic Vision", hexColor: "#2E8B57" }, // Sea Green
revAnimated_v122EOL: { friendlyName: "Rev Animated", hexColor: "#FF6347" }, // Tomato
toonyou_beta6: { friendlyName: "Toonyou", hexColor: "#FFA07A" }, // Light Salmon
"v1-5-pruned-emaonly": { friendlyName: "1.5", hexColor: "#B0C4DE" }, // Light Steel Blue -->
