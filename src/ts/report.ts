import fs from "fs";
import path from "path";
import zlib from "zlib";
import mkdirp from "mkdirp";
import { getBuildOutputDirectory, getOptions, getStatsFilePath } from "./utils";

const options = getOptions();
const buildOutputDir = path.join(
  process.cwd(),
  getBuildOutputDirectory(options)
);

const statsFile: {
  assetsByChunkName: Record<string, string>;
} = require(path.join(process.cwd(), getStatsFilePath(options)));

try {
  fs.accessSync(buildOutputDir, fs.constants.R_OK);
} catch (err) {
  console.error(
    `"${buildOutputDir} is not found" - you may not have your working directory set correctly, or not have run "nuxt build".`
  );
  process.exit(1);
}

const allPageSizes = Object.entries(statsFile.assetsByChunkName).map(
  ([key, value]) => {
    const bytes = fs.readFileSync(
      path.join(buildOutputDir, "dist/client", value)
    );
    const gzipped = zlib.gzipSync(bytes).byteLength;

    return { path: key, size: gzipped };
  }
);

const rawData = JSON.stringify(allPageSizes);
mkdirp.sync(path.join(buildOutputDir, "analyze/"));
fs.writeFileSync(
  path.join(buildOutputDir, "analyze/__bundle_analysis.json"),
  rawData
);
