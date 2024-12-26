<template>
  <div>
    <button
      @click="toggleModal"
      :class="{ 'info-button': true, active: showModal }">
      i
    </button>
    <transition name="fade">
      <div v-if="showModal" class="modal">
        <div class="modal-content" @click="toggleModal">
          <!-- <span class="close" @click="toggleModal">&times;</span> -->
          <p>
            POV: You are a statistical render and the subject of a
            groundbreaking time-travel experiment designed to uncover the key to
            humanity's survival in the aftermath of 9/11. Flung back and forth
            through fractured timelines and dream hacks, you find yourself drawn
            repeatedly to pivotal moments that might hold the solution to
            restoring a devastated world.
          </p>
          <p>
            The experiment anchors you to a recurring location: an airport’s
            viewing pier, where fragmented memories, fleeting interactions, and
            hauntingly familiar faces create a surreal tapestry of the past.
            Each visit is different, yet eerily the same — a loop of events
            where the details shift, but the stakes remain high.
          </p>
          <p>
            Your task is to piece together the truth by observe with objects,
            characters, and events scattered across the timelines. Each decision
            you make alters the flow of time, potentially closing off certain
            paths while revealing others. Be careful: the more you tamper with
            time, the more unstable the experiment becomes, and the line between
            memory and reality begins to blur.
          </p>
          <p>
            Explore, observe, and uncover the hidden threads that connect the
            past to the pre-apocalyptic present. Will you solve the mystery and
            save humanity, or will you become lost in the infinite loops of
            reminiscence?
          </p>
          <!-- <p>Loosely based on Chris Markers <i>"La Jeteé"</i> (1963)</p> -->
          <p><a href="terminal.txt">jetee.txt</a></p>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div id="social-media-bar" class="model-section" v-if="showModal">
        <a
          href="https://www.youtube.com/@NeverForgetNow"
          target="_blank"
          class="btn-layer btn-platform youtube"
          ><img src="/img/icons/yt.svg"
        /></a>
        <a
          href="https://www.tiktok.com/@neverforgetnow"
          target="_blank"
          class="btn-layer btn-platform tiktok"
          ><img src="/img/icons/tiktok.svg"
        /></a>
        <a
          href="https://www.instagram.com/neverforget.pics"
          target="_blank"
          class="btn-layer btn-platform instagram"
          ><img src="/img/icons/insta.svg"
        /></a>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    toggleModal() {
      this.showModal = !this.showModal;
    },
  },
};
</script>

<style scoped>
@import "../assets/dzi-socialmediabar.css";

.info-button {
  position: fixed;
  top: 8vh;
  right: 0;
  z-index: 10002;
  background: rgba(255, 255, 255, 0.6);
  border: none;
  width: 5rem;
  height: 5rem;
  color: black;
  cursor: pointer;
  font-size: 2rem;
  text-shadow: #000 0 0 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Papyrus, fantasy;
}

.info-button.active {
  background: rgba(255, 255, 255, 0.9);
}

::selection {
  background-color: yellow;
  color: black;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 10001;
  color: #ff0;
  font-family: Papyrus, fantasy;
}

.modal-content {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;

  width: calc(100% - 10vw);
  height: calc(100vh - 4rem);

  margin-left: 10vw;
  margin-right: 5rem;

  position: relative;
  overflow-y: auto;
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  cursor: pointer;
}

p {
  max-width: 960px;
}

.modal-content a {
  font-size: 2rem;
}

@media (orientation: portrait) {
  .modal {
    overflow-y: scroll;
  }
  .modal-content {
    height: calc(95% - 2rem);
    margin: 0;
    font-size: 1rem;
    width: calc(100% - 5rem);
    padding-top: 5%;
    padding-right: 4.5rem;
    overflow-y: scroll;
    justify-content: flex-start;
    padding-bottom: 4rem;
  }
  .info-button {
    width: 3rem;
    font-size: 1rem;
    top: 10vh;
    height: 10vh;
  }
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
