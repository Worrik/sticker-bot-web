<script setup lang="ts">
import type { INPData } from '~/models/novaposhta';
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
  `${apiUrl}/stickers/papers/?per_page=100`,
  {
    onResponse() {},
  }
);

onMounted(async () => {
  await nextTick();
  if (!stickerPapers.value?.items.length) return;
  cart.value = cart.value.map((stickerItem) => {
    if (!stickerItem.options.length)
      stickerItem.options.push({
        paperType: stickerPapers.value?.items[0].name!,
        quantity: 1,
      });
    return stickerItem;
  });
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
  async () => {
    if (!npData.value.city || !npData.value.warehouse) {
      deliveryPrice.value = 0;
      return;
    }
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
          CityRecipient: npData.value.city.Ref,
          Weight: '0.2',
          ServiceType: 'WarehouseWarehouse',
          Cost: '50',
          CargoType: 'Cargo',
          SeatsAmount: '1',
        },
      },
    });
    deliveryPrice.value = result.data[0].Cost;
  },
  { deep: true }
);

const orderSumPrice = computed(() => {
  return (
    cart.value.reduce((acc, stickerItem) => {
      return (
        acc +
        stickerItem.options.reduce((acc, option) => {
          const paper = getStickerPaperByName(option.paperType);
          const price = paper?.price || 0;
          return acc + option.quantity * price;
        }, 0)
      );
    }, 0) + 60
  );
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
    }),
  });
  window.Telegram.WebApp.showAlert('Замовлення успішно створено. Очікуйте підтвердження.');
  window.Telegram.WebApp.close();
}
</script>

<template>
  <div>
    <v-app-bar>
      <v-app-bar-title>Обери папір та доставку</v-app-bar-title>
      <template #append>
        <v-chip :color="orderSumPrice > 0 ? 'primary' : 'grey'" text-color="white" class="mr-4">
          ₴ {{ orderSumPrice }}
        </v-chip>
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
    </div>
    <tg-back-button @click="router.push('/stickers')" />
    <tg-main-button
      v-if="orderSumPrice > 0 && isDeliverySelected()"
      :text="`Підтвердити замовлення (${orderSumPrice} грн.)`"
      @click="createOrder"
    />
  </div>
</template>
