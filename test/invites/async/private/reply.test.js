const test = require('tape')
const Server = require('scuttle-testbot')

const first = Server
  .use(require('ssb-private'))
  .call()

const second = Server
  .use(require('ssb-private'))
  .call()

const publishInvite = require('../../../../invites/async/private/publish')(first)
const publishPrivateReply = require('../../../../invites/async/private/reply')(second)
const canReply = require('../../../../invites/async/canReply')(second)

test('invites.async.private.reply', assert => {
  assert.plan(3)

  var recps = [first.id, second.id]
  first.publish({ type: 'event' }, (err, event) => {

    var inviteParams = {
      root: event.key,
      body: 'come to my party?',
      recps: recps
    }

    publishInvite(inviteParams, (err, invite) => {

      var replyParams = {
        root: event.key,
        branch: invite.id,
        recps: recps,
        accept: true
      }

      publishPrivateReply(replyParams, (err, reply) => {
        assert.ok(reply, "Publishes a private reply with no errors")
        assert.notOk(err)

        var should = Object.assign({} , {
          id: reply.id,
          version: 'v1',
          recipient: first.id,
          author: second.id,
          timestamp: reply.timestamp,
          type: 'response'
        }, replyParams)
        delete should.recps

        assert.deepEqual(should, reply, 'Returns a decrypted parsed reply object')

        first.close()
        second.close()
      })
    })
  })
})
