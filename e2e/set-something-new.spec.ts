import { expect, test } from '@playwright/test'

test('POST /version still uses the greeting JSON fallback', async ({ request }) => {
  const response = await request.post('/version')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/json')
  await expect(response.json()).resolves.toEqual({ message: 'Hello, world!' })
})

test('POST /uptime still uses the greeting JSON fallback', async ({ request }) => {
  const response = await request.post('/uptime')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/json')
  await expect(response.json()).resolves.toEqual({ message: 'Hello, world!' })
})
