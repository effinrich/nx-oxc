export interface FormatExecutorSchema {
  /** Project root relative to the workspace root. Defaults to the current project root. */
  projectRoot?: string;
  /** Path to an oxfmt config file relative to the workspace root. */
  config?: string;
  /** Glob patterns relative to the project root. Defaults to the project root. */
  patterns?: string[];
  /** Do not exit with an error when a pattern is unmatched. */
  noErrorOnUnmatchedPattern?: boolean;
  /** Extra CLI args appended to the oxfmt invocation. */
  args?: string[];
}
