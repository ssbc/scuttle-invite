const { parseInvite } = require('ssb-invite-schema')
const getContent = require('ssb-msg-content')

module.exports = function (server) {
  return function getInvite (key, callback) {
    server.invites.getInvite(key, (err, invite) => {
      if (err) return callback(err)
      return callback(null, parseInvite(invite))
    })
  }
}
