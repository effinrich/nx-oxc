import type { ExecutorContext } from '@nx/devkit';

jest.mock('../../utils/run-command', () => ({
  runCommand: jest.fn(),
}));

import { runCommand } from '../../utils/run-command';
import runExecutor from './lint';

const runCommandMock = runCommand as jest.MockedFunction<typeof runCommand>;

describe('lint executor', () => {
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

  it('invokes oxlint with project root and flags', async () => {
    runCommandMock.mockResolvedValue(0);

    const result = await runExecutor(
      {
        fix: true,
        deny: ['correctness'],
        args: ['--react-plugin'],
      },
      context
    );

    expect(result.success).toBe(true);
    expect(runCommandMock).toHaveBeenCalled();
    const [, args] = runCommandMock.mock.calls[0];
    expect(args).toEqual(
      expect.arrayContaining([
        'packages/demo',
        '--fix',
        '-D',
        'correctness',
        '--react-plugin',
      ])
    );
  });

  it('returns failure when oxlint exits non-zero', async () => {
    runCommandMock.mockResolvedValue(1);
    const result = await runExecutor({}, context);
    expect(result.success).toBe(false);
  });
});
