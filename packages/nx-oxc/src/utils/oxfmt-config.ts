import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Default oxfmt config filenames under a project or workspace directory.
 * @see https://oxc.rs/docs/guide/usage/formatter
 */
export const DEFAULT_OXFMT_CONFIG_FILENAMES = [
  '.oxfmtrc.json',
  '.oxfmtrc.jsonc',
  'oxfmt.config.ts',
  'oxfmt.config.mts',
  'oxfmt.config.cts',
  'oxfmt.config.js',
  'oxfmt.config.mjs',
  'oxfmt.config.cjs',
] as const;

/**
 * Returns the absolute path to the first existing default oxfmt config under
 * `directory`, or undefined if none exist.
 */
export function findOxfmtConfigFile(directory: string): string | undefined {
  for (const name of DEFAULT_OXFMT_CONFIG_FILENAMES) {
    const fullPath = join(directory, name);
    if (existsSync(fullPath)) {
      return fullPath;
    }
  }
  return undefined;
}
