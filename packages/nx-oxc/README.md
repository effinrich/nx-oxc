# @nx-oxc/nx

Nx plugin for **[oxlint](https://oxc.rs/docs/guide/usage/linter)** and **[oxfmt](https://oxc.rs/docs/guide/usage/formatter)** — the Oxc Rust toolchain for linting and formatting.

## Why this plugin?

Existing community packages cover oxlint _or_ oxfmt separately. `@nx-oxc/nx` gives you both in one package with:

- Executors for `lint`, `format`, and `format-check`
- Workspace `init` + per-project `configuration` generators
- Modern `createNodes` inference (same pattern as `@nx/eslint`)
- Selective plugin entry points (`/oxlint`, `/oxfmt`, or combined `/plugin`)
- Clear JSON schemas and sensible defaults

## Install

```bash
npm install -D @nx-oxc/nx
npx nx g @nx-oxc/nx:init
```

Or in one step:

```bash
npx nx add @nx-oxc/nx
```

`init` will:

1. Install `oxlint` and/or `oxfmt`
2. Scaffold `.oxlintrc.json` / `.oxfmtrc.json` when missing
3. Register inference plugins in `nx.json`

### Init options

| Option | Default | Description |
| --- | --- | --- |
| `oxlint` | `true` | Install oxlint + register `@nx-oxc/nx/oxlint` |
| `oxfmt` | `true` | Install oxfmt + register `@nx-oxc/nx/oxfmt` |
| `createOxlintConfig` | `true` | Write workspace `.oxlintrc.json` if missing |
| `createOxfmtConfig` | `true` | Write workspace `.oxfmtrc.json` if missing |
| `removeEslintPlugin` | `false` | Drop `@nx/eslint/plugin` from `nx.json` |
| `lintTargetName` | `lint` | Inferred lint target name |
| `formatTargetName` | `format` | Inferred format target name |
| `formatCheckTargetName` | `format-check` | Inferred format-check target name |

Examples:

```bash
# oxlint only
npx nx g @nx-oxc/nx:init --oxfmt=false

# keep ESLint plugin; add oxc tools alongside
npx nx g @nx-oxc/nx:init

# replace ESLint inference with oxlint
npx nx g @nx-oxc/nx:init --removeEslintPlugin
```

## Project configuration

Create a project-level oxlint config (required for inferred `lint` targets):

```bash
npx nx g @nx-oxc/nx:configuration --project=my-lib
```

Optionally add explicit executor targets instead of inference:

```bash
npx nx g @nx-oxc/nx:configuration --project=my-lib --addTargets
```

## Usage

```bash
npx nx run my-lib:lint
npx nx run my-lib:format
npx nx run my-lib:format-check

npx nx run-many -t lint
npx nx run-many -t format-check
```

## Inference plugins

`init` registers:

```json
{
  "plugins": [
    {
      "plugin": "@nx-oxc/nx/oxlint",
      "options": { "targetName": "lint" }
    },
    {
      "plugin": "@nx-oxc/nx/oxfmt",
      "options": {
        "formatTargetName": "format",
        "formatCheckTargetName": "format-check"
      }
    }
  ]
}
```

- **oxlint** — adds a `lint` target when the project has an oxlint config (`.oxlintrc.json`, `oxlint.config.ts`, …)
- **oxfmt** — adds `format` + `format-check` to every project (except the workspace root)

Combined entry (both tools):

```json
{ "plugin": "@nx-oxc/nx/plugin" }
```

## Executors

### `@nx-oxc/nx:lint`

| Option | Type | Description |
| --- | --- | --- |
| `projectRoot` | `string` | Project root (default: current project) |
| `configFile` | `string` | Config path relative to workspace root |
| `fix` | `boolean` | Apply safe fixes |
| `fixSuggestions` | `boolean` | Apply suggestions |
| `fixDangerously` | `boolean` | Apply dangerous fixes |
| `format` | `string` | Output format (`default`, `json`, `github`, …) |
| `quiet` | `boolean` | Errors only |
| `maxWarnings` | `number` | Fail above warning threshold |
| `deny` / `warn` / `allow` | `string[]` | Rule/category flags |
| `args` | `string[]` | Extra CLI args |

### `@nx-oxc/nx:format` / `@nx-oxc/nx:format-check`

| Option | Type | Description |
| --- | --- | --- |
| `projectRoot` | `string` | Project root |
| `config` | `string` | oxfmt config path |
| `patterns` | `string[]` | Globs relative to project root |
| `noErrorOnUnmatchedPattern` | `boolean` | Don't fail on unmatched globs |
| `args` | `string[]` | Extra CLI args |

## Requirements

- Nx >= 20 (via `@nx/devkit`; do not add `nx` as a direct dependency in consumer workspaces)
- Node.js 18+
- `oxlint` / `oxfmt` as optional peer dependencies (installed by `init`)

## Publishing

This package is published to npm as `@nx-oxc/nx`. From the workspace root:

```bash
npx nx run-many -t build
npx nx release version patch   # or minor/major
npx nx release publish
```

Use the workspace `local-registry` target to dry-run publish against Verdaccio before releasing to npm.

## License

MIT
