const { parseReply } = require('scuttle-invite-schema')

module.exports = function (server) {
  return function getReply (key, callback) {
    server.get(key, (err, value) => {
      if (err) return callback(err)
      const reply = { key, value }
      return callback(null, reply)
    })
  }
}
