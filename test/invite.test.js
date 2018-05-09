const Test = require('tape')
const Server = require('scuttle-testbot')
const Keys = require('ssb-keys')

const Invite = require('../invite/sync/build')
const getInvite = require('../invite/async/get')(server)

const name = 'config'
const keys = Keys.generate()

var server = new Server({ name: name, keys: keys })
var feed = server.createFeed(keys)

Test(`new Invite(server, msg) returns a valid invite`, (assert) => {
  var msg = {
    key: "%p/nrhxhd9271D2BBPRyAsHasbZvU18oW7LKHtkRzNEE=.sha256",
    value: {
      author: keys.id,
      content: {
        type: 'invite',
        version: 'v1',
        root: '%8V06YM8EEtS+7FgVmdazv8nTjuD5fCrWVNAL4kylWUg=.sha256',
        expiresAt: new Date().toISOString(),
        body: "crypto monkeys love to party",
        recps: [keys.id, "@MpDd66GPXgN1+eMNrZInHkWq1THMurWwLdMx8BZ1ncw=.ed25519"]
      },
    }
  }
  var invite = new Invite(server, msg)
  assert.equal(invite.errors.length, 0)
  assert.end()
})

Test(`getInvite(key) returns an invite`, (assert) => {
  assert.end()
})

