<script setup lang="ts">
export interface Props {
  url: string;
  selected: boolean;
}

export interface Emits {
  (event: 'select'): void;
  (event: 'unselect'): void;
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
    @click="selected ? emits('unselect') : emits('select')"
  >
    <v-skeleton-loader type="image" height="140">
      <v-img class="sticker-img ma-2" :src="url"></v-img>
    </v-skeleton-loader>
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
