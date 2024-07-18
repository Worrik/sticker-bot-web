<script setup lang="ts">
import type { ICity, ICityWarehouse, INPData } from '~/models/novaposhta';
import type { IPage } from '~/models/pagination';
import type { IStickerPaper, IStickerCartItem } from '~/models/stickers';

const router = useRouter();

const cart = useState<Array<IStickerCartItem>>('cart', () => []);
const npData = ref<INPData>({
  phone: '',
  name: '',
  city: undefined,
  warehouse: undefined,
});
const deliveryPrice = ref<number>(0);

const { data: stickerPapers } = await useFetch<IPage<IStickerPaper>>(
  `${apiUrl}/stickers/papers/?per_page=100`
);

const { data: lastDelivery } = await useFetch<{
  city: string | null;
  warehouse: string | null;
  phone: string | null;
  name: string | null;
}>(
  `${apiUrl}/orders/last-delivery/`,
  { headers: { Authorization: getWebAppInitData() } }
);

async function getCityByRef(ref_value: string): Promise<ICity | null> {
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

async function getWarehouseByRef(ref_value: string): Promise<ICityWarehouse | null> {
  const result = await $fetch<{ data: ICityWarehouse[]; info: { totalCount: number } }>(
    'https://api.novaposhta.ua/v2.0/json/',
    {
      method: 'POST',
      body: {
        apiKey: '',
        modelName: 'Address',
        calledMethod: 'getWarehouses',
        methodProperties: { CityRef: ref_value },
      },
    }
  );
  return result.data[0];
}

onMounted(async () => {
  await nextTick();
  if (stickerPapers.value?.items.length)
    cart.value = cart.value.map((stickerItem) => {
      if (!stickerItem.options.length)
        stickerItem.options.push({
          paperType: stickerPapers.value?.items[0].name!,
          quantity: 1,
        });
      return stickerItem;
    });

  if (lastDelivery.value) {
    const city = await getCityByRef(lastDelivery.value.city!);
    const warehouse = await getWarehouseByRef(lastDelivery.value.warehouse!);
    npData.value = {
      phone: lastDelivery.value.phone,
      name: lastDelivery.value.name,
      city,
      warehouse,
    };
  }
});

function getStickerPaperByName(name: string): IStickerPaper | undefined {
  return stickerPapers.value?.items.find((paper) => paper.name === name);
}

function isDeliverySelected(): boolean {
  return (
    !!npData.value.city && !!npData.value.warehouse && !!npData.value.phone && !!npData.value.name
  );
}

watch(
  npData,
  async (newValue, oldValue) => {
    if (!newValue.city) {
      deliveryPrice.value = 0;
      return;
    }
    if (oldValue.city?.Ref === newValue.city.Ref) return;
    const result = await $fetch<{
      data: Array<{
        AssessedCost: number;
        Cost: number;
      }>;
      info: { totalCount: number };
    }>('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      body: {
        apiKey: '',
        modelName: 'InternetDocumentGeneral',
        calledMethod: 'getDocumentPrice',
        methodProperties: {
          CitySender: 'db5c88d0-391c-11dd-90d9-001a92567626',
          CityRecipient: newValue.city.Ref,
          Weight: '0.2',
          ServiceType: 'WarehouseWarehouse',
          Cost: '50',
          CargoType: 'Cargo',
          SeatsAmount: '1',
          PackCount: '1',
          PackRef: '0b39fcdc-45e3-11e7-80c8-005056887b8d',
        },
      },
    });
    deliveryPrice.value = result.data[0].Cost + 5;
  },
  { deep: true }
);

const orderSumPrice = computed(() => {
  return cart.value.reduce((acc, stickerItem) => {
    return (
      acc +
      stickerItem.options.reduce((acc, option) => {
        const paper = getStickerPaperByName(option.paperType);
        const price = paper?.price || 0;
        return acc + option.quantity * price;
      }, 0)
    );
  }, 0);
});

async function createOrder() {
  const stickers = cart.value.map((stickerItem) => {
    return {
      sticker_id: stickerItem.sticker.id,
      options: stickerItem.options.map((option) => {
        return {
          paper: option.paperType,
          quantity: option.quantity,
        };
      }),
    };
  });
  await $fetch(`${apiUrl}/orders/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getWebAppInitData(),
    },
    body: JSON.stringify({
      stickers: stickers,
      city_ref: npData.value.city?.Ref,
      warehouse_ref: npData.value.warehouse?.Ref,
      name: npData.value.name,
      phone: npData.value.phone,
    }),
  });
  window.Telegram.WebApp.showAlert('Замовлення успішно створено. Очікуйте підтвердження.');
  window.Telegram.WebApp.close();
}
</script>

<template>
  <div>
    <v-app-bar>
      <v-app-bar-title>Папір та доставка</v-app-bar-title>
      <template #append>
        <span>
          <v-chip :color="orderSumPrice > 0 ? 'primary' : 'grey'" text-color="white">
            <v-icon left>mdi-sticker</v-icon>: ₴ {{ orderSumPrice }}
          </v-chip>
          <span class="mx-2">+</span>
          <v-chip :color="deliveryPrice ? 'primary' : 'grey'" text-color="white">
            <v-icon left>mdi-truck-delivery</v-icon>: ₴ {{ deliveryPrice || '---' }}
          </v-chip>
        </span>
      </template>
    </v-app-bar>
    <div class="py-12"></div>
    <div class="pa-4">
      <div class="d-flex flex-column ga-4">
        <StickersStickerPaperConfig
          v-for="stickerItem in cart"
          v-model:sticker="stickerItem.sticker"
          :key="stickerItem.sticker.id"
          :options="stickerItem.options"
          :sticker-papers="stickerPapers?.items || []"
        />
      </div>
      <h2 class="mt-8">Доставка</h2>
      <NovaposhtaDeliverySelect v-model:np-data="npData" />
      <div class="py-12"></div>
    </div>
    <tg-back-button @click="router.push('/stickers')" />
    <tg-main-button
      v-if="orderSumPrice > 0 && isDeliverySelected()"
      :text="`Підтвердити замовлення (${orderSumPrice + deliveryPrice} грн.)`"
      @click="createOrder"
    />
  </div>
</template>
