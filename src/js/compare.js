#!/usr/bin/env node

const filesize = require('filesize');
const fs = require('fs');
const path = require('path');
const { getBuildOutputDirectory, getOptions } = require('./utils');

const options = getOptions();

const buildOutputDir = path.join(
  process.cwd(),
  getBuildOutputDirectory(options),
);

const outdir = path.join(buildOutputDir, 'analyze');
const outfile = path.join(outdir, '__bundle_analysis_comment.txt');

const currentBundle = require(path.join(
  buildOutputDir,
  'analyze/__bundle_analysis.json',
));

const baseBundle = require(path.join(
  buildOutputDir,
  'analyze/base/bundle/__bundle_analysis.json',
));

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

    if (diffSize === 0) {
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

const output =
  sizes === ''
    ? 'This PR introduced no changes to the javascript bundle.'
    : `# Bundle Size
| Route | Size (gzipped) |
| --- | --- |
${sizes}`;

try {
  fs.mkdirSync(outdir);
} catch (err) {
  // may already exist
}

fs.writeFileSync(outfile, output);

function createTableRow(path, size, diffStr) {
  return `| \`${path}\` | ${filesize(size)} (${diffStr}) |`;
}
