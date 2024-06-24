<script setup lang="ts">
import type { ISticker } from '~/models/stickers';

export interface Props {
  sticker: ISticker;
  selected: boolean;
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
  <v-card
    width="150"
    class="sticker"
    :class="{
      chosen: selected,
    }"
    @click="selected ? emits('removeFromCart') : emits('addToCart')"
  >
    <v-img class="sticker-img ma-2" :src="sticker.url"></v-img>
  </v-card>
</template>

<style scoped>
.sticker {
  cursor: pointer;
  border: 5px solid transparent;
}
.chosen {
  border: 5px solid var(--tg-theme-link-color);
}
.stickers-img:active {
  transform: scale(0.9);
}
</style>
