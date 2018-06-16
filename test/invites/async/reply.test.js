const test = require('tape')
const Server = require('scuttle-testbot')

const first = Server
  .use(require('ssb-private'))
  .call()

const second = Server
  .use(require('ssb-private'))
  .call()

const publishInvite = require('../../../invites/async/publish')(first)
const publishReply = require('../../../invites/async/reply')(second)
const canReply = require('../../../invites/async/canReply')(second)

test('invites.async.reply', assert => {
  assert.plan(1)

  var recps = [first.id, second.id]
  first.publish({ type: 'event' }, (err, event) => {
    publishInvite(
      { root: event.key, body: 'come to my party?', recps: recps },
      (err, invite) => {

        publishReply({
          root: event.key,
          branch: invite.id,
          recps: recps,
          accept: true
        }, (err, response) => {
          if (err) console.log(err)

          assert.ok(response)
          first.close()
          second.close()
        })

      }
    )
  })
})
