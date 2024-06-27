<script setup lang="ts">
import type { IStickerCartItem } from '~/models/stickers';

const router = useRouter();

const cart = useState<Array<IStickerCartItem>>('cart', () => []);

async function goToCheckout() {
  router.push('/checkout');
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
    <tg-main-button text="Перейти до оплати" @click="" />
  </div>
</template>
