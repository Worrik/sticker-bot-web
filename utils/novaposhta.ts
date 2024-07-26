import type { ICity, ICityWarehouse } from "~/models/novaposhta";


export async function getCityByRef(ref_value: string): Promise<ICity | null> {
  const result = await $fetch<{ data: ICity[]; info: { totalCount: number } }>(
    'https://api.novaposhta.ua/v2.0/json/',
    {
      method: 'POST',
      body: {
        apiKey: '',
        modelName: 'Address',
        calledMethod: 'getCities',
        methodProperties: { Ref: ref_value },
      },
    }
  );
  return result.data[0];
}

export async function getWarehouseByRef(ref_value: string): Promise<ICityWarehouse | null> {
  const result = await $fetch<{ data: ICityWarehouse[]; info: { totalCount: number } }>(
    'https://api.novaposhta.ua/v2.0/json/',
    {
      method: 'POST',
      body: {
        apiKey: '',
        modelName: 'Address',
        calledMethod: 'getWarehouses',
        methodProperties: { Ref: ref_value },
      },
    }
  );
  return result.data[0];
}