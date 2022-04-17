#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const mkdirp = require('mkdirp');

const memoryCache = {};

const {
  getBuildOutputDirectory,
  getOptions,
  getStatsFilePath,
} = require('./utils');

const options = getOptions();

const buildOutputDir = path.join(
  process.cwd(),
  getBuildOutputDirectory(options)
);

const statsFile = require(path.join(process.cwd(), getStatsFilePath(options)));

try {
  fs.accessSync(buildOutputDir, fs.constants.R_OK);
} catch (err) {
  console.error(
    `"${buildOutputDir} is not found" - you may not have your working directory set correctly, or not have run "nuxt build".`
  );
  process.exit(1);
}

const allPageSizes = Object.entries(statsFile.namedChunkGroups).map(
  ([key, value]) => {
    const size = value.assets
      .map((x) => {
        const scriptPath = path.join(buildOutputDir, 'dist/client', x);

        if (Object.keys(memoryCache).includes(scriptPath)) {
          return memoryCache[scriptPath];
        }

        const bytes = fs.readFileSync(scriptPath, 'utf8');
        const gzipSize = zlib.gzipSync(bytes).byteLength;
        memoryCache[scriptPath] = gzipSize;

        return gzipSize;
      })
      .reduce((s, b) => s + b, 0);
    return { path: key, size };
  }
);

const rawData = JSON.stringify(allPageSizes);
mkdirp.sync(path.join(buildOutputDir, 'analyze/'));
fs.writeFileSync(
  path.join(buildOutputDir, 'analyze/__bundle_analysis.json'),
  rawData
);
