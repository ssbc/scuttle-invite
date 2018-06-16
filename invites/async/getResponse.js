module.exports = function (server) {
  return function get (key, callback) {
    server.invites.getResponse(key, (err, response) => {
      if (err) return callback(err)
      else return callback(null, response)
    })
  }
}
