<template>
  <div id="log" ref="chatWindow">
    <transition-group name="list" tag="p"
      ><div
        v-for="(message, idx) in messages"
        v-bind:key="`${message}-${idx}`"
        class="list-item">
        {{ message }}
      </div></transition-group
    >
  </div>
</template>

<script>
// import { chatLogs } from "../data/chatLog.js";
import { moreLogs } from "../data/chatLog2.js";
import { zalgofy } from "../zalgo.js";

export default {
  props: {
    ticks: Number,
    storyTicks: Number,
  },
  data() {
    return {
      messages: [],
      chatLogs: moreLogs,
      allMessages: [],
    };
  },
  mounted() {
    this.allMessages = moreLogs
      .map((log) => log.split("\n").filter((line) => line.trim() !== ""))
      .flat();
  },
  watch: {
    ticks() {
      const chat = this.allMessages[this.ticks % this.allMessages.length];

      let maxUp = [8, 4, 2, 0].sample();
      let maxMid = [4, 2, 1, 0].sample();
      let maxDown = [8, 4, 2, 0].sample();
      // zalgofy(chat, maxUp, maxMid, maxDown)
      this.messages.push(chat);
      // console.log(chat);

      this.$nextTick(() => {
        this.$refs.chatWindow.scrollTop = this.$refs.chatWindow.scrollHeight;
      });
    },
  },
};
</script>

<style scoped>
@import "../assets/chat-log.css";

#log {
  position: fixed;
  top: 8vh;
  right: -30vw;
  width: 40vw;
  height: 72vh;
  overflow-y: scroll;
  mix-blend-mode: difference;
  font-size: 1rem;
  /* padding-bottom: 7vh; */
  text-align: left;
  padding-right: 2vw;
  padding-bottom: 20vh;
  padding-top: 1rem;
  text-shadow: 0 0 2px white;
  font-family: Arial, Helvetica, sans-serif;
  font-family: Times, Helvetica, sans-serif;
  color: white;
  transition: right 100ms ease-out;
  cursor: pointer;
  display: none;
}

#log.active {
  right: 0;
}

#log > div {
  padding-bottom: 1rem;
}

@media (orientation: portrait) {
  #log {
    font-size: 0.75rem;
    width: 50vw;
  }
  #log > div {
    margin: 0.5rem;
  }
}

.list-item {
  display: inline-block;
  margin-right: 0.25rem;
  margin-bottom: 0.5rem;
}

.list-enter-active,
.list-leave-active {
  transition: all 250ms;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
