import fsp from 'node:fs/promises';
import { globby } from 'globby';
import { join } from 'pathe';
import { getOptions } from '../utils';

export async function getClientStats() {
  const rootDir = process.cwd();
  const options = await getOptions();
  const stats = await analyzeSizes(
    '**/*.js',
    join(rootDir, options.outputDirectory, 'public')
  );

  return [stats];
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
      const bytes = Buffer.byteLength(await fsp.readFile(path));
      totalBytes += bytes;
    }
  }
  return { path: 'app', size: totalBytes };
}
