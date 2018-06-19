const { describe } = require('tape-plus')
const { PublishEvent, Server } = require('../../methods')
const PublishInvite = require('../../../invites/async/publish')
const PublishReply = require('../../../invites/async/reply')

describe('invites.async.reply', context => {
  let first, second
  let defaultParams
  let publishInvite, publishReply, publishEvent

  context.beforeEach(t => {
    first = Server()
    second = Server()

    defaultParams = {
      body: 'Getting jiggy with it',
      recps: [first.id, second.id],
      accept: true
    }

    publishInvite = PublishInvite(first)
    publishReply = PublishReply(second)
    publishEvent = PublishEvent(first)
  })

  context.afterEach(t => {
    first.close()
    second.close()
  })

  context("fails to publish a reply when missing a 'root' record", (assert, next) => {
    publishReply(defaultParams, (err, reply) => {
      assert.ok(err, 'Returns an error')
      assert.equal(err.message, "invalid: data.root, data.branch", "Provides an error message")
      next()
    })
  })

  context("fails to publish a reply without an 'invite' record", (assert, next) => {
    publishEvent((err, event) => {
      var defaultParamsWithRoot = Object.assign({}, defaultParams, { root: event.key })
      publishReply(defaultParamsWithRoot, (err, reply) => {
        assert.ok(err)
        assert.equal(err.message, "invalid: data.branch", "Provides an error message")
        next()
      })
    })
  })

  context("fails to publish a reply when not invited", (assert, next) => {
    const third = Server()
    publishEvent((err, event) => {
      var defaultParamsWithRoot = Object.assign({}, defaultParams, { root: event.key })
      publishInvite(defaultParamsWithRoot, (err, invite) => {
        var replyParams = Object.assign({}, defaultParams, {
          root: event.key,
          branch: invite.id,
          recps: [...defaultParams.recps, third.id]
        })
        publishReply(replyParams, (err, reply) => {
          assert.ok(err)
          assert.equal(err.message, "invalid: you are not invited")
          third.close()
          next()
        })
      })
    })
  })

  context("Successfully publishing an invite", (assert, next) => {
    publishEvent((err, event) => {
      var defaultParamsWithRoot = Object.assign({}, defaultParams, { root: event.key })
      publishInvite(defaultParamsWithRoot, (err, invite) => {
        var replyParams = Object.assign({}, defaultParams, {
          root: event.key,
          branch: invite.id,
        })
        publishReply(replyParams, (err, reply) => {
          assert.ok(reply, "Success")
          assert.notOk(err, "Errors are null")
          next()
        })
      })
    })
  })
})
