<template>
  <button class="btn-audio" @click="handleClick">start</button>
</template>
<script>
import * as Tone from "tone";
// import bell3 from "../assets/bell3.mp3";
import { audioLibrary } from "../audioLibrary.js";

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

      // const file1 = audioLibrary.uiSamples.sample();
      const file1 = "/audio/cabin.mp3";
      console.log("loading into sampleslot1", file1);

      const sampler1 = new Tone.Player(file1, () => {
        this.sampler1 = sampler1;
        // this.sampler1.playbackRate = 0.9
        this.sampler1.autostart = true;
        this.sampler1.loop = true;
        this.sampler1.volume.value = -12;
      }).toDestination(); // .connect(reverb)

      const file2 = "/audio/bush-interview.mp3";
      console.log("loading into sampleslot2", file2);

      const sampler2 = new Tone.Player(file2, () => {
        this.sampler2 = sampler2;
        // this.sampler1.playbackRate = 0.9
        this.sampler2.autostart = true;
        this.sampler2.loop = true;
        this.sampler2.volume.value = -12;
      }).toDestination();

      // this.noiseMaker = new Tone.Noise("brown");
      // const autoFilter = new Tone.AutoFilter({
      //   frequency: 0.01,
      //   baseFrequency: 200,
      //   octaves: 3,
      // }).toDestination();
      // this.noiseMaker.connect(autoFilter);
      // autoFilter.start();
      // this.noiseMaker.start();
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
