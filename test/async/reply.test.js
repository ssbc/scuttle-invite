const { describe } = require('tape-plus')
const { isReply } = require('ssb-invite-schema')
const { PublishEvent, Server } = require('../methods')
const PublishInvite = require('../../invites/async/publish')
const PublishReply = require('../../invites/async/reply')
const GetInvite = require('../../invites/async/getInvite')

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

  context("Successfully publishing a reply", (assert, next) => {
    publishEvent((err, event) => {
      var inviteParams = { root: event.key, recps: [server.id], body: 'yo party at mine this friday!' }
      publishInvite(inviteParams, (err, invite) => {
        var replyParams = { accept: true, body: 'I will bring crepes!' }
        publishReply(invite.key, replyParams, (err, reply) => {
          assert.ok(reply, "Success")
          assert.notOk(err, "Errors are null")
          assert.ok(isReply(reply))
          next()
        })
      })
    })
  })

  context("fails to publish a reply when missing a 'accept' property", (assert, next) => {
    publishEvent((err, event) => {
      var inviteParams = { root: event.key, recps: [server.id], body: 'yo party at mine this friday!' }
      publishInvite(inviteParams, (err, invite) => {
        var replyParams = { body: 'I will bring crepes!' }
        publishReply(invite.key, replyParams, (err, reply) => {
          assert.ok(err, "fails")
          assert.equal(err.message, 'invalid: data.accept')
          next()
        })
      })
    })
  })

  context("fails to reply to a non-invite", (assert, next) => {
    server.publish({ type: 'post', text: 'want to come to my party?' }, (err, notInvite) => {
      var replyParams = { accept: true, body: 'I will bring crepes!' }

      publishReply(notInvite.key, replyParams, (err, reply) => {
        assert.ok(err, "fails")
        assert.ok(err.message.match(/is not a valid invite/), "told it's not a valid invite")
        next()
      })
    })
  })

})
