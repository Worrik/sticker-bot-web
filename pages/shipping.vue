<script setup lang="ts">
import type { ICity, ICityWarehouse } from '~/models/novaposhta';
import type { IStickerCartItem } from '~/models/stickers';

const router = useRouter();

const cart = useState<Array<IStickerCartItem>>('cart', () => []);

const citiesSearch = useNovaPoshtaAPISearch<ICity>('Address', 'getCities');
const postOfficesMethodProperties = computed(() => ({
  CityName: city.value?.Description,
}));
const postOfficesSearch = useNovaPoshtaAPISearch<ICityWarehouse>('Address', 'getWarehouses', postOfficesMethodProperties);

const phone = ref<string>('');
const name = ref<string>('');
const city = ref<ICity | null>(null);
const postOffice = ref<ICityWarehouse | null>(null);

async function intersectCities(isIntersecting: boolean) {
  if (isIntersecting) await citiesSearch.loadMore();
}

async function intersectPostOffices(isIntersecting: boolean) {
  if (isIntersecting) await postOfficesSearch.loadMore();
}

async function createOrder() {
  const stickers_ids = cart.value.filter((item) => item.quantity > 0).map((item) => item.sticker.id);
  await $fetch(`${apiUrl}/orders/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: window.Telegram.WebApp.initData,
    },
    body: JSON.stringify({
      order: {
        stickers: stickers_ids,
        phone: phone.value,
        name: name.value,
        city: city.value?.Description,
        warehouse: postOffice.value?.Description,
      }
    }),
  });
}
</script>

<template>
  <div>
    <tg-back-button @click="router.push('/stickers')" />
    <div class="pa-8">
      <v-text-field
        v-model="phone"
        label="Телефон"
        type="tel"
        required
        clearable
      />
      <v-text-field
        v-model="name"
        label="Прізвище та ім'я"
        required
        clearable
      />
      <v-autocomplete
        v-model="city"
        label="Місто"
        :items="citiesSearch.items"
        item-title="Description"
        no-filter
        return-object
        clearable
        @update:search="citiesSearch.search"
      >
        <template #append-item>
          <div v-intersect="intersectCities">
            <v-progress-linear
              v-if="citiesSearch.loading"
              indeterminate
              color="primary"
            ></v-progress-linear>
          </div>
        </template>
      </v-autocomplete>
      <v-autocomplete
        v-model="postOffice"
        label="Відділення"
        :items="postOfficesSearch.items"
        item-title="Description"
        no-filter
        return-object
        clearable
        @update:search="postOfficesSearch.search"
      >
        <template #append-item>
          <div v-intersect="intersectPostOffices">
            <v-progress-linear
              v-if="postOfficesSearch.loading"
              indeterminate
              color="primary"
            ></v-progress-linear>
          </div>
        </template>
      </v-autocomplete>
    </div>
    <tg-main-button v-if="postOffice && phone && name" text="Замовити" @click="createOrder" />
  </div>
</template>
