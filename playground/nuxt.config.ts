import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  telemetry: false,
  builder: 'webpack',
  webpack: {
    analyze: {
      generateStatsFile: true,
      analyzeMode: 'disabled',
      openAnalyzer: false,
    },
  },
});
