import {
  addProjectConfiguration,
  type Tree,
  readProjectConfiguration,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { configurationGenerator } from './configuration';

describe('configuration generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    addProjectConfiguration(tree, 'demo', {
      root: 'packages/demo',
      projectType: 'library',
      sourceRoot: 'packages/demo/src',
      targets: {},
    });
  });

  it('creates a project oxlint config by default', async () => {
    await configurationGenerator(tree, {
      project: 'demo',
      skipFormat: true,
    });

    expect(tree.exists('packages/demo/.oxlintrc.json')).toBe(true);
    expect(tree.exists('packages/demo/.oxfmtrc.json')).toBe(false);
  });

  it('can add explicit executor targets', async () => {
    await configurationGenerator(tree, {
      project: 'demo',
      addTargets: true,
      oxfmt: true,
      skipFormat: true,
    });

    const project = readProjectConfiguration(tree, 'demo');
    expect(project.targets?.['lint']?.executor).toBe('@nx-oxc/nx:lint');
    expect(project.targets?.['format']?.executor).toBe('@nx-oxc/nx:format');
    expect(project.targets?.['format-check']?.executor).toBe(
      '@nx-oxc/nx:format-check'
    );
    expect(tree.exists('packages/demo/.oxfmtrc.json')).toBe(true);
  });
});
