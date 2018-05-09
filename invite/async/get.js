const pull = require('pull-stream')
const sort = require('ssb-sort')
const { isInvite } = require('ssb-invites-schema')
const Invite = require('../sync/build')

module.exports = function (server) {
  return function get (key, cb) {
    server.get(key, (err, value) => {
      if (err) return cb(err, null)
      pull(
        createBacklinkStream(key),
        pull.drain(msg => {
          var invite = new Invite(server, msg)
          cb(null, invite)
        })
      )
    })
  }

  function createBacklinkStream (key) {
    var filterQuery = {
      $filter: {
        dest: key
      }
    }

    return server.backlinks.read({
      query: [filterQuery],
      index: 'DTA',
      live: true
    })
  }
}
