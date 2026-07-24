import type { ExecutorContext, PromiseExecutor } from '@nx/devkit';
import { runOxfmt } from '../shared/run-oxfmt';
import type { FormatExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<FormatExecutorSchema> = async (
  options,
  context: ExecutorContext
) => {
  return runOxfmt(options, context, { check: false });
};

export default runExecutor;
