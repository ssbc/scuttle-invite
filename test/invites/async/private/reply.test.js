const { describe } = require('tape-plus')
const { PublishEvent, Server } = require('../../../methods')
const PublishInvite = require('../../../../invites/async/publish')
const PublishPrivateReply = require('../../../../invites/async/private/reply')

describe('invites.async.private.reply', context => {
  let first, second
  let publishInvite, publishPrivateReply, publishEvent
  let params

  context.beforeEach(t => {
    first = Server()
    second = Server()

    publishEvent = PublishEvent(first)
    publishInvite = PublishInvite(first)
    publishPrivateReply = PublishPrivateReply(second)

    params = {
      body: 'super secret cabal meeting',
      recps: [first.id, second.id]
    }
  })

  context.afterEach(t => {
    first.close()
    second.close()
  })

  context("Publishes a private reply with no errors", (assert, next) => {
    publishEvent((err, event) => {
      params = Object.assign(params, { root: event.key })
      publishInvite(params, (err, invite) => {
        params = Object.assign(params, { branch: invite.id, accept: true })
        publishPrivateReply(params, (err, reply) => {
          assert.ok(reply, "Success")
          assert.notOk(err, "Errors are null")

          var should = Object.assign({} , {
            id: reply.id,
            version: 'v1',
            recipient: first.id,
            author: second.id,
            timestamp: reply.timestamp,
            type: 'response'
          }, params)
          delete should.recps

          assert.deepEqual(should, reply, 'Returns a decrypted parsed reply object')
          next()
        })
      })
    })
  })
})
