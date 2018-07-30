const pull = require('pull-stream')
const next = require('pull-next-query')
const pullMerge = require('pull-merge')

const { isMsgId } = require('ssb-ref')
const { isInvite, isReply } = require('scuttle-invite-schema')

module.exports = function (server) {
  return function repliesByRoot (rootId, opts = {}) {
    if (!rootId || !isMsgId(rootId)) throw new Error('root: must be a valid ssb message ID')

    return pull(
      next(server.query.read, queryByTypeWithContent('invite-reply'), ['value', 'timestamp']),
      pull.filter(isReply),
      pull.asyncMap((reply, callback) => {
        const invite = reply.value.content.branch
        server.get(invite, (err, value) => {
          if (err) return callback(err)
          callback(null, Object.assign({}, reply,
            { invite: { key: invite, value } }
          ))
        })
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
