const { describe } = require('tape-plus')
const Server = require('scuttle-testbot')

Server
  .use(require('ssb-invites-db'))
  .use(require('ssb-private'))

const PublishInvite = require('../../../invites/async/publish')
const CanReply = require('../../../invites/async/canReply')
const { PublishEvent } = require('../../helper')

describe('invites.async.canReply', test => {
  let first, second
  let publishInvite, publishEvent
  let params

  test.beforeEach(t => {
    first = Server()
    second = Server()

    publishEvent = PublishEvent(server)
    publishInvite = PublishInvite(first)

    params = {
      body: 'come to my party?',
      recps: [first.id, second.id]
    }
  })

  test.afterEach(t => {
    first.close()
    second.close()
  })

  test("Cannot reply to one's self", (assert, next) => {
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

  test("Cannot reply when not invited", (assert, next) => {
    next()
  })

  test("Can reply when invited and not self", (assert, next) => {
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
