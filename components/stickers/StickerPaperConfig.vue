<script setup lang="ts">
import type { ISticker, IStickerOption } from '~/models/stickers';
import { PaperTypes } from '~/models/stickers';

export interface Props {
  sticker: ISticker;
}

defineProps<Props>();

const PAPER_TYPES = [PaperTypes.Glossy, PaperTypes.Matte, PaperTypes.Magnetic, PaperTypes.Yellow];
const PAPER_COSTS = {
  [PaperTypes.Glossy]: 15,
  [PaperTypes.Matte]: 15,
  [PaperTypes.Magnetic]: 60,
  [PaperTypes.Yellow]: 10,
};

const options = ref<Array<IStickerOption>>([
  {
    paperType: PaperTypes.Glossy,
    quantity: 1,
  },
]);

const notSelectedPaperTypes = computed(() => {
  return PAPER_TYPES.filter(
    (type) => !options.value.some((option) => option.paperType === type)
  );
});

const price = computed(() => {
  return options.value.reduce((acc, option) => {
    return acc + option.quantity * PAPER_COSTS[option.paperType];
  }, 0);
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
  <v-card class="d-flex flex-row pa-1 ga-2" variant="elevated">
    <div :style="{ width: '30vw', height: '30vw' }" class="pa-1">
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
          variant="solo"
          hide-details="auto"
          flat
        ></v-select>
        <v-number-input
          v-model="option.quantity"
          control-variant="stacked"
          label="Кількість"
          hide-details="auto"
          variant="solo"
          flat
          inset
          :min="0"
          :max="100"
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
      <v-card variant="text" class="pa-1 mt-2 d-flex justify-end">
        <v-card-title>
          <span v-for="(option, index) in options" :key="option.paperType">
            {{ option.quantity }} x {{ PAPER_COSTS[option.paperType] }}
            {{ index === options.length - 1 ? '= ' : ' + '}}
          </span>
          <span>{{ price }}грн.</span>
        </v-card-title>
      </v-card>
    </div>
  </v-card>
</template>
