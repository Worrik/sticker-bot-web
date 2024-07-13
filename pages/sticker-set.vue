<script setup lang="ts">
const route = useRoute();

const stickerSetName = computed<string | null>(() => {
  return route.params.name as string | null;
});
</script>

<template>

</template>