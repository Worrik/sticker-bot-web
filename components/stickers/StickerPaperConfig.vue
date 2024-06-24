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
  }
]);
</script>

<template>
  <v-card class="d-flex flex-row">
    <div :style="{'width': '30vw', 'height': '30vw'}">
      <v-img class="sticker-img" :src="sticker.url"></v-img>
      <v-divider vertical></v-divider>
      <div>
        <div v-for="option in options" :key="option.paperType">
          <v-select
            v-model="localStickerCartItem.paperType"
            :items="[PaperTypes.Glossy, PaperTypes.Matte, PaperTypes.Magnetic, PaperTypes.Yellow]"
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
        </div>
      </div>
    </div>
  </v-card>
</template>