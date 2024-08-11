import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    'src/vite/report.ts',
    'src/compare.ts',
    'src/generate.ts',
    'src/report.ts',
    'src/utils.ts',
  ],
});
