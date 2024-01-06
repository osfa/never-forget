<template>
  <div tabindex="-1" @keyup="keyListener">
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
          <select required name="sortDirection" id="sortDirection" v-model="sortDir">
            <option value="-1">Sort Down</option>
            <option value="1">Sort Up</option>
          </select>
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
      <div v-for="image in filteredImages.slice((currentPage - 1) * imgPerPage, (currentPage - 1) * imgPerPage + imgPerPage)" :key="image.id" :class="{ selected: selectedImages.includes(image) }">
        <div class="card-container">
          <div v-show="showMeta" class="card-header">
            <div class="left">
              <div class="badge" @click="filterModel(image.model)" :style="{ backgroundColor: MODEL_META_MAP[image.model].hexColor }">{{ MODEL_META_MAP[image.model].friendlyName }}</div>
              <div class="badge" @click="filterPrompt(image.promptUsed)" :style="{ backgroundColor: PROMPT_MAP[image.promptUsed].hexColor }">{{ image.promptUsed }}</div>
              <div class="badge static">{{ image.supportPrompt }}</div>
              <div class="badge static">{{ image.cfg }} CFG : {{ image.ss }} SS</div>
              <div class="badge" @click="filterInput(image.inputImage)" :style="{ backgroundColor: CATEGORY_MAP[image.category]?.hexColor }">{{ image.inputImage }}</div>
            </div>
            <div class="right">
              <a href="#" @click="tripleSave(image)">⚂</a>
              <a href="#" @click="blackListAction(image, 'inputImage')">💤</a>
              <a href="#" @click="blackListAction(image, 'id')">⚫</a>
            </div>
          </div>
          <div @dblclick="toggleLightBox(image)" @click.shift="selectImage(image.id, true)" @click.exact="selectImage(image.id)" :class="{ lightBoxed: lightBoxed?.id === image.id }">
            <ImageCard
              :rating="image.rating"
              :image="image"
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
      <div class="triple" v-for="triple in includedTriples">
        <div class="badge left" :style="{ backgroundColor: PROMPT_MAP[triple.promptUsed].hexColor }">{{ triple.promptUsed }}</div>
        <div class="badge center" :style="{ backgroundColor: MODEL_META_MAP[triple.model].hexColor }">{{ MODEL_META_MAP[triple.model].friendlyName }}</div>
        <div class="badge right" :style="{ backgroundColor: CATEGORY_MAP[triple.category]?.hexColor }">{{ triple.category }}</div>
      </div>
    </div>
    <footer>
      <div class="grid-settings"></div>
      <div class="paging">
        <button v-if="currentPage > 1" @click="currentPage -= 1">Previous</button>
        <div class="cursor-label">${{ cursorPosition }} | Page {{ currentPage }} / {{ Math.round(filteredImages.length / imgPerPage) }} | {{ filteredImages.length }} images</div>
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
        <button @click="showMeta = !showMeta">{{ showMeta ? "Hide Meta" : "Show Meta" }}</button>
      </div>
    </footer>
  </div>
</template>
<script>
import * as allImgs from "../pics-v3.json";

let MODELS_IN_SET = [];
let INPUT_IMGS_IN_SET = [];
let PROMPTS_IN_SET = [];
function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

const MODEL_META_MAP = {
  "3dAnimationDiffusion_v10": { friendlyName: "3D Anim", hexColor: "#DA70D6" }, // Orchid
  aniverse_v15Pruned: { friendlyName: "Aniverse", hexColor: "#FFD700" }, // Gold
  counterfeitV30_v30: { friendlyName: "Counterfeit", hexColor: "#FF4500" }, // Orange Red
  divineanimemix_V2: { friendlyName: "Divine Anime", hexColor: "#BA55D3" }, // Medium Orchid
  divineelegancemix_V9: { friendlyName: "Divine Elegance", hexColor: "#DB7093" }, // Pale Violet Red
  "dreamlike-photoreal-2.0": { friendlyName: "Dreamlike", hexColor: "#ADD8E6" }, // Light Blue
  dreamshaper_8: { friendlyName: "Dreamshaper", hexColor: "#20B2AA" }, // Light Sea Green
  epicrealism_naturalSinRC1VAE: { friendlyName: "Epic Realism", hexColor: "#778899" }, // Light Slate Gray
  indigoComic_v10withvae: { friendlyName: "Indigo Comic", hexColor: "#4B0082" }, // Indigo
  meinamix_meinaV11: { friendlyName: "Meinamix", hexColor: "#FF69B4" }, // Hot Pink
  realisticVisionV51_v51VAE: { friendlyName: "Realistic Vision", hexColor: "#2E8B57" }, // Sea Green
  revAnimated_v122EOL: { friendlyName: "Rev Animated", hexColor: "#FF6347" }, // Tomato
  toonyou_beta6: { friendlyName: "Toonyou", hexColor: "#FFA07A" }, // Light Salmon
  "v1-5-pruned-emaonly": { friendlyName: "1.5", hexColor: "#B0C4DE" }, // Light Steel Blue
};

const PROMPT_MAP = {
  2001: { hexColor: "#FFD700" }, // Gold
  2154: { hexColor: "#C0C0C0" }, // Silver
  anime: { hexColor: "#FFB6C1" }, // Light Pink
  candlelit: { hexColor: "#FFDAB9" }, // Peach Puff
  cottage: { hexColor: "#8FBC8F" }, // Dark Sea Green
  deviant: { hexColor: "#8B0000" }, // Dark Red
  "digital-disease": { hexColor: "#00FF00" }, // Lime
  fractal: { hexColor: "#9400D3" }, // Dark Violet
  frutiger: { hexColor: "#FFA500" }, // Orange
  "makeup-mukbang": { hexColor: "#FFC0CB" }, // Pink
  minecraft: { hexColor: "#008000" }, // Green
  mutation: { hexColor: "#B22222" }, // Firebrick
  "p-dim": { hexColor: "#808080" }, // Gray
  "ray-traced": { hexColor: "#4682B4" }, // Steel Blue
  roblox: { hexColor: "#FF4500" }, // Orange Red
  "second-life": { hexColor: "#DA70D6" }, // Orchid
  server: { hexColor: "#0000CD" }, // Medium Blue
  "trailcam-style": { hexColor: "#A52A2A" }, // Brown
  "uncanny-valley": { hexColor: "#778899" }, // Light Slate Gray
  unheimlich: { hexColor: "#708090" }, // Slate Gray
  xeno: { hexColor: "#556B2F" }, // Dark Olive Green
  xray: { hexColor: "#ADD8E6" }, // Light Blue
  candycrush: { hexColor: "#FF69B4" }, // Hot Pink
  ghibli: { hexColor: "#FFD700" }, // Gold
  vr: { hexColor: "#7B68EE" }, // Medium Slate Blue
  trailcam: { hexColor: "#8B4513" }, // Saddle Brown
  cyborg: { hexColor: "#A9A9A9" }, // Dark Gray
  doppel: { hexColor: "#696969" }, // Dim Gray
  ritual: { hexColor: "#4B0082" }, // Indigo
  "npc-magic": { hexColor: "#FF6347" }, // Tomato
  schematics: { hexColor: "#4682B4" }, // Steel Blue
  "server hall": { hexColor: "#20B2AA" }, // Light Sea Green
};

const CATEGORY_MAP = {
  ava: { hexColor: "#2df1b5" },
  911: { hexColor: "#b8b1a6" },
  jetee: { hexColor: "#890add" },
  trackers: { hexColor: "#9e0912" },
  hack: { hexColor: "#cf6d73" },
  bts: { hexColor: "#e238f2" },
  "cs-2x": { hexColor: "#b751b1" },
  wow: { hexColor: "#424f9e" },
  fortnite: { hexColor: "#ba98a0" },
  otg: { hexColor: "#176017" },
};

const parsedImgList = allImgs.default.map((imgPath) => {
  const srcFried = imgPath.replace("/Users/jbe/Dropbox/stabdiff-ui-v2/comfyui-outs/_NF/", "");
  imgPath = imgPath.replace("/Users/jbe/Dropbox/stabdiff-ui-v2/comfyui-outs/_NF/", "").replace("/fried/", "/2pass/");
  imgPath = imgPath.split("-fried_")[0] + "_00001_.png";

  const model = imgPath.split("--")[1];
  let inputImage;
  let promptUsed;
  let category = "?";
  const fna = imgPath.split("/");
  const fn = fna[fna.length - 1];
  const cfg = fn.split("_cfg-")[1].split("_")[0];
  const ss = fn.split("_ss-")[1].split("_")[0];
  const supportPrompt = fn.split("_support_prompt-")[1].split("_")[0];

  if (imgPath.includes("avatar1") || imgPath.includes("avatar2")) {
    category = "ava";
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

  MODELS_IN_SET.push(model);
  INPUT_IMGS_IN_SET.push(inputImage);
  PROMPTS_IN_SET.push(promptUsed);
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
    promptUsed,
    rating: null,
  };
});

const AVAILABLE_MODELS = MODELS_IN_SET.filter(onlyUnique).sort();
const AVAILABLE_INPUT_IMGS = INPUT_IMGS_IN_SET.filter(onlyUnique).sort();
const AVAILABLE_PROMPTS = PROMPTS_IN_SET.filter(onlyUnique).sort();
console.log(AVAILABLE_MODELS, AVAILABLE_INPUT_IMGS, AVAILABLE_PROMPTS);

export default {
  components: {
    ImageCard: () => import("./ImageCard.vue"),
  },
  data() {
    return {
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
      blackList: [],
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
      availableCategories: ["ava", "911", "jetee", "trackers", "hack", "bts", "cs-2x", "wow", "fortnite", "otg"],
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
    filteredImages() {
      console.log("filteredImagesFire");
      let images = this.batch;

      if (this.selectedRating !== "") {
        if (this.selectedRating === "rated") {
          images = this.batch.filter((image) => image.rating !== null);
        } else if (this.selectedRating === "unrated") {
          images = this.batch.filter((image) => image.rating == null);
        } else if (this.selectedRating === "bad") {
          images = this.batch.filter((image) => image.rating <= 3);
        } else if (this.selectedRating === "good") {
          images = this.batch.filter((image) => image.rating === null || image.rating > 3);
        } else {
          images = this.batch.filter((image) => image.rating == this.selectedRating);
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
        images = images.filter((image) => image.promptUsed == this.selectedPrompt);
      }

      const sorted = images.sort((a, b) => (a[this.selectedSorting] > b[this.selectedSorting] ? -this.sortDir : this.sortDir));
      if (this.currentMode === "random") {
        return this.getRandomElements(sorted, Math.min(sorted.length, this.imgPerPage));
      }
      return sorted;
    },
  },
  methods: {
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
        localStorage.setItem("imageRatings", JSON.stringify(this.batch.filter((image) => image.rating !== null)));
      }
    },
    selectImage(id, shiftClick = false) {
      console.log("selectImage", id, shiftClick);
      if (shiftClick && this.selectedImages.length > 0) {
        console.log("shiftClick, add multiple");
        const clickedImage = this.batch.find((img) => img.id === id);
        const indexStart = this.batch.indexOf(this.selectedImages[0]);
        const indexEnd = this.batch.indexOf(clickedImage);
        this.selectedImages = this.batch.slice(indexStart, indexEnd + 1);
      } else {
        this.selectedImages = [];
        this.selectedImages.push(this.batch.find((img) => img.id === id));
        console.log("selected:", this.selectedImages);
      }
    },
    tripleSave(image) {
      this.includedTriples.push({
        category: image.category,
        model: image.model,
        promptUsed: image.promptUsed,
      });
    },
    blackListAction(image, type) {
      if (type === "pair") {
        if (confirm("Ban Model/Prompt Pair?")) {
          this.batch.filter((img) => img.model === image.model && img.promptUsed === image.promptUsed).forEach((img) => this.blackList.push(img.id));
        }
      } else if (type === "triple") {
        if (confirm("Ban Triple?")) {
          this.batch.filter((img) => img.category === image.category && img.model === image.model && img.promptUsed === image.promptUsed).forEach((img) => this.blackList.push(img.id));
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
    goTop() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
  },
  watch: {
    gridSize() {
      if (this.gridSize === "4") {
        this.showMeta = false;
      }
    },
    currentMode() {
      this.currentPage = 1;
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
      this.currentPage = 1;
    },
    selectedRating() {
      this.currentPage = 1;
      localStorage.setItem("selectedRating", JSON.stringify(this.selectedRating));
    },
  },
  created() {
    this.blackList = JSON.parse(localStorage.getItem("blackList") || "[]").filter((n) => n);
    const ratedImages = JSON.parse(localStorage.getItem("imageRatings") || "[]");
    console.log("loaded rated:", ratedImages.length);
    console.log("blacklist length", this.blackList.length);
    this.batch = this.batch.map((img) => {
      const ratedImage = ratedImages.find((i) => i.id === img.id);
      img.rating = ratedImage?.rating || null;
      return img;
    });

    this.selectedModel = localStorage.getItem("selectedModel") ? JSON.parse(localStorage.getItem("selectedModel")) : "";
    this.selectedPrompt = localStorage.getItem("selectedPrompt") ? JSON.parse(localStorage.getItem("selectedPrompt")) : "";
    this.selectedRating = localStorage.getItem("selectedRating") ? JSON.parse(localStorage.getItem("selectedRating")) : "";
    this.selectedInputCategory = localStorage.getItem("selectedInputCategory") ? JSON.parse(localStorage.getItem("selectedInputCategory")) : "";
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
  height: 1.25rem;
  background-color: black;
  display: flex;
  flex-direction: row;
  font-size: 10px;
  font-size: 8px;
  padding: 1%;
  justify-content: space-between;
}
.card-header .left {
  display: flex;
  flex-direction: row;
}
.card-header .right {
  display: flex;
  flex-direction: row;
  color: black;
  justify-content: center;
  align-items: center;
  /* padding-right: 1rem; */
}
.right a {
  margin-left: 1rem;
  text-decoration: none;
  font-size: 1rem;
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
.triples-bar .badge.left {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.triples-bar .badge.right {
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
  width: 26vw;
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
