import http from 'node:http'
import { fileURLToPath } from 'node:url'
import packageJson from './package.json' with { type: 'json' }

const serverStartTime = new Date(Date.now() - process.uptime() * 1000).toISOString()

export function greeting(name = 'world') {
  return `Hello, ${name}!`
}

export function createServer() {
  return http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/ping') {
      res.writeHead(200, { 'content-type': 'text/plain' })
      res.end('pong')
      return
    }

    res.writeHead(200, { 'content-type': 'application/json' })

    if (req.method === 'GET' && req.url === '/uptime') {
      res.end(JSON.stringify({ uptime: process.uptime() }))
      return
    }

    if (req.method === 'GET' && req.url === '/uptime-live') {
      res.end(JSON.stringify({ uptimeSeconds: process.uptime(), serverStartTime }))
      return
    }

    if (req.method === 'GET' && req.url === '/health-mini') {
      res.end(JSON.stringify({ ok: true }))
      return
    }

    if (req.method === 'GET' && req.url === '/version') {
      res.end(JSON.stringify({ version: packageJson.version }))
      return
    }

    res.end(JSON.stringify({ message: greeting() }))
  })
}

if (process.env.NODE_ENV !== 'test' && process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = createServer()
  const port = process.env.PORT || 3100
  server.listen(port, () => console.log(`adac-test-project listening on ${port}`))
}
