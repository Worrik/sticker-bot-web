<script setup lang="ts">
import type { ISticker } from '~/models/stickers';

export interface Props {
  sticker: ISticker;
}

defineProps<Props>();
</script>

<template>
  <div>{{ sticker }}</div>
</template>