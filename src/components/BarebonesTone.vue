<template>
  <div class="btn-audio" @click="toggleAudio">{{ muteIcon() }}</div>
</template>
<script>
import * as Tone from "tone";
import { audioLibrary } from "../audioLibrary.js";

export default {
  props: {
    automaticFade: { type: Boolean, default: false },
    debug: { type: Boolean, default: false },
    kioskMode: { type: Boolean, default: false },
  },
  data() {
    return {
      isActive: false,
      isPlaying: false,
      hasInit: false,
      audioCtx: undefined,
      sampler1: null,
      sampler2: null,
      noiseMaker: null,
    };
  },
  methods: {
    muteIcon() {
      return this.isPlaying ? "🗣️" : "🕳️";
    },
    initAudio() {
      const context = new Tone.Context();
      Tone.setContext(context);
      this.audioCtx = context.rawContext;

      // const file1 = audioLibrary.uiSamples.sample();
      const file1 = "/audio/cabin.mp3";
      const sampler1 = new Tone.Player(file1, () => {
        console.log("loaded into sampleslot1", file1);
        this.sampler1 = sampler1;
        // this.sampler1.playbackRate = 0.9
        this.sampler1.autostart = true;
        this.sampler1.loop = true;
        this.sampler1.volume.value = -9;
      }).toDestination();

      const file2 = "/audio/bush-interview.mp3";
      const sampler2 = new Tone.Player(file2, () => {
        console.log("loaded into sampleslot2", file1);
        this.sampler2 = sampler2;
        // this.sampler2.playbackRate = 0.9
        this.sampler2.autostart = true;
        this.sampler2.loop = true;
        this.sampler2.volume.value = -20;
      }).toDestination();

      this.noiseMaker = new Tone.Noise("brown");
      const autoFilter = new Tone.AutoFilter({
        frequency: 0.01,
        baseFrequency: 200,
        octaves: 3,
      }).toDestination();
      this.noiseMaker.volume.value = -14;
      this.noiseMaker.connect(autoFilter);
      autoFilter.start();
      this.noiseMaker.start();
    },
    toggleAudio() {
      this.isPlaying = !this.isPlaying;
      this.$emit("toggleAudio");

      if (!this.audioCtx) {
        this.initAudio();
        this.hasInit = true;
        return;
      }
      if (this.audioCtx.state === "running") {
        this.audioCtx.suspend().then(function () {});
      } else if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume().then(function () {});
      }
    },
    samplerFadeTo(audioPath) {},
  },
};
</script>
