const {
  isInvite,
  parseInvite,
  versionStrings: {
    V1_SCHEMA_VERSION_STRING
  }
} = require('ssb-invite-schema')

module.exports = function (server) {
  return function publish (params, callback) {
    const invite = Object.assign({}, {
      type: 'invite',
    }, params, {
      version: V1_SCHEMA_VERSION_STRING
    })

    if (!invite.recps) invite.recps = []
    if (!invite.recps.includes(server.id)) invite.recps = [...invite.recps, server.id]

    if (!isInvite(invite)) {
      var errors = invite.errors.map(e => e.field).join(', ')
      return callback(new Error(`invalid: ${errors}`))
    }
    server.private.publish(invite, invite.recps, (err, inv) => {
      if (err) return callback(err)
      var decrypted = server.private.unbox(inv)
      callback(null, decrypted)
    })
  }
}
