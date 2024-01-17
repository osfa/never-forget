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
            <option v-for="input in availableCategories" :key="input" :value="input">{{ input }} ({{ CATEGORY_MAP[input][selectedModel]?.count }})</option>
          </select>

          <!-- <div @click="setSortOrder('inputImage')" class="label" :class="{ active: selectedSorting === 'inputImage' }">Input Img</div> -->
          <select required name="selectedInputImage" id="selectedInputImage" v-model="selectedInputImage">
            <option value="">All Input Images</option>
            <option v-for="input in inputImgs" :key="input" :value="input">{{ input }}</option>
          </select>

          <!-- <div @click="setSortOrder('rating')" class="label" :class="{ active: selectedSorting === 'rating' }">Rating</div> -->
          <select required name="selectedRating" id="selectedRating" v-model="selectedRating" :class="{ active: selectedSorting === 'rating' }">
            <option value="">All</option>
            <option value="rated">Rated</option>
            <option value="unrated">Unrated</option>
            <option value="good">Unrated and 4-5</option>
            <option value="excellent">4-5</option>
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
          <button @click="isWeighted = !isWeighted">{{ isWeighted ? "weighted" : "linear" }}</button>
          <button @click="forceWeights = !forceWeights">{{ forceWeights ? "T" : "-" }}</button>

          <button @click="dumpFiles">DUMP</button>
        </div>
      </div>
    </div>

    <div class="main-sequence-container">
      <div v-for="(image, idx) in viewportImages" :key="`${idx}-${image.id}`" :class="{ selected: selectedImages.includes(image) }">
        <div class="card-container">
          <div v-show="currentMode !== 'blacklist'" class="card-actions">
            <button class="blacklist-triple card-action" @click="blackListAction(image, 'triple')">•••</button>
            <button class="blacklist-input card-action" @click="blackListAction(image, 'inputImage')">inp</button>
            <button class="blacklist-input card-action" @click="blackListAction(image, 'inputImageModel')">inp/model</button>
            <button class="blacklist-card card-action" @click="blackListAction(image, 'id')">•</button>
            <button class="save-triple card-action" @click="tripleSave(image)">•••</button>
            <button class="save-triple card-action" @click="reRoll(idx)">Reroll</button>
          </div>
          <div v-show="showMeta && currentMode === 'blacklist'" class="card-actions">
            <button class="blacklist-triple greeen card-action" @click="reinstateAction(image, 'triple')">•••</button>
            <button class="blacklist-input green card-action" @click="reinstateAction(image, 'inputImage')">••</button>
            <button class="blacklist-card green card-action" @click="reinstateAction(image, 'id')">•</button>
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
      <div class="grid-settings"></div>
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
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
        <select required name="imgPerPage" id="imgPerPage" v-model="imgPerPage">
          <option value="32">32</option>
          <option value="64">64</option>
          <option value="128">128</option>
          <option value="256">256</option>
          <option value="512">512</option>
          <option value="1024">1024</option>
          <option value="2048">2048</option>
          <option value="4096">4096</option>
        </select>
        <select required name="currentMode" id="currentMode" v-model="currentMode">
          <option value="sequence">sequence</option>
          <option value="random">random</option>
          <option value="triples">triples</option>
          <option value="blacklist">blacklist</option>
        </select>
        <button @click="isVertical = !isVertical">{{ isVertical ? "portrait" : "landscape" }}</button>
        <!-- <button @click="showMeta = !showMeta">{{ showMeta ? "meta" : "no meta" }}</button> -->
        <button @click="imageCover = !imageCover">{{ imageCover ? "cover" : "contain" }}</button>
      </div>
    </footer>
  </div>
</template>
<script>
import * as allImgs from "../data/pics-versioned.json";
import { CATEGORY_MAP, MODEL_META_MAP, PROMPT_MAP, parsePathCrawl } from "../maps";

console.log("ratingBook hit");
const BASE_POOL = allImgs.default; //.slice(0, 2000);

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
      isWeighted: true,
      forceWeights: true,
      gridSize: "3",
      lightBoxed: null,
      imageQuality: "fried",
      ipaFilter: "no_ipa",
      debug: true,
      batch: [],
      cursorPosition: 0,
      selectedImages: [],
      viewportImages: [],
      filteredImages: [],
      filteredImagesPool: [],
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
      availableModels: [],
      availableInputs: [],
      availablePrompts: [],
      availableCategories: Object.keys(CATEGORY_MAP),
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
      return `${this.currentPage}|${this.selectedSorting}|${this.selectedRating}|${this.selectedModel}|${this.selectedInputImage}|${this.selectedPrompt}|${this.selectedInputCategory}|${this.sortDir}|${this.ipaFilter}|${this.currentMode}|${this.imgPerPage}|${this.isWeighted}|${this.forceWeights}`;
    },
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
        } else if (this.selectedRating === "excellent") {
          images = images.filter((image) => image.rating > 3);
        } else {
          images = images.filter((image) => image.rating == this.selectedRating);
        }
      }

      if (this.currentMode !== "blacklist") {
        console.log("filtering: excluding blackList:", this.blackList.length);
        images = images.filter((image) => !this.blackList.includes(image.id));
      } else {
        console.log("filtering: showing only blackList");
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
      this.filteredImagesPool = images;
      let sorted = images.sort((a, b) => (a[this.selectedSorting] > b[this.selectedSorting] ? -this.sortDir : this.sortDir));
      if (this.currentMode === "random" || this.currentMode === "triples") {
        if (this.isWeighted) {
          sorted = this.getRandomWeightedElements(sorted, Math.min(sorted.length, this.imgPerPage));
        } else {
          sorted = this.getRandomElements(sorted, Math.min(sorted.length, this.imgPerPage));
        }
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
    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    getRandomWeightedElements(arr, n) {
      let selection = [];
      for (const category in CATEGORY_MAP) {
        console.log(`${category}: ${CATEGORY_MAP[category].weight}`);
        const cat = CATEGORY_MAP[category];
        const categoryImageCount = Math.floor(n * cat.weight);
        console.log("trying to get:", categoryImageCount);

        const pool = arr.filter((image) => image.category === category);
        if (pool.length < 1) {
          console.log("no images for:", category);
          continue;
        }

        let usedInputs = [];
        // shuffle first?
        // or check if max 3?
        const singleInputPool = pool.filter((image) => {
          if (usedInputs.includes(image.inputImage)) {
            return false;
          } else {
            usedInputs.push(image.inputImage);
            return true;
          }
        });

        // need to check if input is already used?
        // need like repeating here to fill up?
        let pulledImages = this.getRandomElements(singleInputPool, Math.min(singleInputPool.length, categoryImageCount));
        console.log("got:", pulledImages.length);

        if (this.forceWeights && pulledImages.length < categoryImageCount) {
          while (pulledImages.length < categoryImageCount) {
            pulledImages = pulledImages.concat(pulledImages);
          }
        }
        selection = selection.concat(pulledImages.slice(0, categoryImageCount));
      }
      console.log("done:", selection.length);
      return this.shuffle(selection);
    },
    weightedRandom(options) {
      var i;
      var weights = [options[0].weight];
      for (i = 1; i < options.length; i++) {
        weights[i] = options[i].weight + weights[i - 1];
      }
      var random = Math.random() * weights[weights.length - 1];
      for (i = 0; i < weights.length; i++) {
        if (weights[i] > random) break;
      }
      return options[i].name;
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

        if (rating < 4 && this.currentMode === "random") {
          // this.$delete(this.viewportImages, this.viewportImages.indexOf(image));
          this.reRoll(this.viewportImages.indexOf(image));
        }

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
      this.$delete(this.includedTriples, idx);
      localStorage.setItem("triples", JSON.stringify(this.includedTriples));
    },
    reRoll(idx) {
      const newImage = this.getRandomElements(this.filteredImagesPool, 1)[0];
      this.viewportImages.splice(idx, 1, newImage);
    },
    blackListAction(image, type) {
      console.log("blacklist", image, type);
      if (type === "pair") {
        if (confirm("Ban Model/Prompt Pair?")) {
          this.batch.filter((img) => img.model === image.model && img.prompt === image.prompt).forEach((img) => this.blackList.push(img.id));
        }
      } else if (type === "triple") {
        if (confirm("Ban Triple?")) {
          this.batch.filter((img) => img.category === image.category && img.model === image.model && img.prompt === image.prompt).forEach((img) => this.blackList.push(img.id));
        }
      } else if (type === "inputImageModel") {
        if (confirm("Ban Input for model?")) {
          this.batch.filter((img) => img.model === image.model && img.inputImage === image.inputImage).forEach((img) => this.blackList.push(img.id));
        }
      } else if (type === "inputImage") {
        if (confirm("Ban Input?")) {
          this.batch.filter((img) => img.inputImage === image.inputImage).forEach((img) => this.blackList.push(img.id));
        }
      } else if (type === "id") {
        this.blackList.push(image.id);
        this.$delete(this.viewportImages, this.viewportImages.indexOf(image));
        // this.blackList = this.blackList.slice(this.blackList.indexOf(image), 1);
      }
      localStorage.setItem("blackList", JSON.stringify(this.blackList));
    },
    reinstateAction(image, type) {
      if (type === "pair") {
        if (confirm("Reinstate Model/Prompt Pair?")) {
          // this.batch.filter((img) => img.model === image.model && img.prompt === image.prompt).forEach((img) => this.blackList.push(img.id));
          alert("borken");
        }
      } else if (type === "triple") {
        if (confirm("Reinstate Triple?")) {
          // this.batch.filter((img) => img.category === image.category && img.model === image.model && img.prompt === image.prompt).forEach((img) => this.blackList.push(img.id));
          alert("borken");
        }
      } else if (type === "inputImage") {
        if (confirm("Reinstate Input?")) {
          const existingForInput = this.batch.filter((img) => img.inputImage === image.inputImage).map((img) => img.id);
          this.blackList = this.blackList.filter((id) => !existingForInput.includes(id));
        }
      } else if (type === "id") {
        // this.blackList = this.blackList.slice(this.blackList.indexOf(image), 1);
        this.blackList = this.blackList.filter((id) => id !== image.id);
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
      // console.log("filteredImagesPool:");
      // console.log(this.filteredImagesPool.map((x) => x.id));
      console.log("filteredImages:");
      console.log(this.filteredImages.map((x) => x.id));
      console.log("viewportImages:");
      console.log(this.viewportImages.map((x) => x.id));
      console.log("rated images 4 and above:");
      console.log(this.ratedImages.filter((image) => image.rating > 3).map((x) => x.id)); // base on selected rating?
      console.log("all rated:");
      console.log(this.ratedImages.map((x) => x.id)); // base on selected rating?
      console.log("blacklist:");
      console.log(this.blackList);
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
    filterOpts() {
      console.log("filterOpts");
      this.filteredImages = this.filterImages();
    },
    gridSize() {
      // if (this.gridSize === "4") {
      //   this.showMeta = false;
      // }
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
    sortDir() {
      localStorage.setItem("sortDir", JSON.stringify(this.sortDir));
    },
    imgPerPage() {
      localStorage.setItem("imgPerPage", JSON.stringify(this.imgPerPage));
    },
    isWeighted() {
      localStorage.setItem("isWeighted", JSON.stringify(this.isWeighted));
    },
    selectedSorting() {
      this.currentPage = 1;
      localStorage.setItem("selectedSorting", JSON.stringify(this.selectedSorting));
    },
  },
  async created() {
    console.log("created fire.");

    const parseResult = parsePathCrawl(BASE_POOL, CATEGORY_MAP);
    this.batch = parseResult.imageObjs;
    console.log(parseResult);

    this.availableModels = parseResult.availableModels;
    this.availableInputs = parseResult.availableInputs;
    this.availablePrompts = parseResult.availablePrompts;
    this.CATEGORY_MAP = parseResult.category_map;

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
    this.sortDir = localStorage.getItem("sortDir") ? JSON.parse(localStorage.getItem("sortDir")) : 1;
    this.imgPerPage = localStorage.getItem("imgPerPage") ? JSON.parse(localStorage.getItem("imgPerPage")) : 128;
    this.selectedSorting = localStorage.getItem("selectedSorting") ? JSON.parse(localStorage.getItem("selectedSorting")) : "inputImage";
    this.isWeighted = localStorage.getItem("isWeighted") ? JSON.parse(localStorage.getItem("isWeighted")) : false;
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
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: row;
  /* font-size: 10px;
  font-size: 8px; */
  padding: 1%;
  justify-content: space-between;
  z-index: 100;
  visibility: hidden;
}
.card-container:hover .card-header {
  visibility: visible;
}
.card-header .left {
  display: flex;
  flex-direction: row;
}
.card-container {
  position: relative;
}
.card-actions {
  display: flex;
  flex-direction: row;
  color: black;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 500;
}
.card-container:hover .card-action {
  visibility: visible;
}
.card-action {
  border-radius: 0.5rem;
  margin-left: 0.25rem;
  text-decoration: none;
  font-size: 0.5rem;
  box-shadow: #fff 0 0 3px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  visibility: hidden;
  padding: 0.25rem;
}
.blacklist-card {
  background-color: #000;
}
.blacklist-triple {
  background-color: #000;
}
.blacklist-input {
  background-color: #000;
}
.card-action.save-triple {
  background-color: #0f0;
}

.card-action.green {
  background-color: #0f0;
}

.card-action:hover {
  opacity: 0.75;
}
.triples-bar {
  visibility: hidden;
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
