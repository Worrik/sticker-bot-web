import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { VNumberInput } from 'vuetify/labs/VNumberInput'

export default defineNuxtPlugin((app) => {
  const telegramTheme = window?.Telegram?.WebApp?.themeParams;
  let customTelegramTheme = {};
  if (telegramTheme) {
    customTelegramTheme = {
      dark: window?.Telegram?.WebApp?.colorScheme === 'dark',
      colors: {
        primary: telegramTheme.button_color || '',
        background: telegramTheme.bg_color || '',
        surface: telegramTheme.bg_color || '',
        'on-background': telegramTheme.text_color || '',
        'on-primary': telegramTheme.button_text_color || '',
      },
      variables: {},
    };
  }
  const vuetify = createVuetify({
    theme: {
      defaultTheme: customTelegramTheme ? 'customTelegramTheme' : undefined,
      themes: {
        customTelegramTheme,
      }
    },
    components: {
      VNumberInput,
    }
  })
  app.vueApp.use(vuetify)
})
