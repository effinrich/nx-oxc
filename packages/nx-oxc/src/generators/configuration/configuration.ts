import {
  formatFiles,
  joinPathFragments,
  logger,
  readProjectConfiguration,
  type Tree,
  updateProjectConfiguration,
  writeJson,
} from '@nx/devkit';
import type { ConfigurationGeneratorSchema } from './schema';

const DEFAULT_PROJECT_OXLINT_CONFIG = {
  plugins: ['typescript', 'unicorn', 'oxc'],
  categories: {
    correctness: 'error',
  },
  ignorePatterns: ['**/dist/**', '**/coverage/**'],
};

const DEFAULT_PROJECT_OXFMT_CONFIG = {};

function hasOxlintConfig(tree: Tree, projectRoot: string): boolean {
  const candidates = [
    '.oxlintrc.json',
    '.oxlintrc.jsonc',
    'oxlint.config.ts',
    'oxlint.config.js',
    'oxlint.config.mjs',
    'oxlint.config.cjs',
  ];
  return candidates.some((file) =>
    tree.exists(joinPathFragments(projectRoot, file))
  );
}

function hasOxfmtConfig(tree: Tree, projectRoot: string): boolean {
  const candidates = [
    '.oxfmtrc.json',
    '.oxfmtrc.jsonc',
    'oxfmt.config.ts',
    'oxfmt.config.js',
    'oxfmt.config.mjs',
    'oxfmt.config.cjs',
  ];
  return candidates.some((file) =>
    tree.exists(joinPathFragments(projectRoot, file))
  );
}

export async function configurationGenerator(
  tree: Tree,
  options: ConfigurationGeneratorSchema
): Promise<void> {
  const project = readProjectConfiguration(tree, options.project);
  const projectRoot = project.root;
  const enableOxlint = options.oxlint !== false;
  const enableOxfmt = options.oxfmt === true;

  if (enableOxlint && !hasOxlintConfig(tree, projectRoot)) {
    writeJson(
      tree,
      joinPathFragments(projectRoot, '.oxlintrc.json'),
      DEFAULT_PROJECT_OXLINT_CONFIG
    );
    logger.info(
      `[@nx-oxc/nx] Created ${joinPathFragments(projectRoot, '.oxlintrc.json')}`
    );
  }

  if (enableOxfmt && !hasOxfmtConfig(tree, projectRoot)) {
    writeJson(
      tree,
      joinPathFragments(projectRoot, '.oxfmtrc.json'),
      DEFAULT_PROJECT_OXFMT_CONFIG
    );
    logger.info(
      `[@nx-oxc/nx] Created ${joinPathFragments(projectRoot, '.oxfmtrc.json')}`
    );
  }

  if (options.addTargets) {
    const targets = { ...(project.targets ?? {}) };
    const lintTargetName = options.lintTargetName ?? 'lint';
    const formatTargetName = options.formatTargetName ?? 'format';
    const formatCheckTargetName =
      options.formatCheckTargetName ?? 'format-check';

    if (enableOxlint) {
      targets[lintTargetName] = {
        executor: '@nx-oxc/nx:lint',
        cache: true,
        inputs: ['default', { externalDependencies: ['oxlint'] }],
        options: {
          projectRoot,
        },
      };
    }

    targets[formatTargetName] = {
      executor: '@nx-oxc/nx:format',
      cache: true,
      inputs: ['default', { externalDependencies: ['oxfmt'] }],
      options: {
        projectRoot,
      },
    };

    targets[formatCheckTargetName] = {
      executor: '@nx-oxc/nx:format-check',
      cache: true,
      inputs: ['default', { externalDependencies: ['oxfmt'] }],
      options: {
        projectRoot,
      },
    };

    updateProjectConfiguration(tree, options.project, {
      ...project,
      targets,
    });
  }

  if (!options.skipFormat) {
    await formatFiles(tree);
  }
}

export default configurationGenerator;
