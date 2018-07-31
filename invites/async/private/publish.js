const {
  isInvite,
  parseInvite,
  versionStrings: {
    V1_SCHEMA_VERSION_STRING
  }
} = require('ssb-invite-schema')

const buildError = require('../../lib/buildError')

module.exports = function (server) {
  return function publish (params, callback) {
    // params must contain: root, recps

    const invite = Object.assign({}, params, {
      type: 'invite',
      version: V1_SCHEMA_VERSION_STRING
    })

    if (!isInvite(invite)) return callback(buildError(invite))

    if (!invite.recps.includes(server.id)) invite.recps.push(server.id)

    server.private.publish(invite, invite.recps, (err, inv) => {
      if (err) return callback(err)
      var decrypted = server.private.unbox(inv)
      callback(null, decrypted)
    })
  }
}
