const Response = require('../../sync/buildResponse')
const { isResponse, parseResponse } = require('ssb-invites-schema')

module.exports = function (server) {
  return function reply (params, callback) {
    const response = new Response(params)
    if (!isResponse(response)) {
      var errors = response.errors.map(e => e.field).join(', ')
      return callback(new Error(`invalid: ${errors}`))
    }
    server.private.publish(response, response.recps, (err, resp) => {
      if (err) return callback(err)
      var decrypted = server.private.unbox(resp)
      callback(null, parseResponse(decrypted))
    })
  }
}
