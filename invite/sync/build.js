const { isInvite } = require('ssb-invites-schema')

module.exports = function Invite (server, msg) {
  var self = msg.value.content

  self.isValid = () => {
    isInvite(self)
    return self.errors.length == 0 ? true : false
  }

  if (self.isValid()) {
    // Define model methods

    server.whoami((err, whoami) => {
      if (err) throw err
      if (canAccept()) {
        self.accept = (cb) => {
          if (!cb) return new Error("provide a callback")
          new Promise ((resolve, reject) => {
            server.publish({
              response
            }, recps, (err, msg) => {
              if (err) reject(err)
              else resolve(msg)
            })
          }).then(msg => cb(msg), err => cb(msg))
        }
      }

      function canAccept () {
        return self.recps.filter(recp => {
          return recp !== whoami.id &&
            recp === msg.author
        }).length > 0
      }
    })

    self.recipient = (cb) => {
      if (!cb) return new Error("provide a callback")
      new Promise ((resolve, reject) => {
        var recipient = null
        if (recipient) {
          resolve(recipient)
        } else {
          var error = new Error("Missing recipient")
          self.errors.push(error)
          reject(error)
        }
      }).then(msg => cb(msg), err => cb(err))
    }

    self.response = (cb) => {
      if (!cb) return new Error("provide a callback")
      new Promise ((resolve, reject) => {
        var response = null
        if (response) {
          resolve(response)
        } else {
          reject(new Error("Not yet responded"))
        }
      }).then(msg => cb(msg), err => cb(err))
    }

  }

  return self
}

