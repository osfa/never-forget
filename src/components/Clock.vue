<template>
  <div class="clock-container font-weight-light">
    <div v-if="isUnixTime" class="clock-inner">
      <div class="hour text-white">{{ unix }}</div>
    </div>
    <div v-else class="clock-inner">
      <div class="date">9/11 2022</div>
      <div class="hour">{{ hours }}</div>
      <div class="dots">:</div>
      <div class="min">{{ minutes }}</div>
      <div class="dots">:</div>
      <div class="secs">{{ seconds }}</div>
      <div class="mode"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClockComponent",
  props: {
    isUnixTime: { type: Boolean, default: false },
    offset: { type: Number, default: 0 },
  },
  data() {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      unix: "-",
    };
  },
  mounted() {
    this.setTime();
  },
  methods: {
    setTime() {
      setInterval(() => {
        const date = new Date();
        this.unix = Math.round(date.getTime() / 100);
        this.hours = date.getHours();
        this.minutes = this.checkSingleDigit(date.getMinutes());
        this.seconds = this.checkSingleDigit(date.getSeconds());
      }, 1000);
    },
    checkSingleDigit(digit) {
      return ("0" + digit).slice(-2);
    },
  },
  created() {
    console.log("created");
    this.setTime();
  },
};
</script>

<style scoped>
.clock-container {
  display: flex;
  justify-content: center;
  align-items: center;
  align-items: flex-start;

  margin: auto;
  flex-direction: column;

  z-index: 10;
  font-family: "Roboto";
  pointer-events: none;
  background-color: transparent;

  /* width: 100vw; */
  height: 100vh;
  font-size: 5rem;
  font-size: 0.75rem;
  color: white;

  position: absolute;
  font-family: monospace;

  width: 100vw;
  height: auto;
  z-index: 10000;
  top: 0;
  left: 0;

  text-shadow: 0px 0px 3px rgb(0, 0, 0);
}

.clock-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding: 0.75rem 1.5rem;
  background-color: rgba(0, 0, 0, 0.25);
}

.dots {
  margin: 0 5px;
}
.date {
  margin-right: 16px;
}

@media (orientation: landscape) {
  .clock-container {
    letter-spacing: 0.25rem;
  }
}
</style>
