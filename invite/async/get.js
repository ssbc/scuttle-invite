const pull = require('pull-stream')
const sort = require('ssb-sort')
const { isInvite, isResponse } = require('ssb-invite-schema')
const Invite = require('../sync/invite')

module.exports = function (server) {
  return function get (key, cb) {
    server.get(key, (err, value) => {
      if (err) return cb(err)

      if (isInvite(value)) {
        // find response and if exists return invite with child response and { accepted: result } else just return invite
      } else if (isResponse(value)) {
        // find invite and return a response with parent invite and { accepted: result }
        pull(
          createBacklinkStream(key),
          pull.filter(msg => msg.root === key)
        )
      } else {
        return cb(new Error('scuttle-invite could not fetch, key provided was not a valid invite or response'))
      }

      pull(
        createBacklinkStream()
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
