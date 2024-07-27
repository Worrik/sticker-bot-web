<script setup lang="ts">
import type { IOrder } from '~/models/orders';

export interface Props {
  order: IOrder;
}

export interface Emits {
  (event: 'close'): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const deliveryInfo = ref<string>('');

watchEffect(async () => {
  if (!props.order.warehouse) {
    deliveryInfo.value = '';
    return;
  }
  const warehouse = await getWarehouseByRef(props.order.warehouse);
  deliveryInfo.value = warehouse ? `${warehouse.CityDescription}, ${warehouse.Description}` : '';
});
</script>

<template>
  <v-dialog width="auto">
    <v-card>
      <v-card-title>
        <span class="headline">Замовлення №{{ order.id }}</span>
      </v-card-title>
      <v-card-text>
        <div>Ім'я: {{ order.name }}</div>
        <div>Телефон: {{ order.phone }}</div>
        <div>Доставка: {{ deliveryInfo }}</div>
        <v-divider class="my-4" />
        <v-card
          v-for="sticker in order.stickers"
          :key="sticker.sticker.id"
          class="d-flex flex-row pa-1 ga-2"
          variant="elevated"
        >
          <div :style="{ width: '30vw', height: '30vw' }" class="pa-1">
            <v-img class="sticker-img" :src="sticker.sticker.url"></v-img>
          </div>
          <v-divider vertical></v-divider>
          <div class="d-flex ga-2 flex-column w-100">
            <div
              v-for="(option, index) in sticker.options"
              :key="option.paper"
              class="d-flex flex-row align-center"
            >
              <div>{{ option.paper }}: {{ option.quantity }}</div>
            </div>
          </div>
        </v-card>
        <div class="d-flex" v-for="sticker in order.stickers" :key="sticker.sticker.id">
          <v-img :src="sticker.sticker.url" width="100" height="100" />
          <div v-for="option in sticker.options" :key="option.paper">
            <div>Папір: {{ option.paper }}</div>
            <div>Кількість: {{ option.quantity }}</div>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn class="ms-auto" text="Close" @click="emits('close')" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
