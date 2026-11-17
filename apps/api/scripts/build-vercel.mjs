// Builds the API for Vercel with the Build Output API (https://vercel.com/docs/build-output-api):
// one Node.js function holding a single bundled file (our code, @zzz/core and the npm packages;
// the HTTP database client has no native modules), in São Paulo next to the Turso database, and
// a route that sends every path to it. Run by Vercel as the build command (see vercel.json).
import { build } from 'esbuild'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const output = `${root}.vercel/output`
const fn = `${output}/functions/api.func`

await rm(output, { recursive: true, force: true })
await mkdir(fn, { recursive: true })

await build({
  entryPoints: [`${root}src/vercel.ts`],
  outfile: `${fn}/index.mjs`,
  bundle: true,
  platform: 'node',
  target: 'node24',
  format: 'esm',
  legalComments: 'none',
  // CommonJS dependencies inside an ES module bundle still call require() for Node built-ins.
  banner: {
    js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);",
  },
  logLevel: 'info',
})

const json = (value) => `${JSON.stringify(value, null, 2)}\n`
await writeFile(
  `${fn}/.vc-config.json`,
  json({
    runtime: 'nodejs24.x',
    handler: 'index.mjs',
    launcherType: 'Nodejs',
    // Leave the request body to Hono (Vercel's helpers would consume the stream).
    shouldAddHelpers: false,
    regions: ['gru1'],
  }),
)
await writeFile(
  `${output}/config.json`,
  json({ version: 3, routes: [{ src: '/(.*)', dest: '/api' }] }),
)
console.log(`Vercel build output written to ${output}`)
