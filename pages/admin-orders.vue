<script setup lang="ts">
import type { IPage, IPaginator } from '~/models/pagination';
import type { IOrder } from '~/models/orders';

const ordersDataProvider = useGenericPaginatedDataProvider<IOrder>({
  fetchItems: async (paginator: IPaginator) => {
    return await $fetch<IPage<IOrder>>(
      `${apiUrl}/orders/?page=${paginator.page}&per_page=${paginator.perPage}`,
      { headers: { Authorization: getWebAppInitData() } }
    );
  },
});

async function load({ done }: { done: (status: 'ok' | 'error' | 'empty') => void }) {
  await ordersDataProvider.loadMore();
  if (ordersDataProvider.error) done('error');
  else if (ordersDataProvider.paginator.hasNext) done('ok');
  else done('empty');
}

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}
</script>

<template>
  <v-main>
    <div class="d-flex ga-4 pa-4">
      <v-card v-for="order in ordersDataProvider.items" :key="order.id">
        <v-card-text>
          <div>ID: {{ order.id }}</div>
          <div>{{ formatDate(order.created_at) }}</div>
          <div>Статус: {{ order.status }}</div>
        </v-card-text>
      </v-card>
    </div>
    <v-infinite-scroll @load="load">
      <template #empty>
        <div class="pa-2"></div>
      </template>
      <template #error>
        <div class="pa-2"></div>
      </template>
    </v-infinite-scroll>
  </v-main>
</template>
