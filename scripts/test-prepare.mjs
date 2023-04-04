import fs from 'fs';

fs.mkdirSync('playground/.nuxt/analyze/base/bundle', {
  recursive: true,
});

fs.copyFileSync(
  'scripts/template/__bundle_analysis.json',
  'playground/.nuxt/analyze/base/bundle/__bundle_analysis.json'
);
