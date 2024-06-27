<script setup lang="ts">
import type { IStickerCartItem } from '~/models/stickers';

const router = useRouter();

const cart = useState<Array<IStickerCartItem>>('cart', () => []);

async function createOrder() {
  const stickers = cart.value
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
  <div class="pa-4">
    <div class="d-flex flex-column ga-4">
      <StickersStickerPaperConfig
        v-for="stickerItem in cart"
        :key="stickerItem.sticker.id"
        :sticker="stickerItem.sticker"
        :options="stickerItem.options"
      />
    </div>
    <tg-back-button @click="router.push('/stickers')" />
    <tg-main-button text="Підтвердити замовлення" @click="" />
  </div>
</template>
