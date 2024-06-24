<script setup lang="ts">
import type { ISticker, IStickerOption } from '~/models/stickers';
import { PaperTypes } from '~/models/stickers';

export interface Props {
  sticker: ISticker;
}

defineProps<Props>();

const options = ref<Array<IStickerOption>>([
  {
    paperType: PaperTypes.Glossy,
    quantity: 1,
  },
]);

const notSelectedPaperTypes = computed(() => {
  return [PaperTypes.Glossy, PaperTypes.Matte, PaperTypes.Magnetic, PaperTypes.Yellow].filter(
    (type) => !options.value.some((option) => option.paperType === type)
  );
});

function availablePaperTypes(option: IStickerOption) {
  return notSelectedPaperTypes.value.concat(option.paperType);
}

function addOption() {
  if (notSelectedPaperTypes.value.length === 0) return;
  options.value.push({
    paperType: notSelectedPaperTypes.value[0],
    quantity: 1,
  });
}
</script>

<template>
  <v-card class="d-flex flex-row pa-2 ga-2" variant="tonal">
    <div :style="{ width: '30vw', height: '30vw' }">
      <v-img class="sticker-img" :src="sticker.url"></v-img>
    </div>
    <v-divider vertical></v-divider>
    <div>
      <div v-for="option in options" :key="option.paperType" class="d-flex flex-row align-center ga-1">
        <v-select
          v-model="option.paperType"
          :items="availablePaperTypes(option)"
          label="Тип паперу"
          class="rounded px-2"
          variant="solo"
          hide-details
          flat
        ></v-select>
        <v-text-field
          v-model="option.quantity"
          label="Кількість"
          type="number"
          min="1"
          max="100"
        ></v-text-field>
        <v-btn icon="mdi-close" size="x-small" variant="tonal"></v-btn>
      </div>
      <v-btn
        v-if="notSelectedPaperTypes.length"
        variant="tonal"
        density="compact"
        block
        @click="addOption"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>
