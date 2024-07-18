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
  reset(): void;
}

export interface INPData {
  city?: ICity | null;
  warehouse?: ICityWarehouse | null;
  phone?: string | null;
  name?: string | null;
}