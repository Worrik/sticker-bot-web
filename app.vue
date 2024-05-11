<script setup lang="ts">
import { useTheme } from 'vuetify';

const telergamTheme = computed(() => window?.Telegram?.WebApp?.themeParams);

watch(
  () => telergamTheme.value,
  () => {
    if (!telergamTheme.value) return;
    const theme = useTheme();
    const copyFromTheme =
      window?.Telegram?.WebApp?.colorScheme === 'dark'
        ? theme.themes.value.dark
        : theme.themes.value.light;
    theme.themes.value.telegramTheme = {
      dark: window?.Telegram?.WebApp?.colorScheme === 'dark',
      colors: {
        ...theme.global.current.value.colors,
        primary: telergamTheme.value.button_color || '',
        background: telergamTheme.value.bg_color || '',
        surface: telergamTheme.value.bg_color || '',
        'on-background': telergamTheme.value.text_color || '',
        'on-surface': telergamTheme.value.text_color || '',
        'on-primary': telergamTheme.value.button_text_color || '',
        'on-secondary': telergamTheme.value.text_color || '',
      },
      variables: {},
    };
    console.log({
      theme: theme.themes.value.telegramTheme,
      copyFromTheme,
      tgTheme: telergamTheme.value,
    });
    theme.global.name = 'telegramTheme';
  },
  { immediate: true }
);
</script>

<template>
  <v-theme-provider :theme="telergamTheme ? 'telegramTheme' : ''" :with-background="true">
    <v-app>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </v-app>
  </v-theme-provider>
</template>

<style>
html,
body {
  background-color: var(--tg-theme-bg-color);
}
</style>
