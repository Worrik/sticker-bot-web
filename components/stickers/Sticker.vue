<script setup lang="ts">
import type { IStickerCartItem } from '~/models/stickers';

export interface Props {
  stickerCartItem: IStickerCartItem;
}

export interface Emits {
  (event: 'update:stickerCartItem', value: IStickerCartItem): void;
  (event: 'addToCart'): void;
  (event: 'removeFromCart'): void;
  (event: 'removeSticker'): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const localStickerCartItem = computed<IStickerCartItem>({
  get: () => props.stickerCartItem,
  set: (value) => emits('update:stickerCartItem', value),
});

const showSettings = ref<boolean>(false);

watch(
  () => props.stickerCartItem.quantity,
  (value) => {
    if (value === 0) {
      showSettings.value = false;
    };
  },
  { immediate: true }
);
</script>

<template>
  <v-card
    width="200"
    :elevation="localStickerCartItem.quantity ? 16 : 0"
    :variant="localStickerCartItem.quantity ? 'elevated' : 'flat'"
  >
    <v-img class="ma-2" :src="localStickerCartItem.sticker.url"></v-img>

    <v-card-actions>
      <v-btn
        v-if="localStickerCartItem.quantity === 0"
        block
        variant="tonal"
        @click="emits('addToCart')"
      >
        Додати
      </v-btn>
      <div class="w-100" v-else>
        <div class="d-flex">
          <v-btn
            :active="showSettings"
            icon="mdi-cog"
            class="rounded pa-0"
            size="x-small"
            @click="showSettings = !showSettings"
          ></v-btn>
          <v-spacer />
          <v-btn
            variant="tonal"
            color="primary"
            class="rounded pa-0"
            icon="mdi-minus"
            size="x-small"
            @click="emits('removeFromCart')"
          ></v-btn>
          <div class="d-flex align-center px-2 ml-2">
            {{ localStickerCartItem.quantity }}
          </div>
          <v-btn
            variant="tonal"
            color="primary"
            class="rounded"
            icon="mdi-plus"
            size="x-small"
            @click="emits('addToCart')"
          ></v-btn>
        </div>
      </div>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="showSettings">
        <v-divider></v-divider>

        <div class="pa-1">
          <v-select
            v-model="localStickerCartItem.paperType"
            :items="['Глянцевий', 'Матовий']"
            label="Тип паперу"
            class="rounded px-2"
            variant="solo"
            hide-details
            flat
          ></v-select>
          <div class="pa-2">
            <v-btn
              block
              variant="tonal"
              color="error"
              class="rounded"
              @click="emits('removeSticker')"
            >
              Видалити
            </v-btn>
          </div>
        </div>
      </div>
    </v-expand-transition>
  </v-card>
</template>
