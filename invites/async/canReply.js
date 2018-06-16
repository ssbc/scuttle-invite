module.exports = function (server) {
  return function canReply (invite, callback) {
    const { author, recipient } = invite
    server.whoami((err, id) => {
      var bool = (recipient !== id) &&
        (recipient === author)
      callback(bool)
    })
  }
} 
