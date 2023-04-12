<template>
  <div>
    <v-stage ref="stage" :config="configKonva" @dragstart="handleDragstart" @dragend="handleDragend">
      <v-layer ref="layer">
        <v-image
          v-for="item in list"
          :key="item.id"
          :config="{
            x: item.x,
            y: item.y,
            rotation: item.rotation,

            id: item.id,
            image: item.image,
            draggable: true,
            width: imgWidth,
            height: imgHeight,

            // scaleX: dragItemId === item.id ? item.scale * 1.2 : item.scale,
            // scaleY: dragItemId === item.id ? item.scale * 1.2 : item.scale,
            // shadowColor: 'black',
            // shadowBlur: 10,
            // shadowOffsetX: dragItemId === item.id ? 15 : 5,
            // shadowOffsetY: dragItemId === item.id ? 15 : 5,
            // shadowOpacity: 0.6,
          }"></v-image>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
const imgWidth = 500;
const imgHeight = 353;

const width = window.innerWidth;
const height = window.innerHeight;

const innerWidth = window.innerWidth - imgWidth;
const innerHeight = window.innerHeight - imgHeight;
import { imgLibrary } from "../imgLibrary.js";

export default {
  data() {
    return {
      imgWidth,
      imgHeight,
      imgPaths: imgLibrary.testBatch,
      list: [],
      dragItemId: null,
      configKonva: {
        width: width,
        height: height,
        background: "white",
      },
      // image: null,
      // lfsImage: null,

      lastNow: null,
      ticks: 0,
      tickInterval: 1000,
    };
  },
  methods: {
    tick() {
      this.ticks += 1;
      this.addMemory(this.imgPaths.sample());
    },
    addMemory(imgPath) {
      const image = new window.Image();
      image.src = imgPath;
      this.list.push({
        image,
        id: Math.round(Math.random() * 10000).toString(),
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        rotation: this.randomInt(-20, 20),
        // scale: Math.random(),
      });
    },
    frame() {
      const now = Date.now();
      if (!this.lastNow || now - this.lastNow >= this.tickInterval) {
        this.lastNow = now;
        this.tick();
      }
      requestAnimationFrame(() => {
        this.frame();
      });
    },
    handleDragstart(e) {
      // save drag element:
      this.dragItemId = e.target.id();
      // move current element to the top:
      const item = this.list.find((i) => i.id === this.dragItemId);
      const index = this.list.indexOf(item);
      this.list.splice(index, 1);
      this.list.push(item);
    },
    handleDragend(e) {
      this.dragItemId = null;
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
  },
  mounted() {
    // this.imgPaths.forEach((element) => {
    //   this.addMemory(element);
    // });
    this.frame();
  },
  created() {
    // const image = new window.Image();
    // image.src = "./00001-2017427526_46.jpg";
    // image.onload = () => {
    //   // set image only when it is loaded
    //   console.log("loaded");
    //   this.image = image;
    // };
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
