import { expect, test } from '@playwright/test'

test('GET /status returns ok as JSON', async ({ request }) => {
  const response = await request.get('/status')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/json')
  await expect(response.json()).resolves.toEqual({ status: 'ok' })
})

test('GET /status is public and returns the exact ok payload', async ({ request }) => {
  const response = await request.get('/status')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/json')
  await expect(response.text()).resolves.toBe('{"status":"ok"}')
})

test('POST /status still returns the greeting JSON', async ({ request }) => {
  const response = await request.post('/status')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/json')
  await expect(response.json()).resolves.toEqual({ message: 'Hello, world!' })
})

test('GET /status returns only the ok JSON payload without authentication', async ({ request }) => {
  const response = await request.get('/status')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/json')
  await expect(response.text()).resolves.toBe('{"status":"ok"}')
})

test('GET /status keeps existing route contracts unchanged', async ({ request }) => {
  const pingResponse = await request.get('/ping')
  expect(pingResponse.status()).toBe(200)
  expect(pingResponse.headers()['content-type']).toContain('text/plain')
  await expect(pingResponse.text()).resolves.toBe('pong')

  const unknownResponse = await request.get('/status-missing')
  expect(unknownResponse.status()).toBe(404)
  expect(unknownResponse.headers()['content-type']).toContain('application/json')
  await expect(unknownResponse.json()).resolves.toEqual({ error: 'Not found' })
})
