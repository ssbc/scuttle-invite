const Test = require('tape')
const Server = require('scuttle-testbot')
const Keys = require('ssb-keys')

const name = 'test-config'
const keys = Keys.generate()

var server = new Server({ name: name, keys: keys }),

exports = {
  name: name,
  server: server,
  keys: keys,
  feed: server.createFeed(keys)
}
