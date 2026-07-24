export type OxlintFormatOption =
  | 'checkstyle'
  | 'default'
  | 'github'
  | 'gitlab'
  | 'json'
  | 'junit'
  | 'stylish'
  | 'unix';

export interface LintExecutorSchema {
  /** Project root relative to the workspace root. Defaults to the current project root. */
  projectRoot?: string;
  /** Path to an oxlint config file relative to the workspace root. */
  configFile?: string;
  /** Fix as many issues as possible. */
  fix?: boolean;
  /** Apply auto-fixable suggestions (may change program behavior). */
  fixSuggestions?: boolean;
  /** Apply dangerous fixes and suggestions. */
  fixDangerously?: boolean;
  /** Output format. */
  format?: OxlintFormatOption;
  /** Only report errors (suppress warnings). */
  quiet?: boolean;
  /** Fail when warning count exceeds this threshold. */
  maxWarnings?: number;
  /** Deny rule or category (`-D`). */
  deny?: string[];
  /** Warn on rule or category (`-W`). */
  warn?: string[];
  /** Allow rule or category (`-A`). */
  allow?: string[];
  /** Extra CLI args appended to the oxlint invocation. */
  args?: string[];
}
