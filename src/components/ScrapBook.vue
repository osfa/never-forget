<template>
  <div>
    <v-stage ref="stage" :config="configKonva" @dragstart="handleDragstart" @dragend="handleDragend">
      <v-layer ref="layer">
        <v-image
          :config="{
            image: image,
            width: 500,
            height: 353,
            draggable: true,
            stroke: 'white',
            strokeWidth: 10,
            rotation: 5,
          }" />

        <v-image
          :config="{
            image: lfsImage,
            width: 500,
            height: 353,
            draggable: true,
            stroke: 'white',
            strokeWidth: 10,
            rotation: 5,
          }" />
        <!-- <v-star
          v-for="item in list"
          :key="item.id"
          :config="{
            x: item.x,
            y: item.y,
            rotation: item.rotation,
            id: item.id,
            numPoints: 5,
            innerRadius: 30,
            outerRadius: 50,
            fill: '#89b717',
            opacity: 0.8,
            draggable: true,
            scaleX: dragItemId === item.id ? item.scale * 1.2 : item.scale,
            scaleY: dragItemId === item.id ? item.scale * 1.2 : item.scale,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffsetX: dragItemId === item.id ? 15 : 5,
            shadowOffsetY: dragItemId === item.id ? 15 : 5,
            shadowOpacity: 0.6,
          }"></v-star> -->
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
const width = window.innerWidth;
const height = window.innerHeight;
export default {
  data() {
    return {
      list: [],
      dragItemId: null,
      configKonva: {
        width: width,
        height: height,
        background: "white",
      },
      image: null,
      lfsImage: null,
    };
  },
  methods: {
    handleDragstart(e) {
      // save drag element:
      this.dragItemId = e.target.id();
      // move current element to the top:
      // const item = this.list.find((i) => i.id === this.dragItemId);
      // const index = this.list.indexOf(item);
      // this.list.splice(index, 1);
      // this.list.push(item);
    },
    handleDragend(e) {
      this.dragItemId = null;
    },
  },
  mounted() {
    for (let n = 0; n < 30; n++) {
      this.list.push({
        id: Math.round(Math.random() * 10000).toString(),
        x: Math.random() * width,
        y: Math.random() * height,
        rotation: Math.random() * 180,
        scale: Math.random(),
      });
    }
  },
  created() {
    const image = new window.Image();
    image.src = "./00001-2017427526_46.jpg";
    image.onload = () => {
      // set image only when it is loaded
      console.log("loaded");
      this.image = image;
    };
    const lfsImage = new window.Image();
    lfsImage.src = "./memories/00007-2017427528_44.png";
    lfsImage.onload = () => {
      // set image only when it is loaded
      console.log("loaded");
      this.lfsImage = lfsImage;
    };
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
