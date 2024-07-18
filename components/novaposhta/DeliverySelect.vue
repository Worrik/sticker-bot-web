<script setup lang="ts">
import type { ICity, ICityWarehouse } from '~/models/novaposhta';
import { getWebAppInitData } from '~/utils/apiUrl';


export interface Props {}
export interface Emits {
  (event: 'select'): void;
}

defineProps<Props>();
defineEmits<Emits>();

const citiesSearch = useNovaPoshtaAPISearch<ICity>('Address', 'getCities');
const postOfficesMethodProperties = computed(() => ({
  CityName: city.value?.Description,
}));
const postOfficesSearch = useNovaPoshtaAPISearch<ICityWarehouse>(
  'Address',
  'getWarehouses',
  postOfficesMethodProperties
);

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
  await $fetch(`${apiUrl}/orders/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getWebAppInitData(),
    },
    body: JSON.stringify({
      phone: phone.value,
      name: name.value,
      city: city.value?.Description,
      warehouse: postOffice.value?.Description,
    }),
  });
  window.Telegram.WebApp.showAlert('Замовлення успішно створено. Очікуйте підтвердження.');
  window.Telegram.WebApp.close();
}
</script>

<template>
  <div>
    <div class="mt-4">
      <v-autocomplete
        v-model="city"
        label="Місто"
        :items="citiesSearch.items"
        item-title="Description"
        no-filter
        return-object
        clearable
        :menu-props="{
          maxHeight: 100,
        }"
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
      <v-text-field v-model="phone" label="Телефон" type="tel" required clearable />
      <v-text-field v-model="name" label="Прізвище та ім'я" required clearable />
    </div>
  </div>
</template>
