module.exports = function (server) {
  return function isAccepted (invite, callback) {
    getResponse(invite.id, (err, resp) => {
      // If no response?
      if (err) return callback(err)
      callback(null, resp.accepted)
    })
  }
}
