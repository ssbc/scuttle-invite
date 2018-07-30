const { describe } = require('tape-plus')
const { PublishEvent, Server } = require('../methods')
const GetReply = require('../../invites/async/getReply')
const PublishReply = require('../../invites/async/publish')

describe('invites.async.getReply', context => {
  let server, grace
  let publishReply, publishEvent, getReply

  context.beforeEach(t => {
    server = Server()
    grace = server.createFeed()

    publishEvent = PublishEvent(server)
    publishReply = PublishReply(server)
    getReply = GetReply(server)
  })

  context.afterEach(t => {
    server.close()
  })

  context("Returns a parsed Reply", (assert, next) => {
    publishEvent((err, event) => {
      var params = {
        root: event.key,
        body: 'super secret cabal meeting',
        recps: [server.id, grace.id]
      }
      publishReply(params, (err, reply) => {
        getReply(reply.key, (err, gotten) => {
          delete reply.timestamp
          assert.deepEqual(reply, gotten, "publishReply matches getReply")
          assert.notOk(err, "Errors are null")
          next()
        })
      })
    })
  })
})
