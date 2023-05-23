<template>
  <div class="clock-container text-sm md:text-lg font-weight-light">
    <div v-if="isUnixTime" class="clock-inner">
      <div class="hour text-white">{{ unix }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClockComponent",
  props: {
    isUnixTime: { type: Boolean, default: true },
    offset: { type: Number, default: 0 },
  },
  data() {
    return {
      unix: "-",
    };
  },
  mounted() {
    this.setTime();
  },
  methods: {
    setTime() {
      setInterval(() => {
        this.unix = Math.round(new Date().getTime() / 100) + this.offset;
      }, 100);
    },
  },
};
</script>

<style scoped>
.clock-container {
  /* background-color: rgba(00, 00, 00, 0.25); */
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  flex-direction: column;
  font-family: "Roboto", "Arial", sans-serif;
  font-family: "Papyrus", "Roboto", "Arial", sans-serif;
  font-family: monospace;
  /* pointer-events: none; */

  font-size: 1rem;
  /* font-weight: bold; */
  /* font-size: 1rem; */
  letter-spacing: 0.4rem;

  color: white;
  /* color: ; */
  position: absolute;

  width: 100vw;
  height: auto;
  z-index: 10000;

  /* padding: 1rem 0; */
  top: 0;
  left: 0;

  /* background-color: transparent; */
  /* kiosk */
  text-shadow: 0 0 9px rgb(255, 255, 0);

  /* non-kiosk */
  text-shadow: 0px 0px 3px rgb(0, 0, 0);
}
.clock-inner {
  /* background-color: rgba(00, 00, 00, 0.25); */
  padding: 0.75rem 1.5rem;
}

@media (orientation: landscape) {
  .clock-container {
    letter-spacing: 0.7rem;
  }
}
/* .hour,
.min,
.secs,
.dots {
  font-size: 14.5px;
} */

.clock-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.text-red {
  color: red;
}
</style>
