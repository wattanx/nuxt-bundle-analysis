const path = require("path");

/**
 * Reads options from `package.json`
 */
const getOptions = (pathPrefix = process.cwd()) => {
  return require(path.join(pathPrefix, "package.json")).nuxtBundleAnalysis;
};

/**
 * Gets the output build directory, defaults to `.nuxt`
 *
 * @param {object} options the options parsed from package.json.nuxtBundleAnalysis using `getOptions`
 * @returns {string}
 */
const getBuildOutputDirectory = (options) => {
  return options.buildOutputDirectory || ".nuxt";
};

/**
 * Gets the stats file path.
 */
const getStatsFilePath = (options) => {
  return options.statsFile || ".nuxt/stats/client.json";
};

module.exports = {
  getOptions,
  getBuildOutputDirectory,
  getStatsFilePath,
};
