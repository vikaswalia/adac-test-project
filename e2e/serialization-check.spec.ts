import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

test('JSON endpoints return serialized response bodies with unchanged contracts', async ({ request }) => {
  const cases = [
    {
      label: 'version',
      request: () => request.get('/version'),
      expectedStatus: 200,
      expectedBody: { version: packageJson.version },
    },
    {
      label: 'unknown route',
      request: () => request.get('/serialization-check-missing'),
      expectedStatus: 404,
      expectedBody: { error: 'Not found' },
    },
    {
      label: 'known path unsupported method fallback',
      request: () => request.post('/version'),
      expectedStatus: 200,
      expectedBody: { message: 'Hello, world!' },
    },
  ]

  for (const testCase of cases) {
    const response = await testCase.request()
    const rawBody = await response.text()

    expect(response.status(), `${testCase.label} status`).toBe(testCase.expectedStatus)
    expect(response.headers()['content-type'], `${testCase.label} content type`).toContain('application/json')
    expect(rawBody, `${testCase.label} raw serialized body`).toBe(JSON.stringify(testCase.expectedBody))
    expect(JSON.parse(rawBody), `${testCase.label} parsed body`).toEqual(testCase.expectedBody)
  }
})

test('uptime serialization preserves a numeric uptime field', async ({ request }) => {
  const response = await request.get('/uptime')
  const rawBody = await response.text()
  const body = JSON.parse(rawBody)

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/json')
  expect(rawBody).toMatch(/^\{"uptime":\d+(\.\d+)?\}$/)
  expect(body).toEqual({ uptime: expect.any(Number) })
  expect(body.uptime).toBeGreaterThanOrEqual(0)
})

test('plain text ping response remains outside JSON serialization', async ({ request }) => {
  const response = await request.get('/ping')
  const rawBody = await response.text()

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/plain')
  expect(rawBody).toBe('pong')
  expect(() => JSON.parse(rawBody)).toThrow()
})
