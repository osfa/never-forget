<!-- eslint-disable no-console -->
<template>
  <div id="viewer-image" ref="image">
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

      <!-- <AudioModule
        v-if="!develop"
        ref="audioModule"
        :automatic-fade="false"
        :debug="false"
        :kiosk-mode="false"
      /> -->
    </div>
  </div>
</template>
<script>
import OpenSeadragon from "openseadragon";
import { availableSchemas } from "../schemas.js";
import AudioModule from "./AudioModule.vue";

window.OpenSeadragon = OpenSeadragon;
export default {
  name: "DziViewer",
  components: {
    AudioModule,
  },
  data() {
    return {
      idx: 0,
      active_schema: availableSchemas[0],
      wrap: true,
      startZoom: 6,
      minZoom: 6, // how far you can zoom out, the smaller the more
      // minZoom: 2, // how far you can zoom out, the smaller the more
      maxZoom: 28,
      selectMode: false,
      selected: null,
      cull: [],
      cursorHistory: [],
      ticks: 0,

      // dev mode
      favorites: [],
      devMode: true,
      infoOpen: false,
      develop: false,
    };
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
  mounted() {
    this.initViewer();
  },
  methods: {
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
    initViewer() {
      // const ts = this.active_schema

      if (window.innerWidth < 640) {
        this.startZoom = 24;
        this.minZoom = 2;
        this.maxZoom = 75;
      } else if (window.innerWidth < 889) {
        this.startZoom = 18;
        this.minZoom = 2;
        this.maxZoom = 50;
      } else {
        this.startZoom = 8; // decrease with viewport width
        this.startZoom = 0.2; // decrease with viewport width
        this.minZoom = 0.01; // decrease with viewport width
        this.maxZoom = 24; // decrease with viewport width
      }
      console.log("init viewer:", window.innerWidth, this.startZoom, this.minZoom, this.maxZoom);
      // smaller width => higher zoom?
      this.viewer = OpenSeadragon({
        id: "viewer-image",
        maxImageCacheCount: 10000,
        // tileSources: ts,
        tileSources: [availableSchemas[0], availableSchemas[1], availableSchemas[2]],
        sequenceMode: true,
        // imageSmoothingEnabled???
        showNavigator: false,
        showRotationControl: false,
        animationTime: 1,
        blendTime: 0.1,
        showNavigationControl: false,
        visibilityRatio: 1, // dont allow bigger than image
        // constrainDuringPan: true, // prevents bounceback anim
        autoResize: true,
        zoomPerScroll: 1.2,
        defaultZoomLevel: this.startZoom,
        minZoomLevel: this.minZoom,
        maxZoomLevel: this.maxZoom,
        // maxZoomPixelRatio: 2, // default 1.1 The maximum ratio to allow a zoom-in to affect the highest level pixel ratio.
        // This can be set to Infinity to allow 'infinite' zooming into the image
        wrapHorizontal: this.wrap,
        wrapVertical: this.wrap,
        scrollToZoom: true,
        // something to stop
      });

      this.viewer.gestureSettingsMouse.clickToZoom = false;

      this.viewer.addHandler("open", () => {
        this.currentCenter = this.viewer.viewport.getCenter();
        this.viewer.addHandler("zoom", () => {
          console.log("zoom", this.viewer.viewport.getZoom());
        });
      });

      this.viewer.addHandler("canvas-click", (event) => {
        this.infoOpen = false;
        if (!event.quick) {
          return;
        }
        console.log("canvas-click-center:", this.viewer.viewport.getCenter(true));
        const webPoint = event.position;
        // this.viewer.viewport.panTo(
        //   this.viewer.viewport.pointFromPixel(webPoint)
        // )
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

        this.idx += 1;
        const z = this.viewer.viewport.getZoom();
        this.viewer.viewport.defaultZoomLevel = z;

        this.viewer.goToPage(this.idx % this.viewer.tileSources.length);
        // this.viewer.viewport.zoomTo(z)
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
</style>
