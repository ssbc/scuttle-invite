const Response = require('../sync/buildResponse')
const { isResponse, parseResponse } = require('ssb-invites-schema')

module.exports = function (server) {
  return function reply (params, callback) {
    const response = new Response(params)
    if (!isResponse(response)) {
      var errors = response.errors.map(e => e.field).join(', ')
      return callback(new Error(`invalid: ${errors}`))
    }
    server.publish(response, (err, data) => {
      if (err) return callback(err)
      callback(null, parseResponse(data))
    })
  }
}
