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

const oddCartColumn = computed<Array<ISticker>>(() => {
  return stickersDataProvider.items.filter((_, index) => index % 2 === 0);
});

const evenCartColumn = computed<Array<ISticker>>(() => {
  return stickersDataProvider.items.filter((_, index) => index % 2 === 1);
});

const stickersCount = computed<number>(() => {
  return cart.value.length;
});

function addToCart(sticker: ISticker) {

}

function removeFromCart(sticker: ISticker) {}

async function load({ done }: { done: (status: 'ok' | 'error' | 'empty') => void }) {
  await stickersDataProvider.loadMore();
  if (stickersDataProvider.error) done('error');
  else if (stickersDataProvider.paginator.hasNext) done('ok');
  else done('empty');
}

async function removeSticker(stickerCartItem: IStickerCartItem) {
  window.Telegram.WebApp.showConfirm('Видалити стікер?', async (ok: boolean) => {
    if (!ok) return;
    cart.value = cart.value.filter((item) => item.sticker.id !== stickerCartItem.sticker.id);
    await $fetch(`${apiUrl}/stickers/${stickerCartItem.sticker.id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: getWebAppInitData(),
      },
    });
  });
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
    <v-btn
      variant="elevated"
      color="primary"
      appendIcon="mdi-check"
    >
      Обрати всі
    </v-btn>
    <v-btn
      variant="elevated"
      color="primary"
      appendIcon="mdi-trash-can"
      :disabled="stickersCount === 0"
    >
      Видалити обрані
    </v-btn>
    <div class="d-flex flex-wrap align-center w-100 ga-4 pb-16 flex-column">
      <v-container>
        <v-row class="justify-center flex-wrap">
          <div class="d-flex justify-end flex-column px-2 ga-4">
            <StickersStickerSelect
              v-for="sticker in oddCartColumn"
              :key="sticker.id"
              :sticker="sticker"
              @addToCart="addToCart(sticker)"
              @removeFromCart="removeFromCart(sticker)"
              @removeSticker="removeSticker(sticker)"
            />
          </div>
          <div class="d-flex justify-start flex-column px-2 ga-4">
            <StickersStickerSelect
              v-for="sticker in evenCartColumn"
              :key="sticker.id"
              :sticker="stickerCartItem"
              @addToCart="addToCart(sticker)"
              @removeFromCart="removeFromCart(sticker)"
              @removeSticker="removeSticker(sticker)"
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
