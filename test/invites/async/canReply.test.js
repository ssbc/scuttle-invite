const test = require('tape')
const Server = require('scuttle-testbot')

const first = Server
  .use(require('ssb-private'))
  .call()

const second = Server
  .use(require('ssb-private'))
  .call()

const publishInvite = require('../../../invites/async/publish')(first)
const canReply = require('../../../invites/async/canReply')

test('invites.async.canReply', assert => {
  assert.plan(2)

  var recps = [first.id, second.id]
  first.publish({ type: 'event' }, (err, event) => {
    publishInvite(
      { root: event.key, body: 'come to my party?', recps: recps },
      (err, invite) => {

        canReply(first)(invite, cannot => {
          assert.notOk(cannot)

          canReply(second)(invite, can => {
            assert.ok(can)

            first.close()
            second.close()
          })
        })
      }
    )
  })
})
