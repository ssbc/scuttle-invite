const { parseInvite } = require('ssb-invites-schema')

module.exports = function (server) {
  return function get (key, callback) {
    server.invites.getInvite(key, (err, invite) => {
      if (err) return callback(err)
      return callback(null, parseInvite(invite))
    })
  }
}
