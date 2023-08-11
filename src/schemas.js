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
export const availableSchemas = [ANIME, y1997, SECOND_LIFE];
