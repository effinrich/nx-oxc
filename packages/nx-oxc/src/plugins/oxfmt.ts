import {
  type CreateNodesContextV2,
  createNodesFromFiles,
  type CreateNodesResult,
  type CreateNodesV2,
  type TargetConfiguration,
} from '@nx/devkit';
import { dirname } from 'node:path';

export interface OxfmtPluginOptions {
  /** Inferred format target name. Defaults to `format`. */
  formatTargetName?: string;
  /** Inferred format-check target name. Defaults to `format-check`. */
  formatCheckTargetName?: string;
}

const PROJECT_CONFIG_GLOB = '**/{package,project}.json';
const PACKAGE_NAME = '@nx-oxc/nx';

function normalizeOptions(options: OxfmtPluginOptions | undefined): {
  formatTargetName: string;
  formatCheckTargetName: string;
} {
  return {
    formatTargetName: options?.formatTargetName ?? 'format',
    formatCheckTargetName: options?.formatCheckTargetName ?? 'format-check',
  };
}

async function createNodesInternal(
  configFilePath: string,
  options: OxfmtPluginOptions | undefined,
  _context: CreateNodesContextV2
): Promise<CreateNodesResult> {
  const projectRoot = dirname(configFilePath);

  // Skip workspace root package.json — formatting root is handled by `nx format`.
  if (projectRoot === '.' || projectRoot === '') {
    return {};
  }

  const normalized = normalizeOptions(options);

  const baseOptions = {
    projectRoot,
  };

  const formatTarget: TargetConfiguration = {
    executor: `${PACKAGE_NAME}:format`,
    cache: true,
    inputs: [
      'default',
      '{workspaceRoot}/.oxfmtrc.json',
      '{workspaceRoot}/.oxfmtrc.jsonc',
      { externalDependencies: ['oxfmt'] },
    ],
    options: { ...baseOptions },
  };

  const formatCheckTarget: TargetConfiguration = {
    executor: `${PACKAGE_NAME}:format-check`,
    cache: true,
    inputs: [
      'default',
      '{workspaceRoot}/.oxfmtrc.json',
      '{workspaceRoot}/.oxfmtrc.jsonc',
      { externalDependencies: ['oxfmt'] },
    ],
    options: { ...baseOptions },
  };

  return {
    projects: {
      [projectRoot]: {
        targets: {
          [normalized.formatTargetName]: formatTarget,
          [normalized.formatCheckTargetName]: formatCheckTarget,
        },
      },
    },
  };
}

export const createNodes: CreateNodesV2<OxfmtPluginOptions> = [
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
