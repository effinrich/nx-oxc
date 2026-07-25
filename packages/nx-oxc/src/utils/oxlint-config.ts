import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Default oxlint config filenames under a project directory (first match wins).
 * @see https://oxc.rs/docs/guide/usage/linter/config
 */
export const DEFAULT_OXLINT_CONFIG_FILENAMES = [
  '.oxlintrc.json',
  '.oxlintrc.jsonc',
  'oxlint.config.ts',
  'oxlint.config.mts',
  'oxlint.config.cts',
  'oxlint.config.js',
  'oxlint.config.mjs',
  'oxlint.config.cjs',
  '.oxlintrc',
  'oxlint.json',
] as const;

/**
 * Returns the absolute path to the first existing default oxlint config under
 * `directory`, or undefined if none exist.
 */
export function findOxlintConfigFile(directory: string): string | undefined {
  for (const name of DEFAULT_OXLINT_CONFIG_FILENAMES) {
    const fullPath = join(directory, name);
    if (existsSync(fullPath)) {
      return fullPath;
    }
  }
  return undefined;
}

export function findOxlintConfigFileName(directory: string): string | undefined {
  const absolute = findOxlintConfigFile(directory);
  if (!absolute) {
    return undefined;
  }
  return absolute.slice(directory.length).replace(/^[/\\]/, '');
}
