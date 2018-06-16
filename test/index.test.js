const test = require('tape')
const pry = require('pryjs')

const server = require('scuttle-testbot')
  .use(require('ssb-invites-db'))
  .use(require('ssb-private'))
  .call()

var grace = server.createFeed()

var api = require('../index')(server)

test('publish a public invite', assert => {
  assert.plan(1)

  server.publish({ type: 'event' }, (err, event) => {
    api.invites.async.publish(
      { root: event.key, body: 'come to my party?', recps: [grace.id, server.id] },
      (err, invite) => {
        if (err) console.log(err)
        assert.ok(invite)
        server.close()
      }
    )
  })
})

test('publish a private invite', assert => {
  assert.plan(1)

  var recps = [grace.id, server.id]
  server.private.publish({ type: 'event', recps: recps }, recps, (err, event) => {
    api.invites.async.private.publish(
      { root: event.key, body: 'super secret cabal meeting', recps: recps },
      (err, invite) => {
        if (err) console.log(err)
        assert.ok(invite)
        server.close()
      }
    )
  })
})

test('publish a response', assert => {
  assert.plan(1)

  var recps = [grace.id, server.id]
  server.publish({ type: 'event'  }, (err, event) => {
    api.invites.async.publish(
      { root: event.key, body: 'come to my party?', recps: recps },
      (err, invite) => {

        api.invites.async.canReply(invite, can => {
          if (can) {
            api.invites.async.reply({
              root: event.key,
              branch: invite.key,
              recps: recps,
              accept: true
            }, (err, response) => {
              if (err) console.log(err)
              assert.ok(response)
              server.close()
            })
          } else {
            assert.fail(`can't reply!`)
            server.close()
          }
        })

      }
    )
  })
})
