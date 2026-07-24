import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { ExecutorContext, PromiseExecutor } from '@nx/devkit';
import { findOxlintConfigFile } from '../../utils/oxlint-config';
import { getProjectRoot } from '../../utils/project-root';
import { resolveBinary } from '../../utils/resolve-binary';
import { runCommand } from '../../utils/run-command';
import type { LintExecutorSchema } from './schema';

function buildArgs(
  options: LintExecutorSchema,
  projectRoot: string,
  configFilePath: string | undefined
): string[] {
  const args: string[] = [];

  if (projectRoot) {
    args.push(projectRoot);
  }

  if (configFilePath) {
    args.push('--config', configFilePath);
  }

  if (options.fix) {
    args.push('--fix');
  }
  if (options.fixSuggestions) {
    args.push('--fix-suggestions');
  }
  if (options.fixDangerously) {
    args.push('--fix-dangerously');
  }
  if (options.format && options.format !== 'default') {
    args.push('--format', options.format);
  }
  if (options.quiet) {
    args.push('--quiet');
  }
  if (options.maxWarnings !== undefined) {
    args.push('--max-warnings', String(options.maxWarnings));
  }

  for (const rule of options.deny ?? []) {
    args.push('-D', rule);
  }
  for (const rule of options.warn ?? []) {
    args.push('-W', rule);
  }
  for (const rule of options.allow ?? []) {
    args.push('-A', rule);
  }

  if (options.args?.length) {
    args.push(...options.args);
  }

  return args;
}

const runExecutor: PromiseExecutor<LintExecutorSchema> = async (
  options,
  context: ExecutorContext
) => {
  const projectRoot = getProjectRoot(context, options.projectRoot);
  const oxlint = resolveBinary(context.root, 'oxlint');

  let configFilePath: string | undefined;
  if (options.configFile) {
    const absolute = join(context.root, options.configFile);
    if (existsSync(absolute)) {
      configFilePath = absolute;
    } else {
      console.warn(
        `[@nx-oxc/nx] Specified config file not found: ${options.configFile}. Continuing without --config.`
      );
    }
  } else {
    configFilePath = findOxlintConfigFile(join(context.root, projectRoot));
  }

  const args = buildArgs(options, projectRoot, configFilePath);

  try {
    const code = await runCommand(oxlint, args, { cwd: context.root });
    return { success: code === 0 };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[@nx-oxc/nx] Failed to run oxlint: ${message}`);
    console.error(
      'Ensure oxlint is installed in the workspace (npm i -D oxlint).'
    );
    return { success: false };
  }
};

export default runExecutor;
