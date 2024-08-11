import { defineNuxtConfig } from 'nuxt/config';

const builder = (process.env.NUXT_BUNDLE_ANALYSIS_BUILDER || 'webpack') as
  | 'webpack'
  | 'vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  telemetry: false,
  builder: builder,
  webpack: {
    analyze: {
      generateStatsFile: true,
      analyzeMode: 'disabled',
      openAnalyzer: false,
    },
  },
});
