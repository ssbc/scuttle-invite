const Response = require('../sync/buildResponse')
const { isResponse, parseResponse } = require('ssb-invites-schema')

module.exports = function (server) {
  const getInvite = require('./getInvite')(server)

  return function reply (params, callback) {
    const response = new Response(params)
    if (!isResponse(response)) {
      var errors = response.errors.map(e => e.field).join(', ')
      return callback(new Error(`invalid: ${errors}`))
    }
    getInvite(response.branch, (err, invite) => {
      if (err) return callback(err)
      var whoami = server.whoami()
      var notInvited = invite.recipient !== whoami.id
      if (notInvited) return callback(new Error(`invalid: you are not invited`))

      server.publish(response, (err, data) => {
        if (err) return callback(err)
        callback(null, parseResponse(data))
      })
    })
  }
}
