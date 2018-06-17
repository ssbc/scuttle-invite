const test = require('tape')
const Server = require('scuttle-testbot')

const first = Server.call()
const second = Server.call()

const publishInvite = require('../../../invites/async/publish')(first)
const publishResponse = require('../../../invites/async/reply')(second)

test('invites.async.isAccepted', assert => {
  assert.end()
  first.close()
  second.close()
})

