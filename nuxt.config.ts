// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  appConfig: {
    header: {
      logo: {
        light: '/logo.png',
        dark: '/logo.png',
        alt: 'Site logo',
      },
    },
  },
  content: {
    experimental: {
      sqliteConnector: "native",
    },
  },
  modules: ["@nuxt/content", "@nuxt/eslint"],
  css: ['~/assets/css/theme.css'],
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: "2024-04-03",
  extends: ["docus"],
});
