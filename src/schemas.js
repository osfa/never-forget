const ANIME = {
  Image: {
    xmlns: "http://schemas.microsoft.com/deepzoom/2008",
    Url: "/dzi/anime_files/",
    Format: "jpeg",
    Overlap: "1",
    TileSize: "254",
    ServerFormat: "Default",
    Size: {
      Height: "27000",
      Width: "48000",
    },
  },
};
const y1997 = {
  Image: {
    xmlns: "http://schemas.microsoft.com/deepzoom/2008",
    Url: "/dzi/secondlife_files/",
    Format: "jpeg",
    Overlap: "1",
    TileSize: "254",
    ServerFormat: "Default",
    Size: {
      Height: "27000",
      Width: "48000",
    },
  },
};
const SECOND_LIFE = {
  Image: {
    xmlns: "http://schemas.microsoft.com/deepzoom/2008",
    Url: "/dzi/y1997_files/",
    Format: "jpeg",
    Overlap: "1",
    TileSize: "254",
    ServerFormat: "Default",
    Size: {
      Height: "27000",
      Width: "48000",
    },
  },
};
const ANIVERSE = {
  Image: {
    xmlns: "http://schemas.microsoft.com/deepzoom/2008",
    Url: "/dzi/aniverse-v0_files/",
    Format: "jpeg",
    Overlap: "1",
    TileSize: "254",
    ServerFormat: "Default",
    Size: {
      Height: "28800",
      Width: "51200",
    },
  },
};
const ANIVERSE1 = {
  Image: {
    xmlns: "http://schemas.microsoft.com/deepzoom/2008",
    Url: "/dzi/aniverse-v1.0_files/",
    Format: "jpeg",
    Overlap: "1",
    TileSize: "254",
    ServerFormat: "Default",
    Size: {
      Height: "27000",
      Width: "48000",
    },
  },
  height: 27000,
  width: 48000,
  tileSize: 256,
  tileOverlap: 1,
  // minLevel: 8,
  // maxLevel: 8,
  getTileUrl: function (level, x, y) {
    const models = ["aniverse-v1.0", "aniverse-v0"];

    // how to hook in here and select based on global settings?

    const randomModel = models[Math.floor(Math.random() * models.length)];
    // http://localhost:3000/dzi/aniverse-v1.0_files/12/10_4.jpeg
    // http://localhost:3000/dzi/
    return `http://jpeg.matrix.surf/dzi/${randomModel}_files/${level}/${x}_${y}.jpeg`;
    return `https://remember.matrix.surf/dzi/${randomModel}_files/${level}/${x}_${y}.jpeg`;
    return `http://localhost:3000/dzi/${randomModel}_files/${level}/${x}_${y}.jpeg`;

    return (
      "http://s3.amazonaws.com/com.modestmaps.bluemarble/" +
      (level - 8) +
      "-r" +
      y +
      "-c" +
      x +
      ".jpg"
    );
  },
};

const DREAM = {
  Image: {
    xmlns: "http://schemas.microsoft.com/deepzoom/2008",
    Url: "/dzi/_local/dreamshaper_8-5f4e6134-d704-11ee-a188-120e0458f973-10x10-fullhd-fry-fit-q10-10x10-1920x1080_files/",
    Format: "jpeg",
    Overlap: "1",
    TileSize: "512",
    ServerFormat: "Default",
    Size: {
      Height: "10800",
      Width: "19200",
    },
  },
  height: 10800,
  width: 19200,
  tileSize: 512,
  tileOverlap: 1,
  getTileUrl: function (level, x, y) {
    const models = [
      "epicrealism_naturalSinRC1VAE-9d70e6d0-d709-11ee-8536-120e0458f973-10x10-fullhd-no-fry-fit-q50-10x10",
      // "dreamshaper_8-5f4e6134-d704-11ee-a188-120e0458f973-10x10-fullhd-fry-fit-q10-10x10-1920x1080",
    ];
    // how to hook in here and select based on global settings?
    const randomModel = models[Math.floor(Math.random() * models.length)];
    return `http://localhost:3000/dzi/_local/${randomModel}_files/${level}/${x}_${y}.jpeg`;
  },
};

const EPIC = {
  Image: {
    xmlns: "http://schemas.microsoft.com/deepzoom/2008",
    Url: "/dzi/_local/epicrealism_naturalSinRC1VAE-9d70e6d0-d709-11ee-8536-120e0458f973-10x10-fullhd-fry-fit-q10-10x10-1920x1080_files/",
    Format: "jpeg",
    Overlap: "1",
    TileSize: "512",
    ServerFormat: "Default",
    Size: {
      Height: "10800",
      Width: "19200",
    },
  },
  height: 10800,
  width: 19200,
  tileSize: 512,
  tileOverlap: 1,
  getTileUrl: function (level, x, y) {
    const models = [
      "epicrealism_naturalSinRC1VAE-9d70e6d0-d709-11ee-8536-120e0458f973-10x10-fullhd-no-fry-fit-q50-10x10",
      "dreamshaper_8-5f4e6134-d704-11ee-a188-120e0458f973-10x10-fullhd-fry-fit-q10-10x10-1920x1080",
    ];
    // how to hook in here and select based on global settings?
    const randomModel = models[Math.floor(Math.random() * models.length)];
    return `http://localhost:3000/dzi/_local/${randomModel}_files/${level}/${x}_${y}.jpeg`;
  },
};

// export const availableSchemas = [ANIVERSE, ANIME, y1997, SECOND_LIFE];
export const availableSchemas = [
  EPIC,
  DREAM,
  // ANIVERSE1,
  // ANIVERSE,
  // ANIME,
  // y1997,
  // SECOND_LIFE,
];
