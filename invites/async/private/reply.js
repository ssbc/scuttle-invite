const Reply = require('../../sync/buildReply')
const { isReply, parseReply } = require('ssb-invites-schema')

module.exports = function (server) {
  const getInvite = require('../getInvite')(server)

  return function reply (params, callback) {
    const reply = new Reply(params)
    if (!isReply(reply)) {
      var errors = reply.errors.map(e => e.field).join(', ')
      return callback(new Error(`invalid: ${errors}`))
    }
    getInvite(reply.branch, (err, invite) => {
      var decryptedInvite = server.private.unbox(invite) || invite
      if (err) return callback(err)
      var whoami = server.whoami()
      var notInvited = decryptedInvite &&
        (decryptedInvite.recipient !== whoami.id)
      if (notInvited) return callback(new Error(`invalid: you are not invited`))

      server.private.publish(reply, reply.recps, (err, resp) => {
        if (err) return callback(err)
        var decrypted = server.private.unbox(resp)
        callback(null, parseReply(decrypted))
      })
    })
  }
}
