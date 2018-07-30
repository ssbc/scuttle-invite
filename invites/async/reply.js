const {
  isReply,
  parseReply,
  versionStrings: {
    V1_SCHEMA_VERSION_STRING
  }
} = require('ssb-invite-schema')


module.exports = function (server) {
  const getInvite = require('./getInvite')(server)

  return function reply (params, callback) {
    const reply = Object.assign({}, {
      type: 'invite-reply',
    }, params, {
      version: V1_SCHEMA_VERSION_STRING
    })

    if (!reply.recps) reply.recps = []
    if (!reply.recps.includes(server.id)) reply.recps = [...reply.recps, server.id]

    if (!isReply(reply)) {
      var errors = reply.errors.map(e => e.field).join(', ')
      return callback(new Error(`invalid: ${errors}`))
    }

    getInvite(reply.branch, (err, invite) => {
      if (err) return callback(err)
      var whoami = server.whoami()
      var notInvited = invite.recipient !== whoami.id
      if (notInvited) return callback(new Error(`invalid: you are not invited`))

      server.publish(reply, (err, data) => {
        if (err) return callback(err)
        callback(null, parseReply(data))
      })
    })
  }
}
