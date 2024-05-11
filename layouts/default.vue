<script setup lang="ts">
import { useTheme } from 'vuetify';

const telergamTheme = computed(() => window?.Telegram?.WebApp?.themeParams);

watch(
  () => telergamTheme.value,
  () => {
    if (!telergamTheme) return;
    const theme = useTheme();
    theme.themes.value.telegramTheme = {
      dark: window?.Telegram?.WebApp?.colorScheme === "dark",
      colors: {
        primary: telergamTheme.value.button_color || '',
        background: telergamTheme.value.secondary_bg_color || '',
        surface: telergamTheme.value.bg_color || '',
        secondary: '',
        success: '',
        warning: '',
        error: '',
        info: '',
        'on-background': telergamTheme.value.text_color || '',
        'on-surface': telergamTheme.value.text_color || '',
        'on-primary': telergamTheme.value.button_text_color || '',
        'on-secondary': telergamTheme.value.text_color || '',
        'on-success': '',
        'on-warning': '',
        'on-error': '',
        'on-info': ''
      },
      variables: {},
    }
  },
  { immediate: true }
);
</script>
<template>
  <div>
    <slot />
  </div>
</template>
