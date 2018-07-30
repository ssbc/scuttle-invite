const { describe } = require('tape-plus')
const { PublishEvent, Server } = require('../../methods')
const PublishInvite = require('../../../invites/async/publish')
const PublishPrivateReply = require('../../../invites/async/private/reply')

describe('invites.async.private.reply', context => {
  let server, grace
  let publishInvite, publishPrivateReply, publishEvent
  let params

  context.beforeEach(t => {
    server = Server()
    grace = server.createFeed()

    params = {
      body: 'super secret cabal meeting',
      recps: [server.id, grace.id]
    }

    publishEvent = PublishEvent(grace)
    publishInvite = PublishInvite(grace)
    publishPrivateReply = PublishPrivateReply(server)
  })

  context.afterEach(t => {
    server.close()
  })

  context("fails to publish a reply when not invited", (assert, next) => {
    var third = server.createFeed()
    PublishEvent(third)((err, event) => {
      var inviteParams = Object.assign({}, params, { recps: [third.id, grace.id], root: event.key })
      PublishInvite(third)(inviteParams, (err, invite) => {
        var replyParams = Object.assign({}, params, {
          root: event.key,
          branch: invite.id,
          recps: [...inviteParams.recps, server.id],
          accept: true
        })
        publishPrivateReply(replyParams, (err, reply) => {
          assert.ok(err)
          assert.equal(err.message, "invalid: you are not invited")
          next()
        })
      })
    })
  })

  context("Successfully publishing a private reply", (assert, next) => {
    publishEvent((err, event) => {
      inviteParams = Object.assign({}, params, {
        root: event.key
      })
      publishInvite(inviteParams, (err, invite) => {
        replyParams = Object.assign({}, params, {
          root: event.key,
          branch: invite.id,
          accept: true
        })
        publishPrivateReply(replyParams, (err, reply) => {
          assert.ok(reply, "Success")
          assert.notOk(err, "Errors are null")

          const { id, timestamp } = reply
          var reply = Object.assign({}, {
            id,
            author: server.id,
            recipient: grace.id,
            timestamp,
            type: 'invite-reply',
            version: 'v1'
          }, replyParams)
          delete reply.recps

          assert.deepEqual(reply, reply, 'Returns a decrypted parsed reply')
          next()
        })
      })
    })
  })
})
