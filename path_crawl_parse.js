// import { parsePathCrawl, CATEGORY_MAP } from "../maps";
// import * as allImgs from "src/data/pics-versioned.json";
// import { parse } from 'node-html-parser';
const fs = require("fs");

const CATEGORY_MAP = {
  avatar: { hexColor: "#2df1b5", weight: 0.3 },
  jetee: { hexColor: "#890add", weight: 0.2 },
  hack: { hexColor: "#cf6d73", weight: 0.1 },
  // 50%

  otg: { hexColor: "#176017", weight: 0.05 },
  911: { hexColor: "#b8b1a6", weight: 0.05 },
  bts: { hexColor: "#e238f2", weight: 0.025 },
  memorial: { hexColor: "#e238f2", weight: 0.025 },

  trackers: { hexColor: "#9e0912", weight: 0.05 },
  // 70%

  "ava-game": { hexColor: "#0000ff", weight: 0.05 },
  wow: { hexColor: "#424f9e", weight: 0.05 },

  fortnite: { hexColor: "#ba98a0", weight: 0.05 },
  starcraft: { hexColor: "#88409C", weight: 0.05 },

  diablo: { hexColor: "#ff0000", weight: 0.05 },
  cs: { hexColor: "#b751b1", weight: 0.05 },
  // 90%
};

// const extractMetaFromPath = (imgPath) => {
//   const srcFried = imgPath.replace(
//     "/Users/jbe/Dropbox/stabdiff-ui-v2/comfyui-outs/_NF/",
//     ""
//   );
//   imgPath = imgPath
//     .replace("/Users/jbe/Dropbox/stabdiff-ui-v2/comfyui-outs/_NF/", "")
//     .replace("/fried/", "/2pass/");
//   imgPath = imgPath.split("-fried_")[0] + "_00001_.png";

//   const model = imgPath.split("--")[1];
//   let inputImage;
//   let prompt;
//   let category = null;
//   const fna = imgPath.split("/");
//   const fn = fna[fna.length - 1];
//   const cfg = fn.split("_cfg-")[1].split("_")[0];
//   const ss = fn.split("_ss-")[1].split("_")[0];
//   const supportPrompt = fn.split("_support_prompt-")[1].split("_")[0];
//   if (imgPath.includes("avatar1") || imgPath.includes("avatar2")) {
//     category = "avatar";
//     inputImage = fn.split("--")[2].split(".jpg")[0] + ".jpg";
//     prompt = fn
//       .split("--")[2]
//       .split(".jpg")[1]
//       .split("_")[1]
//       .replace("prompt-", "");
//   } else {
//     inputImage = imgPath.split("--")[2].split("_")[0];
//     prompt = imgPath.split("--")[2].split("_")[1].replace("prompt-", "");
//   }

//   if (imgPath.includes("911")) {
//     category = "911";
//   }
//   if (imgPath.includes("jetee")) {
//     category = "jetee";
//   }
//   if (imgPath.includes("trackers")) {
//     category = "trackers";
//   }
//   if (
//     imgPath.includes("--bts") ||
//     imgPath.includes("--davos") ||
//     imgPath.includes("--mission") ||
//     imgPath.includes("--poolc")
//   ) {
//     category = "bts";
//   }
//   if (imgPath.includes("--hack")) {
//     category = "hack";
//   }
//   if (imgPath.includes("--wow")) {
//     category = "wow";
//   }
//   if (imgPath.includes("cs-2x")) {
//     category = "cs";
//   }
//   if (imgPath.includes("fortnite")) {
//     category = "fortnite";
//   }
//   if (imgPath.includes("starcraft")) {
//     category = "starcraft";
//   }
//   if (imgPath.includes("diablo")) {
//     category = "diablo";
//   }
//   if (imgPath.includes("ava-game")) {
//     category = "ava-game";
//   }
//   if (imgPath.includes("--otg")) {
//     category = "otg";
//   }

//   if (imgPath.includes("--otg")) {
//     category = "otg";
//   }
//   if (imgPath.includes("memorial")) {
//     category = "memorial";
//   }
// };

const parsePathCrawl = (path_object_array, category_map) => {
  // const path_array = path_object.map
  const availableModelsAll = [];
  const availableInputsAll = [];
  const availablePromptsAll = [];
  const availableSupportPromptsAll = [];

  // NF-03-5--v1-5-pruned-emaonly--avatar12-00007-2x.jpg_prompt-second-life_support_prompt-9-11_MP-1_cfg-24_ss-15_seed-1000195145_cnet_d-0.9_cnet_c-0_00001_

  const imageObjs = path_object_array.map((path_ts_tuple) => {
    let imgPath = path_ts_tuple["path"];

    const srcFried = imgPath.replace(
      "/Users/jbe/Dropbox/stabdiff-ui-v2/comfyui-outs/_NF/",
      ""
    );
    imgPath = imgPath
      .replace("/Users/jbe/Dropbox/stabdiff-ui-v2/comfyui-outs/_NF/", "")
      .replace("/fried/", "/2pass/");
    imgPath = imgPath.split("-fried_")[0] + "_00001_.png";

    const model = imgPath.split("--")[1];
    let inputImage;
    let prompt;
    let category = null;
    const fna = imgPath.split("/");
    const fn = fna[fna.length - 1];
    const cfg = fn.split("_cfg-")[1].split("_")[0];
    const ss = fn.split("_ss-")[1].split("_")[0];
    const supportPrompt = fn.split("_support_prompt-")[1].split("_")[0];
    if (imgPath.includes("avatar1") || imgPath.includes("avatar2")) {
      category = "avatar";
      inputImage = fn.split("--")[2].split(".jpg")[0] + ".jpg";
      prompt = fn
        .split("--")[2]
        .split(".jpg")[1]
        .split("_")[1]
        .replace("prompt-", "");
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
    if (
      imgPath.includes("--bts") ||
      imgPath.includes("--davos") ||
      imgPath.includes("--mission") ||
      imgPath.includes("--poolc")
    ) {
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
    if (imgPath.includes("diablo")) {
      category = "diablo";
    }
    if (imgPath.includes("ava-game")) {
      category = "ava-game";
    }
    if (imgPath.includes("--otg")) {
      category = "otg";
    }

    if (imgPath.includes("--otg")) {
      category = "otg";
    }
    if (imgPath.includes("memorial")) {
      category = "memorial";
    }
    if (category === null) throw new Error(imgPath);

    category_map[category][model] = category_map[category][model] || {
      count: 0,
      inputs: [],
    };
    category_map[category][model]["count"] += 1;

    if (!category_map[category][model]["inputs"].includes(inputImage)) {
      category_map[category][model]["inputs"].push(inputImage);
    }

    if (!availableInputsAll.includes(inputImage)) {
      availableInputsAll.push(inputImage);
    }

    if (!availablePromptsAll.includes(prompt)) availablePromptsAll.push(prompt);
    if (!availableSupportPromptsAll.includes(supportPrompt))
      availableSupportPromptsAll.push(supportPrompt);
    if (model !== "divineelegancemix_V9") availableModelsAll.push(model);

    return {
      fn,
      id: imgPath,
      src: imgPath,
      src1pass: imgPath
        .replace("/2pass/", "/1pass/")
        .replace("_00001_.png", "-1x_00001_.png"),
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
      ts: path_ts_tuple["ts"],
    };
  });

  const onlyUnique = (value, index, array) => {
    return array.indexOf(value) === index;
  };
  const availableModels = availableModelsAll.filter(onlyUnique);
  const availableInputs = availableInputsAll.filter(onlyUnique);
  const availablePrompts = availablePromptsAll.filter(onlyUnique);
  const availableSupportPrompts = availableSupportPromptsAll.filter(onlyUnique);

  Object.keys(category_map).forEach((category) => {
    availableModels.forEach((model) => {
      if (category_map[category][model]) {
        category_map[category][model]["inputs"] =
          category_map[category][model]["inputs"].length;
      }
    });
  });

  return {
    imageObjs,
    category_map,
    availableModels,
    availableInputs,
    availablePrompts,
    availableSupportPrompts,
  };
};

// const allImgs = require("/Users/jbe/static-sites/never-forget-vite-vue2/src/data/pics-versioned.json");
const allImgs = require("/Users/jbe/static-sites/never-forget-vite-vue2/src/data/pics-versioned-ts.json"); // { path: string, ts: number }[]
// const allImgs = require("/Users/jbe/static-sites/never-forget-vite-vue2/src/data/pics-versioned-ts-tiny.json");

const parseResult = parsePathCrawl(allImgs, CATEGORY_MAP);
var json = JSON.stringify(parseResult);
fs.writeFile(
  "/Users/jbe/static-sites/never-forget-vite-vue2/src/data/pics-parsed.json",
  json,
  "utf8",
  () => console.log("done")
);

// CODE TO FIX FAVS AND STUFF?

// backup_rating_path =
//   "/Users/jbe/Dropbox/stabdiff-ui-v2/_sorted-outputs/never-forget/_selections/backups/_rated-no-ratings-lol/jbe-favs-jan-14.json"; // flat array
// localstorage_path =
//   "/Users/jbe/Dropbox/stabdiff-ui-v2/_sorted-outputs/never-forget/_selections/backups/jbe-favs-feb-13-raw-localstorage.json"; // {id: string, rating: number}[]
// consolidated_path =
//   "/Users/jbe/Dropbox/stabdiff-ui-v2/_sorted-outputs/never-forget/_selections/backups/favorites-combined-for-localstorage.json";
// consolidated_path_full_meta =
//   "/Users/jbe/Dropbox/stabdiff-ui-v2/_sorted-outputs/never-forget/_selections/backups/favorites-with-meta.json";

// const oldRatedArray = require(backup_rating_path); // []
// const localStorageArray = require(localstorage_path); // {id: string, rating: number}[]

// const localStorageArrayIds = localStorageArray.map((item) => item.id);
// let combinedIdRatingArray = oldRatedArray
//   .map((id) => {
//     if (!localStorageArrayIds.includes(id)) {
//       return { id, rating: 4 };
//     }
//   })
//   .concat(localStorageArray);

// combinedIdRatingArray = combinedIdRatingArray.filter((n) => n);

// console.log(
//   oldRatedArray.length,
//   localStorageArray.length,
//   combinedIdRatingArray.length
// );

// // var json = JSON.stringify(combinedIdRatingArray);
// // fs.writeFile(consolidated_path, json, "utf8", () => console.log("done"));

// const parseResult = parsePathCrawl(
//   combinedIdRatingArray.map((img) => {
//     return { path: img.id, ts: 0 };
//   }),
//   CATEGORY_MAP
// );
// var json = JSON.stringify(parseResult);
// fs.writeFile(consolidated_path_full_meta, json, "utf8", () =>
//   console.log("done")
// );
