const Invite = require('../../sync/build')
const { isInvite } = require('ssb-invites-schema')

module.exports = function (server) {
  return function publish (params, callback) {
    // needs logic to check if ssb-private is plugged in to server!!
    const invite = new Invite(params)
    if (!invite.isValid()) {
      var errors = invite.errors.map(e => e.field).join(', ')
      return callback(new Error(`invalid: ${errors}`))
    }
    server.private.publish(invite, invite.recps, callback)
  }
}
