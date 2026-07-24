import {
  type CreateNodesContextV2,
  createNodesFromFiles,
  type CreateNodesResult,
  type CreateNodesV2,
  joinPathFragments,
  type TargetConfiguration,
} from '@nx/devkit';
import { dirname, join } from 'node:path';
import {
  findOxlintConfigFile,
  findOxlintConfigFileName,
} from '../utils/oxlint-config';

export interface OxlintPluginOptions {
  /** Inferred target name. Defaults to `lint`. */
  targetName?: string;
  /** Default `--fix` for inferred targets. */
  fix?: boolean;
  /** Default output format for inferred targets. */
  format?: string;
  /** Default `--quiet` for inferred targets. */
  quiet?: boolean;
  /** Default `--max-warnings` for inferred targets. */
  maxWarnings?: number;
}

const PROJECT_CONFIG_GLOB = '**/{package,project}.json';
const PACKAGE_NAME = '@nx-oxc/nx';

function normalizeOptions(
  options: OxlintPluginOptions | undefined
): Required<
  Pick<OxlintPluginOptions, 'targetName'>
> &
  OxlintPluginOptions {
  return {
    targetName: options?.targetName ?? 'lint',
    fix: options?.fix,
    format: options?.format,
    quiet: options?.quiet,
    maxWarnings: options?.maxWarnings,
  };
}

async function createNodesInternal(
  configFilePath: string,
  options: OxlintPluginOptions | undefined,
  context: CreateNodesContextV2
): Promise<CreateNodesResult> {
  const projectRoot = dirname(configFilePath);

  // Root workspace package.json is not a project for lint inference.
  if (projectRoot === '.' || projectRoot === '') {
    return {};
  }

  const absoluteProjectRoot = join(context.workspaceRoot, projectRoot);
  const configFileName = findOxlintConfigFileName(absoluteProjectRoot);
  if (!configFileName) {
    return {};
  }

  const normalized = normalizeOptions(options);

  const lintTarget: TargetConfiguration = {
    executor: `${PACKAGE_NAME}:lint`,
    cache: true,
    inputs: [
      'default',
      joinPathFragments('{projectRoot}', configFileName),
      { externalDependencies: ['oxlint'] },
    ],
    options: {
      projectRoot,
      ...(normalized.fix !== undefined ? { fix: normalized.fix } : {}),
      ...(normalized.format ? { format: normalized.format } : {}),
      ...(normalized.quiet !== undefined ? { quiet: normalized.quiet } : {}),
      ...(normalized.maxWarnings !== undefined
        ? { maxWarnings: normalized.maxWarnings }
        : {}),
    },
  };

  return {
    projects: {
      [projectRoot]: {
        targets: {
          [normalized.targetName]: lintTarget,
        },
      },
    },
  };
}

export const createNodes: CreateNodesV2<OxlintPluginOptions> = [
  PROJECT_CONFIG_GLOB,
  async (configFiles, options, context) => {
    return await createNodesFromFiles(
      (configFile, opts, ctx) => createNodesInternal(configFile, opts, ctx),
      configFiles,
      options,
      context
    );
  },
];

/** @deprecated Use `createNodes`. Kept for Nx versions that still look for createNodesV2. */
export const createNodesV2 = createNodes;
