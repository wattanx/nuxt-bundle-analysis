import path from "path";
import { NuxtBundleAnalysisOptions } from "./types";

/**
 * Reads options from `package.json`
 */
export const getOptions = (
  pathPrefix = process.cwd()
): NuxtBundleAnalysisOptions => {
  return require(path.join(pathPrefix, "package.json")).nuxtBundleAnalysis;
};

/**
 * Gets the output build directory, defaults to `.nuxt`
 */
export const getBuildOutputDirectory = (options: NuxtBundleAnalysisOptions) => {
  return options.buildOutputDirectory || ".nuxt";
};

/**
 * Gets the stats file path.
 */
export const getStatsFilePath = (options: NuxtBundleAnalysisOptions) => {
  return options.statsFile || ".nuxt/stats/client.json";
};
