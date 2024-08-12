import path from 'path';
import { NuxtBundleAnalysisOptions } from './types';
import { readPackageJSON } from 'pkg-types';
import { defu } from 'defu';

/**
 * Reads options from `package.json`
 */
export const getOptions = async (
  pathPrefix = process.cwd()
): Promise<NuxtBundleAnalysisOptions> => {
  const json = await readPackageJSON(path.join(pathPrefix, 'package.json'));
  return defu(json.nuxtBundleAnalysis, {
    minimumChangeThreshold: 0,
    buildOutputDirectory: '.nuxt',
    clientDir: 'dist/client',
    statsFile: '.nuxt/stats/client.json',
    builder: process.env.NUXT_BUNDLE_ANALYSIS_BUILDER || 'webpack',
    outputDirectory: '.output',
  });
};
