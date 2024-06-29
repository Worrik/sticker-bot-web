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
  [PaperTypes.Glossy]: 10,
  [PaperTypes.Matte]: 10,
  [PaperTypes.Magnetic]: 50,
  [PaperTypes.Yellow]: 8,
};
