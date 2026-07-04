import { expect, test } from '@playwright/test'

test('GET /ping returns exactly pong as plain text', async ({ request }) => {
  const response = await request.get('/ping')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/plain')
  await expect(response.text()).resolves.toBe('pong')
})

test('POST /ping still returns the greeting JSON', async ({ request }) => {
  const response = await request.post('/ping')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/json')
  await expect(response.json()).resolves.toEqual({ message: 'Hello, world!' })
})
