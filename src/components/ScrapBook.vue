<template>
  <div>
    <div class="controls"><input v-model="tickInterval" /></div>
    <v-stage ref="stage" :config="configKonva" @dragstart="handleDragstart" @dragend="handleDragend">
      <v-layer ref="layer">
        <v-image
          v-for="item in list"
          ref="setItemRef"
          :key="item.id"
          :config="{
            x: item.x,
            y: item.y,
            rotation: item.rotation,

            // opacity: 0,

            id: item.id,
            image: item.image,

            draggable: false,
            listening: false,

            width: item.width,
            height: item.height,
            stroke: item.stroke,
            strokeWidth: item.strokeWidth,
            // scaleX: dragItemId === item.id ? item.scale * 1.2 : item.scale,
            // scaleY: dragItemId === item.id ? item.scale * 1.2 : item.scale,
            shadowColor: 'black',
            shadowBlur: 10,
            // shadowOffsetX: dragItemId === item.id ? 15 : 5,
            // shadowOffsetY: dragItemId === item.id ? 15 : 5,
            shadowOpacity: 0.6,
          }"></v-image>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
const imgWidth = 500;
const imgHeight = 353;
const aspectRatio = 500 / 353;

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
      itemRefs: [],
      dragItemId: null,
      configKonva: {
        width: width,
        height: height,
      },
      // image: null,
      // lfsImage: null,
      lastNow: null,
      ticks: 0,
      tickInterval: 3000,
    };
  },
  methods: {
    setItemRef(el) {
      // console.log("setItemRef", el);
      // console.log(el.getNode());
      // this.$nextTick(() => {
      //   el.getNode().to({
      //     opacity: 1.0,
      //     duration: 0.5,
      //   });
      // });
      // if (el) {
      //   this.itemRefs.push(el);
      // }
    },
    tick() {
      this.ticks += 1;
      this.addMemory(this.imgPaths.sample());
      // console.log(this.$refs.layer);
    },
    addMemory(imgPath) {
      const image = new window.Image();
      image.src = imgPath;
      image.onload = (e) => {
        // set image only when it is loaded
        const w = this.randomInt(300, 400);
        const id = Math.round(Math.random() * 10000).toString();
        this.list.push({
          image,
          id,
          x: Math.random() * innerWidth,
          y: Math.random() * innerHeight,
          rotation: this.randomInt(-20, 20),
          stroke: "white",
          strokeWidth: 10,
          width: w,
          height: w / aspectRatio,
          opacity: 0,
          // scale: Math.random(),
        });

        // hmm like this somehow?
        // this.$nextTick(() => {
        //   const node = this.$refs.image.getStage();
        //   node.cache();
        //   node.getLayer().batchDraw();
        // });

        // const item = this.list.find((i) => i.id === id);
        // console.log(this.$refs);
        // item.to({
        //   scaleX: Math.random() + 0.8,
        //   scaleY: Math.random() + 0.8,
        //   duration: 0.2,
        // });
      };
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
  // beforeUpdate() {
  //   console.log("beforeUpdate");
  //   this.itemRefs = [];
  // },
  // updated() {
  //   console.log("wut?");
  //   console.log(this.itemRefs);
  //   this.$refs.itemRefs[this.$refs.itemRefs.length - 1].to({
  //     scaleX: Math.random() + 0.8,
  //     scaleY: Math.random() + 0.8,
  //     duration: 0.2,
  //   });
  // },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
.controls {
  position: fixed;
  top: 50px;
  right: 0px;
  z-index: 1000;
}
</style>
