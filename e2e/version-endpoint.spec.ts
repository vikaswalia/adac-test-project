import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

test('GET /version returns the package version as JSON', async ({ request }) => {
  const response = await request.get('/version')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/json')
  await expect(response.json()).resolves.toEqual({ version: packageJson.version })
})

test('GET /versioned returns a JSON 404 error', async ({ request }) => {
  const response = await request.get('/versioned')

  expect(response.status()).toBe(404)
  expect(response.headers()['content-type']).toContain('application/json')
  await expect(response.json()).resolves.toEqual({ error: 'Not found' })
})
