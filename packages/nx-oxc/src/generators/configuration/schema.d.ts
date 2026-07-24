export interface ConfigurationGeneratorSchema {
  /** Project to configure. */
  project: string;
  /** Create a project-level `.oxlintrc.json` (default true). */
  oxlint?: boolean;
  /** Create a project-level `.oxfmtrc.json` (default false — workspace config is usually enough). */
  oxfmt?: boolean;
  /** Also add explicit executor targets instead of relying on inference (default false). */
  addTargets?: boolean;
  /** Lint target name when addTargets is true. */
  lintTargetName?: string;
  /** Format target name when addTargets is true. */
  formatTargetName?: string;
  /** Format-check target name when addTargets is true. */
  formatCheckTargetName?: string;
  /** Skip formatting files after generation. */
  skipFormat?: boolean;
}
