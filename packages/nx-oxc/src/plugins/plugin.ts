import { type CreateNodesResult, type CreateNodesV2 } from '@nx/devkit';
import {
  createNodes as createOxfmtNodes,
  type OxfmtPluginOptions,
} from './oxfmt';
import {
  createNodes as createOxlintNodes,
  type OxlintPluginOptions,
} from './oxlint';

export type NxOxcPluginOptions = OxlintPluginOptions & OxfmtPluginOptions;

const PROJECT_CONFIG_GLOB = '**/{package,project}.json';

/**
 * Combined inference plugin that registers both oxlint and oxfmt targets.
 * Prefer `@nx-oxc/nx/oxlint` and `@nx-oxc/nx/oxfmt` for selective adoption.
 */
export const createNodes: CreateNodesV2<NxOxcPluginOptions> = [
  PROJECT_CONFIG_GLOB,
  async (configFiles, options, context) => {
    const [, oxlintCreate] = createOxlintNodes;
    const [, oxfmtCreate] = createOxfmtNodes;

    const [oxlintResults, oxfmtResults] = await Promise.all([
      oxlintCreate(configFiles, options, context),
      oxfmtCreate(configFiles, options, context),
    ]);

    return mergeCreateNodesResults(oxlintResults, oxfmtResults);
  },
];

/** @deprecated Use `createNodes`. */
export const createNodesV2 = createNodes;

type CreateNodesResultArray = ReadonlyArray<
  readonly [configFileSource: string, result: CreateNodesResult]
>;

function mergeCreateNodesResults(
  ...results: CreateNodesResultArray[]
): Array<[string, CreateNodesResult]> {
  const byFile = new Map<string, CreateNodesResult>();

  for (const resultSet of results) {
    for (const [file, result] of resultSet) {
      const existing = byFile.get(file) ?? {};
      byFile.set(file, deepMergeResults(existing, result));
    }
  }

  return Array.from(byFile.entries());
}

function deepMergeResults(
  a: CreateNodesResult,
  b: CreateNodesResult
): CreateNodesResult {
  const projects: NonNullable<CreateNodesResult['projects']> = {
    ...(a.projects ?? {}),
  };

  for (const [root, config] of Object.entries(b.projects ?? {})) {
    const existing = projects[root] ?? {};
    projects[root] = {
      ...existing,
      ...config,
      targets: {
        ...(existing.targets ?? {}),
        ...(config.targets ?? {}),
      },
      metadata: {
        ...(existing.metadata ?? {}),
        ...(config.metadata ?? {}),
      },
    };
  }

  return {
    ...a,
    ...b,
    projects,
  };
}
