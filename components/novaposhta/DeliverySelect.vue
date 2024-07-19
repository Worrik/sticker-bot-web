<script setup lang="ts">
import type { ICity, ICityWarehouse, INPData } from '~/models/novaposhta';

export interface Props {
  npData: INPData;
}
export interface Emits {
  (event: 'update:npData', value: INPData): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const citiesSearch = useNovaPoshtaAPISearch<ICity>('Address', 'getCities');
const postOfficesMethodProperties = computed(() => ({
  CityName: localNpData.value.city?.Description,
}));
const postOfficesSearch = useNovaPoshtaAPISearch<ICityWarehouse>(
  'Address',
  'getWarehouses',
  postOfficesMethodProperties
);

const localNpData = computed<INPData>({
  get: () => props.npData,
  set: (value) => {
    emits('update:npData', value);
  },
});

watch(
  () => localNpData.value.city,
  () => {
    if (localNpData.value.city?.Ref === localNpData.value.warehouse?.CityRef) return;
    console.log({
      local: localNpData.value,
    });
    localNpData.value.warehouse = null;
    postOfficesSearch.reset();
  }
);

async function intersectCities(isIntersecting: boolean) {
  if (isIntersecting) await citiesSearch.loadMore();
}

async function intersectPostOffices(isIntersecting: boolean) {
  if (isIntersecting) await postOfficesSearch.loadMore();
}
</script>

<template>
  <div>
    <div class="mt-4">
      <v-autocomplete
        v-model="localNpData.city"
        label="Місто"
        :items="citiesSearch.items"
        item-title="Description"
        no-filter
        return-object
        clearable
        :menu-props="{ maxHeight: 120 }"
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
        v-model="localNpData.warehouse"
        label="Відділення"
        :items="postOfficesSearch.items"
        item-title="Description"
        no-filter
        return-object
        clearable
        :menu-props="{ maxHeight: 120 }"
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
      <v-text-field v-model="localNpData.phone" label="Телефон" type="tel" required clearable />
      <v-text-field v-model="localNpData.name" label="Прізвище та ім'я" required clearable />
    </div>
  </div>
</template>
