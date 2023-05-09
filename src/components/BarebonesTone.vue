<template>
  <div class="btn-audio" @click="toggleAudio">{{ muteIcon() }}</div>
</template>
<script>
import * as Tone from "tone";
import { audioLibrary } from "../audioLibrary.js";

// const narrationUrls = audioLibrary.bush.reduce((acc, curr) => ((acc[curr] = curr), acc), {});
// // const narrationPlayer = null;

// const narrationPlayer = new Tone.Players(narrationUrls, () => {
//   console.log("loaded into narrationPlayer", narrationUrls);
//   narrationPlayer.volume.value = -16;
// }); //.toDestination();

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
      // narrationPlayer: null, // doesn't fly in vue3
      narrationPlayer: () => narrationPlayer,
      noiseMaker: null,

      ambianceVolume: -3,
      ambianceChannel1: undefined,
      ambianceChannel2: undefined,

      currently1: "",
      currently2: "",

      crossFadeVal: 0.5,
      crossFade: undefined,
      crossDirection: false,
      crossFadeInterval: undefined,
      crossFadeDuration: 30, // in seconds
    };
  },
  methods: {
    playTick() {
      if (!this.isPlaying) return;
      // if (narrationPlayer && narrationPlayer.state === "stopped") {
      //   console.log("starting new narration");
      //   narrationPlayer.player(audioLibrary.bush.sample()).start();
      // }
      // if (this.narrationPlayer() && this.narrationPlayer().state === "stopped") {
      //   console.log("starting new narration");
      //   this.narrationPlayer().player(audioLibrary.bush.sample()).start();
      // }
    },
    muteIcon() {
      return this.isPlaying ? "🗣️" : "🕳️";
    },
    initAudio() {
      const context = new Tone.Context();
      Tone.setContext(context);
      this.audioCtx = context.rawContext;

      // const file1 = "/audio/cabin.mp3";
      // const ambiancePlayer = new Tone.Player(file1, () => {
      //   console.log("loaded into ambiancePlayer", file1);
      //   this.ambiancePlayer = ambiancePlayer;
      //   // this.sampler1.playbackRate = 0.9
      //   this.ambiancePlayer.autostart = true;
      //   this.ambiancePlayer.loop = true;
      //   this.ambiancePlayer.volume.value = -9;
      // }).toDestination();

      // ambiancePlayer.onstop = () => {
      //   console.log("ambiancePlayer stopped");
      // };
      this.initAmbiance();

      // this.narrationPlayer().toDestination();
      // const narrationUrls = audioLibrary.bush.reduce((acc, curr) => ((acc[curr] = curr), acc), {});
      // narrationPlayer = new Tone.Players(narrationUrls, () => {
      //   console.log("loaded into narrationPlayer", narrationUrls);
      //   // this.narrationPlayer = narrationPlayer;
      //   narrationPlayer.volume.value = -16;
      //   // console.log("started this.narrationPlayer");
      //   // narrationPlayer.player(audioLibrary.bush.sample()).start();
      //   // narrationPlayer.onstop = () => {
      //   //   console.log("narrationPlayer stopped");
      //   //   narrationPlayer.player(audioLibrary.bush.sample()).start();
      //   // };
      // }).toDestination();

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
    initAmbiance() {
      const def = {
        frequency: 1.5,
        delayTime: 2.5,
        depth: 0.75,
        spread: 180,
        wet: this.chorusWetness,
      };

      this.chorus = new Tone.Chorus(def).toDestination();
      // this.chorus.wet.value = this.chorusWetness
      this.crossFade = new Tone.CrossFade().connect(this.chorus).connect(new Tone.Reverb(0.1)); // .toDestination()
      this.crossFade.fade.value = this.crossFadeVal; // 0-currently1, 1-currently2

      this.currently1 = "/audio/cabin.mp3"; // audioLibrary.bush.sample();
      // console.log(this.currently1);
      // this.asmrChannel1 = new Tone.Player(this.currently1).connect(this.crossFade.a);

      const ambiancePlayer = new Tone.Player(this.currently1, () => {
        console.log("loaded into ambiancePlayer", this.currently1);
        this.ambiancePlayer = ambiancePlayer;
        // this.sampler1.playbackRate = 0.9
        this.ambiancePlayer.autostart = true;
        this.ambiancePlayer.loop = true;
        this.ambiancePlayer.volume.value = -9;
        // ambiancePlayer;
      }).connect(this.crossFade.a);

      // ambiancePlayer.onstop = () => {
      //   console.log("ambiancePlayer stopped");
      // };

      // this.asmrChannel1.autostart = false;
      // this.asmrChannel1.loop = true;
      // this.asmrChannel1.volume.value = this.ambianceVolume;

      // this.currently2 = audioLibrary.bush.sample();
      // this.asmrChannel2 = new Tone.Player(this.currently2).connect(this.crossFade.b);
      // this.asmrChannel2.autostart = false;
      // this.asmrChannel2.loop = true;
      // this.asmrChannel2.volume.value = this.ambianceVolume;

      // if (this.automaticFade) {
      //   this.crossFadeInterval = setInterval(this.doCrossFade, (this.crossFadeDuration / 5) * 1000);
      // }
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
    isObj(variable) {
      return typeof variable === "object" && !Array.isArray(variable) && variable !== null;
    },
    load1(chosen) {
      console.log("load1:", chosen);
      if (this.isObj(chosen)) {
        console.log(chosen.path);
        this.currently1 = chosen.path;
        this.asmrChannel1.volume.rampTo(this.ambianceVolume + chosen.volume, 3);
      } else {
        this.currently1 = chosen;
        this.asmrChannel1.volume.rampTo(this.ambianceVolume, 3);
      }
      this.asmrChannel1.load(this.currently1);
    },
    load2(chosen) {
      console.log("load2:", chosen);
      if (this.isObj(chosen)) {
        this.currently2 = chosen.path;
        this.asmrChannel2.volume.rampTo(this.ambianceVolume + chosen.volume, 3);
      } else {
        this.currently2 = chosen;
        this.asmrChannel1.volume.rampTo(this.ambianceVolume, 3);
      }
      this.asmrChannel2.load(this.currently2);
    },
    hardFade1() {
      this.load1(audioLibrary.realGrouped[this.audioCounter1].sample());
      this.audioCounter1 += 1;
    },
    hardFade2() {
      this.load2(audioLibrary.fakeGrouped[this.audioCounter2].sample());
      this.audioCounter2 += 1;
    },
    doCrossFade() {
      console.log("cross fade");
      const stepSize = this.kioskMode ? 0.1 : 0.05;
      if (this.crossFade.fade.value === 1.0 || this.crossFade.fade.value <= 0.0) {
        this.crossDirection = !this.crossDirection;
        if (this.crossFade.fade.value === 1.0) {
          const chosen = audioLibrary.realGrouped.sample().sample();
          this.load1(chosen);
        } else {
          const chosen = audioLibrary.fakeGrouped.sample().sample();
          this.load2(chosen);
        }
      }

      // crossFadeVal = 0, only currently1
      // crossFadeVal = 1, only currently2
      if (this.crossDirection) {
        const val = Math.min(parseFloat(this.crossFade.fade.value + stepSize), 1);
        this.crossFade.fade.value = val;
        this.crossFadeVal = val.toFixed(1);
      } else {
        const val = Math.max(parseFloat(this.crossFade.fade.value - stepSize), 0);
        this.crossFade.fade.value = val;
        this.crossFadeVal = val.toFixed(1);
      }
    },
  },
};
</script>
