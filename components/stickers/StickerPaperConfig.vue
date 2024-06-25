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

function removeOption(index: number) {
  options.value.splice(index, 1);
}
</script>

<template>
  <v-card class="d-flex flex-row pa-2 ga-2" variant="elevated">
    <div :style="{ width: '30vw', height: '30vw' }">
      <v-img class="sticker-img" :src="sticker.url"></v-img>
    </div>
    <v-divider vertical></v-divider>
    <div class="d-flex ga-2 flex-column w-100">
      <div
        v-for="(option, index) in options"
        :key="option.paperType"
        class="d-flex flex-row align-center"
      >
        <v-select
          v-model="option.paperType"
          :items="availablePaperTypes(option)"
          label="Тип паперу"
          class="rounded px-2"
          variant="solo"
          hide-details="auto"
          flat
        ></v-select>
        <v-number-input
          v-model="option.quantity"
          label="Кількість"
          min="0"
          max="100"
          hide-details="auto"
          width="3"
          @update:modelValue="option.quantity = parseInt($event)"
        ></v-number-input>
      </div>
      <v-btn
        v-if="notSelectedPaperTypes.length"
        class="w-100"
        variant="tonal"
        density="compact"
        @click="addOption"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>
