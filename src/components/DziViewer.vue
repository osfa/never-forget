<template>
  <div id="viewer-image" ref="image">
    <div
      id="overlay"
      :style="{ backgroundSize: `${Math.min(currentZoom * 25, 35)}%` }"></div>

    <!-- <img id="overlay" src="/grid2.svg" :style="{ scale: `${currentZoom * 150}%` }" /> -->
    <div id="subs-container">
      <div id="subs-text">{{ subtitles }}</div>
      <audio id="my-audio-player" src="/audio/script-srt-test.mp3">
        <track
          kind="captions"
          src="/audio/script-srt-test.vtt"
          srclang="en"
          label="English"
          default />
      </audio>
    </div>
    <div id="scroller">
      <!-- <div class="marquee enable-animation marquee--fit-content">
        <ul class="marquee__content">
          <li>
            This is the story of a man, marked by an image of his childhood. The
            violent scene that upsets him, and whose meaning he was to grasp
            only years later happened on the main jetty at Dulles, the
            Washington DC airport sometime before, the outbreak of war.
          </li>
        </ul>
        <ul class="marquee__content" aria-hidden="true">
          <li>
            This is the story of a man, marked by an image of his childhood. The
            violent scene that upsets him, and whose meaning he was to grasp
            only years later happened on the main jetty at Dulles, the
            Washington DC airport sometime before, the outbreak of war.
          </li>
        </ul>
      </div> -->
    </div>
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

      <BarebonesTone ref="audioModule" automaticFade :debug="false" />
    </div>
    <div id="social-media-bar">
      <a
        href="https://www.youtube.com/@NeverForgetNow"
        class="btn-platform youtube"
        ><img src="/yt.svg"
      /></a>
      <a
        href="https://www.tiktok.com/@neverforgetnow"
        class="btn-platform tiktok"
        ><img src="/tiktok.svg"
      /></a>
      <a
        href="https://www.instagram.com/neverforgetnow1"
        class="btn-platform instagram"
        ><img src="/insta.svg"
      /></a>
    </div>
    <div id="filter-bar">
      <div id="model-section">
        <div
          v-for="(model, idx) in Object.keys(MODEL_META_MAP)"
          class="btn-layer"
          :class="{ active: selectedModels.includes(model) }"
          :style="{ backgroundColor: MODEL_META_MAP[model]?.hexColor }"
          @click="setPlateFilter(model)">
          {{ MODEL_META_MAP[model]?.unicode }}
        </div>
      </div>
      <div id="action-section">
        <!-- <div
          class="btn-layer"
          :class="{ active: plateCellSize === 'fullhd' }"
          @click="plateCellSize = 'fullhd'">
          ◼
        </div>
        <div
          class="btn-layer"
          :class="{ active: plateCellSize === 'hd' }"
          @click="plateCellSize = 'hd'">
          ◧
        </div>
        <div
          class="btn-layer"
          :class="{ active: plateCellSize === 'sd' }"
          @click="plateCellSize = 'sd'">
          ◳
        </div> -->
        <div
          class="btn-layer"
          :class="{ active: plateFried }"
          @click="plateFried = !plateFried">
          ◡
        </div>
        <div
          class="btn-layer"
          :class="{ active: infoModalOpen }"
          @click="infoModalOpen = !infoModalOpen">
          ⓘ
        </div>
        <!-- <div class="btn-layer btn-right" @click="pan(5, 0)">⇉</div>
        <div class="btn-layer btn-left" @click="pan(-5, 0)">⇇</div> -->
      </div>
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

const ZOOM_COLORS = [
  "#000",
  "#111",
  "#222",
  "#333",
  "#666",
  "#999",
  "#ccc",
  "#eee",
  "#fff",
];

window.OpenSeadragon = OpenSeadragon;
export default {
  name: "DziViewer",
  components: {
    BarebonesTone,
  },
  data() {
    return {
      idx: 0,
      active_schema: this.generateTileUrl(),
      wrap: true,
      subtitles: "",
      // zoom
      currentZoom: 0.2,
      selectedZoomLevelIdx: 0,
      zoomLevels: [2, 4, 6, 8, 12, 16, 18, 24],
      startZoom: 3,
      minZoom: 3, // how far you can zoom out, the smaller the more
      maxZoom: 28, // how far you can zoom in, the higher the more

      driftStep: 0.025,
      currentDirectionX: 0,
      currentDirectionY: -1,
      // dev mode
      favorites: [],
      devMode: true,
      infoOpen: false,
      develop: false,
      plateCellSize: "fullhd",
      plateFried: false,
      infoModalOpen: false,

      // tick stuff
      ticks: 0,
      lastNow: null,
      ticks: 0,
      tickInterval: 1000,
      slideTickInterval: 8,
      tickDown: 8,
      selectedModel: "aniverse_v15Pruned",
      selectedModels: ["aniverse_v15Pruned"],
      MODEL_META_MAP,
      ZOOM_COLORS,
    };
  },
  watch: {
    selectedZoomLevelIdx() {
      console.log(
        "selectedZoomLevel",
        this.selectedZoomLevelIdx,
        this.zoomLevels[this.selectedZoomLevelIdx]
      );
      // doesnt center?
      // need to take viewport width in account somehow?
      this.viewer.viewport.zoomTo(this.zoomLevels[this.selectedZoomLevelIdx]);
      // this.viewer.viewport.zoomBy(this.zoomPerScroll);
    },
    plateFried() {
      this.viewer.addTiledImage({
        tileSource: this.generateTileUrl(),
        x: 0,
        y: 0,
        width: 1,
      });
    },
    plateCellSize() {
      this.viewer.addTiledImage({
        tileSource: this.generateTileUrl(),
        x: 0,
        y: 0,
        width: 1,
      });
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
    document
      .getElementById("my-audio-player")
      .textTracks[0].addEventListener("cuechange", (event) => {
        console.log("cuechange", event.target.activeCues);
        if (event.target.activeCues.length > 0) {
          this.subtitles = event.target.activeCues[0].text;
          this.pan(0.5, 0);
        }
      });
  },
  methods: {
    generateTileUrl() {
      const grid_dims = 15;
      const dims = {
        fullhd: [1920, 1080],
        hd: [1280, 720],
        sd: [640, 360],
      };

      const plateCellSize = this.plateCellSize || "fullhd";
      console.log("plateCellSize:", plateCellSize);
      return {
        Image: {
          xmlns: "http://schemas.microsoft.com/deepzoom/2008",
          Url: "",
        },
        width: dims[plateCellSize][0] * grid_dims,
        height: dims[plateCellSize][1] * grid_dims,
        tileSize: 512,
        tileOverlap: 1,
        plates: this.selectedModels,
        plateCellSize: plateCellSize,
        plateFried: this.plateFried || false,
        getTileUrl: function (level, x, y) {
          const selectedModel =
            this.plates[Math.floor(Math.random() * this.plates.length)];

          const doFryCells = false;
          const fry_cells = doFryCells ? "fry-cells-" : "";

          const fried =
            this.plateFried && plateCellSize != "hd" ? "fry-" : "no-fry-";
          const q =
            (this.plateFried && plateCellSize != "hd") || doFryCells
              ? "q10"
              : "q50";

          const baseUrl = "jpeg.matrix.surf/dzi/v0";
          // const baseUrl = "localhost:3000/dzi/_local"

          return `http://${baseUrl}/${selectedModel}-15x15-${this.plateCellSize}-${fried}${fry_cells}fit-${q}_files/${level}/${x}_${y}.jpeg`;
        },
      };
    },
    tick() {
      this.ticks += 1;
      this.tickDown -= 1;
      if (this.$refs.audioModule) this.$refs.audioModule.playTick();
      // if (this.ticks % this.slideTickInterval === 0) {
      //   this.storyTick();
      // }
    },
    isTouchDevice() {
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
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
      const coord = new OpenSeadragon.Point(
        point.x + this.randomFloat(0, d),
        point.y + this.randomFloat(0, d)
      );
      return coord;
    },
    triggerZoom(e) {
      console.log("trigg", this.selectedZoomLevelIdx);
      if (
        e.scroll > 0 &&
        this.selectedZoomLevelIdx < this.zoomLevels.length - 1
      ) {
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
    triggerPan(event) {
      console.log("triggerPan", event.delta);
      if (Math.abs(event.delta.x) > Math.abs(event.delta.y)) {
        this.currentDirectionX = event.delta.x > 0 ? 1 : -1;
        this.currentDirectionY = 0;
      } else {
        this.currentDirectionX = 0;
        this.currentDirectionY = event.delta.y > 0 ? 1 : -1;
      }
      const move = new OpenSeadragon.Point(
        this.driftStep * this.currentDirectionX * (1 / this.currentZoom),
        this.driftStep * this.currentDirectionY * (1 / this.currentZoom)
      );
      this.viewer.viewport.panBy(move);
    },
    panDown() {
      const dirX = 0;
      const dirY = -1;
      const move = new OpenSeadragon.Point(
        this.driftStep * dirX,
        this.driftStep * dirY
      );
      this.viewer.viewport.panBy(move);
    },
    pan(dirX, dirY) {
      const move = new OpenSeadragon.Point(
        this.driftStep * dirX,
        this.driftStep * dirY
      );
      this.viewer.viewport.panBy(move);
    },
    setPlateFilter(model) {
      console.log("setplatefilter", model);
      if (this.selectedModels.includes(model)) {
        this.selectedModels = this.selectedModels.filter((m) => m !== model);
      } else {
        this.selectedModels.push(model);
      }

      this.viewer.addTiledImage({
        tileSource: this.generateTileUrl(),
        x: 0,
        y: 0,
        width: 1,
      });
    },
    initViewer() {
      console.log(
        "init viewer:",
        window.innerWidth,
        this.startZoom,
        this.minZoom,
        this.maxZoom,
        this.plateCellSize,
        availableSchemas
      );
      const bootSchema = this.generateTileUrl();
      this.viewer = OpenSeadragon({
        id: "viewer-image",
        maxImageCacheCount: 10000,
        // tileSources: availableSchemas, // hmm
        tileSources: bootSchema, // hmm
        // tileSources: customTileSource,
        sequenceMode: true,
        showSequenceControl: false,
        imageSmoothingEnabled: true,
        // placeholderFillStyle : draw grid if not loaded?
        showNavigator: false,
        showRotationControl: false,
        // animationTime: 1.5,
        // animationTime: 1.2,
        // animationTime: 0.5,
        // animationTime: 0.25,
        // animationTime: 0.1,
        // springStiffness: 6.5 ,
        // springStiffness: 0.25,
        // springStiffness: 10,
        // springStiffness: 0.1,
        // blendTime: 0.5,
        blendTime: 0.25,
        // alwaysBlend: true,
        showNavigationControl: false,
        // visibilityRatio: 1, // dont allow bigger than image
        visibilityRatio: 2, // dont allow bigger than image
        constrainDuringPan: false, // prevents bounceback anim
        autoResize: true,
        // zoomPerScroll: 2,
        // zoomPerClick: 2,
        defaultZoomLevel: this.startZoom,
        minZoomLevel: this.minZoom, // HOW FAR YOU CAN ZOOM OUT
        // maxZoomLevel: this.maxZoom, // HOW FAR YOU CAN ZOOM IN
        maxZoomPixelRatio: 0.5, // default 1.1 The maximum ratio to allow a zoom-in to affect the highest level pixel ratio.
        // This can be set to Infinity to allow 'infinite' zooming into the image
        wrapHorizontal: this.wrap,
        wrapVertical: this.wrap,
        scrollToZoom: false,
        panHorizontal: false,
        // panVertical: false,
      });

      this.viewer.gestureSettingsMouse.clickToZoom = true;
      this.viewer.gestureSettingsMouse.scrollToZoom = false;
      // this.viewer.gestureSettingsMouse.dragToPan = false;

      this.viewer.addHandler("open", () => {
        // const homeZoom = this.viewer.viewport.getHomeZoom();

        const fullZoom = this.viewer.viewport.imageToViewportZoom(0.5);
        console.log("fullZoom:", fullZoom);

        //   const zoomTo = Math.max(
        //   maxZoom,
        //   this.zoomLevels[this.selectedZoomLevelIdx]
        // );
        // this.maxZoom = fullZoom;

        // [2, 4, 6, 8, 12, 16, 18, 24]
        // const generateSequentialIntegers = (min, max, n) => {
        //   if (max - min + 1 < n) {
        //     throw new Error(
        //       "Range is too small for the requested number of sequential integers"
        //     );
        //   }

        //   const start = Math.floor(Math.random() * (max - min - n + 2)) + min;
        //   return Array.from({ length: n }, (_, i) => start + i);
        // };

        const generateSequentialFloats = (min, max, n) => {
          if (n < 2) {
            throw new Error("Need at least 2 points for a range");
          }

          const step = (max - min) / (n - 1);
          return Array.from({ length: n }, (_, i) => min + step * i);
        };
        // this.zoomLevels = generateSequentialIntegers(2, fullZoom, 8);

        this.zoomLevels = generateSequentialFloats(this.minZoom, fullZoom, 8);
        console.log("zoomLevels", this.zoomLevels);

        // this.viewer.zoomPerClick = Math.cbrt(fullZoom / homeZoom); // cubed
        // this.zoomPerScroll = Math.cbrt(fullZoom / homeZoom); // cubed

        this.currentCenter = this.viewer.viewport.getCenter();
        this.viewer.addHandler("zoom", () => {
          console.log("zoom", this.viewer.viewport.getZoom());
          this.currentZoom = this.viewer.viewport.getZoom();
        });
      });

      // HNNNG
      // this.viewer.addHandler("canvas-drag", (event) => {
      //   // console.log("canvas-drag", event);
      //   event.preventDefault = false;
      //   event.preventDefaultAction = false;
      //   this.triggerPan(event);
      // });

      // this.viewer.addHandler("canvas-drag-end", (event) => {
      //   // console.log("canvas-drag", event);
      //   event.preventDefault = false;
      //   event.preventDefaultAction = false;
      //   this.triggerPan(event);
      // });

      // this.viewer.addHandler("pan", (event) => {
      //   console.log("pan", event);
      //   this.doPan();
      //   // this.viewer.viewport.panTo(this.randomCoord());
      //   // this.viewer.viewport.panTo(this.viewer.viewport.getCenter());
      // });

      this.viewer.addHandler("canvas-scroll", (event) => {
        event.preventDefault = false;
        // this.triggerZoom(event);
        console.log(event.scroll);
        if (event.scroll > 0) {
          this.panDown();
        } else {
          this.pan(1, 0);
        }
      });

      this.viewer.addHandler("canvas-click", (event) => {
        this.infoOpen = false;
        if (!event.quick) {
          return;
        }

        // if (this.selectedZoomLevelIdx < this.zoomLevels.length - 1) {
        //   // zoom in
        //   this.selectedZoomLevelIdx += 1;
        // }

        console.log(
          "canvas-click-center:",
          this.viewer.viewport.getCenter(true)
        );
        const webPoint = event.position;
        const ip = this.viewer.viewport.viewerElementToImageCoordinates(
          event.position
        );

        console.log("ip:", ip);
        const viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);
        const imagePoint =
          this.viewer.viewport.viewportToImageCoordinates(viewportPoint);

        console.log(
          webPoint.toString(),
          viewportPoint.toString(),
          imagePoint.toString()
        );
      });
    },
  },
};
</script>

<style scoped>
@import "../assets/dzi-filterbar.css";
@import "../assets/dzi-socialmediabar.css";
@import "../assets/dzi-scroller-subs.css";

/* :root {
  --–margins: 3vw;
} */

html,
body {
  width: 100%;
}

#viewer-image {
  /* margin-top: 2vh; */
  height: 100vh;
  /* width: calc(100vw-var(--margins)); */
  width: 98vw;
  /* padding: 0 var(--margins); */
  margin-left: 2vw;
  position: relative;
  cursor: wait;
  cursor: pointer;
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
  opacity: 15%;
  opacity: 5%;
  /* mix-blend-mode: difference; */
  /* background-color: transparent; */
}
.hidden {
  display: none !important;
}
</style>
