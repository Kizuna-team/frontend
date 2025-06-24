// 貼圖數據配置文件
export const defaultStickers = [
  {
    id: 1,
    name: "蛋包飯",
    url: "/stickers/01.png",
    emoji: "🍙",
  },
  {
    id: 2,
    name: "蛋糕",
    url: "/stickers/02.png",
    emoji: "🍰",
  },
  {
    id: 3,
    name: "布丁",
    url: "/stickers/03.png",
    emoji: "🍮",
  },
  {
    id: 3,
    name: "爆米花",
    url: "/stickers/18.png",
    emoji: "🍿",
  },
  {
    id: 4,
    name: "酒",
    url: "/stickers/19.png",
    emoji: "🍺",
  },
  {
    id: 5,
    name: "香蕉皮",
    url: "/stickers/14.png",
    emoji: "🍌",
  },
  {
    id: 6,
    name: "烏龜",
    url: "/stickers/04.png",
    emoji: "🐢",
    category: "animal",
  },
  {
    id: 7,
    name: "蝴蝶",
    url: "/stickers/05.png",
    emoji: "🦋",
  },
  {
    id: 8,
    name: "貓咪",
    url: "/stickers/06.png",
    emoji: "🐈",
  },
  {
    id: 9,
    name: "狗",
    url: "/stickers/13.png",
    emoji: "🐕",
  },
  {
    id: 10,
    name: "外星人1",
    url: "/stickers/07.png",
    emoji: "👽",
  },
  {
    id: 11,
    name: "外星人2",
    url: "/stickers/08.png",
    emoji: "👾",
  },
  {
    id: 12,
    name: "外星人3",
    url: "/stickers/09.png",
    emoji: "🤖",
  },
  {
    id: 13,
    name: "大便",
    url: "/stickers/10.png",
    emoji: "💩",
  },
  {
    id: 14,
    name: "鬼",
    url: "/stickers/12.png",
    emoji: "👻",
  },
  {
    id: 15,
    name: "讚",
    url: "/stickers/11.png",
    emoji: "👍",
  },
  {
    id: 17,
    name: "愛心(粉)",
    url: "/stickers/15.png",
    emoji: "💗",
  },
  {
    id: 18,
    name: "愛心(紅)",
    url: "/stickers/16.png",
    emoji: "❤",
  },
  {
    id: 19,
    name: "花",
    url: "/stickers/17.png",
    emoji: "💐",
  },
  {
    id: 20,
    name: "鬼臉",
    url: "/stickers/20.png",
    emoji: "🤪",
  },
];

export const validateSticker = (sticker) => {
  const requiredFields = ["id", "name", "url", "emoji"];
  return requiredFields.every(
    (field) =>
      sticker.hasOwnProperty(field) &&
      sticker[field] !== null &&
      sticker[field] !== ""
  );
};

// 新增自定義貼圖的輔助函數
export const createSticker = (id, name, url, emoji) => {
  const sticker = { id, name, url, emoji };

  if (!validateSticker(sticker)) {
    throw new Error("Invalid sticker data format");
  }

  return sticker;
};
