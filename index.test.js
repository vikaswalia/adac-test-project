import { test } from 'node:test'
import assert from 'node:assert/strict'
import { greeting } from './index.js'

test('greeting greets the world', () => {
  assert.equal(greeting(), 'Hello, world!')
})
