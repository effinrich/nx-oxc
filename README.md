# nx-oxc

Community Nx plugins for the [Oxc](https://oxc.rs/) toolchain.

## Packages

| Package | Description |
| --- | --- |
| [`@nx-oxc/nx`](./packages/nx-oxc) | Unified Nx plugin for **oxlint** + **oxfmt** (executors, generators, inferred targets) |

## Quick start (consumers)

```bash
npm install -D @nx-oxc/nx
npx nx g @nx-oxc/nx:init
```

Then:

```bash
npx nx g @nx-oxc/nx:configuration --project=my-lib
npx nx run my-lib:lint
npx nx run my-lib:format
npx nx run my-lib:format-check
```

See [`packages/nx-oxc/README.md`](./packages/nx-oxc/README.md) for full docs.

## Develop this workspace

```bash
npm install
npx nx build nx-oxc
npx nx test nx-oxc
npx nx typecheck nx-oxc
```

## Repository

Source: [github.com/effinrich/nx-oxc](https://github.com/effinrich/nx-oxc)

## License

MIT
