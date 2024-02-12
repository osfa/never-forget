<template>
  <div id="filter-bar" v-show="displayFilter">
    <multiselect
      placeholder="Select Categories"
      v-model="filterCategories"
      :options="filterCategoriesOptions"
      :multiple="true"
      :searchable="true"
      :close-on-select="false"
      :clear-on-select="false"
      :preselect-first="false"
      :max-height="900"
      open-direction="bottom"
      @select="selectCategoriesHandler"
      :show-labels="false">
      <template slot="selection" slot-scope="{ values, search, isOpen }"
        ><span class="multiselect__single" v-if="values.length" v-show="!isOpen"
          >{{ values.length }} categories selected</span
        >
      </template>
      <template slot="option" slot-scope="props">
        <div
          class="option__desc"
          :style="{
            backgroundColor: categoryMap[props.option]?.hexColor,
          }">
          <span class="option__title">{{ props.option }}</span>
        </div>
      </template>
    </multiselect>
    <multiselect
      placeholder="Select Models"
      v-model="filterModels"
      :options="filterModelsOptions"
      :multiple="true"
      :searchable="true"
      :close-on-select="false"
      :clear-on-select="false"
      :preselect-first="false"
      open-direction="bottom"
      :max-height="900"
      @select="selectModelsHandler"
      :show-labels="false">
      <template slot="selection" slot-scope="{ values, search, isOpen }">
        <span class="multiselect__single" v-if="values.length" v-show="!isOpen"
          >{{ values.length }} models selected</span
        >
      </template>
      <template slot="option" slot-scope="props">
        <div
          class="option__desc"
          :style="{
            backgroundColor: MODEL_META_MAP[props.option]?.hexColor,
          }">
          <span class="option__title">{{ props.option }}</span>
        </div>
      </template>
    </multiselect>
    <multiselect
      placeholder="Select Prompts"
      v-model="filterPrompts"
      :options="filterPromptsOptions"
      :multiple="true"
      :searchable="true"
      :close-on-select="false"
      :clear-on-select="false"
      :preselect-first="false"
      :max-height="900"
      open-direction="bottom"
      @select="selectPromptsHandler"
      :show-labels="false">
      <template slot="selection" slot-scope="{ values, search, isOpen }">
        <span class="multiselect__single" v-if="values.length" v-show="!isOpen"
          >{{ values.length }} prompts selected</span
        >
      </template>
      <template slot="option" slot-scope="props">
        <div
          class="option__desc"
          :style="{
            backgroundColor: PROMPT_MAP[props.option]?.hexColor,
          }">
          <span class="option__title">{{ props.option }}</span>
        </div>
      </template>
    </multiselect>
    <multiselect
      placeholder="Select Support Prompts"
      v-model="filterSupportPrompts"
      :options="filterSupportPromptsOptions"
      :multiple="true"
      :searchable="true"
      :close-on-select="false"
      :clear-on-select="false"
      :preselect-first="false"
      :max-height="900"
      open-direction="bottom"
      @select="selectSupportPromptsHandler"
      :show-labels="false">
      <template slot="selection" slot-scope="{ values, search, isOpen }">
        <span class="multiselect__single" v-if="values.length" v-show="!isOpen"
          >{{ values.length }} supp. prompts selected</span
        >
      </template>
      <template slot="option" slot-scope="props">
        <div class="option__desc">
          <span class="option__title">{{ props.option }}</span>
        </div>
      </template>
    </multiselect>
    <multiselect
      placeholder="Select Inputs"
      v-model="filterInputs"
      :options="['All', ...availableInputs]"
      :multiple="true"
      :searchable="true"
      :close-on-select="false"
      :clear-on-select="false"
      :preselect-first="false"
      :max-height="900"
      open-direction="bottom"
      @select="selectInputsHandler"
      :show-labels="false">
      <template slot="selection" slot-scope="{ values, search, isOpen }">
        <span class="multiselect__single" v-if="values.length" v-show="!isOpen"
          >{{ values.length }} inputs selected</span
        >
      </template>
      <template slot="option" slot-scope="props">
        <div class="option__desc">
          <span class="option__title">{{ props.option }}</span>
        </div>
      </template>
    </multiselect>

    <multiselect
      placeholder="Select Ratings"
      v-model="filterRatings"
      :options="filterRatingsOptions"
      :multiple="true"
      :searchable="true"
      :close-on-select="false"
      :clear-on-select="false"
      :preselect-first="false"
      :max-height="900"
      open-direction="bottom"
      @select="selectRatingsHandler"
      :show-labels="false">
      <template slot="selection" slot-scope="{ values, search, isOpen }">
        <span class="multiselect__single" v-if="values.length" v-show="!isOpen"
          >{{ values.length }} ratings selected</span
        >
      </template>
      <template slot="option" slot-scope="props">
        <div class="option__desc">
          <span class="option__title">{{ props.option }}</span>
        </div>
      </template>
    </multiselect>

    <div v-show="displayTriples" class="triples-bar">
      <div
        @dblclick="tripleDelete(idx)"
        class="triple"
        v-for="(triple, idx) in includedTriples">
        <!-- <div
          class="badge first"
          :style="{ backgroundColor: PROMPT_MAP[triple.prompt]?.hexColor }">
          {{ triple.prompt }}
        </div> -->
        <div
          class="badge center"
          :style="{ backgroundColor: MODEL_META_MAP[triple.model].hexColor }">
          {{ MODEL_META_MAP[triple.model].friendlyName }}
        </div>
        <div
          class="badge last"
          :style="{ backgroundColor: categoryMap[triple.category]?.hexColor }">
          {{ triple.category }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MODEL_META_MAP, PROMPT_MAP } from "../maps";

export default {
  components: {
    Multiselect: () => import("vue-multiselect"),
  },
  props: {
    includedTriples: Array,
    displayTriples: Boolean,
    displayFilter: Boolean,
    categoryMap: Object,
    filterModelsOptions: Array,
    filterPromptsOptions: Array,
    filterSupportPromptsOptions: Array,
    filterCategoriesOptions: Array,
    availableInputs: Array,
  },
  data() {
    return {
      filterModels: null,
      filterPrompts: null,
      filterSupportPrompts: null,
      filterCategories: null,
      filterRatings: null,
      filterRatingsOptions: ["All", 5, 4, 3, 2, 1, "Unrated"],
      filterInputs: null,
      MODEL_META_MAP,
      PROMPT_MAP,
    };
  },
  mounted() {
    console.log("mounted");
    this.filterCategories = localStorage.getItem("filterCategories")
      ? JSON.parse(localStorage.getItem("filterCategories"))
      : [];
    this.filterModels = localStorage.getItem("filterModels")
      ? JSON.parse(localStorage.getItem("filterModels"))
      : [];
    this.filterPrompts = localStorage.getItem("filterPrompts")
      ? JSON.parse(localStorage.getItem("filterPrompts"))
      : [];
    this.filterSupportPrompts = localStorage.getItem("filterSupportPrompts")
      ? JSON.parse(localStorage.getItem("filterSupportPrompts"))
      : [];
    this.filterInputs = localStorage.getItem("filterInputs")
      ? JSON.parse(localStorage.getItem("filterInputs"))
      : [];
    this.filterRatings = localStorage.getItem("filterRatings")
      ? JSON.parse(localStorage.getItem("filterRatings"))
      : [];
  },
  computed: {
    inputImgs() {
      if (this.filterCategories && this.filterCategories.length > 0) {
        return this.availableInputs
          .filter((input) => {
            input.includes(this.filterCategories[0]);
          })
          .sort();
      }
      return this.availableInputs.sort();
    },
  },
  methods: {
    tripleDelete(idx) {
      // console.log(category, event);
      this.$emit("tripleDelete", idx);
    },
    selectedAllCheck(values, options) {
      console.log("selectedAllCheck", values.length === options.length);
      return values.length === options.length ? [] : options;
    },
    selectModelsHandler(event) {
      if (event === "All") {
        this.filterModels = this.selectedAllCheck(
          this.filterModels,
          this.filterModelsOptions
        );
      }
    },
    selectPromptsHandler(event) {
      // console.log("selectPromptsHandler", event);
      if (event === "All") {
        this.filterPrompts = this.selectedAllCheck(
          this.filterPrompts,
          this.filterPromptsOptions
        );
      }
    },
    selectSupportPromptsHandler(event) {
      // console.log("selectPromptsHandler", event);
      if (event === "All") {
        this.filterSupportPrompts = this.selectedAllCheck(
          this.filterSupportPrompts,
          this.filterSupportPromptsOptions
        );
      }
    },
    selectCategoriesHandler(event) {
      // console.log("selectCategoriesHandler", event);
      if (event === "All") {
        this.filterCategories = this.selectedAllCheck(
          this.filterCategories,
          this.filterCategoriesOptions
        );
      }
    },
    selectInputsHandler(event) {
      // console.log("selectCategoriesHandler", event);
      if (event === "All") {
        this.filterInputs = this.selectedAllCheck(this.filterInputs, [
          "All",
          ...this.availableInputs,
        ]);
      }
    },
    selectRatingsHandler(event) {
      // console.log("selectCategoriesHandler", event);
      if (event === "All") {
        this.filterRatings = this.selectedAllCheck(
          this.filterRatings,
          this.filterRatingsOptions
        );
      }
    },
  },
  watch: {
    filterModels(newVal, oldVal) {
      console.log("updateFilterModels fire", newVal, oldVal);
      this.$emit("update-filter-models", newVal);
    },
    filterPrompts(newVal, oldVal) {
      this.$emit("update-filter-prompts", newVal);
    },
    filterSupportPrompts(newVal, oldVal) {
      this.$emit("update-filter-support-prompts", newVal);
    },
    filterCategories(newVal, oldVal) {
      this.$emit("update-filter-categories", newVal);
    },
    filterInputs(newVal, oldVal) {
      this.$emit("update-filter-inputs", newVal);
    },
    filterRatings(newVal, oldVal) {
      this.$emit("update-filter-ratings", newVal);
    },
  },
};
</script>
<style scoped>
#filter-bar {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  /* align-items: center; */
  width: 100%;
  position: fixed;
  left: 0;
  top: 1rem;
  z-index: 2000;
}
.center {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.triple {
  display: flex;
  flex-direction: row;
  margin-right: 0.5rem;
}
.triples-bar {
  position: fixed;
  top: 4rem;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: row;
  /* justify-content: center; */
}
.triples-bar .badge {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #333;
  /* padding: 0 5px; */
  padding: 0 0.5rem;
  font-size: 0.5rem;
  border-radius: 10px;
  border-radius: 0;
  margin-right: 4px;
  cursor: pointer;
  color: white;
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
</style>
<style>
@import "../assets/multiselect.css";
.option__desc {
  padding: 0.5rem;
  background-color: #eee;
  color: black;
}

.multiselect__option--selected.multiselect__option--highlight {
  background: #ff6a6a;
  background: black;
  color: #fff;
}

.multiselect__option--selected.multiselect__option--highlight:after {
  background: #ff6a6a;
  background: black;
  color: #fff;
}

.multiselect__option--highlight {
  background: #41b883;
  background: white;
  outline: none;
  color: white;
}

.multiselect__option--highlight:after {
  background: #41b883;
  background: white;
  color: black;
}
.multiselect__option {
  padding: 0;
  opacity: 0.5;
}

.multiselect__option--selected {
  background: white;
  color: #35495e;
  color: black;
  font-weight: bold;
  opacity: 1 !important;
}

.multiselect__input,
.multiselect__single,
.multiselect__tags {
  border-radius: 0;
  border: none;
}
</style>
