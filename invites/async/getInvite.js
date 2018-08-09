const { isInvite } = require('ssb-invite-schema')

module.exports = function (server) {
  return function getInvite (key, callback) {
    if (isInvite(key)) return callback(null, key)

    server.get(key, (err, value) => {
      if (err) return callback(err)
      const invite = { key, value }
      var decryptedInvite = server.private.unbox(invite) || invite
      if (!isInvite(decryptedInvite)) callback(new Error(`${key} is not a valid invite, cannot reply to this`))
      else callback(null, decryptedInvite)
    })
  }
}
