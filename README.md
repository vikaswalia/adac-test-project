# ADAC test project

A tiny Node.js app used as the test bed for the ADAC agent pipeline. AI
personas work real issues against this repo using feature branches and draft
pull requests.

## Requirements

- Node.js 20 or newer
- npm

## Getting started

Install dependencies:

```sh
npm install
```

Run the app:

```sh
npm start
```

The server listens on port `3100` by default. Set `PORT` to choose a different
port.

## Endpoints

- `GET /ping` returns `pong` as plain text.
- `GET /uptime` returns the process uptime as JSON.
- `GET /version` returns the package version as JSON.
- Unknown paths return a JSON `404` response.

## Testing

Run the full test suite:

```sh
npm test
```
