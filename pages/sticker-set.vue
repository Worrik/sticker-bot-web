<script setup lang="ts">
import type { IStickerSet, IStickerThumbnail } from '~/models/stickers';

const route = useRoute();

const { data: stickerSet } = await useFetch<IStickerSet>(
  `${apiUrl}/stickers/set/?name=${route.query.name}`
);

const selectedStickers = ref<Array<IStickerThumbnail>>([]);

const progress = ref(0);
const loading = ref(false);

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

function selectOrUnselectAll() {
  if (selectedStickers.value.length !== stickerSet.value?.stickers.length) {
    selectedStickers.value = stickerSet.value?.stickers || [];
  } else {
    selectedStickers.value = [];
  }
}

async function addStickers() {
  loading.value = true;
  for (let index = 0; index < selectedStickers.value.length; index++) {
    const sticker = selectedStickers.value[index];
    progress.value = Math.round(((index + 1) / selectedStickers.value.length) * 100);
    await $fetch(`${apiUrl}/stickers/save/${sticker.sticker_id}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getWebAppInitData(),
      },
    });
  }
  loading.value = false;
  window.Telegram.WebApp.showAlert('Стікери збережено.');
  window.Telegram.WebApp.close();
}
</script>

<template>
  <v-container class="d-flex justify-center flex-column" :class="{ 'opacity-50': loading, 'disable-events': loading }">
    <v-progress-linear
      :model-value="progress"
      :active="loading"
      color="primary"
      absolute
      bottom
    ></v-progress-linear>
    <v-row>
      <h1 class="text-center">
        {{ stickerSet?.name }}
      </h1>
    </v-row>
    <v-row class="my-4 px-2">
      <v-btn variant="tonal" color="primary" appendIcon="mdi-check" @click="selectOrUnselectAll">
        {{
          selectedStickers.length !== stickerSet?.stickers.length ? 'Вибрати всі' : 'Прибрати всі'
        }}
      </v-btn>
    </v-row>
    <v-row class="justify-center flex-wrap">
      <div class="d-flex flex-column px-2 ga-4">
        <StickersStickerSelect
          v-for="sticker in oddCartColumn"
          :key="sticker.file_id"
          :url="`${apiUrl}/stickers/download/thumb/${sticker.file_id}/`"
          :selected="isStickerSelected(sticker)"
          @select="selectSticker(sticker)"
          @unselect="unselectSticker(sticker)"
        />
      </div>
      <div class="d-flex flex-column px-2 ga-4">
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
    <tg-main-button v-if="selectedStickers.length > 0" text="Додати" @click="addStickers" />
  </v-container>
</template>

<style scoped>
.disable-events {
  pointer-events: none;
}
</style>
