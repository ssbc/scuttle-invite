module.exports = function (server) {
  return function get (key, callback) {
    server.invites.getInvite(key, (err, invite) => {
      if (err) return callback(err)
      else return callback(null, invite)
    })
  }
}
