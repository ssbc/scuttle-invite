const {
  isInvite,
  parseInvite,
  versionStrings: {
    V1_SCHEMA_VERSION_STRING
  }
} = require('ssb-invite-schema')

module.exports = function (server) {
  return function publish (params, callback) {
    // params must contain: root, recps

    const invite = Object.assign({}, params, {
      type: 'invite',
      version: V1_SCHEMA_VERSION_STRING
    })

    if (!isInvite(invite)) {
      var errors = invite.errors.map(e => e.field).join(', ')
      return callback(new Error(`invalid: ${errors}`))
    }

    if (!invite.recps.includes(server.id)) invite.recps.push(server.id)

    server.publish(invite, callback)
  }
}
