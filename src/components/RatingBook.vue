<template>
  <div tabindex="-1" @keyup="keyListener">
    <!-- <img class="formats" src="/formats2.png" /> -->
    <div class="controls">
      <div class="controls-inner">
        <div class="filters">
          <div class="pills">
            <select required name="selectedModel" id="selectedModel" v-model="selectedModel">
              <option value="">All Models</option>
              <option v-for="model in availableModels" :key="model" :value="model">{{ model }}</option>
            </select>
            <select required name="selectedPrompt" id="selectedPrompt" v-model="selectedPrompt">
              <option value="">All Prompts</option>
              <option v-for="prompt in availablePrompts" :key="prompt" :value="prompt">
                {{ prompt }}
              </option>
            </select>
          </div>
        </div>
        <div class="center">
          <select required name="selectedInputCategory" id="selectedInputCategory" v-model="selectedInputCategory">
            <option value="">All Categories</option>
            <option v-for="input in availableCategories" :key="input" :value="input">
              {{ input }}
            </option>
          </select>
          <select required name="selectedInputImage" id="selectedInputImage" v-model="selectedInputImage">
            <option value="">All Input Images</option>
            <option v-for="input in inputImgs" :key="input" :value="input">{{ input }}</option>
          </select>

          <select required name="selectedRating" id="selectedRating" v-model="selectedRating">
            <option value="">All Ratings</option>
            <option value="rated">Rated</option>
            <option value="unrated">Unrated</option>
            <option v-for="n in 5" :key="n" :value="n">
              {{ n }}
            </option>
          </select>
          <select required name="selectedSorting" id="selectedSorting" v-model="selectedSorting">
            <option value="">Path</option>
            <option value="rating">rating</option>
            <option value="inputImage">inputImage</option>
            <option value="model">model</option>
            <option value="promptUsed">promptUsed</option>
          </select>
          <select required name="imgPerPage" id="imgPerPage" v-model="imgPerPage">
            <option value="32">32</option>
            <option value="64">64</option>
            <option value="128">128</option>
            <option value="256">256</option>
            <option value="512">512</option>
          </select>
          <button @click="showFried = !showFried">{{ showFried ? "Fried" : "PNG" }}</button>
          <button @click="show1pass = !show1pass">{{ show1pass ? "1pass" : "2pass" }}</button>
          <select required name="ipaFilter" id="ipaFilter" v-model="ipaFilter">
            <option value="all">all</option>
            <option value="ipa_only">ipa_only</option>
            <option value="no_ipa">no_ipa</option>
          </select>
        </div>
        <div class="cursor-label">${{ cursorPosition }} / {{ filteredImages.length }} | Page {{ currentPage }} / {{ Math.round(filteredImages.length / imgPerPage) }}</div>
      </div>
    </div>

    <!-- <div v-if="showBlacklist" class="main-sequence-container">
      <div class="fade-in-image chapter-bkg" v-for="(imgPath, idx) in blackList" :style="{ backgroundImage: 'url(' + imgPath + ')' }">
        <div class="action-bar"><span @click="reinstate(idx)" class="action">🟢</span></div>
      </div>
    </div> -->
    <div v-if="!showBlacklist" class="main-sequence-container">
      <!-- <div v-for="image in filteredImages.slice(cursorPosition, cursorPosition + imgPerPage)" :key="image.id" :class="{ selected: selectedImage?.id === image.id }"> -->
      <div v-for="image in filteredImages.slice((currentPage - 1) * imgPerPage, (currentPage - 1) * imgPerPage + imgPerPage)" :key="image.id" :class="{ selected: selectedImage?.id === image.id }">
        <!-- <div v-for="image in filteredImages" :key="image.id"> -->
        <ImageCard
          @click.shift="selectImage(image.id, true)"
          @click.native="selectImage(image.id)"
          :rating="image.rating"
          :image="image"
          @rate="rateImage"
          :showFried="showFried"
          :show1pass="show1pass" />
      </div>
    </div>
  </div>
</template>
<script>
import * as allImgs from "../pics.json";
// console.log(allImgs.default);
// NF-03-5--divineelegancemix*V9
//--911-00008-2x.jpg_prompt-makeup-mukbang_support_prompt-blue_MP-1_cfg-18_ss-15_seed-1000195145_cnet_d-0.9_cnet_c-0_00001
let MODELS_IN_SET = [];
let INPUT_IMGS_IN_SET = [];
let PROMPTS_IN_SET = [];
function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}
const parsedImgList = allImgs.default.map((imgPath) => {
  const srcFried = imgPath.replace("/Users/jbe/Dropbox/stabdiff-ui-v2/comfyui-outs/_NF/", "");
  imgPath = imgPath.replace("/Users/jbe/Dropbox/stabdiff-ui-v2/comfyui-outs/_NF/", "").replace("/fried/", "/2pass/");
  imgPath = imgPath.split("-fried_")[0] + "_00001_.png";

  const model = imgPath.split("--")[1];
  let inputImage;
  let promptUsed;
  let category;
  if (imgPath.includes("avatar1") || imgPath.includes("avatar2")) {
    category = "ava";
    const fna = imgPath.split("/");
    const fn = fna[fna.length - 1];
    inputImage = fn.split("--")[2].split(".jpg")[0] + ".jpg";
    promptUsed = fn.split("--")[2].split(".jpg")[1].split("_")[1].replace("prompt-", "");
  } else {
    inputImage = imgPath.split("--")[2].split("_")[0];
    promptUsed = imgPath.split("--")[2].split("_")[1].replace("prompt-", "");
  }

  if (imgPath.includes("911")) {
    category = "911";
  }
  if (imgPath.includes("jetee")) {
    category = "jetee";
  }
  if (imgPath.includes("trackers")) {
    category = "trackers";
  }

  MODELS_IN_SET.push(model);
  INPUT_IMGS_IN_SET.push(inputImage);
  PROMPTS_IN_SET.push(promptUsed);
  return {
    id: imgPath,
    src: imgPath,
    src1pass: imgPath.replace("/2pass/", "/1pass/").replace("_00001_.png", "-1x_00001_.png"),
    srcFried,
    model,
    category,
    isIpa: imgPath.includes("_ipa"),
    inputImage,
    promptUsed,
    rating: null,
    // blackList: false,
    // starList: false,
    // variants: 8,
  };
});

const AVAILABLE_MODELS = MODELS_IN_SET.filter(onlyUnique);
const AVAILABLE_INPUT_IMGS = INPUT_IMGS_IN_SET.filter(onlyUnique);
const AVAILABLE_PROMPTS = PROMPTS_IN_SET.filter(onlyUnique);
console.log(AVAILABLE_MODELS, AVAILABLE_INPUT_IMGS, AVAILABLE_PROMPTS);

export default {
  components: {
    ImageCard: () => import("./ImageCard.vue"),
  },
  data() {
    return {
      showFried: true,
      show1pass: false,
      ipaFilter: "all",
      debug: true,
      batch: parsedImgList,
      cursorPosition: 0,
      selectedImage: null,
      imgPerPage: 512,
      currentPage: 1,
      showBlacklist: false,
      isLoading: false,
      selectedSorting: "",
      selectedRating: "",
      selectedModel: "",
      selectedInputImage: "",
      selectedPrompt: "",
      selectedInputCategory: "",
      availableModels: AVAILABLE_MODELS,
      availableInputs: AVAILABLE_INPUT_IMGS,
      availablePrompts: AVAILABLE_PROMPTS,
      availableCategories: ["ava", "911", "jetee", "trackers"],
    };
  },
  computed: {
    inputImgs() {
      if (this.selectedInputCategory !== "") {
        return this.availableInputs.filter((input) => input.includes(this.selectedInputCategory));
      }
      return this.availableInputs;
    },
    filteredImages() {
      let images = this.batch;

      if (this.selectedSorting !== "") {
        images = this.batch.sort((a, b) => (a[selectedSorting] > b[selectedSorting] ? -1 : 1));
      }

      if (this.ipaFilter === "ipa_only") {
        images = images.filter((image) => image.isIpa);
      }

      if (this.ipaFilter === "no_ipa") {
        images = images.filter((image) => !image.isIpa);
      }

      if (this.selectedRating !== "") {
        if (this.selectedRating === "rated") {
          images = this.batch.filter((image) => image.rating !== null);
        } else if (this.selectedRating === "unrated") {
          images = this.batch.filter((image) => image.rating == null);
        } else {
          images = this.batch.filter((image) => image.rating == this.selectedRating);
        }
      }
      if (this.selectedInputCategory !== "") {
        images = images.filter((image) => image.inputImage.includes(this.selectedInputCategory));
      }
      if (this.selectedModel !== "") {
        images = images.filter((image) => image.model == this.selectedModel);
      }
      if (this.selectedInputImage !== "") {
        images = images.filter((image) => image.inputImage == this.selectedInputImage);
      }
      if (this.selectedPrompt !== "") {
        images = images.filter((image) => image.promptUsed == this.selectedPrompt);
      }
      // console.log("sort", images[0].src);

      // if (this.selectedSorting !== "") {
      //   // return this.batch.sort((a, b) => (a.model > b.model ? -1 : 1));
      //   return images.sort((a, b) => a.model - b.model);
      //   return images.sort((a, b) => {
      //     // console.log(a.inputImage, this.selectedSorting, a[this.selectedSorting]);
      //     // console.log(a.model, this.selectedSorting, a[this.selectedSorting]);

      //     if (a[this.selectedSorting] < b[this.selectedSorting]) {
      //       return -1;
      //     }
      //     if (a[this.selectedSorting] > b[this.selectedSorting]) {
      //       return 1;
      //     }
      //     return 0;
      //   });
      // }
      // console.log("sort", images[0].src);

      return images;
    },
  },
  methods: {
    // rate(stars, cardIdx) {
    //   console.log("rating:", stars, this.table_top[cardIdx].imgPath);
    //   this.table_top[cardIdx].stars = stars;
    //   this.rated.push(this.table_top[cardIdx]);
    //   this.hotSwapCard(cardIdx);
    //   this.exportRated();
    // },
    rateImage(id, rating) {
      const image = this.batch.find((img) => img.id === id);
      if (image) {
        image.rating = rating;
        const isSelectedImg = (img) => img.id === id;
        const idx = this.batch.findIndex(isSelectedImg);
        this.batch.splice(idx, 1, image);
        localStorage.setItem("imageRatings", JSON.stringify(this.batch.filter((image) => image.rating !== null)));
        // reread batches from localstorage?
        // or splice in new rating
      }
    },
    selectImage(id, shiftClick = false) {
      if (shiftClick) {
        this.selectedImage = this.batch.find((img) => img.id === id);
      }
      this.selectedImage = this.batch.find((img) => img.id === id);
    },
    keyListener(e) {
      console.log("keyListener", e);
      if (e.key === "1") {
        this.rateImage(this.selectedImage.id, 1);
        return;
      } else if (e.key === "2") {
        this.rateImage(this.selectedImage.id, 2);
        return;
      } else if (e.key === "3") {
        this.rateImage(this.selectedImage.id, 3);
        return;
      } else if (e.key === "4") {
        this.rateImage(this.selectedImage.id, 4);
        return;
      } else if (e.key === "5") {
        this.rateImage(this.selectedImage.id, 5);
        return;
      } else if (e.key === "ArrowLeft") {
        this.moveCursor(0, -1);
        return;
      } else if (e.key === "ArrowRight") {
        this.moveCursor(0, 1);
        return;
      } else if (e.key === "f") {
        this.superStarCard(0);
        return;
      } else if (e.key === "b") {
        this.blackListCard(0);
        return;
      }
    },
    toggleControls() {
      console.log("toggleControls");
      this.showControls = !this.showControls;
    },
    moveCursor(cardIdx, direction) {
      console.log("moveCursor", cardIdx, direction);
      const image = new window.Image();
      this.currentPage += direction;
      this.cursorPosition = (this.currentPage - 1) * this.imgPerPage;

      // const chapterCard = this.batch[this.cursorPosition];

      // this.isLoading = true;
      // image.src = chapterCard.imgPath;
      // image.onload = () => {
      //   this.isLoading = false;
      //   this.table_top.splice(cardIdx, 1, chapterCard);
      // };
    },
    hotSwapCard(cardIdx, chapterCard, doubleClick) {
      this.table_top.splice(cardIdx, 1, chapterCard);
    },
    blackListCard(cardIdx) {
      console.log("blackListCard:", cardIdx);
      this.blackList.push(this.table_top[cardIdx].imgPath);
      this.exportBlackList();
    },
    superStarCard(cardIdx) {
      console.log("superStarCard:", cardIdx);
      this.superList.push(this.table_top[cardIdx].imgPath);
      this.exportSuperList();
    },
    reinstate(cardIdx) {
      console.log("reinstate:", cardIdx);
      this.blackList.splice(cardIdx, 1);
    },
    newCard() {
      this.table_top.push(this.batch.sample());
    },
    seed() {
      this.table_top.push(this.batch[this.cursorPosition]);
      this.table_top.push(this.batch[this.cursorPosition + 1]);
      this.table_top.push(this.batch[this.cursorPosition + 2]);
      this.table_top.push(this.batch[this.cursorPosition + 3]);
    },
    exportBlackList() {
      const s = JSON.stringify(this.blackList);
      console.log("exportBlackList:", s);
      localStorage.setItem("blackList", s);
    },
    exportSuperList() {
      const s = JSON.stringify(this.superList);
      console.log("exportSuperList:", s);
      localStorage.setItem("superList", s);
    },
    exportRated() {
      const s = JSON.stringify(this.rated);
      // console.log("exportRated:", s);
      localStorage.setItem("rated", s);
    },
    randomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    },
    randomFloat(min, max) {
      const r = Math.random() * (max - min) + min;
      return r;
    },
  },
  created() {
    // this.superList = JSON.parse(localStorage.getItem("superList") || "[]");
    // this.blackList = JSON.parse(localStorage.getItem("blackList") || "[]");
    // this.rated = JSON.parse(localStorage.getItem("rated") || "[]");
    const ratedImages = JSON.parse(localStorage.getItem("imageRatings") || "[]");
    console.log("loaded rated:", ratedImages.length);
    console.log("loaded rated:", ratedImages[0]);

    // console.log(this.blackList.length);
    // console.log(this.blackList[0]);
    // console.log(this.batch[0]);

    // console.log("before blacklist", this.batch.length);
    // this.batch = this.batch.filter((x) => !this.blackList.includes(x));
    // console.log("after blacklist", this.batch.length);

    // after filtering?
    this.batch = this.batch.map((img) => {
      const ratedImage = ratedImages.find((i) => i.id === img.id);
      img.rating = ratedImage?.rating || null;
      return img;
    });
    console.log("after rated", this.batch.filter((x) => x.rating !== null).length);
    // this.previouslyRated = this.batch.filter((x) => x.stars !== null).length;
    // this.batch = this.batch.filter((x) => x.stars === null);
    // this.seed();
  },
};
</script>

<style scoped>
.action-bar {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 0.5rem;
  z-index: 10000;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0.5rem;
}

.action {
  padding: 0.5rem;
  cursor: pointer;
}

.action:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

html,
body {
  margin: 0;
  padding: 0;
  /* overflow-x: hidden; */
  background-color: white;
}

.formats {
  display: none;
  position: fixed;
  z-index: 3000;
  bottom: 0.5rem;
  right: 2rem;
  width: 15vw;
}

.tick-info {
  position: fixed;
  z-index: 3000;
  bottom: 0.5rem;
  right: 2rem;
  font-size: 1.5rem;
  text-shadow: 0px 0px 3px rgb(0, 0, 0);
}

.controls {
  position: fixed;
  top: 0;
  right: 0px;
  z-index: 3000;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
}

.controls-inner {
  height: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
}
.cursor-label {
  margin-left: 1rem;
}
.main-sequence-container {
  width: 100%;
  /* height: 100vh; */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-x: hidden;
  justify-content: center;
  background-color: black;
  /* background-color: #0f0; */
  margin-top: 2rem;
}
.sequences-container {
  width: 100vw;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-x: hidden;
  justify-content: center;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.chapter-bkg {
  width: 50vw;
  height: 50vh;
  position: relative;
  cursor: pointer;
  /* opacity: 0; */
  /* pointer-events: none; */
  /* position: fixed;
  top: 0;
  left: 0; */
}

.btn {
  cursor: pointer;
  text-decoration: underline;
}

.isLoading {
  opacity: 0.75;
  background-color: #0f0;
}
</style>
