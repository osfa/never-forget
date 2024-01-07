<template>
  <div tabindex="-1" @keyup="keyListener">
    <WeightingBar :available-categories="availableCategories" />
    <div v-show="showControls" class="controls">
      <div class="controls-inner">
        <div class="left">
          <div class="pills">
            <!-- <div @click="setSortOrder('model')" class="label" :class="{ active: selectedSorting === 'model' }">Model</div> -->
            <select
              @click.shift="setSortOrder('model')"
              required
              name="selectedModel"
              id="selectedModel"
              v-model="selectedModel"
              :class="{ active: selectedSorting === 'model' }"
              :style="{ backgroundColor: MODEL_META_MAP[selectedModel]?.hexColor }">
              <option value="">All Models</option>
              <option v-for="model in availableModels" :key="model" :value="model">{{ MODEL_META_MAP[model].friendlyName }}</option>
            </select>
            <!-- <div @click="setSortOrder('promptUsed')" class="label" :class="{ active: selectedSorting === 'promptUsed' }">Prompt</div> -->
            <select required name="selectedPrompt" id="selectedPrompt" v-model="selectedPrompt" :style="{ backgroundColor: PROMPT_MAP[selectedPrompt]?.hexColor }">
              <option value="">All Prompts</option>
              <option v-for="prompt in availablePrompts" :key="prompt" :value="prompt">
                {{ prompt }}
              </option>
            </select>
          </div>
        </div>
        <div class="center">
          <!-- <div @click="setSortOrder('category')" class="label" :class="{ active: selectedSorting === 'category' }">Category</div> -->
          <select required name="selectedInputCategory" id="selectedInputCategory" v-model="selectedInputCategory" :style="{ backgroundColor: CATEGORY_MAP[selectedInputCategory]?.hexColor }">
            >
            <option value="">All Categories</option>
            <option v-for="input in availableCategories" :key="input" :value="input">
              {{ input }}
            </option>
          </select>

          <!-- <div @click="setSortOrder('inputImage')" class="label" :class="{ active: selectedSorting === 'inputImage' }">Input Img</div> -->
          <select required name="selectedInputImage" id="selectedInputImage" v-model="selectedInputImage">
            <option value="">All Input Images</option>
            <option v-for="input in inputImgs" :key="input" :value="input">{{ input }}</option>
          </select>

          <!-- <div @click="setSortOrder('rating')" class="label" :class="{ active: selectedSorting === 'rating' }">Rating</div> -->
          <select required name="selectedRating" id="selectedRating" v-model="selectedRating" :class="{ active: selectedSorting === 'rating' }">
            <option value="">All Ratings</option>
            <option value="rated">All Rated</option>
            <option value="unrated">All Unrated</option>
            <option value="good">>3</option>
            <option value="bad">{{ "=< 3" }}</option>
            <option v-for="n in 5" :key="n" :value="n">
              {{ n }}
            </option>
          </select>
        </div>
        <div>
          <button @click="sortDir = sortDir === -1 ? 1 : -1">{{ sortDir === -1 ? "sort down" : "sort up" }}</button>

          <select required name="selectedSort" id="selectedSort" v-model="selectedSorting">
            <option value="inputImage">Input Image</option>
            <option value="model">Model</option>
            <option value="prompt">Prompt</option>
            <option value="rating">Rating</option>
          </select>
          <select required name="imageQuality" id="imageQuality" v-model="imageQuality">
            <option value="1pass">1pass</option>
            <option value="2pass">2pass</option>
            <option value="fried">fried</option>
          </select>
          <select required name="ipaFilter" id="ipaFilter" v-model="ipaFilter">
            <option value="all">all</option>
            <option value="ipa_only">ipa_only</option>
            <option value="no_ipa">no_ipa</option>
          </select>
        </div>
      </div>
    </div>

    <div class="main-sequence-container">
      <div v-for="image in viewportImages" :key="image.id" :class="{ selected: selectedImages.includes(image) }">
        <div class="card-container">
          <div v-show="showMeta" class="right">
            <a href="#" class="triple card-action" @click="tripleSave(image)"></a>
            <a href="#" class="blacklist-triple card-action" @click="blackListAction(image, 'inputImage')"></a>
            <a href="#" class="blacklist-card card-action" @click="blackListAction(image, 'id')"></a>
          </div>
          <div v-show="showMeta" class="card-header">
            <div class="left">
              <div class="badge" @click="filterModel(image.model)" :style="{ backgroundColor: MODEL_META_MAP[image.model].hexColor }">{{ MODEL_META_MAP[image.model].friendlyName }}</div>
              <div class="badge" @click="filterPrompt(image.prompt)" :style="{ backgroundColor: PROMPT_MAP[image.prompt].hexColor }">{{ image.prompt }}</div>
              <div class="badge static">{{ image.supportPrompt }}</div>
              <div class="badge static">{{ image.cfg }} CFG : {{ image.ss }} SS</div>
              <div class="badge" @click="filterInput(image.inputImage)" :style="{ backgroundColor: CATEGORY_MAP[image.category]?.hexColor }">{{ image.inputImage }}</div>
            </div>
          </div>
          <div
            @dblclick="toggleLightBox(image)"
            @click.shift="selectImage(image.id, true)"
            @click.middle="selectImage(image.id, false, true)"
            @click.exact="selectImage(image.id)"
            :class="{ lightBoxed: lightBoxed?.id === image.id }">
            <ImageCard
              :rating="image.rating"
              :image="image"
              :image-display="imageCover ? 'cover' : 'contain'"
              @rate="rateImage"
              :showFried="imageQuality === 'fried'"
              :show1pass="imageQuality === '1pass'"
              :card-size="gridSize"
              :is-vertical="isVertical"
              :full-size="lightBoxed && lightBoxed.id === image.id" />
          </div>
        </div>
      </div>
    </div>
    <div class="triples-bar">
      <div @dblclick="tripleDelete(idx)" class="triple" v-for="(triple, idx) in includedTriples">
        <div class="badge first" :style="{ backgroundColor: PROMPT_MAP[triple.prompt]?.hexColor }">{{ triple.prompt }}</div>
        <div class="badge center" :style="{ backgroundColor: MODEL_META_MAP[triple.model].hexColor }">{{ MODEL_META_MAP[triple.model].friendlyName }}</div>
        <div class="badge last" :style="{ backgroundColor: CATEGORY_MAP[triple.category]?.hexColor }">{{ triple.category }}</div>
      </div>
    </div>
    <footer>
      <div class="grid-settings">
        <!-- <div @click="addStuff">SANEKSSS</div> -->
      </div>
      <div class="paging">
        <button v-if="currentPage > 1" @click="currentPage -= 1">Previous</button>
        <div class="cursor-label">${{ cursorPosition }} | Page {{ currentPage }} / {{ Math.ceil(filteredImages.length / imgPerPage) }} | {{ filteredImages.length }} images</div>
        <button v-if="currentPage * imgPerPage <= filteredImages.length && currentMode !== 'random'" @click="currentPage += 1">Next</button>
      </div>
      <div class="grid-settings">
        <select required name="gridSize" id="gridSize" v-model="gridSize">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <select required name="imgPerPage" id="imgPerPage" v-model="imgPerPage">
          <option value="32">32</option>
          <option value="64">64</option>
          <option value="128">128</option>
          <option value="256">256</option>
          <option value="512">512</option>
        </select>
        <select required name="currentMode" id="currentMode" v-model="currentMode">
          <option value="sequence">sequence</option>
          <option value="random">random</option>
          <option value="weighted">weighted</option>
          <option value="triples">triples</option>
          <option value="blacklist">blacklist</option>
        </select>
        <button @click="isVertical = !isVertical">{{ isVertical ? "portrait" : "landscape" }}</button>
        <button @click="showMeta = !showMeta">{{ showMeta ? "meta" : "no meta" }}</button>
        <button @click="imageCover = !imageCover">{{ imageCover ? "cover" : "contain" }}</button>
      </div>
    </footer>
  </div>
</template>
<script>
import * as allImgs from "../pics-v4.json";
import { CATEGORY_MAP, MODEL_META_MAP, PROMPT_MAP } from "../maps";

const DB_NAME = "never-forget";
const DB_VERSION = 3;

/* BREAK OUT */
let MODELS_IN_SET = [];
let INPUT_IMGS_IN_SET = [];
let PROMPTS_IN_SET = [];
function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}
const BASE_POOL = allImgs.default;
// BASE_POOL = BASE_POOL.slice(0, 2000);

const parsedImgList = BASE_POOL.map((imgPath) => {
  const srcFried = imgPath.replace("/Users/jbe/Dropbox/stabdiff-ui-v2/comfyui-outs/_NF/", "");
  imgPath = imgPath.replace("/Users/jbe/Dropbox/stabdiff-ui-v2/comfyui-outs/_NF/", "").replace("/fried/", "/2pass/");
  imgPath = imgPath.split("-fried_")[0] + "_00001_.png";

  const model = imgPath.split("--")[1];
  let inputImage;
  let prompt;
  let category = "?";
  const fna = imgPath.split("/");
  const fn = fna[fna.length - 1];
  const cfg = fn.split("_cfg-")[1].split("_")[0];
  const ss = fn.split("_ss-")[1].split("_")[0];
  const supportPrompt = fn.split("_support_prompt-")[1].split("_")[0];

  if (imgPath.includes("avatar1") || imgPath.includes("avatar2")) {
    category = "ava";
    inputImage = fn.split("--")[2].split(".jpg")[0] + ".jpg";
    prompt = fn.split("--")[2].split(".jpg")[1].split("_")[1].replace("prompt-", "");
  } else {
    inputImage = imgPath.split("--")[2].split("_")[0];
    prompt = imgPath.split("--")[2].split("_")[1].replace("prompt-", "");
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
  if (imgPath.includes("--bts")) {
    category = "bts";
  }
  if (imgPath.includes("--hack")) {
    category = "hack";
  }
  if (imgPath.includes("--wow")) {
    category = "wow";
  }
  if (imgPath.includes("cs-2x")) {
    category = "cs";
  }
  if (imgPath.includes("fortnite")) {
    category = "fortnite";
  }
  if (imgPath.includes("starcraft")) {
    category = "starcraft";
  }

  MODELS_IN_SET.push(model);
  INPUT_IMGS_IN_SET.push(inputImage);
  PROMPTS_IN_SET.push(prompt);
  return {
    fn,
    id: imgPath,
    src: imgPath,
    src1pass: imgPath.replace("/2pass/", "/1pass/").replace("_00001_.png", "-1x_00001_.png"),
    srcFried,
    model,
    category,
    supportPrompt,
    cfg,
    ss,
    isIpa: imgPath.includes("_ipa"),
    inputImage,
    prompt,
    rating: null,
  };
});

const AVAILABLE_MODELS = MODELS_IN_SET.filter(onlyUnique).sort();
const AVAILABLE_INPUT_IMGS = INPUT_IMGS_IN_SET.filter(onlyUnique).sort();
const AVAILABLE_PROMPTS = PROMPTS_IN_SET.filter(onlyUnique).sort();
console.log(AVAILABLE_MODELS, AVAILABLE_INPUT_IMGS, AVAILABLE_PROMPTS);

/* BREAK OUT */

export default {
  components: {
    ImageCard: () => import("./ImageCard.vue"),
    WeightingBar: () => import("./WeightingBar.vue"),
  },
  data() {
    return {
      db: null,
      imageCover: true,
      modelCursor: 0,
      promptCursor: 0,
      inputCursor: 0,
      showMeta: true,
      isVertical: false,
      currentMode: "sequence",
      gridSize: "3",
      lightBoxed: null,
      imageQuality: "fried",
      ipaFilter: "no_ipa",
      debug: true,
      batch: parsedImgList,
      cursorPosition: 0,
      selectedImages: [],
      viewportImages: [],
      filteredImages: [],
      blackList: [],
      ratedImages: [],
      includedTriples: [],
      currentPage: 1,
      imgPerPage: 128,
      isLoading: false,
      selectedSorting: "inputImage",
      selectedRating: "",
      selectedModel: "",
      selectedInputImage: "",
      selectedPrompt: "",
      selectedInputCategory: "",
      availableModels: AVAILABLE_MODELS,
      availableInputs: AVAILABLE_INPUT_IMGS,
      availablePrompts: AVAILABLE_PROMPTS,
      availableCategories: ["ava", "911", "jetee", "trackers", "hack", "bts", "cs-2x", "wow", "fortnite", "otg", "starcraft"],
      sortDir: 1,
      MODEL_META_MAP,
      PROMPT_MAP,
      CATEGORY_MAP,
    };
  },
  computed: {
    showControls() {
      return this.lightBoxed === null;
    },
    inputImgs() {
      if (this.selectedInputCategory !== "") {
        return this.availableInputs.filter((input) => input.includes(this.selectedInputCategory)).sort();
      }
      return this.availableInputs.sort();
    },
    filterOpts() {
      return `${this.currentPage}|${this.selectedSorting}|${this.selectedRating}|${this.selectedModel}|${this.selectedInputImage}|${this.selectedPrompt}|${this.selectedInputCategory}|${this.sortDir}|${this.ipaFilter}|${this.currentMode}|${this.imgPerPage}`;
    },
    // filteredImages() {
    //   console.log("filteredImagesFire");
    //   let images = this.batch;

    //   if (this.currentMode === "triples") {
    //     images = [];
    //     this.includedTriples.forEach((triple) => {
    //       const filteredTriple = this.batch.filter((image) => image.category === triple.category && image.promptUsed === triple.promptUsed && image.model === triple.model);
    //       images = images.concat(filteredTriple);
    //     });
    //   }

    //   if (this.selectedRating !== "") {
    //     if (this.selectedRating === "rated") {
    //       images = images.filter((image) => image.rating !== null);
    //     } else if (this.selectedRating === "unrated") {
    //       images = images.filter((image) => image.rating == null);
    //     } else if (this.selectedRating === "bad") {
    //       images = images.filter((image) => image.rating <= 3);
    //     } else if (this.selectedRating === "good") {
    //       images = images.filter((image) => image.rating === null || image.rating > 3);
    //     } else {
    //       images = images.filter((image) => image.rating == this.selectedRating);
    //     }
    //   }

    //   if (this.currentMode !== "blacklist") {
    //     console.log("filtering no blackList:", this.blackList.length);
    //     images = images.filter((image) => !this.blackList.includes(image.id));
    //   } else {
    //     console.log("filtering only blackList");
    //     images = images.filter((image) => this.blackList.includes(image.id));
    //   }

    //   if (this.ipaFilter === "ipa_only") {
    //     images = images.filter((image) => image.isIpa);
    //   }

    //   if (this.ipaFilter === "no_ipa") {
    //     images = images.filter((image) => !image.isIpa);
    //   }

    //   if (this.selectedInputCategory !== "") {
    //     images = images.filter((image) => image.inputImage.includes(this.selectedInputCategory));
    //   }
    //   if (this.selectedModel !== "") {
    //     images = images.filter((image) => image.model == this.selectedModel);
    //   }
    //   if (this.selectedInputImage !== "") {
    //     images = images.filter((image) => image.inputImage == this.selectedInputImage);
    //   }
    //   if (this.selectedPrompt !== "") {
    //     images = images.filter((image) => image.promptUsed == this.selectedPrompt);
    //   }

    //   let sorted = images.sort((a, b) => (a[this.selectedSorting] > b[this.selectedSorting] ? -this.sortDir : this.sortDir));
    //   if (this.currentMode === "random" || this.currentMode === "triples") {
    //     sorted = this.getRandomElements(sorted, Math.min(sorted.length, this.imgPerPage));
    //   }
    //   this.viewportImages = sorted.slice((this.currentPage - 1) * this.imgPerPage, (this.currentPage - 1) * this.imgPerPage + this.imgPerPage);
    //   return sorted;
    // },
  },
  methods: {
    filterImages() {
      console.log("filterImagesFire");
      let images = this.batch;

      if (this.currentMode === "triples") {
        images = [];
        this.includedTriples.forEach((triple) => {
          const filteredTriple = this.batch.filter((image) => image.category === triple.category && image.prompt === triple.prompt && image.model === triple.model);
          images = images.concat(filteredTriple);
        });
      }

      if (this.selectedRating !== "") {
        if (this.selectedRating === "rated") {
          images = images.filter((image) => image.rating !== null);
        } else if (this.selectedRating === "unrated") {
          images = images.filter((image) => image.rating == null);
        } else if (this.selectedRating === "bad") {
          images = images.filter((image) => image.rating <= 3);
        } else if (this.selectedRating === "good") {
          images = images.filter((image) => image.rating === null || image.rating > 3);
        } else {
          images = images.filter((image) => image.rating == this.selectedRating);
        }
      }

      if (this.currentMode !== "blacklist") {
        console.log("filtering no blackList:", this.blackList.length);
        images = images.filter((image) => !this.blackList.includes(image.id));
      } else {
        console.log("filtering only blackList");
        images = images.filter((image) => this.blackList.includes(image.id));
      }

      if (this.ipaFilter === "ipa_only") {
        images = images.filter((image) => image.isIpa);
      }

      if (this.ipaFilter === "no_ipa") {
        images = images.filter((image) => !image.isIpa);
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
        images = images.filter((image) => image.prompt == this.selectedPrompt);
      }

      let sorted = images.sort((a, b) => (a[this.selectedSorting] > b[this.selectedSorting] ? -this.sortDir : this.sortDir));
      if (this.currentMode === "random" || this.currentMode === "triples") {
        sorted = this.getRandomElements(sorted, Math.min(sorted.length, this.imgPerPage));
      }
      this.viewportImages = sorted.slice((this.currentPage - 1) * this.imgPerPage, (this.currentPage - 1) * this.imgPerPage + this.imgPerPage);
      return sorted;
    },
    getRandomElements(arr, n) {
      let result = new Array(n),
        len = arr.length,
        taken = new Array(len);

      if (n > len) throw new RangeError("getRandomElements: more elements taken than available");

      while (n--) {
        let x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
      }
      return result;
    },
    toggleLightBox(img) {
      console.log("toggleLightBox", img.id);
      if (this.lightBoxed && this.lightBoxed.id === img.id) {
        this.lightBoxed = null;
      } else {
        this.lightBoxed = img;
      }
    },
    setSortOrder(sortOrder) {
      this.selectedSorting = sortOrder;
    },
    filterPrompt(prompt) {
      this.selectedPrompt = prompt;
    },
    filterModel(model) {
      this.selectedModel = model;
    },
    filterInput(inputImage) {
      this.selectedInputImage = inputImage;
    },
    rateSelected(rating) {
      this.selectedImages.forEach((image) => {
        this.rateImage(image.id, rating);
      });
    },
    rateImage(id, rating) {
      const image = this.batch.find((img) => img.id === id);
      if (image) {
        image.rating = rating;
        const isSelectedImg = (img) => img.id === id;
        const idx = this.batch.findIndex(isSelectedImg);
        this.batch.splice(idx, 1, image);
        // viewport splice as well?

        // const rated = this.batch
        //   .filter((image) => image.rating !== null)
        //   .map((image) => {
        //     return { id: image.id, rating: image.rating };
        //   });
        // this.ratedImages.push(this.batch[idx]);
        // const rated = this.ratedImages.map((image) => {
        //   return { id: image.id, rating: image.rating };
        // });
        // console.log("dumping out:", rated);

        // push image here instead to save a filter?
        this.ratedImages = this.batch
          .filter((image) => image.rating !== null)
          .map((image) => {
            return { id: image.id, rating: image.rating };
          });
        localStorage.setItem("imageRatings", JSON.stringify(this.ratedImages));
      }
    },
    selectImage(id, shiftClick = false, ctrlClick = false) {
      console.log("selectImage", id, shiftClick);
      if (shiftClick && this.selectedImages.length > 0) {
        const clickedImage = this.viewportImages.find((img) => img.id === id);
        const indexStart = this.viewportImages.indexOf(this.selectedImages[0]);
        const indexEnd = this.viewportImages.indexOf(clickedImage);

        // todo: if indexStart or indexEnd for previous? save idx pos on click?
        if (indexStart > indexEnd) {
          this.selectedImages = this.viewportImages.slice(indexEnd, indexStart + 1);
        } else {
          this.selectedImages = this.viewportImages.slice(indexStart, indexEnd + 1);
        }
      } else if (ctrlClick && this.selectedImages.length > 0) {
        this.selectedImages.push(this.viewportImages.find((img) => img.id === id));
      } else {
        this.selectedImages = [];
        this.selectedImages.push(this.viewportImages.find((img) => img.id === id));
      }
    },
    tripleSave(image) {
      console.log(image.category);
      this.includedTriples.push({
        category: image.category,
        model: image.model,
        prompt: image.prompt,
      });
      localStorage.setItem("triples", JSON.stringify(this.includedTriples));
    },
    tripleDelete(idx) {
      // this.includedTriples.splice(idx, 1);
      this.$delete(this.includedTriples, idx);
      localStorage.setItem("triples", JSON.stringify(this.includedTriples));
    },
    blackListAction(image, type) {
      if (type === "pair") {
        if (confirm("Ban Model/Prompt Pair?")) {
          this.batch.filter((img) => img.model === image.model && img.prompt === image.prompt).forEach((img) => this.blackList.push(img.id));
        }
      } else if (type === "triple") {
        if (confirm("Ban Triple?")) {
          this.batch.filter((img) => img.category === image.category && img.model === image.model && img.prompt === image.prompt).forEach((img) => this.blackList.push(img.id));
        }
      } else if (type === "inputImage") {
        if (confirm("Ban Input?")) {
          this.batch.filter((img) => img.inputImage === image.inputImage).forEach((img) => this.blackList.push(img.id));
        }
      } else if (type === "id") {
        this.blackList.push(image.id);
      }
      localStorage.setItem("blackList", JSON.stringify(this.blackList));
    },
    keyListener(e) {
      console.log("keyListener", e);
      if (e.key === "1") {
        this.rateSelected(1);
        return;
      } else if (e.key === "2") {
        this.rateSelected(2);
        return;
      } else if (e.key === "3") {
        this.rateSelected(3);
        return;
      } else if (e.key === "4") {
        this.rateSelected(4);
        return;
      } else if (e.key === "5") {
        this.rateSelected(5);
        return;
      } else if (e.shiftKey === true && e.key === "ArrowLeft") {
        this.promptCursor -= 1;
        this.selectedPrompt = this.availablePrompts[(this.promptCursor + this.availablePrompts.length) % this.availablePrompts.length];
        return;
      } else if (e.shiftKey === true && e.key === "ArrowRight") {
        this.promptCursor += 1;
        this.selectedPrompt = this.availablePrompts[(this.promptCursor + this.availablePrompts.length) % this.availablePrompts.length];
        return;
      } else if (e.altKey === true && e.key === "ArrowLeft") {
        this.inputCursor -= 1;
        this.selectedInputImage = this.availableInputs[(this.inputCursor + this.availableInputs.length) % this.availableInputs.length];
        return;
      } else if (e.altKey === true && e.key === "ArrowRight") {
        this.inputCursor += 1;
        this.selectedInputImage = this.inputImgs[(this.inputCursor + this.inputImgs.length) % this.inputImgs.length];
        return;
      } else if (e.key === "ArrowLeft") {
        this.modelCursor -= 1;
        this.selectedModel = this.availableModels[(this.modelCursor + this.availableModels.length) % this.availableModels.length];
        return;
      } else if (e.key === "ArrowRight") {
        this.modelCursor += 1;
        this.selectedModel = this.availableModels[(this.modelCursor + this.availableModels.length) % this.availableModels.length];
        return;
      }
    },
    toggleControls() {
      console.log("toggleControls");
      this.showControls = !this.showControls;
    },
    moveCursor(cardIdx, direction) {
      console.log("moveCursor", cardIdx, direction);
      // if (this.selectedInputImage === "") {
      //   this.currentPage += direction;
      // }
      // this.cursorPosition = (this.currentPage - 1) * this.imgPerPage;
      // this.modelCursor += direction;
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
    dumpFiles() {
      // this.viewportImages
      // console.log('in view:', this.filteredImages.slice((currentPage - 1) * imgPerPage, (currentPage - 1) * imgPerPage + imgPerPage))
      // .slice((currentPage - 1) * imgPerPage, (currentPage - 1) * imgPerPage + imgPerPage)"
      // this.blackList
      // this.ratedImages
    },
    goTop() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
    // async addCat() {
    //   this.addDisabled = true;
    //   let cat = {
    //     name: "Cat" + Math.floor(Math.random() * 100),
    //     age: Math.floor(Math.random() * 10) + 1,
    //   };
    //   console.log("about to add " + JSON.stringify(cat));
    //   await this.addCatToDb(cat);
    //   this.cats = await this.getCatsFromDb();
    //   this.addDisabled = false;
    // },
    // async deleteCat(id) {
    //   await this.deleteCatFromDb(id);
    //   this.cats = await this.getCatsFromDb();
    // },
    // addStuff() {
    //   const stuff = JSON.parse(localStorage.getItem("imageRatings") || "[]");
    //   this.addImagesToDb(stuff);
    // },
    // async addImagesToDb(images) {
    //   return new Promise((resolve, reject) => {
    //     let trans = this.db.transaction(["ratings"], "readwrite");
    //     trans.oncomplete = (e) => {
    //       resolve();
    //     };

    //     let store = trans.objectStore("ratings");
    //     for (image in images) {
    //       store.add(image);
    //     }
    //   });
    // },
    // async deleteCatFromDb(id) {
    //   return new Promise((resolve, reject) => {
    //     let trans = this.db.transaction(["ratings"], "readwrite");
    //     trans.oncomplete = (e) => {
    //       resolve();
    //     };

    //     let store = trans.objectStore("ratings");
    //     store.delete(id);
    //   });
    // },
    // async getImagesFromDb() {
    //   return new Promise((resolve, reject) => {
    //     let trans = this.db.transaction(["ratings"], "readonly");
    //     trans.oncomplete = (e) => {
    //       resolve(cats);
    //     };

    //     let store = trans.objectStore("ratings");
    //     let cats = [];

    //     store.openCursor().onsuccess = (e) => {
    //       let cursor = e.target.result;
    //       if (cursor) {
    //         cats.push(cursor.value);
    //         cursor.continue();
    //       }
    //     };
    //   });
    // },
    // async getDb() {
    //   console.log("getDb");
    //   return new Promise((resolve, reject) => {
    //     let request = window.indexedDB.open(DB_NAME, DB_VERSION);

    //     request.onerror = (e) => {
    //       console.log("Error opening db", e);
    //       reject("Error");
    //     };

    //     request.onsuccess = (e) => {
    //       console.log("db success");
    //       resolve(e.target.result);
    //     };

    //     request.onupgradeneeded = (e) => {
    //       console.log("onupgradeneeded");
    //       let db = e.target.result;
    //       let objectStore = db.createObjectStore("ratings", { autoIncrement: true, keyPath: "id" });
    //     };
    //   });
    // },
  },
  watch: {
    filterOpts() {
      console.log("filterOpts");
      this.filteredImages = this.filterImages();
    },
    gridSize() {
      if (this.gridSize === "4") {
        this.showMeta = false;
      }
    },
    currentMode() {
      this.currentPage = 1;
      localStorage.setItem("currentMode", JSON.stringify(this.currentMode));
    },
    selectedModel() {
      this.currentPage = 1;
      localStorage.setItem("selectedModel", JSON.stringify(this.selectedModel));
    },
    selectedPrompt() {
      this.currentPage = 1;
      localStorage.setItem("selectedPrompt", JSON.stringify(this.selectedPrompt));
    },
    selectedInputCategory() {
      this.currentPage = 1;
      this.selectedInputImage = "";
      localStorage.setItem("selectedInputCategory", JSON.stringify(this.selectedInputCategory));
    },
    selectedInputImage() {
      if (this.currentMode === "random") {
        this.currentMode = "sequence";
      }
      localStorage.setItem("selectedInputImage", JSON.stringify(this.selectedInputImage));
      this.currentPage = 1;
    },
    selectedRating() {
      this.currentPage = 1;
      localStorage.setItem("selectedRating", JSON.stringify(this.selectedRating));
    },
  },

  async created() {
    console.log("created fire.");
    this.blackList = JSON.parse(localStorage.getItem("blackList") || "[]").filter((n) => n);
    this.ratedImages = JSON.parse(localStorage.getItem("imageRatings") || "[]");
    this.includedTriples = JSON.parse(localStorage.getItem("triples") || "[]");
    console.log("loaded rated:", this.ratedImages.length);
    console.log("blacklist length", this.blackList.length);
    console.log("triples", this.includedTriples);

    this.batch = this.batch.map((img) => {
      const ratedImage = this.ratedImages.find((i) => i.id === img.id);
      img.rating = ratedImage?.rating || null;
      return img;
    });

    this.selectedModel = localStorage.getItem("selectedModel") ? JSON.parse(localStorage.getItem("selectedModel")) : "";
    this.selectedPrompt = localStorage.getItem("selectedPrompt") ? JSON.parse(localStorage.getItem("selectedPrompt")) : "";
    this.selectedRating = localStorage.getItem("selectedRating") ? JSON.parse(localStorage.getItem("selectedRating")) : "";
    this.selectedInputCategory = localStorage.getItem("selectedInputCategory") ? JSON.parse(localStorage.getItem("selectedInputCategory")) : "";
    this.currentMode = localStorage.getItem("currentMode") ? JSON.parse(localStorage.getItem("currentMode")) : "sequence";
    this.selectedInputImage = localStorage.getItem("selectedInputImage") ? JSON.parse(localStorage.getItem("selectedInputImage")) : "";

    // this.viewportImages = this.filterImages();
    // this.db = await this.getDb();
    // this.cats = await this.getImagesFromDb();
  },
};
</script>
<style>
.selected .meta-bar {
  visibility: visible;
}
</style>
<style scoped>
select {
  padding: 8px;
  border: none;
  background-color: white;
  color: black;
}
#selectedPrompt,
#selectedModel {
  background-color: #333;
}
.pills select {
  color: white;
}
button {
  padding: 8px;
  border: none;
  background-color: white;
  color: black;
}
.controls-inner {
  background-color: white;
}
.left {
  display: flex;
  flex-direction: row;
}
.pills {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.pills .label {
  margin-right: 0.5rem;
}
.label {
  color: white;
  color: black;
  margin: 0 0.5rem;
  cursor: pointer;
  font-size: 0.5rem;
}
.badge:hover {
  /* text-decoration: underline; */
  opacity: 0.75;
}

.label.active {
  font-weight: bold;
  text-decoration: underline;
}

.center {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.lightBoxed {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}
.card-container {
  /* background-color: #0f0; */
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.selected .meta-bar {
  visibility: visible;
}
.selected {
  box-sizing: border-box;
  padding: 0.1rem;
  background-color: #0f0;
}
.card-header {
  width: 98%;
  height: 0.75rem;
  background-color: black;
  display: flex;
  flex-direction: row;
  /* font-size: 10px;
  font-size: 8px; */
  padding: 1%;
  justify-content: space-between;
}
.card-header .left {
  display: flex;
  flex-direction: row;
}
.card-container {
  position: relative;
}
.right {
  display: flex;
  flex-direction: row;
  color: black;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 4000;
}
.card-container:hover .right a {
  visibility: visible;
}
.right a {
  padding-left: 1rem;
  margin-left: 0.25rem;
  text-decoration: none;
  font-size: 1rem;
  visibility: hidden;
  box-shadow: #fff 0 0 3px;
}
.card-action {
  padding: 0.4rem;
  border-radius: 0.5rem;
}
.blacklist-card {
  background-color: #000;
}
.blacklist-triple {
  background-color: #f00;
}
.card-action.triple {
  background-color: #0f0;
}

.right a:hover {
  opacity: 0.75;
}
.card-header .badge,
.triples-bar .badge {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #333;
  /* padding: 0 5px; */
  padding: 0 0.5rem;
  font-size: 0.5rem;
  border-radius: 10px;
  margin-right: 4px;
  cursor: pointer;
  color: white;
}
.card-header .badge.static {
  color: white;
  cursor: default;
}
.card-header .badge.static:hover {
  opacity: 1;
}

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

.triples-bar {
  position: fixed;
  bottom: 3rem;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.triples-bar .badge {
  margin-right: 0;
}
.triples-bar .badge:hover {
  opacity: 1;
}
.triples-bar .badge.center {
  border-radius: 0;
}
.triples-bar .badge.first {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.triples-bar .badge.last {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.triple {
  display: flex;
  flex-direction: row;
}

footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  z-index: 999;
}

.paging {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 1rem;
}
.grid-settings {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 1rem;
  width: 28vw;
}

html,
body {
  margin: 0;
  padding: 0;
  /* overflow-x: hidden; */
  background-color: #0f0;
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
  /* background-color: rgba(0, 0, 0, 0.5); */
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
  margin: 0 1rem;
}
.main-sequence-container {
  width: 100%;
  /* width: 100vw; */
  /* height: 100vh; */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-x: hidden;
  justify-content: center;
  background-color: black;
  /* background-color: #0f0; */
  margin-top: 2rem;
  margin-top: 3rem;
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
