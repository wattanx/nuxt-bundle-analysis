#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { parseChunked } from '@discoveryjs/json-ext';
import { StatsType } from './types';
import { getOptions } from './utils';
import { getClientStats } from './vite/report';

const memoryCache: { [scriptPath: string]: number } = {};

function getScriptSize(scriptPath: string) {
  if (Object.keys(memoryCache).includes(scriptPath)) {
    return memoryCache[scriptPath];
  }

  const bytes = fs.readFileSync(scriptPath, 'utf8');
  const gzipSize = zlib.gzipSync(bytes).byteLength;
  memoryCache[scriptPath] = gzipSize;

  return gzipSize;
}

async function generateAnalysisJson() {
  const options = await getOptions();
  const buildOutputDir = path.join(process.cwd(), options.buildOutputDirectory);

  try {
    fs.accessSync(buildOutputDir, fs.constants.R_OK);
  } catch (err) {
    console.error(
      `"${buildOutputDir} is not found" - you may not have your working directory set correctly, or not have run "nuxt build".`
    );
    process.exit(1);
  }

  if (options.builder === 'vite') {
    const rawData = JSON.stringify(await getClientStats());
    try {
      fs.mkdirSync(path.join(buildOutputDir, 'analyze/'));
    } catch (err) {}
    fs.writeFileSync(
      path.join(buildOutputDir, 'analyze/__bundle_analysis.json'),
      rawData
    );
    return;
  }

  const { clientDir } = options;

  const statsFile: StatsType = await parseChunked(
    fs.createReadStream(path.join(process.cwd(), options.statsFile), {
      encoding: 'utf-8',
    })
  );

  const allPageSizes = Object.entries(statsFile.namedChunkGroups).map(
    ([key, value]) => {
      const size = value.assets
        .map((scriptInfo) => {
          const scriptPath =
            typeof scriptInfo === 'string' ? scriptInfo : scriptInfo.name;
          const gzipSize = getScriptSize(
            path.join(buildOutputDir, clientDir, scriptPath)
          );
          return gzipSize;
        })
        .reduce((s, b) => s + b, 0);
      return { path: key, size };
    }
  );

  const rawData = JSON.stringify(allPageSizes);
  try {
    fs.mkdirSync(path.join(buildOutputDir, 'analyze/'));
  } catch (err) {}
  fs.writeFileSync(
    path.join(buildOutputDir, 'analyze/__bundle_analysis.json'),
    rawData
  );
}

generateAnalysisJson();
