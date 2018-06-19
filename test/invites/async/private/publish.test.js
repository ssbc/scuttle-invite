const { describe } = require('tape-plus')
const { PublishEvent, Server } = require('../../../methods')
const PublishPrivateInvite = require('../../../../invites/async/private/publish')

describe('invites.async.private.publish', test => {
  let server, grace
  let publishPrivateInvite, publishEvent
  let params

  test.beforeEach(t => {
    server = Server()
    grace = server.createFeed()

    publishEvent = PublishEvent(server)
    publishPrivateInvite = PublishPrivateInvite(server)

    params = {
      body: 'super secret cabal meeting',
      recps: [grace.id, server.id]
    }
  })

  test.afterEach(t => {
    server.close()
  })

  test("Publishes a private invite with no errors", (assert, next) => {
    publishEvent((err, event) => {
      params = Object.assign(params, { root: event.key })
      publishPrivateInvite(params, (err, invite) => {
        assert.ok(invite, 'Success')
        assert.notOk(err, "Errors are null")

        var should = Object.assign({
          id: invite.id,
          version: 'v1',
          recipient: grace.id,
          author: server.id,
          timestamp: invite.timestamp,
          type: 'invite'
        }, params)
        delete should.recps

        assert.deepEqual(should, invite, 'Returns a decrypted parsed invite object')
        next()
      })
    })
  })
})
