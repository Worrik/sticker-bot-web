<script setup lang="ts">
import type { IPage } from '~/models/pagination';
import type { ISticker, IStickerOption, IStickerPaper } from '~/models/stickers';

export interface Props {
  sticker: ISticker;
  options: Array<IStickerOption>;
  stickerPapers: Array<IStickerPaper>;
}

export interface Emits {
  (event: 'update:options', value: Array<IStickerOption>): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

function getStickerPaperByName(name: string): IStickerPaper | undefined {
  return props.stickerPapers.find((paper) => paper.name === name);
}

const localOptions = computed<Array<IStickerOption>>({
  get: () => props.options,
  set: (value) => {
    emits('update:options', value);
  },
});

const notSelectedPaperTypes = computed<Array<string>>(() => {
  return (
    props.stickerPapers
      .filter((paper) => !localOptions.value.some((option) => option.paperType === paper.name))
      .map((paper) => paper.name) || []
  );
});

const price = computed(() => {
  return localOptions.value.reduce((acc, option) => {
    const paper = getStickerPaperByName(option.paperType);
    const price = paper?.price || 0;
    return acc + option.quantity * price;
  }, 0);
});

const optionsSumText = computed(() => {
  return (
    localOptions.value
      .map(
        (option) => `${option.quantity} x ${getStickerPaperByName(option.paperType)?.price || 0}`
      )
      .join(' + ') +
    ' = ' +
    price.value +
    'грн.'
  );
});

function availablePaperTypes(option: IStickerOption) {
  return notSelectedPaperTypes.value.concat(option.paperType);
}

function addOption() {
  if (notSelectedPaperTypes.value.length === 0) return;
  localOptions.value.push({
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
        v-for="(option, index) in localOptions"
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
          @update:modelValue="option.quantity = parseInt($event.toString())"
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
      <v-card variant="text" class="pa-1 mt-2 d-flex justify-end flex-wrap">
        <span>{{ optionsSumText }}</span>
      </v-card>
    </div>
  </v-card>
</template>
