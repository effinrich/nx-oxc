import {
  addDependenciesToPackageJson,
  formatFiles,
  type GeneratorCallback,
  logger,
  runTasksInSerial,
  type Tree,
  writeJson,
} from '@nx/devkit';
import {
  addPluginRegistration,
  removePluginRegistration,
} from '../../utils/plugin-registration';
import type { InitGeneratorSchema } from './schema';

const OXLINT_VERSION = '^1.75.0';
const OXFMT_VERSION = '^0.60.0';

const DEFAULT_OXLINT_CONFIG = {
  $schema: './node_modules/oxlint/configuration_schema.json',
  plugins: ['typescript', 'unicorn', 'oxc'],
  categories: {
    correctness: 'error',
  },
  ignorePatterns: ['**/dist/**', '**/coverage/**', '**/.nx/**'],
};

const DEFAULT_OXFMT_CONFIG = {
  $schema: './node_modules/oxfmt/configuration_schema.json',
};

function hasAnyOxlintConfig(tree: Tree): boolean {
  const candidates = [
    '.oxlintrc.json',
    '.oxlintrc.jsonc',
    'oxlint.config.ts',
    'oxlint.config.js',
    'oxlint.config.mjs',
    'oxlint.config.cjs',
  ];
  return candidates.some((file) => tree.exists(file));
}

function hasAnyOxfmtConfig(tree: Tree): boolean {
  const candidates = [
    '.oxfmtrc.json',
    '.oxfmtrc.jsonc',
    'oxfmt.config.ts',
    'oxfmt.config.js',
    'oxfmt.config.mjs',
    'oxfmt.config.cjs',
  ];
  return candidates.some((file) => tree.exists(file));
}

export async function initGenerator(
  tree: Tree,
  options: InitGeneratorSchema
): Promise<GeneratorCallback> {
  const oxlint = options.oxlint !== false;
  const oxfmt = options.oxfmt !== false;
  const tasks: GeneratorCallback[] = [];

  if (!oxlint && !oxfmt) {
    throw new Error(
      '[@nx-oxc/nx] init requires at least one of --oxlint or --oxfmt.'
    );
  }

  const devDeps: Record<string, string> = {};
  if (oxlint) {
    devDeps['oxlint'] = OXLINT_VERSION;
  }
  if (oxfmt) {
    devDeps['oxfmt'] = OXFMT_VERSION;
  }

  tasks.push(addDependenciesToPackageJson(tree, {}, devDeps));

  if (
    oxlint &&
    options.createOxlintConfig !== false &&
    !hasAnyOxlintConfig(tree)
  ) {
    writeJson(tree, '.oxlintrc.json', DEFAULT_OXLINT_CONFIG);
  }

  if (
    oxfmt &&
    options.createOxfmtConfig !== false &&
    !hasAnyOxfmtConfig(tree)
  ) {
    writeJson(tree, '.oxfmtrc.json', DEFAULT_OXFMT_CONFIG);
  }

  if (options.removeEslintPlugin) {
    removePluginRegistration(tree, '@nx/eslint/plugin');
    logger.info('[@nx-oxc/nx] Removed @nx/eslint/plugin from nx.json.');
  }

  if (oxlint) {
    addPluginRegistration(tree, '@nx-oxc/nx/oxlint', {
      targetName: options.lintTargetName ?? 'lint',
    });
  }

  if (oxfmt) {
    addPluginRegistration(tree, '@nx-oxc/nx/oxfmt', {
      formatTargetName: options.formatTargetName ?? 'format',
      formatCheckTargetName: options.formatCheckTargetName ?? 'format-check',
    });
  }

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(...tasks);
}

export default initGenerator;
