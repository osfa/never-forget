import { aniversePlate } from "./data/aniverse-plate.js";
import { epicPlate } from "./data/epic-plate.js";
import { meinaPlate } from "./data/meina-plate.js";

export const MODEL_META_MAP = {
  // "3dAnimationDiffusion_v10": {
  //   friendlyName: "3D Anim",
  //   hexColor: "#DA70D6",
  //   unicode: "ↂ",
  // }, // Orchid
  aniverse_v15Pruned: {
    friendlyName: "Aniverse",
    hexColor: "#FFD700",
    unicode: "₻",
    plate: aniversePlate,
  }, // Gold
  // counterfeitV30_v30: {
  //   friendlyName: "Counterfeit",
  //   hexColor: "#FF4500",
  //   unicode: "⏅",
  // }, // Orange Red
  // divineanimemix_V2: {
  //   friendlyName: "Divine Anime",
  //   hexColor: "#BA55D3",
  //   unicode: "⁂",
  // }, // Medium Orchid
  // // dreamlike: {
  // "dreamlike-photoreal-2.0": {
  //   friendlyName: "Dreamlike",
  //   hexColor: "#ADD8E6",
  //   unicode: "∑",
  // }, // Light Blue
  // dreamshaper_8: {
  //   friendlyName: "Dreamshaper",
  //   hexColor: "#20B2AA",
  //   unicode: "≝",
  // }, // Light Sea Green
  epicrealism_naturalSinRC1VAE: {
    friendlyName: "Epic Realism",
    hexColor: "#778899",
    unicode: "‖",
    plate: epicPlate,
  }, // Light Slate Gray
  // indigoComic_v10withvae: {
  //   friendlyName: "Indigo Comic",
  //   hexColor: "#4B0082",
  //   unicode: "∭",
  // }, // Indigo
  meinamix_meinaV11: {
    friendlyName: "Meinamix",
    hexColor: "#FF69B4",
    unicode: "ℳ",
    plate: meinaPlate,
  }, // Hot Pink
  // realisticVisionV51_v51VAE: {
  //   friendlyName: "Realistic Vision",
  //   hexColor: "#2E8B57",
  //   unicode: "⫌",
  // }, // Sea Green
  // revAnimated_v122EOL: {
  //   friendlyName: "Rev Animated",
  //   hexColor: "#FF6347",
  //   unicode: "⍼",
  // }, // Tomato
  // toonyou_beta6: { friendlyName: "Toonyou", hexColor: "#FFA07A", unicode: "◬" }, // Light Salmon
  // "v1-5-pruned-emaonly": {
  //   friendlyName: "1.5",
  //   hexColor: "#B0C4DE",
  //   unicode: "⏺",
  // }, // Light Steel Blue
};
