import { expect, test } from '@playwright/test'

test('GET /uptime returns a JSON uptime value', async ({ request }) => {
  const response = await request.get('/uptime')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/json')

  const body = await response.json()
  expect(body).toEqual({ uptime: expect.any(Number) })
  expect(body.uptime).toBeGreaterThanOrEqual(0)
})

test('GET /ping returns pong as plain text', async ({ request }) => {
  const response = await request.get('/ping')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/plain')
  await expect(response.text()).resolves.toBe('pong')
})

test('non-uptime requests still return the greeting JSON', async ({ request }) => {
  const response = await request.get('/anything')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/json')
  await expect(response.json()).resolves.toEqual({ message: 'Hello, world!' })
})
