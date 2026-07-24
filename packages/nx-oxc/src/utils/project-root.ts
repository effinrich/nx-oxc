import type { ExecutorContext } from '@nx/devkit';

export function getProjectRoot(
  context: ExecutorContext,
  projectRootOption?: string
): string {
  if (projectRootOption) {
    return projectRootOption;
  }

  const projectName = context.projectName;
  if (!projectName) {
    return '';
  }

  return context.projectsConfigurations?.projects[projectName]?.root ?? '';
}
