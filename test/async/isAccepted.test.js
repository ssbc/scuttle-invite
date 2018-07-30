const { describe } = require('tape-plus')
const { PublishEvent, Server } = require('../methods')
const PublishInvite = require('../../invites/async/publish')
const PublishReply = require('../../invites/async/reply')

describe('invites.async.isAccepted', context => {
  var first, second

  context.beforeEach(t => {
    first = Server()
    second = Server()
  })

  context.afterEach(t => {
    first.close()
    second.close()
  })
})

