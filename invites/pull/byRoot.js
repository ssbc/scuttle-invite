const pull = require('pull-stream')
const next = require('pull-next-query')
const pullMerge = require('pull-merge')

const { isMsgId } = require('ssb-ref')
const merge = require('lodash.merge')

const { isInvite, isReply } = require('scuttle-invite-schema')

module.exports = function (server) {
  return function byRoot (opts = {}) {
    const root = opts.root

    if (!root) throw new Error('provide a root')
    if (!isMsgId(root)) throw new Error('root: must be a valid ssb message ID')

    const invites = pull(
      next(server.query.read, optsWithQuery({ type: 'invite', root: root }), ['value', 'timestamp']),
      pull.filter(isInvite),
      pull.asyncMap((invite, callback) => {
        pull(
          next(server.query.read, optsWithQuery({ type: 'invite-reply', root: root, branch: invite.key }), ['value', 'timestamp']),
          pull.collect((err, replies) => {
            if (err) return callback(err)
            var inviteWithReplies = Object.assign({}, invite, { replies })
            callback(null, inviteWithReplies)
          })
        )
      })
    )

    const replies = pull(
      next(server.query.read, optsWithQuery({ type: 'invite-reply', root: root }), ['value', 'timestamp']),
      pull.filter(isReply),
      pull.asyncMap((reply, callback) => {
        const invite = reply.value.content.branch
        server.get(invite, (err, value) => {
          if (err) return console.error(err)
          callback(null, Object.assign({}, reply,
            { invite: { key: invite, value } }
          ))
        })
      })
    )

    return pullMerge(
      invites,
      replies,
      Compare(opts)
    )

    function optsWithQuery (content) {
      return Object.assign({}, {
        limit: 100,
        query: [{
          $filter: {
            value: {
              timestamp: { $gt: 0 },
              content: content
            }
          }
        }]
      }, opts)
    }
  }
}

function Compare (opts) {
  return (a, b) => {
    if (opts.reverse) {
      return a.value.timestamp > b.value.timestamp ? -1 : +1
    } else {
      return a.value.timestamp < b.value.timestamp ? -1 : +1
    }
  }

}
