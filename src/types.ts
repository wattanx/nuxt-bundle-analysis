export type NuxtBundleAnalysisOptions = {
  buildOutputDirectory: string;
  statsFile: string;
};

export type BundleAnalysisType = {
  path: string;
  size: number;
};

export type StatsType = {
  namedChunkGroups: namedChunkGroup;
};

export type namedChunkGroup = {
  [key: string]: { assets: string[] };
};
