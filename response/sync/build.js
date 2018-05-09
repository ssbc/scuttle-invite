const { isResponse } = require('ssb-invites-schema')

module.exports = function Response (server, msg, invite = null) {
  var self = msg.value.content

  self.isValid = () => {
    isResponse(self)
    return self.errors.length == 0 ? true : false
  }

  if (isValid()) {

    self.invite = invite ? invite : (cb) => {

    }

  }
}
