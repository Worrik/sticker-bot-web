export interface ISticker {
  id: number;
  url: string;
}

export interface IStickerOption {
  quantity: number;
  paperType: string;
}

export interface IStickerCartItem {
  sticker: ISticker;
  options: Array<IStickerOption>;
}

export interface IStickerPaper {
  name: string;
  price: number;
}

export interface IStickerThumbnail {
  file_id: string;
  sticker_id: string;
}

export interface IStickerSet {
  name: string;
  stickers: Array<IStickerThumbnail>;
}
