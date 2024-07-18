import type { IPaginator } from '~/models/pagination';
import { debounce } from 'lodash';
import type { INovaPoshtaAPISearch } from '~/models/novaposhta';

export function useNovaPoshtaAPISearch<T>(
  modelName: string,
  calledMethod: string,
  methodProperties?: Ref<Record<string, unknown>>
): INovaPoshtaAPISearch<T> {
  const items = ref<Array<T>>([]) as Ref<Array<T>>;
  const loading = ref<boolean>(false);
  const paginator = ref<IPaginator>({
    page: 0,
    perPage: 10,
    hasNext: true,
  });
  const searchText = ref<string>('');

  const debounceSearch = debounce(searchItems, 500);

  async function fetchItems() {
    const result = await $fetch<{ data: T[]; info: { totalCount: number } }>(
      'https://api.novaposhta.ua/v2.0/json/',
      {
        method: 'POST',
        body: {
          apiKey: '',
          modelName: modelName,
          calledMethod: calledMethod,
          methodProperties: {
            Page: paginator.value.page,
            Limit: paginator.value.perPage,
            FindByString: searchText.value,
            ...methodProperties?.value,
          },
        },
      }
    );
    if (!result) throw new Error('Failed to fetch items');
    return result;
  }

  async function searchItems() {
    if (loading.value) return;
    loading.value = true;
    paginator.value.page = 1;

    try {
      const result = await fetchItems();
      const { data, info } = result!;
      items.value = data;
      paginator.value.hasNext = paginator.value.page * paginator.value.perPage < info.totalCount;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }

  async function search(searchKeyword: string) {
    searchText.value = searchKeyword;
    await debounceSearch();
  }

  async function loadMore() {
    if (loading.value || !paginator.value.hasNext) return;
    loading.value = true;
    paginator.value.page += 1;

    try {
      const { data, info } = await fetchItems();
      items.value = [...items.value, ...data];
      paginator.value.hasNext = paginator.value.page * paginator.value.perPage < info.totalCount;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }

  function reset() {
    items.value = [];
    paginator.value.page = 0;
    paginator.value.hasNext = true;
  }

  return reactive({
    items,
    loading,
    search,
    loadMore,
    reset,
  });
}
