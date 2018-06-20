const { describe } = require('tape-plus')
const { PublishEvent, Server } = require('../../methods')
const PublishInvite = require('../../../invites/async/publish')
const PublishReply = require('../../../invites/async/reply')
const GetInvite = require('../../../invites/async/getInvite')

describe('invites.async.reply', context => {
  let server, grace
  let defaultParams
  let publishInvite, publishReply, publishEvent, getInvite

  context.beforeEach(t => {
    server = Server()
    grace = server.createFeed()

    defaultParams = {
      body: 'Getting jiggy with it',
      recps: [server.id, grace.id],
      accept: true
    }

    publishEvent = PublishEvent(grace)
    publishInvite = PublishInvite(grace)
    publishReply = PublishReply(server)
  })

  context.afterEach(t => {
    server.close()
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
    var third = server.createFeed()
    PublishEvent(third)((err, event) => {
      var defaultParamsWithRoot = Object.assign({}, defaultParams, { recps: [third.id, grace.id], root: event.key })
      PublishInvite(third)(defaultParamsWithRoot, (err, invite) => {
        var replyParams = Object.assign({}, defaultParams, {
          root: event.key,
          branch: invite.id,
          recps: [...defaultParams.recps, server.id]
        })
        publishReply(replyParams, (err, reply) => {
          assert.ok(err)
          assert.equal(err.message, "invalid: you are not invited")
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

          const { id, timestamp } = reply
          var response = Object.assign({}, {
            id,
            author: server.id,
            recipient: grace.id,
            timestamp,
            type: 'response',
            version: 'v1'
          }, replyParams)
          delete response.recps

          assert.deepEqual(reply, response, "Returns a parsed reply")
          next()
        })
      })
    })
  })
})
