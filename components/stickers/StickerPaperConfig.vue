<script setup lang="ts">
import type { ISticker } from '~/models/stickers';

export interface Props {
  sticker: ISticker;
}

defineProps<Props>();
</script>

<template>
  <v-card class="d-flex flex-row">
    <div :style="{'width': '30vw', 'height': '30vw'}">
      <v-img class="sticker-img" :src="sticker.url"></v-img>
    </div>
  </v-card>
</template>