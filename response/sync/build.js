const { isResponse } = require('ssb-invites-schema')
const Invite = require('../../invites/sync/build')

module.exports = function Response (server, msg, invite = null) {
  const getInvite = require('../../invites/async/get')(server)

  const { author, content } = msg.value
  var self = content

  Object.assign(self, { id: msg.key })

  self.isValid = () => {
    isResponse(self)
    self.errors = self.errors || []
    return self.errors.length == 0 ? true : false
  }

  if (self.isValid()) {
    self.invite = (cb) => {
      if (invite) return cb(null, invite)
      new Promise((resolve, reject) => {
        getInvite(self.branch, (err, invite) => {
          if (err) reject(err)
          else resolve(invite)
        })
      }).then(
        resp => cb(null, resp),
        err => cb(err, null)
      )
    }
  }

  return self
}
