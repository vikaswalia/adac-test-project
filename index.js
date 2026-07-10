import http from 'node:http'
import { fileURLToPath } from 'node:url'
import morgan from 'morgan'
import packageJson from './package.json' with { type: 'json' }

export function greeting(name = 'world') {
  return `Hello, ${name}!`
}

export function createServer({ requestLogStream = process.stdout } = {}) {
  const requestLogger = requestLogStream ? morgan('combined', { stream: requestLogStream }) : null

  return http.createServer((req, res) => {
    const handleRequest = () => {
      const knownPaths = new Set(['/ping', '/uptime', '/version', '/status'])

      if (req.method === 'GET' && req.url === '/ping') {
        res.writeHead(200, { 'content-type': 'text/plain' })
        res.end('pong')
        return
      }

      if (req.method === 'GET' && req.url === '/uptime') {
        res.writeHead(200, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ uptime: process.uptime() }))
        return
      }

      if (req.method === 'GET' && req.url === '/version') {
        res.writeHead(200, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ version: packageJson.version }))
        return
      }

      if (req.method === 'GET' && req.url === '/status') {
        res.writeHead(200, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ status: 'ok' }))
        return
      }

      if (!knownPaths.has(req.url)) {
        res.writeHead(404, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ error: 'Not found' }))
        return
      }

      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ message: greeting() }))
    }

    if (requestLogger) {
      requestLogger(req, res, handleRequest)
      return
    }

    handleRequest()
  })
}

if (process.env.NODE_ENV !== 'test' && process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = createServer()
  const port = process.env.PORT || 3100
  server.listen(port, () => console.log(`adac-test-project listening on ${port}`))
}
