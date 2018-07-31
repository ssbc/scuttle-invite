const getContent = require('ssb-msg-content')
const pull = require('pull-stream')
const { heads } = require('ssb-sort')

const {
  isInvite,
  isReply,
  parseReply,
  versionStrings: {
    V1_SCHEMA_VERSION_STRING
  }
} = require('ssb-invite-schema')

const buildError = require('../../lib/buildError')

module.exports = function (server) {
  const getInvite = require('./getInvite')(server)

  return function reply (inviteKey, params, callback) {
    getInvite(inviteKey, (err, invite) => {
      if (err) return callback(err)
      if (!isInvite(invite)) return callback(new Error(`${inviteKey} is not a valid invite, cannot reply to this`))

      const { recps = [], root } = getContent(invite)

      const iWasInvited = Boolean(recps.find(recp => recp === server.id))
      if (!iWasInvited) return callback(new Error(`invalid: you are not invited`))

      pull(
        backlinksSource(root),
        pull.collect((err, msgs) => {
          if (err) return callback(err)

          const reply = Object.assign({},
            params,
            {
              type: 'invite-reply',
              version: V1_SCHEMA_VERSION_STRING,
              recps,
              root,
              branch: heads(msgs)
            }
          )

          if (!isReply(reply)) return callback(buildError(reply))

          server.publish(reply, callback)
        })
      )
    })
  }

  function backlinksSource (root) {
    return server.backlinks.read({
      query: [{
        $filter: {dest: root}
      }]
    })
  }
}
