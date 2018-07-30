const { describe } = require('tape-plus')
const { PublishEvent, Server } = require('../methods')
const PublishInvite = require('../../invites/async/publish')

describe('invites.async.publish', context => {
  let server, grace
  let publishEvent, publishInvite
  let params

  context.beforeEach(t => {
    server = Server()
    grace = server.createFeed()

    params = {
      body: 'come to my party?',
      recps: [grace.id, server.id]
    }

    publishEvent = PublishEvent(server)
    publishInvite = PublishInvite(server)
  })

  context.afterEach(t => {
    server.close()
  })

  context("Publishing without a 'root' record", (assert, next)=> {
    publishInvite(params, (err, invite) => {
      assert.ok(err, 'Returns an error')
      assert.equal(err.message, "invalid: data.root")
      assert.notOk(invite, 'Fails to publish')
      next()
    })
  })

  context("Successful publishing an invite", (assert, next) => {
    publishEvent((err, event) => {
      params = Object.assign(params, { root: event.key })
      publishInvite(params, (err, invite) => {
        assert.ok(invite, 'Success')
        assert.notOk(err, 'Errors are null')
        next()
      })
    })
  })
})

