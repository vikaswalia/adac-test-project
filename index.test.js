import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { greeting, createServer } from './index.js'

const packageJson = JSON.parse(await readFile(new URL('./package.json', import.meta.url), 'utf8'))

test('greeting greets the world', () => {
  assert.equal(greeting(), 'Hello, world!')
})

test('GET /uptime returns uptime as JSON', async () => {
  const server = createServer()
  await new Promise((resolve) => server.listen(0, resolve))

  try {
    const { port } = server.address()
    const response = await fetch(`http://127.0.0.1:${port}/uptime`)
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.match(response.headers.get('content-type'), /application\/json/)
    assert.equal(typeof body.uptime, 'number')
    assert.ok(body.uptime >= 0)
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve())
    })
  }
})

test('GET /version returns package version as JSON', async () => {
  const server = createServer()
  await new Promise((resolve) => server.listen(0, resolve))

  try {
    const { port } = server.address()
    const response = await fetch(`http://127.0.0.1:${port}/version`)
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.match(response.headers.get('content-type'), /application\/json/)
    assert.deepEqual(body, { version: packageJson.version })
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve())
    })
  }
})

test('POST /version still returns the greeting JSON', async () => {
  const server = createServer()
  await new Promise((resolve) => server.listen(0, resolve))

  try {
    const { port } = server.address()
    const response = await fetch(`http://127.0.0.1:${port}/version`, { method: 'POST' })
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.match(response.headers.get('content-type'), /application\/json/)
    assert.deepEqual(body, { message: 'Hello, world!' })
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve())
    })
  }
})

test('GET /ping returns pong as plain text', async () => {
  const server = createServer()
  await new Promise((resolve) => server.listen(0, resolve))

  try {
    const { port } = server.address()
    const response = await fetch(`http://127.0.0.1:${port}/ping`)
    const body = await response.text()

    assert.equal(response.status, 200)
    assert.match(response.headers.get('content-type'), /text\/plain/)
    assert.equal(body, 'pong')
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve())
    })
  }
})

test('POST /uptime still returns the greeting JSON', async () => {
  const server = createServer()
  await new Promise((resolve) => server.listen(0, resolve))

  try {
    const { port } = server.address()
    const response = await fetch(`http://127.0.0.1:${port}/uptime`, { method: 'POST' })
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.match(response.headers.get('content-type'), /application\/json/)
    assert.deepEqual(body, { message: 'Hello, world!' })
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve())
    })
  }
})

test('GET /anything returns a JSON 404 error', async () => {
  const server = createServer()
  await new Promise((resolve) => server.listen(0, resolve))

  try {
    const { port } = server.address()
    const response = await fetch(`http://127.0.0.1:${port}/anything`)
    const body = await response.json()

    assert.equal(response.status, 404)
    assert.match(response.headers.get('content-type'), /application\/json/)
    assert.deepEqual(body, { error: 'Not found' })
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve())
    })
  }
})
