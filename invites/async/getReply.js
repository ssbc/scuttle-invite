const { isReply } = require('ssb-invite-schema')

module.exports = function (server) {
  return function getReply (key, callback) {
    server.get(key, (err, value) => {
      if (err) return callback(err)
      const reply = { key, value }
      var decryptedReply = server.private.unbox(reply) || reply
      if (!isReply(decryptedReply)) callback(new Error(`${key} is not a valid invite, cannot reply to this`))
      else callback(null, decryptedReply)
    })
  }
}
