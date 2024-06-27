<script setup lang="ts">
import { PAPER_COSTS, type IStickerCartItem } from '~/models/stickers';

const router = useRouter();

const cart = useState<Array<IStickerCartItem>>('cart', () => []);

const orderSumPrice = computed(() => {
  return cart.value.reduce((acc, stickerItem) => {
    return (
      acc +
      stickerItem.options.reduce((acc, option) => {
        return acc + option.quantity * PAPER_COSTS[option.paperType];
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
          <v-icon left>mdi-sticker</v-icon>
          ₴ {{ orderSumPrice }}
        </v-chip>
      </template>
    </v-app-bar>
    <div class="py-12"></div>
    <div class="pa-4">
      <div class="d-flex flex-column ga-4">
        <StickersStickerPaperConfig
          v-for="stickerItem in cart"
          :key="stickerItem.sticker.id"
          v-model:sticker="stickerItem.sticker"
          :options="stickerItem.options"
        />
      </div>
      <tg-back-button @click="router.push('/stickers')" />
      <tg-main-button
        v-if="orderSumPrice > 0"
        :text="`Підтвердити замовлення (${orderSumPrice} грн.)`"
        @click="createOrder"
      />
    </div>
  </div>
</template>
