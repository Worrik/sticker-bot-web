export interface ISticker {
  id: number;
  url: string;
}

export interface IStickerCartItem {
  sticker: ISticker;
  quantity: number;
  paperType: 'Глянцевий' | 'Матовий';
}
