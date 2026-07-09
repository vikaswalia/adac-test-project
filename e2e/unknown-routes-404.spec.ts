import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

test('GET unknown routes return JSON 404 errors', async ({ request }) => {
  for (const path of ['/nonexistent', '/anything', '/versioned']) {
    const response = await request.get(path)

    expect(response.status(), `${path} status`).toBe(404)
    expect(response.headers()['content-type'], `${path} content type`).toContain('application/json')
    await expect(response.json(), `${path} body`).resolves.toEqual({ error: 'Not found' })
  }
})

test('documented GET endpoints keep their response contracts', async ({ request }) => {
  const ping = await request.get('/ping')
  expect(ping.status()).toBe(200)
  expect(ping.headers()['content-type']).toContain('text/plain')
  await expect(ping.text()).resolves.toBe('pong')

  const uptime = await request.get('/uptime')
  expect(uptime.status()).toBe(200)
  expect(uptime.headers()['content-type']).toContain('application/json')
  const uptimeBody = await uptime.json()
  expect(uptimeBody).toEqual({ uptime: expect.any(Number) })
  expect(uptimeBody.uptime).toBeGreaterThanOrEqual(0)

  const version = await request.get('/version')
  expect(version.status()).toBe(200)
  expect(version.headers()['content-type']).toContain('application/json')
  await expect(version.json()).resolves.toEqual({ version: packageJson.version })
})

test('known path method fallbacks still return greeting JSON', async ({ request }) => {
  for (const path of ['/ping', '/uptime', '/version']) {
    const response = await request.post(path)

    expect(response.status(), `${path} status`).toBe(200)
    expect(response.headers()['content-type'], `${path} content type`).toContain('application/json')
    await expect(response.json(), `${path} body`).resolves.toEqual({ message: 'Hello, world!' })
  }
})
