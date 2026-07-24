import type { ExecutorContext, PromiseExecutor } from '@nx/devkit';
import { runOxfmt } from '../shared/run-oxfmt';
import type { FormatCheckExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<FormatCheckExecutorSchema> = async (
  options,
  context: ExecutorContext
) => {
  return runOxfmt(options, context, { check: true });
};

export default runExecutor;
