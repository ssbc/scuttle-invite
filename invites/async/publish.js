const Invite = require('../sync/build')
const { isInvite } = require('ssb-invites-schema')

module.exports = function (server) {
  return function publish (params, callback) {
    const invite = new Invite(params)
    if (!invite.isValid()) {
    console.log(invite)
      var errors = invite.errors.map(e => e.field).join(', ')
      return callback(new Error(`invalid: ${errors}`))
    }
    server.publish(invite, callback)
  }
}
