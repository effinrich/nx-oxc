import type { ExecutorContext } from '@nx/devkit';

jest.mock('../../utils/run-command', () => ({
  runCommand: jest.fn(),
}));

import { runCommand } from '../../utils/run-command';
import runExecutor from './format-check';

const runCommandMock = runCommand as jest.MockedFunction<typeof runCommand>;

describe('format-check executor', () => {
  const context: ExecutorContext = {
    root: '/workspace',
    cwd: '/workspace',
    isVerbose: false,
    projectName: 'demo',
    projectsConfigurations: {
      version: 2,
      projects: {
        demo: { root: 'packages/demo' },
      },
    },
    nxJsonConfiguration: {},
    projectGraph: { nodes: {}, dependencies: {} },
  };

  beforeEach(() => {
    runCommandMock.mockReset();
  });

  it('runs oxfmt --check', async () => {
    runCommandMock.mockResolvedValue(0);

    const result = await runExecutor({ patterns: ['src/**/*.ts'] }, context);

    expect(result.success).toBe(true);
    const [, args] = runCommandMock.mock.calls[0];
    expect(args[0]).toBe('--check');
    expect(args).toContain('packages/demo/src/**/*.ts');
  });
});
