const { describe } = require('tape-plus')
const { PublishEvent, Server } = require('../../methods')
const GetInvite = require('../../../invites/async/getInvite')
const PublishInvite = require('../../../invites/async/publish')

describe('invites.async.getInvite', test => {
  let server, grace
  let publishInvite, publishEvent, getInvite

  test.beforeEach(t => {
    server = Server()
    grace = server.createFeed()

    publishEvent = PublishEvent(server)
    publishInvite = PublishInvite(server)
    getInvite = GetInvite(server)
  })

  test.afterEach(t => {
    server.close()
  })

  test("Returns a parsed Invite", (assert, next) => {
    publishEvent((err, event) => {
      var params = {
        root: event.key,
        body: 'super secret cabal meeting',
        recps: [server.id, grace.id]
      }
      publishInvite(params, (err, invite) => {
        getInvite(invite.id, (err, gotten) => {
          assert.deepEqual(invite, gotten, "publishInvite matches getInvite")
          assert.notOk(err, "Errors are null")
          next()
        })
      })
    })
  })
})
