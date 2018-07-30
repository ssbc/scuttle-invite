const {
  isInvite,
  parseInvite,
  versionStrings: {
    V1_SCHEMA_VERSION_STRING
  }
} = require('scuttle-invite-schema')

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

    server.publish(invite, (err, data) => {
      if (err) return callback(err)
      callback(null, parseInvite(data))
    })
  }
}
