import {
  type PluginConfiguration,
  readNxJson,
  type Tree,
  updateNxJson,
} from '@nx/devkit';

export function pluginHasName(
  plugin: PluginConfiguration,
  pluginName: string
): boolean {
  return typeof plugin === 'string'
    ? plugin === pluginName
    : plugin.plugin === pluginName;
}

export function hasPlugin(tree: Tree, pluginName: string): boolean {
  const nxJson = readNxJson(tree) ?? {};
  return (nxJson.plugins ?? []).some((plugin) =>
    pluginHasName(plugin, pluginName)
  );
}

export function addPluginRegistration(
  tree: Tree,
  pluginName: string,
  options?: Record<string, string | boolean | number>
): void {
  if (hasPlugin(tree, pluginName)) {
    return;
  }

  const nxJson = readNxJson(tree) ?? {};
  nxJson.plugins = [
    ...(nxJson.plugins ?? []),
    options
      ? {
          plugin: pluginName,
          options,
        }
      : pluginName,
  ];
  updateNxJson(tree, nxJson);
}

export function removePluginRegistration(tree: Tree, pluginName: string): void {
  const nxJson = readNxJson(tree) ?? {};
  if (!nxJson.plugins?.length) {
    return;
  }
  nxJson.plugins = nxJson.plugins.filter(
    (plugin) => !pluginHasName(plugin, pluginName)
  );
  updateNxJson(tree, nxJson);
}
