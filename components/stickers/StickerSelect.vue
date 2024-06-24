<script setup lang="ts">
import type { IStickerCartItem } from '~/models/stickers';

export interface Props {
  stickerCartItem: IStickerCartItem;
}

export interface Emits {
  (event: 'addToCart'): void;
  (event: 'removeFromCart'): void;
  (event: 'removeSticker'): void;
}

defineProps<Props>();
const emits = defineEmits<Emits>();
</script>

<template>
  <v-card width="175">
    <v-img class="sticker-img ma-2" :src="localStickerCartItem.sticker.url"></v-img>
  </v-card>
</template>

<style scoped>
.chosen {
  border: 5px solid var(--tg-theme-link-color);
  margin: 5px;
}

.stickers-img:active {
  transform: scale(0.9);
}
</style>
