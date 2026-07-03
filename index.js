import { readFileSync } from 'node:fs'
import http from 'node:http'
import { pathToFileURL } from 'node:url'

function jsonResponse(res, body) {
  res.writeHead(200, { 'content-type': 'application/json' })
  res.end(JSON.stringify(body))
}

export function greeting(name = 'world') {
  return `Hello, ${name}!`
}

export function packageVersion() {
  const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

  return packageJson.version
}

export function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost')

    if (req.method === 'GET' && url.pathname === '/version') {
      jsonResponse(res, { version: packageVersion() })
      return
    }

    jsonResponse(res, { message: greeting() })
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = process.env.PORT || 3100
  const server = createServer()
  server.listen(port, () => console.log(`adac-test-project listening on ${port}`))
}
