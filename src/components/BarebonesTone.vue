<template>
  <button class="btn-audio" @click="handleClick">start</button>
</template>
<script>
import * as Tone from "tone";
// import bell3 from "../assets/bell3.mp3";
export default {
  data() {
    return {
      isLoaded: false,
    };
  },
  methods: {
    handleClick() {
      // this.sampler.triggerAttack("Bell");
      // this.noise = new Tone.Noise("brown").toDestination();
      console.log("clickety");
      const context = new Tone.Context();
      Tone.setContext(context);
      this.audioCtx = context.rawContext;
      this.noiseMaker = new Tone.Noise("brown");
      const autoFilter = new Tone.AutoFilter({
        frequency: 0.01,
        baseFrequency: 200,
        octaves: 3,
      }).toDestination();
      this.noiseMaker.connect(autoFilter);
      autoFilter.start();
      this.noiseMaker.start();
    },
  },
  created() {
    // this.noise = new Tone.Noise("brown").toDestination();
    // this.sampler = new Sampler(
    //   { bell3 },
    //   {
    //     onload: () => {
    //       this.isLoaded = true;
    //     },
    //   }
    // ).toDestination();
  },
};
</script>
