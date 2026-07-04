import { expect, test } from '@playwright/test'

test('GET /test-issue-1001 returns the test issue response as JSON', async ({ request }) => {
  const response = await request.get('/test-issue-1001')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/json')
  await expect(response.json()).resolves.toEqual({ message: 'test issue 1001' })
})
