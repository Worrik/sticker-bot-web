<script setup lang="ts">
import type { IStickerSet, IStickerThumbnail } from '~/models/stickers';

const route = useRoute();

const { data: stickerSet } = await useFetch<IStickerSet>(
  `${apiUrl}/stickers/set/?name=${route.query.name}`
);

console.log(stickerSet.value);

const selectedStickers = ref<Array<IStickerThumbnail>>([]);

const oddCartColumn = computed<Array<IStickerThumbnail>>(() => {
  return stickerSet.value?.stickers.filter((_, index) => index % 2 === 0) || [];
});

const evenCartColumn = computed<Array<IStickerThumbnail>>(() => {
  return stickerSet.value?.stickers.filter((_, index) => index % 2 === 1) || [];
});

function isStickerSelected(sticker: IStickerThumbnail): boolean {
  return selectedStickers.value.some(
    (selectedSticker) => selectedSticker.file_id === sticker.file_id
  );
}

function selectSticker(sticker: IStickerThumbnail) {
  if (isStickerSelected(sticker)) return;
  selectedStickers.value.push(sticker);
}

function unselectSticker(sticker: IStickerThumbnail) {
  selectedStickers.value = selectedStickers.value.filter(
    (selectedSticker) => selectedSticker.file_id !== sticker.file_id
  );
}

function selectAll() {
  selectedStickers.value = stickerSet.value?.stickers || [];
}
</script>

<template>
  <v-container class="d-flex justify-center flex-column">
    <h1 class="text-center">
      {{ stickerSet?.name }}
    </h1>
    <v-btn
      variant="tonal"
      color="primary"
      appendIcon="mdi-check"
      :disabled="selectedStickers.length === stickerSet?.stickers.length"
      @click="selectAll"
    >
      Обрати всі
    </v-btn>
    <v-row class="justify-center flex-wrap">
      <div class="d-flex justify-end flex-column px-2 ga-4">
        <StickersStickerSelect
          v-for="sticker in oddCartColumn"
          :key="sticker.file_id"
          :url="`${apiUrl}/stickers/download/thumb/${sticker.file_id}/`"
          :selected="isStickerSelected(sticker)"
          @select="selectSticker(sticker)"
          @unselect="unselectSticker(sticker)"
        />
      </div>
      <div class="d-flex justify-start flex-column px-2 ga-4">
        <StickersStickerSelect
          v-for="sticker in evenCartColumn"
          :key="sticker.file_id"
          :url="`${apiUrl}/stickers/download/thumb/${sticker.file_id}/`"
          :selected="isStickerSelected(sticker)"
          @select="selectSticker(sticker)"
          @unselect="unselectSticker(sticker)"
        />
      </div>
    </v-row>
  </v-container>
</template>
