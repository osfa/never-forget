<template>
  <div id="log">
    <div v-for="message in messages">{{ message }}</div>
  </div>
</template>

<script>
export default {
  props: {
    idx: String,
    imgPath: String,
  },
  data() {
    return {
      messages: ["hej", "hej", "hej"],
    };
  },
};
</script>

<style scoped>
@import "../assets/chat-log.css";
#log {
  position: fixed;
  top: 10vh;
  left: 3rem;
}
</style>
