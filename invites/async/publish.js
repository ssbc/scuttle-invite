const Invite = require('../sync/buildInvite')
const { isInvite, parseInvite } = require('scuttle-invite-schema')

module.exports = function (server) {
  return function publish (params, callback) {
    const invite = new Invite(params)
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
