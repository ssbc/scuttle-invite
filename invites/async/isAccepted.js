module.exports = function (server) {
  return function isAccepted (invite, callback) {
    getReply(invite.id, (err, resp) => {
      // If no reply?
      if (err) return callback(err)
      callback(null, resp.accepted)
    })
  }
}
