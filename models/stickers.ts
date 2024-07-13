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
