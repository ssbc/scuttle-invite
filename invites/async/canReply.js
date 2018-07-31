module.exports = function (server) {
  return function canReply (invite, callback) {
    const { value: { author, content: { recps } } } = invite

    let otherRecp = recps.find(recp => recp !== server.id)
    if (!otherRecp) return callback(null, false)

    callback(null, otherRecp === author)
  }
}
