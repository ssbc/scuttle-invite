module.exports = function (server) {
  return function canReply (invite, callback) {
    const { value: { author, content: { recps } } } = invite
    server.whoami((err, whoami) => {
      let recipients = recps.filter(recp => recp !== whoami.id)
      if (recipients.length !== 1) return callback(false)
      let recipient = recipients[0]
      callback(recipient === author)
    })
  }
}
