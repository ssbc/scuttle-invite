const test = require('tape')

const server = require('scuttle-testbot')
  .use(require('ssb-private'))
  .call()

var grace = server.createFeed()

const publishPrivateInvite = require('../../../../invites/async/private/publish')(server)

test('invites.async.private.publish', assert => {
  assert.plan(1)

  var recps = [grace.id, server.id]
  server.publish({ type: 'event', recps: recps }, (err, event) => {
    publishPrivateInvite(
      { root: event.key, body: 'super secret cabal meeting', recps: recps },
      (err, invite) => {
        if (err) console.log(err)
        assert.ok(invite)
        server.close()
      }
    )
  })
})
