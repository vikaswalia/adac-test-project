import { expect, test } from '@playwright/test'

test('GET /status returns ok as JSON', async ({ request }) => {
  const response = await request.get('/status')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/json')
  await expect(response.json()).resolves.toEqual({ status: 'ok' })
})

test('POST /status still returns the greeting JSON', async ({ request }) => {
  const response = await request.post('/status')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/json')
  await expect(response.json()).resolves.toEqual({ message: 'Hello, world!' })
})