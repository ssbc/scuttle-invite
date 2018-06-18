const { describe } = require('tape-plus')
const Server = require('scuttle-testbot')

Server.use(require('ssb-private'))

const PublishInvite = require('../../../invites/async/publish')
const { PublishEvent } = require('../../helper')

describe('invites.async.publish', test => {
  let server, grace
  let publishEvent, publishInvite
  let params

  test.beforeEach(t => {
    server = Server()
    grace = server.createFeed()

    params = {
      body: 'come to my party?',
      recps: [grace.id, server.id]
    }

    publishEvent = PublishEvent(server)
    publishInvite = PublishInvite(server)
  })

  test.afterEach(t => {
    server.close()
  })

  test("Publishing without a 'root' record", (assert, next)=> {
    publishInvite(params, (err, invite) => {
      assert.ok(err, 'Returns an error')
      assert.equal(err.message: "invalid: data.root")
      assert.notOk(invite, 'Fails to publish')
      next()
    })
  })

  test("Successful publishing an invite", (assert, next) => {
    publishEvent((err, event) => {
      params = Object.assign(params, { root: event.key })
      publishInvite(params, (err, invite) => {
        assert.ok(invite, 'Success')
        assert.notOk(err, 'Errors are null')
      })
    })
  })
})

