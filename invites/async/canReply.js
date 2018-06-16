module.exports = function (server) {
  return function canReply (invite, callback) {
    const { author, recipient } = invite
    server.whoami((err, whoami) => {
      var bool = (recipient === whoami.id) &&
        (recipient !== author)
      callback(bool)
    })
  }
}
