const Reply = require('../sync/buildReply')
const { isReply, parseReply } = require('scuttle-invite-schema')

module.exports = function (server) {
  const getInvite = require('./getInvite')(server)

  return function reply (params, callback) {
    const reply = new Reply(params)
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
