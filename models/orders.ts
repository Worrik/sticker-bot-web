import type { ISticker } from "./stickers";

export interface OrderUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface IOrderStickerOption {
  paper: string;
  quantity: number;
}

export interface IOrderSticker {
  sticker: ISticker;
  options: IOrderStickerOption[];
}

export interface IOrder {
  id: number;
  created_at: string;
  updated_at: string;
  status: string;
  url?: string;
  city: string;
  warehouse: string;
  phone: string;
  name: string;
  user: OrderUser;
  stickers: IOrderSticker[];
}
