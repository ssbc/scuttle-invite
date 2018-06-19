const { parseResponse } = require('ssb-invites-schema')

module.exports = function (server) {
  return function get (key, callback) {
    server.invites.getResponse(key, (err, response) => {
      if (err) return callback(err)
      return callback(null, parseResponse(response))
    })
  }
}
