import path from 'path';
import { NuxtBundleAnalysisOptions } from './types';
import { readPackageJSON } from 'pkg-types';

/**
 * Reads options from `package.json`
 */
export const getOptions = async (
  pathPrefix = process.cwd()
): Promise<NuxtBundleAnalysisOptions> => {
  const json = await readPackageJSON(path.join(pathPrefix, 'package.json'));
  return json.nuxtBundleAnalysis;
};

/**
 * Gets the output build directory, defaults to `.nuxt`
 */
export const getBuildOutputDirectory = (options: NuxtBundleAnalysisOptions) => {
  return options.buildOutputDirectory || '.nuxt';
};

/**
 * Gets the client directory, defaults to `dist/client`
 */
export const getClientDir = (options: NuxtBundleAnalysisOptions) => {
  return options.clientDir || 'dist/client';
};

/**
 * Gets the stats file path.
 */
export const getStatsFilePath = (options: NuxtBundleAnalysisOptions) => {
  return options.statsFile || '.nuxt/stats/client.json';
};

export const getMinimumChangeThreshold = (
  options: NuxtBundleAnalysisOptions
): number => {
  return options.minimumChangeThreshold || 0;
};

export const getBuilder = (options: NuxtBundleAnalysisOptions) => {
  return (
    options.builder || process.env.NUXT_BUNDLE_ANALYSIS_BUILDER || 'webpack'
  );
};
