import http from 'node:http'

export function greeting(name = 'world') {
  return `Hello, ${name}!`
}

export const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'application/json' })

  if (req.url === '/health') {
    res.end(JSON.stringify({ status: 'ok' }))
    return
  }

  res.end(JSON.stringify({ message: greeting() }))
})

if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3100
  server.listen(port, () => console.log(`adac-test-project listening on ${port}`))
}
