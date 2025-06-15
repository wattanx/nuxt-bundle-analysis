import fsp from 'node:fs/promises';
import { globby } from 'globby';
import { join } from 'pathe';
import zlib from 'zlib';
import { getOptions } from '../utils';

type ManifestEntry = {
  resourceType: string;
  module?: boolean;
  file: string;
  name?: string;
  src?: string;
  isDynamicEntry?: boolean;
  isEntry?: boolean;
  imports?: string[];
  dynamicImports?: string[];
  css?: string[];
};

type ClientManifest = Record<string, ManifestEntry>;

export async function getClientStats() {
  const rootDir = process.cwd();
  const options = await getOptions();
  const publicDir = join(rootDir, options.outputDirectory, 'public');
  const serverDir = join(rootDir, options.buildOutputDirectory, 'dist/server');
  
  // If vitePageAnalysis is false, use aggregate mode
  if (!options.vitePageAnalysis) {
    const stats = await analyzeSizes('**/*.js', publicDir);
    return [stats];
  }
  
  // Page-level analysis mode
  // Read client manifest
  const manifestPath = join(serverDir, 'client.manifest.json');
  let manifest: ClientManifest;
  
  try {
    const manifestContent = await fsp.readFile(manifestPath, 'utf-8');
    manifest = JSON.parse(manifestContent);
  } catch (error) {
    console.warn('Could not read client.manifest.json, falling back to aggregate mode');
    const stats = await analyzeSizes(
      '**/*.js',
      publicDir
    );
    return [stats];
  }

  // Find all page entries
  const pageStats: { path: string; size: number }[] = [];

  for (const [key, entry] of Object.entries(manifest)) {
    // Process page components (pages/*.vue)
    if (key.startsWith('pages/') && entry.resourceType === 'script') {
      const pageName = key.replace(/^pages\//, '').replace(/\.vue$/, '');
      const size = await calculatePageTotalSize(key, manifest, publicDir);
      pageStats.push({ path: pageName, size });
    }
    // Process app entry files
    else if (key.includes('app/entry.js') && entry.resourceType === 'script') {
      const size = await calculatePageTotalSize(key, manifest, publicDir);
      pageStats.push({ path: 'app', size });
    }
  }

  // If no pages found, fall back to aggregate mode
  if (pageStats.length === 0) {
    const stats = await analyzeSizes('**/*.js', publicDir);
    return [stats];
  }

  return pageStats;
}

async function calculatePageTotalSize(
  pageKey: string,
  manifest: ClientManifest,
  publicDir: string
): Promise<number> {
  const entry = manifest[pageKey];
  if (!entry || !entry.file) {
    return 0;
  }

  const processedFiles = new Set<string>();
  const filesToProcess = new Set<string>();
  
  // Start with the main file
  filesToProcess.add(entry.file);
  
  // Add direct imports (excluding entry.js files)
  if (entry.imports) {
    for (const importKey of entry.imports) {
      // Skip entry.js files
      if (importKey.includes('entry.js')) {
        continue;
      }
      const importEntry = manifest[importKey];
      if (importEntry && importEntry.file) {
        filesToProcess.add(importEntry.file);
      }
    }
  }
  
  let totalSize = 0;
  
  // Process all files
  for (const file of filesToProcess) {
    if (processedFiles.has(file)) continue;
    processedFiles.add(file);
    
    // Only process JS files
    if (!file.endsWith('.js')) continue;
    
    const filePath = join(publicDir, '_nuxt', file);
    try {
      const content = await fsp.readFile(filePath, 'utf-8');
      const gzipSize = zlib.gzipSync(content).byteLength;
      totalSize += gzipSize;
    } catch (error) {
      console.warn(`Could not read file ${filePath}:`, error);
    }
  }
  
  return totalSize;
}

async function analyzeSizes(pattern: string | string[], rootDir: string) {
  const files: string[] = await globby(pattern, { cwd: rootDir });
  let totalBytes = 0;
  for (const file of files) {
    const path = join(rootDir, file);
    const isSymlink = (
      await fsp.lstat(path).catch(() => null)
    )?.isSymbolicLink();

    if (!isSymlink) {
      const bytes = zlib.gzipSync(await fsp.readFile(path, 'utf-8')).byteLength;
      totalBytes += bytes;
    }
  }
  return { path: 'app', size: totalBytes };
}
