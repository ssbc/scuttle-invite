const Response = require('../../sync/build')
const { isResponse } = require('ssb-invites-schema')
const CanReply = require('./canReply')

module.exports = function (server) {
  const canReply = CanReply(server)

  return function reply (params, callback) {
    const response = new Response(params)
    if (!response.isValid()) {
      var errors = response.errors.map(e => e.field).join(', ')
      return callback(new Error(`invalid: ${errors}`))
    }
    server.publish(response, callback)
  }
}