const { isInvite } = require('ssb-invites-schema')
const getResponse = require('../../response/async/get')
const Response = require('../../response/sync/build')

module.exports = function Invite (server, msg) {
  var self = msg.value.content

  self.isValid = () => {
    isInvite(self)
    self.errors = self.errors || []
    return self.errors.length === 0 ? true : false
  }

  if (self.isValid()) {

    self.recipient = (cb) => {
      if (!cb) return new Error("provide a callback")
      new Promise((resolve, reject) => {
        // Do get recipient
        var recipient = null
        if (recipient) {
          resolve(recipient)
        } else {
          var error = new Error("Missing recipient")
          self.errors.push(error)
          reject(error)
        }
      }).then(
        recp => cb(null, recp),
        err => cb(err, null)
      )
    }

    self.response = (cb) => {
      if (!cb) return new Error("provide a callback")
      new Promise((resolve, reject) => {
        // Do get response
        var response = null
        if (response) {
          resolve(response)
        } else {
          reject(new Error("Not yet responded"))
        }
      }).then(
        resp => cb(null, resp),
        err => cb(err, null)
      )
    }

    server.whoami((err, whoami) => {
      if (err) throw err
      if (canReply()) {
        self.accept = (cb) => {
          if (!cb) return new Error("provide a callback")
          new Promise((resolve, reject) => {
            server.publish({
              response
            },
            [whoami.id, msg.author],
            (err, resp) => {
              if (err) reject(err)
              else resolve(resp)
            })
          }).then(
            resp => cb(null, resp),
            err => cb(err, null)
          )
        }

        self.reject = (cb) => {
          if (!cb) return new Error("provide a callback")
          new Promise((resolve, reject) => {
            server.publish({

            },
            [whoami.id, msg.author],
            (err, resp) => {
              if (err) reject(err)
              else resolve(resp)
            })
          }).then(
            resp => cb(null, resp),
            err => cb(err, null)
          )
        }
      }

      function canReply () {
        return self.recps.filter(recp => {
          return recp !== whoami.id &&
            recp === msg.author
        }).length > 0
      }
    })

    self.isAccepted = (cb) => {
      if (!cb) return new Error("provide a callback")
      new Promise((resolve, reject) => {
        self.response((err, response) => {
          if (err) reject(err)
          resolve(response.accept)
        })
      }).then(
        bool => cb(null, bool),
        err => cb(err, null)
      )
    }
  }

  return self
}
