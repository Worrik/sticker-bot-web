<script setup lang="ts">
import type { ISticker } from '~/models/stickers';

export interface Props {
  sticker: ISticker;
}

defineProps<Props>();
</script>

<template>
  <v-card class="d-flex flex-row">
    <v-img class="sticker-img" :src="sticker.url"></v-img>
  </v-card>
</template>