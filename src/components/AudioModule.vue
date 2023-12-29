<template>
  <div class="btn btn-full btn-audio" v-bind:class="{ active: isPlaying }" @click="toggleAudio()"><span v-if="!isPlaying">mute</span><span v-else>unmute</span></div>
</template>

<script>
// import VolumeMuteIcon from 'vue-material-design-icons/VolumeMute.vue'
// import VolumeHighIcon from 'vue-material-design-icons/VolumeHigh.vue'

import * as Tone from "tone";
export const random = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};
const INITIAL_FREQ = 5;
export default {
  name: "AudioModule",
  // components: {
  //   VolumeHighIcon,
  //   VolumeMuteIcon,
  // },
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

      volume: -6,

      noiseVolume: -14,
      noiseMin: -17,
      noiseMax: -10,
      noiseRampTime: 15,

      audioCtx: undefined,
      noiseMaker: undefined,
    };
  },
  methods: {
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
    initAudio() {
      console.log("initAudio");

      const context = new Tone.Context();
      Tone.setContext(context);
      this.audioCtx = context.rawContext;

      // this.noiseMaker = new Tone.Noise('brown').toDestination()
      this.noiseMaker = new Tone.Noise("brown"); // .start()
      // this.noiseMaker = new Tone.Noise('pink').toDestination()

      const autoFilter = new Tone.AutoFilter({
        frequency: 0.01,
        baseFrequency: 200,
        octaves: 3,
      }).toDestination();

      this.noiseMaker.connect(autoFilter);
      autoFilter.start();
      this.noiseMaker.volume.value = this.noiseVolume;

      // this.setVolume();
      // this.setFrequencies();

      this.noiseMaker.start();
    },
  },
};
</script>
<style scoped>
.audio-container {
  z-index: 10001;
  position: relative;
}
.button-play {
  position: relative;
}

.button-play:before {
  content: "";
  position: absolute;
  width: 35px;
  height: 35px;
  background: black;
  opacity: 0.25;
  right: -6px;
  top: -7px;
}

.button-play:after {
  display: block;
  position: absolute;
  content: "";
  right: 0;
  width: 0;
  height: 0;
  border: 20px solid transparent;
  border-width: 10px 0px 10px 18px;
  border-radius: 0;
  border-left-color: white;
}

.v-controls {
  top: 0;
  right: 0;
  position: absolute;
  z-index: 1000;
  cursor: pointer;
}

.rec {
  top: 1.2rem;
  left: 5%;
  font-family: "Roboto", "Arial", sans-serif;

  z-index: 1000;
  background-color: rgb(108, 254, 108);
  box-shadow: 0 0 9px rgb(108, 254, 108);
  justify-content: center;
  align-items: center;
}

@media (orientation: landscape) {
  .rec {
    left: 1rem;
  }
}

.rec.active {
  background-color: red;
  box-shadow: 0 0 9px rgb(254, 108, 108);
}

.main-play {
  z-index: 1000;
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.v-controls.active {
  transform: scale(1);
  /* animation: pulse 2s infinite; */
  /* background: red; */
}
.customFade-enter-active,
.customFade-leave-active {
  transition: all 250ms cubic-bezier(1, 0.5, 0.8, 1);
  /*transition: opacity 5s;*/
}

.customFade-enter,
.customFade-leave-to {
  opacity: 0;
  /* transform: scale(1.05); */
}

.vol-controls {
  position: fixed;
  width: 100vw;
  bottom: 0;
  left: 0;
}

@keyframes pulse {
  0% {
    transform: scale(0.85);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }

  100% {
    transform: scale(0.85);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

.blink {
  animation: blink-animation 1s steps(5, start) infinite;
}
@keyframes blink-animation {
  to {
    visibility: hidden;
  }
}
@-webkit-keyframes blink-animation {
  to {
    visibility: hidden;
  }
}

.close {
  position: absolute;
}
.close:hover {
  opacity: 1;
}
.close:before,
.close:after {
  position: absolute;
  left: 15px;
  content: " ";
  height: 33px;
  width: 4px;
  background-color: #fff;
}
.close:before {
  transform: rotate(45deg);
}
.close:after {
  transform: rotate(-45deg);
}

.audio-debug {
  position: fixed;
  bottom: 10px;
  right: 40px;
  z-index: 5000;
}
</style>
