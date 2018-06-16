const Invite = require('../../sync/buildInvite')
const { isInvite } = require('ssb-invites-schema')

module.exports = function (server) {
  return function publish (params, callback) {
    const invite = new Invite(params)
    if (!invite.isValid()) {
      var errors = invite.errors.map(e => e.field).join(', ')
      return callback(new Error(`invalid: ${errors}`))
    }
    server.private.publish(invite, invite.recps, callback)
  }
}
