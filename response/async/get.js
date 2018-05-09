const pull = require('pull-stream')
const sort = require('ssb-sort')
const { isResponse } = require('ssb-invites-schema')
const Invite = require('../sync/build')

module.exports = function (server) {
  return function get (branch, cb) {
    server.get(branch, (err, value) => {
      if (err) return cb(err, null)
      pull(
        createBacklinkStream(),
        pull.drain(msg => {
          var response = new Response(msg)
          cb(null, response)
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
