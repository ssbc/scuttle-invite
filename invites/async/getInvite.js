const { parseInvite } = require('ssb-invite-schema')
const getContent = require('ssb-msg-content')

module.exports = function (server) {
  return function getInvite (key, callback) {
    server.get(key, (err, value) => {
      if (err) return callback(err)
      const invite = { key, value }
      return callback(null, invite)
    })
  }
}
