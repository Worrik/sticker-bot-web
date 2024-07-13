<script setup lang="ts">
import type { IPage } from '~/models/pagination';
import type { IStickerPaper, IStickerCartItem } from '~/models/stickers';

const router = useRouter();

const cart = useState<Array<IStickerCartItem>>('cart', () => []);

const { data: stickerPapers } = await useFetch<IPage<IStickerPaper>>(`${apiUrl}/stickers/papers/?per_page=100`);

function getStickerPaperByName(name: string): IStickerPaper | undefined {
  return stickerPapers.value?.items.find((paper) => paper.name === name);
}

watch(
  stickerPapers,
  () => {
    if (!stickerPapers.value?.items.length) return;
    cart.value.forEach((stickerItem) => {
      if (stickerItem.options.length) return;
      stickerItem.options.push({
        paperType: stickerPapers.value?.items[0].name!,
        quantity: 1,
      });
    });
  },
  { deep: true }
)

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
      <v-app-bar-title>Обери стікери</v-app-bar-title>
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
      <v-alert text="Доставка по Україні - 60 грн." type="info" variant="tonal" class="mt-4"></v-alert>
    </div>
    <tg-back-button @click="router.push('/stickers')" />
    <tg-main-button
      v-if="orderSumPrice > 0"
      :text="`Підтвердити замовлення (${orderSumPrice} грн.)`"
      @click="createOrder"
    />
  </div>
</template>
