import { spawn } from 'node:child_process';

export interface RunCommandOptions {
  cwd: string;
  env?: NodeJS.ProcessEnv;
}

/**
 * Spawn a CLI tool and stream stdio. Resolves with the process exit code.
 */
export function runCommand(
  command: string,
  args: string[],
  options: RunCommandOptions
): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env ?? process.env,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      resolve(code ?? 1);
    });
  });
}
