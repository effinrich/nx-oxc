import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Resolve a local node_modules binary, with Windows `.cmd` support.
 * Falls back to the bare command name (PATH lookup) when not installed locally.
 */
export function resolveBinary(workspaceRoot: string, name: string): string {
  const binDir = join(workspaceRoot, 'node_modules', '.bin');

  if (process.platform === 'win32') {
    const cmdPath = join(binDir, `${name}.cmd`);
    if (existsSync(cmdPath)) {
      return cmdPath;
    }
    const ps1Path = join(binDir, `${name}.ps1`);
    if (existsSync(ps1Path)) {
      return ps1Path;
    }
  }

  const unixPath = join(binDir, name);
  if (existsSync(unixPath)) {
    return unixPath;
  }

  return name;
}
