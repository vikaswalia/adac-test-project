import { test } from 'node:test'
import assert from 'node:assert/strict'

process.env.NODE_ENV = 'test'

const { greeting, server } = await import('./index.js')

test('greeting greets the world', () => {
  assert.equal(greeting(), 'Hello, world!')
})

test('GET /health returns service liveness', async () => {
  const response = await request('/health')

  assert.equal(response.statusCode, 200)
  assert.match(response.headers['content-type'], /application\/json/)
  assert.deepEqual(JSON.parse(response.body), { status: 'ok' })
})

test('GET / returns the greeting response', async () => {
  const response = await request('/')

  assert.equal(response.statusCode, 200)
  assert.deepEqual(JSON.parse(response.body), { message: 'Hello, world!' })
})

test('GET /version still returns a successful JSON response', async () => {
  const response = await request('/version')

  assert.equal(response.statusCode, 200)
  assert.match(response.headers['content-type'], /application\/json/)
})

function request(path) {
  return new Promise((resolve, reject) => {
    server.listen(0, () => {
      const { port } = server.address()
      fetch(`http://127.0.0.1:${port}${path}`)
        .then(async (res) => {
          const body = await res.text()
          resolve({
            body,
            headers: Object.fromEntries(res.headers),
            statusCode: res.status,
          })
        })
        .catch(reject)
        .finally(() => server.close())
    })
  })
}
