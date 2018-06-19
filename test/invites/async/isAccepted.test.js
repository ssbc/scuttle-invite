const { describe } = require('tape-plus')
const { PublishEvent, Server } = require('../../methods')
const PublishInvite = require('../../../invites/async/publish')
const PublishResponse = require('../../../invites/async/reply')

describe('invites.async.isAccepted', test => {
  var first, second

  test.beforeEach(t => {
    first = Server()
    second = Server()
  })

  test.afterEach(t => {
    first.close()
    second.close()
  })
})

