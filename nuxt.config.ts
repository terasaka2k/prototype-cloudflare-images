export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    CF_ACCOUNT_ID: process.env.NUXT_API_CF_ACCOUNT_ID,
    CF_API_TOKEN: process.env.NUXT_API_CF_API_TOKEN,
    public: {
      CF_IMAGE_DELIVERY_URL_BASE: process.env.NUXT_PUBLIC_CF_IMAGE_DELIVERY_URL_BASE,
    },
  },
  app: {
    head: {
      script: [
        {
          src: 'https://cdn.tailwindcss.com',
        },
      ],
    },
  },
});
