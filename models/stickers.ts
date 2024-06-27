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

export const PAPER_COSTS = {
  [PaperTypes.Glossy]: 15,
  [PaperTypes.Matte]: 15,
  [PaperTypes.Magnetic]: 60,
  [PaperTypes.Yellow]: 10,
};
