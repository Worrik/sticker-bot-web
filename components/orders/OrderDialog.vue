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
      </v-card-text>
      <v-card-actions>
        <v-btn class="ms-auto" text="Close" @click="emits('close')" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
