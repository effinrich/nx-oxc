import { createNodes } from './oxfmt';
import type { CreateNodesContextV2 } from '@nx/devkit';

describe('oxfmt createNodes', () => {
  const [, create] = createNodes;

  const context = {
    workspaceRoot: '/workspace',
    nxJsonConfiguration: {},
  } as CreateNodesContextV2;

  it('infers format targets for nested projects', async () => {
    const results = await create(
      ['packages/demo/package.json'],
      undefined,
      context
    );

    expect(results).toHaveLength(1);
    const [, result] = results[0];
    expect(result.projects?.['packages/demo']?.targets?.['format']?.executor).toBe(
      '@nx-oxc/nx:format'
    );
    expect(
      result.projects?.['packages/demo']?.targets?.['format-check']?.executor
    ).toBe('@nx-oxc/nx:format-check');
  });

  it('skips the workspace root package.json', async () => {
    const results = await create(['package.json'], undefined, context);
    expect(results[0][1]).toEqual({});
  });
});
