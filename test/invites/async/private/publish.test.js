const test = require('tape')

const server = require('scuttle-testbot')
  .use(require('ssb-private'))
  .call()

var grace = server.createFeed()

const publishPrivateInvite = require('../../../../invites/async/private/publish')(server)

test('invites.async.private.publish', assert => {
  assert.plan(3)

  var recps = [grace.id, server.id]
  server.publish({ type: 'event' }, (err, event) => {

    var params = {
      root: event.key,
      body: 'super secret cabal meeting',
      recps: recps
    }

    publishPrivateInvite(params, (err, invite) => {
      assert.ok(invite, 'Publishes a private invite with no errors')
      assert.notOk(err)

      var should = Object.assign({}, {
        id: invite.id,
        version: 'v1',
        recipient: grace.id,
        author: server.id,
        timestamp: invite.timestamp,
        type: 'invite'
      }, params)

      delete should.recps
      assert.deepEqual(should, invite, 'Returns a decrypted parsed invite object')

      server.close()
    })
  })
})
