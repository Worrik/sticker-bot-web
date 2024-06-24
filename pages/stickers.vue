<script setup lang="ts">
import type { IPage, IPaginator } from '~/models/pagination';
import type { ISticker, IStickerCartItem } from '~/models/stickers';
import { getWebAppInitData } from '~/utils/apiUrl';

const router = useRouter();

const stickersDataProvider = useGenericPaginatedDataProvider<ISticker>({
  itemsPerPage: 100,
  fetchItems: async (paginator: IPaginator) => {
    return await $fetch<IPage<ISticker>>(
      `${apiUrl}/stickers/?page=${paginator.page}&per_page=${paginator.perPage}`,
      {
        headers: {
          Authorization: getWebAppInitData(),
        },
      }
    );
  },
});

const cart = useState<Array<IStickerCartItem>>('cart', () => []);

watch(
  () => stickersDataProvider.items.length,
  () => {
    cart.value = stickersDataProvider.items.map((sticker) => ({
      sticker,
      options: [],
    }));
  },
  { immediate: true }
);

const oddCartColumn = computed<Array<IStickerCartItem>>(() => {
  return cart.value.filter((_, index) => index % 2 === 0);
});

const evenCartColumn = computed<Array<IStickerCartItem>>(() => {
  return cart.value.filter((_, index) => index % 2 === 1);
});

const stickersCount = computed<number>(() => {
  return cart.value.length;
});

function addToCart(id: number) {
  
}

function removeFromCart(id: number) {
}

async function load({ done }: { done: (status: 'ok' | 'error' | 'empty') => void }) {
  await stickersDataProvider.loadMore();
  if (stickersDataProvider.error) done('error');
  else if (stickersDataProvider.paginator.hasNext) done('ok');
  else done('empty');
}

async function removeSticker(stickerCartItem: IStickerCartItem) {
  window.Telegram.WebApp.showConfirm(
    'Видалити стікер?',
    async (ok: boolean) => {
      if (!ok) return;
      cart.value = cart.value.filter((item) => item.sticker.id !== stickerCartItem.sticker.id);
      await $fetch(`${apiUrl}/stickers/${stickerCartItem.sticker.id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: getWebAppInitData(),
        },
      });
    }
  )
}

async function goToShipping() {
  await router.push('/shipping');
}
</script>

<template>
  <div>
    <v-app-bar>
      <v-app-bar-title>Обери стікери</v-app-bar-title>
      <template #append>
        <v-chip v-if="stickersCount > 0" color="primary" text-color="white" class="mr-4">
          <v-icon left>mdi-sticker</v-icon>
          {{ stickersCount }}
        </v-chip>
        <v-btn
          variant="elevated"
          color="primary"
          appendIcon="mdi-truck"
          @click="goToShipping"
          :disabled="stickersCount === 0"
        >
          Далі
        </v-btn>
      </template>
    </v-app-bar>
    <div class="py-12"></div>
    <div class="d-flex flex-wrap align-center w-100 ga-4 pb-16 flex-column">
      <v-container>
        <v-row class="justify-center flex-wrap">
          <div class="d-flex justify-end flex-column px-2 ga-4">
            <StickersStickerSelect
              v-for="(stickerCartItem, index) in oddCartColumn"
              :key="stickerCartItem.sticker.id"
              :stickerCartItem="stickerCartItem"
              @update:stickerCartItem="cart[index] = $event"
              @addToCart="addToCart(stickerCartItem.sticker.id)"
              @removeFromCart="removeFromCart(stickerCartItem.sticker.id)"
              @removeSticker="removeSticker(stickerCartItem)"
            />
          </div>
          <div class="d-flex justify-start flex-column px-2 ga-4">
            <StickersStickerSelect
              v-for="(stickerCartItem, index) in evenCartColumn"
              :key="stickerCartItem.sticker.id"
              :stickerCartItem="stickerCartItem"
              @addToCart="addToCart(stickerCartItem.sticker.id)"
              @removeFromCart="removeFromCart(stickerCartItem.sticker.id)"
              @removeSticker="removeSticker(stickerCartItem)"
            />
          </div>
        </v-row>
      </v-container>
      <v-infinite-scroll @load="load">
        <template #empty>
          <div class="pa-2"></div>
        </template>
        <template #error>
          <v-alert color="error" dense> Не вдалося завантажити стікери </v-alert>
        </template>
      </v-infinite-scroll>
    </div>
  </div>
</template>
