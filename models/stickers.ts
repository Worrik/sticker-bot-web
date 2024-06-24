export interface ISticker {
  id: number;
  url: string;
}

export enum PaperTypes {
  Glossy = 'Глянцевий',
  Matte = 'Матовий',
  Yellow = 'Жовтий',
  Magnetic = 'Магнітний',
}

export interface IStickerOption {
  quantity: number;
  paperType: PaperTypes;
}

export interface IStickerCartItem {
  sticker: ISticker;
  options: Array<IStickerOption>;
}
