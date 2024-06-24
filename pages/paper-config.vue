<script setup lang="ts">
import type { IStickerCartItem } from '~/models/stickers';

const router = useRouter();

const cart = useState<Array<IStickerCartItem>>('cart', () => []);
</script>

<template>
  <div class="pa-4">
    <tg-back-button @click="router.push('/stickers')" />
    <div class="d-flex flex-column ga-4">
      <StickersStickerPaperConfig
        v-for="stickerItem in cart"
        :key="stickerItem.sticker.id"
        :sticker="stickerItem.sticker"
      />
    </div>
  </div>
</template>
