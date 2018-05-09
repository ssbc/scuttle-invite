const { isInvite } = require('ssb-invites-schema')
const Response = require('../../response/sync/build')

module.exports = function Invite (server, msg) {
  const getResponse = require('../../response/async/get')(server)

  const { author, content } = msg.value
  var self = content

  Object.assign(self, { id: msg.key })

  self.isValid = () => {
    isInvite(self)
    self.errors = self.errors || []
    return self.errors.length === 0 ? true : false
  }

  if (self.isValid()) {

    self.recipient = (cb) => {
      if (!cb) throw new Error('provide a callback')
      new Promise((resolve, reject) => {
        // Do get recipient
        var recipient = null
        if (recipient) {
          resolve(recipient)
        } else {
          var error = new Error('Missing recipient')
          self.errors.push(error)
          reject(error)
        }
      }).then(
        recp => cb(null, recp),
        err => cb(err, null)
      )
    }

    self.response = (cb) => {
      if (!cb) throw new Error('provide a callback')
      new Promise((resolve, reject) => {
        getResponse(self.id, (err, response) => {
          if (err) reject(err)
          else resolve(response)
        })
      }).then(
        resp => cb(null, resp),
        err => cb(err, null)
      )
    }

    server.whoami((err, whoami) => {
      if (err) throw err
      if (canReply()) {
        self.accept = (cb) => {
          var attrs = {
            type: 'response',
            version: self.version,
            root: self.root,
            branch: self.id,
            accept: true,
            recps: [whoami.id, author]
          }
          if (!cb) throw new Error('provide a callback')
          new Promise((resolve, reject) => {
            // callback returns null ???
            server.private.publish(
              attrs,
              [whoami.id, author],
            )
            var response = new Response(server, {
              key: '???',
              value: { author: whoami.id, content: attrs }
            })
            if (!response) reject(new Error('failed to publish'))
            else resolve(response)
          }).then(
            resp => cb(null, resp),
            err => cb(err, null)
          )
        }

        self.reject = (cb) => {
          if (!cb) throw new Error('provide a callback')
          new Promise((resolve, reject) => {
            server.private.publish({
              type: 'response',
              version: self.version,
              root: self.root,
              branch: self.id,
              accept: false
            },
            [whoami.id, msg.author],
            resp => {
              if (!resp) reject(new Error('failed to publish'))
              else resolve(new Response(server, resp))
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
            recp === author
        }).length > 0
      }
    })

    self.isAccepted = (cb) => {
      if (!cb) throw new Error('provide a callback')
      new Promise((resolve, reject) => {
        self.response((err, response) => {
          if (err) reject(err)
          else resolve(response.accept)
        })
      }).then(
        bool => cb(null, bool),
        err => cb(err, null)
      )
    }
  }

  return self
}
