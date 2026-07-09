import { expect, test } from '@playwright/test'
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import net from 'node:net'

async function getFreePort() {
  const server = net.createServer()
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  if (!address || typeof address === 'string') {
    throw new Error('Could not allocate a free port')
  }
  const port = address.port
  await new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve())
  })
  return port
}

async function waitForServer(port: number) {
  const deadline = Date.now() + 10_000
  let lastError: unknown

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/uptime`)
      if (response.ok) {
        return
      }
    } catch (error) {
      lastError = error
    }

    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  throw new Error(`Server did not become ready: ${String(lastError)}`)
}

async function stopServer(server: ChildProcessWithoutNullStreams) {
  if (server.exitCode !== null || server.killed) {
    return
  }

  await new Promise<void>((resolve) => {
    server.once('exit', () => resolve())
    server.kill()
    setTimeout(() => {
      if (server.exitCode === null && !server.killed) {
        server.kill('SIGKILL')
      }
      resolve()
    }, 2_000).unref()
  })
}

test('npm start writes Morgan request logs for successful and not found requests', async () => {
  const port = await getFreePort()
  const output: string[] = []
  const server = spawn('npm', ['start'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, PORT: String(port) },
  })

  server.stdout.on('data', (chunk) => output.push(chunk.toString()))
  server.stderr.on('data', (chunk) => output.push(chunk.toString()))

  try {
    await waitForServer(port)

    const pingResponse = await fetch(`http://127.0.0.1:${port}/ping`)
    expect(pingResponse.status).toBe(200)
    expect(await pingResponse.text()).toBe('pong')

    const notFoundResponse = await fetch(`http://127.0.0.1:${port}/anything-not-real`)
    expect(notFoundResponse.status).toBe(404)
    await expect(notFoundResponse.json()).resolves.toEqual({ error: 'Not found' })

    await expect.poll(() => output.join('')).toContain('"GET /ping HTTP/1.1" 200')
    await expect.poll(() => output.join('')).toContain('"GET /anything-not-real HTTP/1.1" 404')
  } finally {
    await stopServer(server)
  }
})
