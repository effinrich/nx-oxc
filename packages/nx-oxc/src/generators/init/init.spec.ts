import { type Tree, readJson, updateJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { initGenerator } from './init';

describe('init generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    updateJson(tree, 'package.json', (json) => {
      json.devDependencies ??= {};
      return json;
    });
  });

  it('registers oxlint and oxfmt plugins and creates configs', async () => {
    await initGenerator(tree, { skipFormat: true });

    const nxJson = readJson(tree, 'nx.json');
    expect(nxJson.plugins).toEqual(
      expect.arrayContaining([
        {
          plugin: '@nx-oxc/nx/oxlint',
          options: { targetName: 'lint' },
        },
        {
          plugin: '@nx-oxc/nx/oxfmt',
          options: {
            formatTargetName: 'format',
            formatCheckTargetName: 'format-check',
          },
        },
      ])
    );

    expect(tree.exists('.oxlintrc.json')).toBe(true);
    expect(tree.exists('.oxfmtrc.json')).toBe(true);

    const pkg = readJson(tree, 'package.json');
    expect(pkg.devDependencies.oxlint).toBeDefined();
    expect(pkg.devDependencies.oxfmt).toBeDefined();
  });

  it('can install oxlint only', async () => {
    await initGenerator(tree, { oxfmt: false, skipFormat: true });

    const nxJson = readJson(tree, 'nx.json');
    expect(nxJson.plugins).toEqual([
      {
        plugin: '@nx-oxc/nx/oxlint',
        options: { targetName: 'lint' },
      },
    ]);
    expect(tree.exists('.oxfmtrc.json')).toBe(false);
  });

  it('optionally removes @nx/eslint/plugin', async () => {
    updateJson(tree, 'nx.json', (json) => {
      json.plugins = ['@nx/eslint/plugin'];
      return json;
    });

    await initGenerator(tree, {
      removeEslintPlugin: true,
      oxfmt: false,
      skipFormat: true,
    });

    const nxJson = readJson(tree, 'nx.json');
    expect(
      nxJson.plugins.some((p: string | { plugin: string }) =>
        typeof p === 'string'
          ? p === '@nx/eslint/plugin'
          : p.plugin === '@nx/eslint/plugin'
      )
    ).toBe(false);
  });

  it('throws when both tools are disabled', async () => {
    await expect(
      initGenerator(tree, { oxlint: false, oxfmt: false, skipFormat: true })
    ).rejects.toThrow(/at least one/);
  });
});
