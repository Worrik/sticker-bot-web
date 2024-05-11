<script setup lang="ts">
import { useTheme } from 'vuetify';

const telergamTheme = computed(() => window?.Telegram?.WebApp?.themeParams);

watch(
  () => telergamTheme.value,
  () => {
    if (!telergamTheme.value) return;
    const theme = useTheme();
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
  },
  { immediate: true }
);
</script>

<template>
  <v-app>
    <v-theme-provider :theme="telergamTheme ? 'telegramTheme' : ''" :with-background="true">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </v-theme-provider>
  </v-app>
</template>
