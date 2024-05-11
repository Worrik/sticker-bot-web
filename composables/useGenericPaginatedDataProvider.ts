import type { IPage, IPaginatedDataProvider, IPaginator } from '~/models/pagination';

export function useGenericPaginatedDataProvider<T>({
  fetchItems,
  itemsPerPage = 20,
}: {
  fetchItems: (paginator: IPaginator) => Promise<IPage<T>>;
  itemsPerPage?: number;
}): IPaginatedDataProvider<T> {
  const items = ref<Array<T>>([]) as Ref<Array<T>>;
  const loading = ref<boolean>(false);
  const error = ref<any>(null);
  const paginator = ref<IPaginator>({ page: 0, perPage: itemsPerPage, hasNext: true });

  async function loadMore() {
    if (loading.value || !paginator.value.hasNext || error.value) return;

    loading.value = true;
    paginator.value.page += 1;

    try {
      const page = await fetchItems(paginator.value);

      items.value = [...items.value, ...page.items];
      paginator.value = { page: page.page, perPage: page.per_page, hasNext: page.has_next };
    } catch (e) {
      error.value = e;
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  return reactive({
    items,
    loading,
    error,
    paginator,
    loadMore,
  });
}
