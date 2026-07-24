import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { ExecutorContext } from '@nx/devkit';
import { findOxfmtConfigFile } from '../../utils/oxfmt-config';
import { getProjectRoot } from '../../utils/project-root';
import { resolveBinary } from '../../utils/resolve-binary';
import { runCommand } from '../../utils/run-command';

export interface OxfmtRunOptions {
  projectRoot?: string;
  config?: string;
  patterns?: string[];
  noErrorOnUnmatchedPattern?: boolean;
  args?: string[];
}

export async function runOxfmt(
  options: OxfmtRunOptions,
  context: ExecutorContext,
  mode: { check: boolean }
): Promise<{ success: boolean }> {
  const projectRoot = getProjectRoot(context, options.projectRoot);
  const oxfmt = resolveBinary(context.root, 'oxfmt');

  const args: string[] = [];

  if (mode.check) {
    args.push('--check');
  } else {
    args.push('--write');
  }

  if (options.noErrorOnUnmatchedPattern) {
    args.push('--no-error-on-unmatched-pattern');
  }

  let configPath: string | undefined;
  if (options.config) {
    const absolute = join(context.root, options.config);
    if (existsSync(absolute)) {
      configPath = absolute;
    } else {
      console.warn(
        `[@nx-oxc/nx] Specified oxfmt config not found: ${options.config}. Continuing without --config.`
      );
    }
  } else {
    configPath =
      findOxfmtConfigFile(join(context.root, projectRoot)) ??
      findOxfmtConfigFile(context.root);
  }

  if (configPath) {
    args.push('--config', configPath);
  }

  if (options.patterns?.length) {
    for (const pattern of options.patterns) {
      args.push(join(projectRoot, pattern).replace(/\\/g, '/'));
    }
  } else if (projectRoot) {
    args.push(projectRoot);
  }

  if (options.args?.length) {
    args.push(...options.args);
  }

  try {
    const code = await runCommand(oxfmt, args, { cwd: context.root });
    if (code !== 0 && mode.check) {
      const label = projectRoot || '.';
      console.error(
        `[@nx-oxc/nx] Formatting check failed for ${relative(context.root, join(context.root, label)) || label}.`
      );
    }
    return { success: code === 0 };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[@nx-oxc/nx] Failed to run oxfmt: ${message}`);
    console.error(
      'Ensure oxfmt is installed in the workspace (npm i -D oxfmt).'
    );
    return { success: false };
  }
}
