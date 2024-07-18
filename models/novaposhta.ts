export interface ICity {
  Ref: string;
  CityID: string;
  Description: string;
  Area: string;
  AreaDescription: string;
  SettlementTypeDescription: string;
}

export interface ICityWarehouse {
  SiteKey: string;
  Description: string;
  ShortAddress: string;
  Ref: string;
  Number: string;
  CityRef: string;
  CityDescription: string;
}

export interface INovaPoshtaAPISearch<T> {
  items: Array<T>;
  loading: boolean;
  search(searchKeyword: string): Promise<void>;
  loadMore(): Promise<void>;
}

export interface INPData {
  city?: ICity;
  warehouse?: ICityWarehouse;
  phone?: string;
  name?: string;
}