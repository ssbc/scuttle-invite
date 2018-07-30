const { describe } = require('tape-plus')
const { PublishEvent, Server } = require('../methods')
const PublishInvite = require('../../invites/async/publish')
const CanReply = require('../../invites/async/canReply')

describe('invites.async.canReply', context => {
  let first, second
  let publishInvite, publishEvent
  let params

  context.beforeEach(t => {
    first = Server()
    second = Server()

    publishEvent = PublishEvent(first)
    publishInvite = PublishInvite(first)

    params = {
      body: 'come to my party?',
      recps: [first.id, second.id]
    }
  })

  context.afterEach(t => {
    first.close()
    second.close()
  })

  context("Cannot reply to one's self", (assert, next) => {
    publishEvent((err, event) => {
      params = Object.assign(params, {root: event.key})
      publishInvite(params, (err, invite) => {
        CanReply(first)(invite, cannot => {
          assert.notOk(cannot)
          next()
        })
      })
    })
  })

  context("Cannot reply when not invited", (assert, next) => {
    next()
  })

  context("Can reply when invited and not self", (assert, next) => {
    publishEvent((err, event) => {
      params = Object.assign(params, {root: event.key})
      publishInvite(params, (err, invite) => {
        CanReply(second)(invite, can => {
          assert.ok(can)
          next()
        })
      })
    })
  })
})
