import http from 'node:http'
import { fileURLToPath } from 'node:url'

export function greeting(name = 'world') {
  return `Hello, ${name}!`
}

export function createServer() {
  return http.createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'application/json' })

    if (req.method === 'GET' && req.url === '/uptime') {
      res.end(JSON.stringify({ uptime: process.uptime() }))
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
