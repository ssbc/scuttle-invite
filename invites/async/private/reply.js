const Response = require('../../sync/buildResponse')
const { isResponse } = require('ssb-invites-schema')

module.exports = function (server) {
  return function reply (params, callback) {
    const response = new Response(params)
    if (!response.isValid()) {
      var errors = response.errors.map(e => e.field).join(', ')
      return callback(new Error(`invalid: ${errors}`))
    }
    server.private.publish(response, response.recps, callback)
  }
}
