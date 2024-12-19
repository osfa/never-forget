// import aniversePlate from "./data/plates/aniverse-plate.json";
// import { epicPlate } from "./data/plates/epic-plate.js";
// import { meinaPlate } from "./data/plates/meina-512-4-5.js";
// import { anim3dPlate } from "./data/plates/3danim-512-possibly-with-unrated.js";
// import { counterfeitPlate } from "./data/plates/counterfeit-512-4-5.js";
// import { onefivePlate } from "./data/plates/v-1-5-512-4-5.js";
// import { indigoPlate } from "./data/plates/indigo-512-4-5.js";
// import { revanimatedPlate } from "./data/plates/revanimated-512-4-5.js";
// import { dreamlikePlate } from "./data/plates/dreamlike-512-4-5.js";
// import { dreamshaperPlate } from "./data/plates/dreamshaper-512-4-5.js";
// import { toonyouPlate } from "./data/plates/toonyou-512-4-5.js";
// import realisticPlate from "./data/plates/realistic-512-4-5.json"; // behaves as an imported js array

import anim3dPlate from "./data/plates-v2/3DANIM-4-5-2048-map.json";
import aniversePlate from "./data/plates-v2/ANIVERSE-4-5-2048-map.json";
import counterfeitPlate from "./data/plates-v2/COUNTERFEIT-4-5-2048-map.json";
import divinePlate from "./data/plates-v2/DIVINE-4-5-2048-map.json";
import dreamlikePlate from "./data/plates-v2/DREAMLIKE-4-5-2048-map.json";
import dreamshaperPlate from "./data/plates-v2/DREAMSHAPER-4-5-2048-map.json";
import epicPlate from "./data/plates-v2/EPIC-4-5-2048-map.json";
import indigoPlate from "./data/plates-v2/INDIGO-4-5-2048-map.json";
import meinaPlate from "./data/plates-v2/MEINA-4-5-2048-map.json";
import realisticPlate from "./data/plates-v2/REALISTIC-4-5-2048-map.json";
import revanimatedPlate from "./data/plates-v2/REVANIMATED-4-5-2048-map.json";
import toonyouPlate from "./data/plates-v2/TOONYOU-4-5-2048-map.json";
import onefivePlate from "./data/plates-v2/V15-4-5-2048-map.json";

export const MODEL_META_MAP = {
  "3dAnimationDiffusion_v10": {
    friendlyName: "3D Anim",
    hexColor: "#DA70D6",
    unicode: "ↂ",
    plate: anim3dPlate,
  }, // Orchid
  aniverse_v15Pruned: {
    friendlyName: "Aniverse",
    hexColor: "#FFD700",
    unicode: "₻",
    plate: aniversePlate,
  }, // Gold
  counterfeitV30_v30: {
    friendlyName: "Counterfeit",
    hexColor: "#FF4500",
    unicode: "⏅",
    plate: counterfeitPlate,
  }, // Orange Red
  divineanimemix_V2: {
    friendlyName: "Divine Anime",
    hexColor: "#BA55D3",
    unicode: "⁂",
    plate: divinePlate,
  }, // Medium Orchid
  // // dreamlike: {
  "dreamlike-photoreal-2.0": {
    friendlyName: "Dreamlike",
    hexColor: "#ADD8E6",
    unicode: "∑",
    plate: dreamlikePlate,
  }, // Light Blue
  dreamshaper_8: {
    friendlyName: "Dreamshaper",
    hexColor: "#20B2AA",
    unicode: "≝",
    plate: dreamshaperPlate,
  }, // Light Sea Green
  epicrealism_naturalSinRC1VAE: {
    friendlyName: "Epic Realism",
    hexColor: "#778899",
    unicode: "‖",
    plate: epicPlate,
  }, // Light Slate Gray
  indigoComic_v10withvae: {
    friendlyName: "Indigo Comic",
    hexColor: "#4B0082",
    unicode: "∭",
    plate: indigoPlate,
  }, // Indigo
  meinamix_meinaV11: {
    friendlyName: "Meinamix",
    hexColor: "#FF69B4",
    unicode: "ℳ",
    plate: meinaPlate,
  }, // Hot Pink
  realisticVisionV51_v51VAE: {
    friendlyName: "Realistic Vision",
    hexColor: "#2E8B57",
    unicode: "⫌",
    plate: realisticPlate,
  }, // Sea Green
  revAnimated_v122EOL: {
    friendlyName: "Rev Animated",
    hexColor: "#FF6347",
    unicode: "⍼",
    plate: revanimatedPlate,
  }, // Tomato
  toonyou_beta6: {
    friendlyName: "Toonyou",
    hexColor: "#FFA07A",
    unicode: "◬",
    plate: toonyouPlate,
  }, // Light Salmon
  "v1-5-pruned-emaonly": {
    friendlyName: "1.5",
    hexColor: "#B0C4DE",
    // unicode: "⏺",
    unicode: "‡",
    plate: onefivePlate,
  }, // Light Steel Blue
};
