import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { writeFileSync, copyFileSync, existsSync } from 'node:fs'
const root = fileURLToPath(new URL('../', import.meta.url))
const command = process.argv[2]
if (!['dev', 'generate'].includes(command)) throw new Error('Expected dev or generate')
const result = spawnSync(process.execPath, [root + 'node_modules/nuxt/bin/nuxt.mjs', command, ...process.argv.slice(3)], {
  cwd: root, stdio: 'inherit',
  env: { ...process.env, NUXT_PUBLIC_DEMO_MODE: 'true', NUXT_APP_BASE_URL: process.env.NUXT_APP_BASE_URL || '/' },
})
if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)
if (command === 'generate') {
  const output = root + '.output/public/'
  if (!existsSync(output + '404.html')) copyFileSync(output + 'index.html', output + '404.html')
  writeFileSync(output + '.nojekyll', '')
}
