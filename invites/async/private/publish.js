const Invite = require('../../sync/buildInvite')
const { isInvite, parseInvite } = require('ssb-invites-schema')

module.exports = function (server) {
  return function publish (params, callback) {
    const invite = new Invite(params)
    if (!isInvite(invite)) {
      var errors = invite.errors.map(e => e.field).join(', ')
      return callback(new Error(`invalid: ${errors}`))
    }
    server.private.publish(invite, invite.recps, (err, inv) => {
      if (err) return callback(err)
      var decrypted = server.private.unbox(inv)
      callback(null, parseInvite(decrypted))
    })
  }
}
