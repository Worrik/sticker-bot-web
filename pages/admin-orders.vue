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
</script>

<template>
  <div>
    <div v-for="order in ordersDataProvider.items" :key="order.id">
      <div>{{ order.id }}</div>
      <div>{{ order.status }}</div>
      <div>{{ order.created_at }}</div>
    </div>
    <v-infinite-scroll @load="load">
      <template #empty>
        <div class="pa-2"></div>
      </template>
      <template #error>
        <div class="pa-2"></div>
      </template>
    </v-infinite-scroll>
  </div>
</template>
