import path from 'path';
import { NuxtBundleAnalysisOptions } from './types';

/**
 * Reads options from `package.json`
 */
export const getOptions = async (
  pathPrefix = process.cwd()
): Promise<NuxtBundleAnalysisOptions> => {
  const json = await import(path.join(pathPrefix, 'package.json')).then(
    (module) => module.default
  );
  return json.nuxtBundleAnalysis;
};

/**
 * Gets the output build directory, defaults to `.nuxt`
 */
export const getBuildOutputDirectory = (options: NuxtBundleAnalysisOptions) => {
  return options.buildOutputDirectory || '.nuxt';
};

/**
 * Gets the stats file path.
 */
export const getStatsFilePath = (options: NuxtBundleAnalysisOptions) => {
  return options.statsFile || '.nuxt/stats/client.json';
};
