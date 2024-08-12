#!/usr/bin/env node

import filesize from 'filesize';
import fs from 'fs';
import fsp from 'node:fs/promises';
import path from 'path';
import { BundleAnalysisType } from './types';
import {
  getBuildOutputDirectory,
  getOptions,
  getMinimumChangeThreshold,
} from './utils';
import { destr } from 'destr';

async function loadJson<T>(file: string) {
  const raw = await fsp.readFile(file, 'utf-8');
  return destr<T>(raw);
}

function createTableRow(path: string, size: number, diffStr: string) {
  return `| \`${path}\` | ${filesize(size)} (${diffStr}) |`;
}

async function compare() {
  const options = await getOptions();

  const minimumChangeThreshold = getMinimumChangeThreshold(options);

  const buildOutputDir = path.join(
    process.cwd(),
    getBuildOutputDirectory(options)
  );

  const outdir = path.join(buildOutputDir, 'analyze');
  const outfile = path.join(outdir, '__bundle_analysis_comment.txt');

  const currentBundle: BundleAnalysisType[] = await loadJson(
    path.join(buildOutputDir, 'analyze/__bundle_analysis.json')
  );

  const baseBundle: BundleAnalysisType[] = await loadJson(
    path.join(buildOutputDir, 'analyze/base/bundle/__bundle_analysis.json')
  );

  const removedSizes = baseBundle
    .filter(({ path }) => !currentBundle.find((x) => x.path === path))
    .map(({ path }) => `| \`${path}\` | removed |`);

  const sizes = currentBundle
    .map(({ path, size }) => {
      const basefile = baseBundle.find((x) => x.path === path);

      if (!basefile) {
        return createTableRow(path, size, 'added');
      }

      const diffSize = size - basefile.size;

      if (diffSize === 0 || Math.abs(diffSize) < minimumChangeThreshold) {
        return '';
      }

      const diffStr = filesize(diffSize);
      const increased = Math.sign(diffSize) > 0;
      const statusIndicator = increased ? '🔴' : '🟢';

      return createTableRow(path, size, `${statusIndicator} ${diffStr}`);
    })
    .filter((x) => x)
    .concat(removedSizes)
    .join('\n');

  if (sizes === '') {
    // If no changes are made, messages are generated on the GitHub Actions side.
    process.exit();
  }

  // To override the comment, use <! -- __NUXTJS_BUNDLE --> to mark it.
  // Actions jobs name is 'Update Comment'
  const output = `
<!-- __NUXTJS_BUNDLE -->
# Bundle Size
| Route | Size (gzipped) |
| --- | --- |
${sizes}`;

  try {
    fs.mkdirSync(outdir);
  } catch (err) {
    // may already exist
  }

  fs.writeFileSync(outfile, output);
}

compare();
