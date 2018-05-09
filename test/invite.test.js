const Test = require('tape')
const Server = require('scuttle-testbot')
const Keys = require('ssb-keys')

const Invite = require('../invite/sync/build')
const Response = require('../response/sync/build')
const getInvite = require('../invite/async/get')(server)

const name = 'config'
const keys = Keys.generate()

Server.use(require('ssb-private'))

var server = new Server({ name: name, keys: keys })
var feed = server.createFeed(keys)

Test('new Invite(server, msg) created by private key holder', (assert) => {
  var msg = {
    key: '%p/nrhxhd9271D2BBPRyAsHasbZvU18oW7LKHtkRzNEE=.sha256',
    value: {
      author: keys.id,
      content: {
        type: 'invite',
        version: 'v1',
        root: '%8V06YM8EEtS+7FgVmdazv8nTjuD5fCrWVNAL4kylWUg=.sha256',
        expiresAt: new Date().toISOString(),
        body: 'crypto monkeys love to party',
        recps: [keys.id, '@MpDd66GPXgN1+eMNrZInHkWq1THMurWwLdMx8BZ1ncw=.ed25519']
      },
    }
  }
  var invite = new Invite(server, msg)
  assert.equal(invite.errors.length, 0, 'is valid')

  assert.throws(invite.isAccepted, Error, 'provide a callback')
  assert.throws(invite.recipient, Error, 'provide a callback')
  assert.throws(invite.response, Error, 'provide a callback')

  invite.isAccepted((err, bool) => {
    assert.equal(err.message, 'Not yet responded', 'isAccepted has no response')
  })

  assert.end()
})

Test('new Invite(server, msg) not created by private key holder', (assert) => {
  var author = Keys.generate()
  var msg = {
    key: '%p/nrhxhd9271D2BBPRyAsHasbZvU18oW7LKHtkRzNEE=.sha256',
    value: {
      author: author.id,
      content: {
        type: 'invite',
        version: 'v1',
        root: '%8V06YM8EEtS+7FgVmdazv8nTjuD5fCrWVNAL4kylWUg=.sha256',
        expiresAt: new Date().toISOString(),
        body: 'fungal infections are no fun',
        recps: [keys.id, author.id]
      },
    }
  }

  var invite = new Invite(server, msg)
  assert.equal(invite.errors.length, 0, 'is valid')

  var response = new Response(server, {
    value: {
      author: keys.id,
      content: {
        type: 'response',
        version: 'v1',
        accept: true,
        root: '%8V06YM8EEtS+7FgVmdazv8nTjuD5fCrWVNAL4kylWUg=.sha256',
        branch: invite.id,
        recps: [keys.id, author.id]
      }
    }
  })

  invite.accept((err, resp) => {
    assert.equal(resp.accept, response.accept)
  })

  assert.end()
})

