<template>
  <div id="subs-container">
    <div
      id="subs-text"
      :class="{
        fried: subsStyle === 'fried',
        plain: subsStyle === 'plain',
        png: subsStyle === 'png',
        papyrus: subsStyle === 'papyrus',
      }">
      <div id="typewriter"></div>
      <span>{{ subtitles }}</span>
    </div>
    <audio
      id="my-audio-player"
      loop
      :src="currentAudioFile"
      crossorigin="anonymous">
      <track
        id="captions"
        kind="captions"
        :src="currentVttFile"
        srclang="en"
        label="English"
        default />
    </audio>
    <Chat
      @click.native="showChat = !showChat"
      :class="{ active: showChat }"
      :ticks="cueTicks"
      :storyTicks="cueTicks" />
  </div>
</template>

<script>
import { stories } from "../data/narration.js";
import Chat from "./Chat.vue";
import { zalgofy } from "../zalgo.js";

const BASE_PATH = "https://jpeg.matrix.surf/audio/narration/";

const availableSubs = stories.map((story) => [
  BASE_PATH + story,
  BASE_PATH + story.replace(".mp3", ".vtt"),
]);

Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};

const init = availableSubs.sample();
const PLAYER_ID = "my-audio-player";
const GLOBAL_OFFSET = 0;

export default {
  name: "SubsPlayer",
  props: {
    currentText: { type: String, default: "" },
    subsStyle: { type: String, default: "fried" },
  },
  components: {
    Chat,
  },
  data() {
    return {
      subtitles: "",
      currentAudioFile: init[0].replace(".mp3", "-br8-sr16000.mp3"),
      currentVttFile: init[1],
      currentSubs: [],
      availableSubs,
      cueTicks: 0,
      showChat: false,
    };
  },
  methods: {
    scrobbleStory() {
      console.log("scrobble");
      const nextSub = this.currentSubs[this.cueTicks + 1];
      // this.cueTicks += 1;
      this.scrobble(nextSub.startTime);
    },
    scrobble(position_in_seconds) {
      document.getElementById(PLAYER_ID).currentTime = position_in_seconds;
    },
  },
  mounted() {
    // have gradually speed up
    // document.getElementById("my-audio-player").playbackRate = 2;
    document.getElementById(PLAYER_ID).volume = 0.5;

    document.getElementById("captions").addEventListener("load", (event) => {
      console.log("captions loaded: ", event);
      const track = event.target.track;
      if (this.currentSubs.length === 0) {
        for (let i = 0; i < track.cues.length; i++) {
          const cue = track.cues[i];
          cue.startTime -= GLOBAL_OFFSET || 0;
          cue.endTime -= GLOBAL_OFFSET || 0;
          this.currentSubs.push(cue);
        }
      }
    });

    document
      .getElementById(PLAYER_ID)
      .textTracks[0].addEventListener("cuechange", (event) => {
        if (event.target.activeCues.length > 0) {
          const srtText = event.target.activeCues[0].text;
          // console.log("cuechange: ", event.target.activeCues[0].text);
          // this.subtitles = srtText;
          let maxUp = [8, 4, 2, 0].sample();
          let maxMid = [4, 2, 1, 0].sample();
          let maxDown = [8, 4, 2, 0].sample();
          //
          this.subtitles = [true, false].sample()
            ? zalgofy(srtText, maxUp, maxMid, maxDown)
            : srtText;
          this.cueTicks += 1;
          this.$emit("story-tick");
        }
        // @todo roll new if at end
        // this.currentAudioFile = this.availableSubs.sample()[0];
        // this.currentVttFile = this.currentAudioFile.replace(".mp3", ".vtt");
      });
  },
};
</script>

<style scoped>
@import "../assets/dzi-scroller-subs.css";
</style>
