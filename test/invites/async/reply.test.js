const describe = require('tape-plus').describe
const Server = require('scuttle-testbot')

Server.use(require('ssb-private'))

const PublishInvite = require('../../../invites/async/publish')
const PublishReply = require('../../../invites/async/reply')

const { PublishEvent } = require('../../helper')

describe('invites.async.reply', test => {
  let first, second
  let defaultParams
  let publishInvite, publishReply, publishEvent

  test.beforeEach(t => {
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

  test.afterEach(t => {
    first.close()
    second.close()
  })

  test("fails to publish a reply when missing a 'root' record", (assert, next) => {
    publishReply(defaultParams, (err, reply) => {
      assert.ok(err)
      assert.equal(err.message, "invalid: data.root, data.branch", "Provides an error message")
      next()
    })
  })

  test("fails to publish a reply without an 'invite' record", (assert, next) => {
    publishEvent((err, event) => {
      var defaultParamsWithRoot = Object.assign({}, defaultParams, { root: event.key })
      publishReply(defaultParamsWithRoot, (err, reply) => {
        assert.ok(err)
        assert.equal(err.message, "invalid: data.branch", "Provides an error message")
        next()
      })
    })
  })

  test("fails to publish a reply when not invited", (assert, next) => {
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
          assert.equal(err.message, "invalid: not invited")
          third.close()
          next()
        })
      })
    })
  })

  test("Successfully publishing an invite", assert => {
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
        })
      })
    })
  })
})
