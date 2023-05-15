<template>
  <div class="clock-container font-weight-light">
    <div>28/04/2022</div>
    <div class="text-red">59.3303°, 18.0634°</div>
    <div v-if="isUnixTime" class="clock-inner">
      <div class="hour text-white">{{ unix }}</div>
    </div>
    <div v-else class="clock-inner">
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
  name: 'ClockComponent',
  props: {
    isUnixTime: { type: Boolean, default: true },
  },
  data() {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      unix: '-',
    }
  },
  mounted() {
    this.setTime()
  },
  methods: {
    setTime() {
      setInterval(() => {
        const date = new Date()
        this.unix = Math.round(date.getTime() / 100)
        this.hours = date.getHours()
        this.minutes = this.checkSingleDigit(date.getMinutes())
        this.seconds = this.checkSingleDigit(date.getSeconds())
      }, 100)
    },
    checkSingleDigit(digit) {
      return ('0' + digit).slice(-2)
    },
  },
}
</script>

<style scoped>
.clock-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  flex-direction: column;
  z-index: 10;
  font-family: 'Roboto';
  pointer-events: none;
  background-color: lightblue;
  width: 100vw;
  height: 100vh;
  font-size: 5rem;
  color: white;
}

.clock-container.full {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  flex-direction: column;
  z-index: 10;
  font-family: 'Roboto';
  color: white;
  pointer-events: none;
}

.clock-container-fixed {
  position: fixed;
  bottom: 68px;
  right: 20px;
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
