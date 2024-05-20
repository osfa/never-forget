<template>
  <div
    class="btn-audio"
    :class="{ hasInit: hasInit || debug, isPlaying }"
    @click="toggleAudio">
    <span>{{ muteIcon() }}</span>
  </div>
</template>
<script>
import * as Tone from "tone";
import { audioLibrary } from "../audioLibrary.js";

export default {
  name: "BarebonesTone",
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

      narrationPlayerDirection: true,
      narrationPlayer: null,

      narrationPlayer1: null,
      narrationPlayer2: null,

      baseVolume: -6,
      // narrationVolume: -9,
      // narrationVolume: -3,
      narrationVolume: -12,
      narrationVolumeMin: -32,
      audioTagVolume: 0.5,
      noiseMaker: null,
      noiserMakerVolume: -16,
      // noiserMakerVolume: -32,

      ambianceVolume: -9,
      ambianceChannel1: undefined,
      ambianceChannel2: undefined,

      currently1: "",
      currently2: "",

      crossFadeVal: 0.5,
      crossFade: undefined,
      crossDirection: false,
      crossFadeInterval: undefined,
      crossFadeDuration: 10, // in seconds
      pauseTicks: 0,
      // BASE_URI: "",
      BASE_URI: "http://jpeg.matrix.surf",
    };
  },
  methods: {
    playTick() {
      if (!this.isPlaying) return;

      // if (this.narrationPlayer && this.narrationPlayer.state === "stopped") {
      //   if (this.pauseTicks === 0) {
      //     const file = audioLibrary.asmr.sample();
      //     console.log("new narration:", file);
      //     this.narrationPlayer.player(file).start();
      //     this.pauseTicks = this.randomInt(10, 30);
      //   } else {
      //     console.log("pause", this.pauseTicks);
      //     this.pauseTicks -= 1;
      //   }
      // }

      // if (this.narrationPlayer1 && this.narrationPlayer1.state === "stopped") {
      //   console.log("new narration.");
      //   this.narrationPlayer1.player(audioLibrary.bush.sample()).start();
      // }
    },
    // narrationSwap() {
    //   console.log("narrationSwap:", this.narrationPlayerDirection);
    //   // this.narrationPlayer1.volume.rampTo(12, 4);

    //   if (!this.isPlaying) return;
    //   if (this.narrationPlayerDirection) {
    //     this.narrationPlayerDirection = !this.narrationPlayerDirection;
    //     this.crossFadeNarrations(this.narrationPlayer, this.narrationPlayer1);
    //   } else {
    //     this.narrationPlayerDirection = !this.narrationPlayerDirection;
    //     this.crossFadeNarrations(this.narrationPlayer1, this.narrationPlayer);
    //   }
    // },
    // crossFadeNarrations(playerToFadeOut, playerToFadeIn) {
    //   console.log("out:", playerToFadeOut.volume.value);
    //   playerToFadeOut.volume.rampTo(this.narrationVolumeMin, 4);
    //   console.log("in:", playerToFadeIn.volume.value);
    //   playerToFadeIn.volume.rampTo(this.narrationVolume, 4);
    // },
    randomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    },
    muteIcon() {
      // return this.isPlaying ? "🔇" : "🕳️";
      return this.isPlaying ? "🔇" : "▶";
      // return this.isPlaying ? "🔇" : "⅏";
      // return this.isPlaying ? "🔇" : "↕";
    },
    initAudio() {
      const context = new Tone.Context();
      Tone.setContext(context);
      this.audioCtx = context.rawContext;
      this.setVolume();
      const file1 = this.BASE_URI + "/audio/cabin.mp3";

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

      this.initAmbiance();

      const narrationUrls = audioLibrary.asmr.reduce(
        (acc, curr) => ((acc[curr] = this.BASE_URI + curr), acc),
        {}
      );
      const narrationPlayer = new Tone.Players(narrationUrls, () => {
        // console.log("loaded into narrationPlayer", narrationUrls);
        this.narrationPlayer = narrationPlayer;
        this.narrationPlayer.volume.value = this.narrationVolume;
      }).toDestination();

      // const narrationPlayer1 = new Tone.Players(narrationUrls, () => {
      //   console.log("loaded into narrationPlaye1", narrationUrls);
      //   this.narrationPlayer1 = narrationPlayer1;
      //   this.narrationPlayer1.volume.value = -32;
      // }).toDestination();

      // const narrationPlayer2 = new Tone.Players(narrationUrls, () => {
      //   console.log("loaded into narrationPlayer2", narrationUrls);
      //   this.narrationPlayer2 = narrationPlayer2;
      //   this.narrationPlayer2.volume.value = this.narrationVolume;
      // }).toDestination();

      this.noiseMaker = new Tone.Noise("brown");
      const autoFilter = new Tone.AutoFilter({
        frequency: 0.01, // How fast the filter modulates between min and max
        baseFrequency: 200, // The minimum value of the filter's cutoff frequency.
        octaves: 3, // The number of octaves above the baseFrequency
      }).toDestination();
      this.noiseMaker.volume.value = this.noiserMakerVolume;
      this.noiseMaker.connect(autoFilter);
      autoFilter.start();
      this.noiseMaker.start();
    },
    setVolume() {
      Tone.getDestination().volume.rampTo(
        this.baseVolume === -100 ? -Infinity : this.baseVolume,
        0
      );
    },
    initAmbiance() {
      const def = {
        frequency: 1.5,
        delayTime: 2.5,
        depth: 0.75,
        spread: 180,
        wet: this.chorusWetness || 0.01, // 0.25,
      };

      const autoFilter = new Tone.AutoFilter({
        frequency: 0.01,
        baseFrequency: 200,
        octaves: 3,
      }).toDestination();

      this.chorus = new Tone.Chorus(def).toDestination();
      // this.chorus.wet.value = this.chorusWetness
      this.crossFade = new Tone.CrossFade()
        .connect(this.chorus)
        .connect(new Tone.Reverb(0.1))
        .connect(autoFilter); // .toDestination()
      this.crossFade.fade.value = this.crossFadeVal; // 0-currently1, 1-currently2

      this.currently1 = this.BASE_URI + audioLibrary.availableReal.sample();
      this.ambianceChannel1 = new Tone.Player(this.currently1).connect(
        this.crossFade.a
      );
      this.ambianceChannel1.autostart = true;
      this.ambianceChannel1.loop = true;
      this.ambianceChannel1.volume.value = this.ambianceVolume;

      this.currently2 = this.BASE_URI + audioLibrary.availableReal.sample();
      this.ambianceChannel2 = new Tone.Player(this.currently2).connect(
        this.crossFade.b
      );
      this.ambianceChannel2.autostart = true;
      this.ambianceChannel2.loop = true;
      this.ambianceChannel2.volume.value = this.ambianceVolume;

      if (this.automaticFade) {
        this.crossFadeInterval = setInterval(
          this.doCrossFade,
          (this.crossFadeDuration / 5) * 1000
        );
      }
      autoFilter.start();
    },
    toggleAudio() {
      this.isPlaying = !this.isPlaying;
      this.$emit("toggleAudio");

      if (!this.audioCtx) {
        this.initAudio();
        this.hasInit = true;
        document.getElementById("my-audio-player").volume = this.audioTagVolume;
        // document.getElementById("my-audio-player").playbackRate = 0.5;
        document.getElementById("my-audio-player").play();
        return;
      }
      if (this.audioCtx.state === "running") {
        document.getElementById("my-audio-player").pause();
        // document.getElementById("my-audio-player").volume = 0;

        this.audioCtx.suspend().then(function () {});
      } else if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume().then(function () {});
        document.getElementById("my-audio-player").play();
        // document.getElementById("my-audio-player").volume = this.audioTagVolume;
      }
    },
    isObj(variable) {
      return (
        typeof variable === "object" &&
        !Array.isArray(variable) &&
        variable !== null
      );
    },
    load1(chosen) {
      console.log("load1:", chosen);
      if (this.isObj(chosen)) {
        console.log(chosen.path);
        this.currently1 = chosen.path;
        this.ambianceChannel1.volume.rampTo(
          this.ambianceVolume + chosen.volume,
          3
        );
      } else {
        this.currently1 = chosen;
        this.ambianceChannel1.volume.rampTo(this.ambianceVolume, 3);
      }
      this.ambianceChannel1.load(this.currently1);
    },
    load2(chosen) {
      console.log("load2:", chosen);
      if (this.isObj(chosen)) {
        this.currently2 = chosen.path;
        this.ambianceChannel2.volume.rampTo(
          this.ambianceVolume + chosen.volume,
          3
        );
      } else {
        this.currently2 = chosen;
        this.ambianceChannel2.volume.rampTo(this.ambianceVolume, 3);
      }
      this.ambianceChannel2.load(this.currently2);
    },
    hardFade1() {
      this.load1(
        this.BASE_URI + audioLibrary.realGrouped[this.audioCounter1].sample()
      );
      this.audioCounter1 += 1;
    },
    hardFade2() {
      this.load2(
        this.BASE_URI + audioLibrary.fakeGrouped[this.audioCounter2].sample()
      );
      this.audioCounter2 += 1;
    },
    doCrossFade() {
      // console.log("cross fade");
      const stepSize = this.kioskMode ? 0.1 : 0.05;
      if (
        this.crossFade.fade.value === 1.0 ||
        this.crossFade.fade.value <= 0.0
      ) {
        this.crossDirection = !this.crossDirection;
        if (this.crossFade.fade.value === 1.0) {
          const chosen =
            this.BASE_URI + audioLibrary.realGrouped.sample().sample();
          this.load1(chosen);
        } else {
          const chosen =
            this.BASE_URI + audioLibrary.fakeGrouped.sample().sample();
          this.load2(chosen);
        }
      }

      // crossFadeVal = 0, only currently1
      // crossFadeVal = 1, only currently2
      if (this.crossDirection) {
        const val = Math.min(
          parseFloat(this.crossFade.fade.value + stepSize),
          1
        );
        this.crossFade.fade.value = val;
        this.crossFadeVal = val.toFixed(1);
      } else {
        const val = Math.max(
          parseFloat(this.crossFade.fade.value - stepSize),
          0
        );
        this.crossFade.fade.value = val;
        this.crossFadeVal = val.toFixed(1);
      }
    },
  },
};
</script>
<style scoped>
@import "../assets/dzi-filterbar.css";
</style>
