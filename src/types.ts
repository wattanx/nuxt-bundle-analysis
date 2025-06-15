export type NuxtBundleAnalysisOptions = {
  /**
   * @default '.nuxt'
   */
  buildOutputDirectory: string;
  clientDir: string;
  /**
   * @default '.nuxt/stats/client.json'
   */
  statsFile: string;
  /**
   * @default 0
   */
  minimumChangeThreshold: number;
  /**
   * @default 'webpack'
   */
  builder: 'webpack' | 'vite';
  /**
   * @default '.output'
   */
  outputDirectory: string;
  /**
   * @default false
   * When true and using vite builder, analyzes each page separately.
   * When false, bundles all JS as 'app'.
   */
  vitePageAnalysis?: boolean;
};

export type BundleAnalysisType = {
  path: string;
  size: number;
};

export type StatsType = {
  namedChunkGroups: namedChunkGroup;
};

export type namedChunkGroup = {
  [key: string]: { assets: string[] | { name: string; size: string }[] };
};
