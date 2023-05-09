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
      ambiancePlayer: null,
      narrationPlayer: null,
      noiseMaker: null,
      // narrationClipPath: "/audio/bush-interview.mp3",
      narrationClipPath: "/audio/bell3.mp3",
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

      const file1 = "/audio/cabin.mp3";
      const ambiancePlayer = new Tone.Player(file1, () => {
        console.log("loaded into ambiancePlayer", file1);
        this.ambiancePlayer = ambiancePlayer;
        // this.sampler1.playbackRate = 0.9
        this.ambiancePlayer.autostart = true;
        this.ambiancePlayer.loop = true;
        this.ambiancePlayer.volume.value = -9;
      }).toDestination();
      ambiancePlayer.onstop = () => {
        console.log("ambiancePlayer stopped");
      };

      const narrationUrls = audioLibrary.bush.reduce((acc, curr) => ((acc[curr] = curr), acc), {});
      const narrationPlayer = new Tone.Players(narrationUrls, () => {
        console.log("loaded into narrationPlayer", narrationUrls);
        this.narrationPlayer = narrationPlayer;
        this.narrationPlayer.volume.value = -16;
        console.log("started this.narrationPlayer");
        narrationPlayer.player(audioLibrary.bush.sample()).start();
        narrationPlayer.onstop = () => {
          console.log("narrationPlayer stopped");
          narrationPlayer.player(audioLibrary.bush.sample()).start();
        };
      }).toDestination();

      this.noiseMaker = new Tone.Noise("brown");
      const autoFilter = new Tone.AutoFilter({
        frequency: 0.01,
        baseFrequency: 200,
        octaves: 3,
      }).toDestination();
      this.noiseMaker.volume.value = 6;
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
