import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

test('GET /version returns the package version as JSON', async ({ request }) => {
  const response = await request.get('/version')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/json')
  await expect(response.json()).resolves.toEqual({ version: packageJson.version })
})
