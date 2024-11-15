<template>
  <div id="subs-container">
    <div id="subs-text" :class="{ fried: plateFried }">
      <div id="typewriter"></div>
      <span>{{ subtitles }}</span>
    </div>
    <audio
      id="my-audio-player"
      loop
      src="https://jpeg.matrix.surf/audio/narration/bush-bad-video-streaming-66-amount.mp3">
      <track
        kind="captions"
        src="/audio/narration/bush.vtt"
        srclang="en"
        label="English"
        default />
    </audio>
  </div>
</template>

<script>
export default {
  name: "SubsPlayer",
  props: {
    currentText: { type: String, default: "" },
  },
  data() {
    return {
      subtitles: "",
      currentSubs: [],
      cueTicks: 0,
      plateFried: false,
    };
  },
  methods: {
    moveStory() {
      console.log("SubsPlayer moveStory");
      const nextSub = this.currentSubs[this.cueTicks + 1];
      // this.cueTicks += 1;
      this.scrobble(nextSub.startTime);
    },
  },
  mounted() {
    // have gradually speed up
    // document.getElementById("my-audio-player").playbackRate = 2;
    document
      .getElementById("my-audio-player")
      .textTracks[0].addEventListener("cuechange", (event) => {
        if (this.currentSubs.length === 0) {
          for (let i = 0; i < event.target.cues.length; i++) {
            const cue = event.target.cues[i];
            this.currentSubs.push(cue);
          }
        }

        if (event.target.activeCues.length > 0) {
          const srtText = event.target.activeCues[0].text;
          console.log("cuechange: ", event.target.activeCues[0].text);
          this.subtitles = srtText;
          this.cueTicks += 1;
          this.$emit("story-tick");
        }
      });
  },
};
</script>

<style scoped>
@import "../assets/dzi-scroller-subs.css";
</style>
