export interface InitGeneratorSchema {
  /** Install and configure oxlint (default true). */
  oxlint?: boolean;
  /** Install and configure oxfmt (default true). */
  oxfmt?: boolean;
  /** Create a workspace `.oxlintrc.json` when missing (default true). */
  createOxlintConfig?: boolean;
  /** Create a workspace `.oxfmtrc.json` when missing (default true). */
  createOxfmtConfig?: boolean;
  /** Inferred lint target name (default `lint`). */
  lintTargetName?: string;
  /** Inferred format target name (default `format`). */
  formatTargetName?: string;
  /** Inferred format-check target name (default `format-check`). */
  formatCheckTargetName?: string;
  /** Remove `@nx/eslint/plugin` from nx.json (default false). */
  removeEslintPlugin?: boolean;
  /** Skip formatting the workspace after generation. */
  skipFormat?: boolean;
}
