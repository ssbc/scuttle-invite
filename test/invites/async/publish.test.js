const test = require('tape')
const Server = require('scuttle-testbot')

const server = Server()
var grace = server.createFeed()

const publishInvite = require('../../../invites/async/publish')(server)

test('invites.async.publish', assert => {
  assert.plan(1)

  server.publish({ type: 'event' }, (err, event) => {
    publishInvite(
      { root: event.key, body: 'come to my party?', recps: [grace.id, server.id] },
      (err, invite) => {
        if (err) console.log(err)
        assert.ok(invite)
        server.close()
      }
    )
  })
})

