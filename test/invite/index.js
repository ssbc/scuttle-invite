const Test = require('tape')

const { server, keys, feed, name } = require('../config')

const build = require('../../invite/sync/build')
const get = require('../../invite/async/get')(server)

Test(`build() returns a valid invite`, (assert) => {
  assert.end()
})

Test(`get() returns an invite`, (assert) => {
  assert.end()
})

