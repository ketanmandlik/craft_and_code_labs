// Start the production preview before running this script.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { chromium } from '@playwright/test'

const url = new URL(process.argv[2] || 'http://127.0.0.1:4173')
if (!['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)) {
  throw new Error('Use a local production preview URL.')
}
const directory = resolve('reports/lighthouse')
mkdirSync(directory, { recursive: true })
const metrics = []
for (const device of ['mobile', 'desktop']) {
  const cli = [
    'node_modules/lighthouse/cli/index.js', url.href,
    '--quiet', '--only-categories=performance,accessibility,best-practices,seo',
    '--output=json', '--output-path=' + resolve(directory, device + '.json'),
    '--chrome-flags=--headless --disable-dev-shm-usage --no-sandbox',
  ]
  if (device === 'desktop') cli.push('--preset=desktop')
  const result = spawnSync(process.execPath, cli, {
    stdio: 'inherit', env: { ...process.env, CHROME_PATH: chromium.executablePath() },
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
  const audit = JSON.parse(readFileSync(resolve(directory, device + '.json'), 'utf8'))
  if (audit.runtimeError) throw new Error(audit.runtimeError.message)
  metrics.push({
    device, measured: audit.fetchTime, version: audit.lighthouseVersion,
    scores: Object.fromEntries(Object.entries(audit.categories).map(([name, value]) => [name, Math.round(value.score * 100)])),
    LCP: audit.audits['largest-contentful-paint'].displayValue,
    TBT: audit.audits['total-blocking-time'].displayValue,
    CLS: audit.audits['cumulative-layout-shift'].displayValue,
  })
}
writeFileSync(resolve(directory, 'summary.json'), JSON.stringify(metrics, null, 2) + '\n')
console.log(metrics)
