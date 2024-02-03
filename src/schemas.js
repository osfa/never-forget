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

// export const availableSchemas = [ANIVERSE, ANIME, y1997, SECOND_LIFE];
export const availableSchemas = [
  ANIVERSE1,
  // ANIVERSE,
  // ANIME,
  // y1997,
  // SECOND_LIFE,
];
