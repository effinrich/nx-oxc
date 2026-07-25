import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Resolve a local node_modules binary, preferring the Windows `.cmd` shim when present.
 * Falls back to the non-suffixed shim / PATH lookup when not installed locally.
 */
export function resolveBinary(workspaceRoot: string, name: string): string {
  const binDir = join(workspaceRoot, 'node_modules', '.bin');

  if (process.platform === 'win32') {
    const cmdPath = join(binDir, `${name}.cmd`);
    if (existsSync(cmdPath)) {
      return cmdPath;
    }
  }

  const shimPath = join(binDir, name);
  if (existsSync(shimPath)) {
    return shimPath;
  }

  return name;
}
