const { parseReply } = require('scuttle-invite-schema')

module.exports = function (server) {
  return function getReply (key, callback) {
    server.invites.getReply(key, (err, reply) => {
      if (err) return callback(err)
      return callback(null, parseReply(reply))
    })
  }
}
