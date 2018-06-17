const test = require('tape')

const server = require('scuttle-testbot')
  .use(require('ssb-invites-db'))
  .call()

const { parseInvite } = require('ssb-invites-schema')
const getInvite = require('../../../invites/async/getInvite')(server)
const publishInvite = require('../../../invites/async/publish')(server)

var grace = server.createFeed()

test('invites.async.getInvite', assert => {
  assert.plan(1)

  var recps = [server.id, grace.id]
  server.publish({ type: 'event' }, (err, event) => {
    publishInvite(
      { root: event.key, body: 'super secret cabal meeting', recps: recps },
      (err, invite) => {
        getInvite(invite.id, (err, gotten) => {
          assert.deepEqual(invite, gotten)
          server.close()
        })
      }
    )
  })
})
