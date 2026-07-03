import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { greeting, createServer } from './index.js'

test('greeting greets the world', () => {
  assert.equal(greeting(), 'Hello, world!')
})

async function fetchFromServer(path) {
  const server = createServer()
  await new Promise((resolve) => server.listen(0, resolve))

  try {
    const { port } = server.address()
    const response = await fetch(`http://127.0.0.1:${port}${path}`)
    const body = await response.json()

    return { response, body }
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error)
        else resolve()
      })
    })
  }
}

test('GET / returns the greeting as JSON', async () => {
  const { response, body } = await fetchFromServer('/')

  assert.equal(response.status, 200)
  assert.match(response.headers.get('content-type'), /application\/json/)
  assert.deepEqual(body, { message: 'Hello, world!' })
})

test('GET /version returns the package version as JSON', async () => {
  const packageJson = JSON.parse(await readFile(new URL('./package.json', import.meta.url), 'utf8'))
  const { response, body } = await fetchFromServer('/version')

  assert.equal(response.status, 200)
  assert.match(response.headers.get('content-type'), /application\/json/)
  assert.deepEqual(body, { version: packageJson.version })
})
