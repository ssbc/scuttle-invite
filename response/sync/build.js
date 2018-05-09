const { isResponse } = require('ssb-invites-schema')

module.exports = function Response (server, msg, invite = null) {
  const { author, content } = msg.value
  var self = content
  console.log(self)

  self.isValid = () => {
    isResponse(self)
    self.errors = self.errors || []
    return self.errors.length == 0 ? true : false
  }

  // if (isValid()) {
  //   self.invite = invite ? invite : (cb) => {

  //   }
  // }

  return self
}
