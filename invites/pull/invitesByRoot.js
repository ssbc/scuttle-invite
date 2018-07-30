const pull = require('pull-stream')
const next = require('pull-next-query')
const pullMerge = require('pull-merge')

const { isMsgId } = require('ssb-ref')
const { isInvite, isReply } = require('scuttle-invite-schema')

module.exports = function (server) {
  return function invitesByRoot (rootId, opts = {}) {
    if (!rootId || !isMsgId(rootId)) throw new Error('root: must be a valid ssb message ID')

    return pull(
      next(server.query.read, queryByTypeWithContent('invite')),
      pull.filter(isInvite),
      pull.asyncMap((invite, callback) => {
        pull(
          next(server.query.read, queryByTypeWithContent('invite-reply', { branch: invite.key })),
          pull.collect((err, replies) => {
            if (err) return callback(err)
            var inviteWithReplies = Object.assign({}, invite, { replies })
            callback(null, inviteWithReplies)
          })
        )
      })
    )

    function queryByTypeWithContent (type, _opts) {
      return Object.assign({}, {
        query: [{
          $filter: {
            value: {
              timestamp: { $gt: 0 },
              content: Object.assign({}, { type, root: rootId }, _opts)
            }
          }
        }]
      }, opts, { limit: 100 })
    }
  }
}

