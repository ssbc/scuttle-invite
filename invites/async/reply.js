const {
  isReply,
  parseReply,
  versionStrings: {
    V1_SCHEMA_VERSION_STRING
  }
} = require('scuttle-invite-schema')


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
      const { value: { content: { recps } } } = invite
      var whoami = server.whoami()
      let recipients = recps.filter(recp => recp !== whoami.id)
      var notInvited = recipients.length !== 1
      if (notInvited) return callback(new Error(`invalid: you are not invited`))

      server.publish(reply, (err, data) => {
        if (err) return callback(err)
        callback(null, data)
      })
    })
  }
}
