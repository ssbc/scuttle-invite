const pull = require('pull-stream')
const next = require('pull-next-query')
const pullMerge = require('pull-merge')

const { isMsgId } = require('ssb-ref')

module.exports = function (server) {
  return function allByRoot (root, opts = {}) {
    if (!root || !isMsgId(root)) throw new Error('root: must be a valid ssb message ID')

    return pullMerge(
      require('./invitesByRoot')(server)(root, opts),
      require('./repliesByRoot')(server)(root, opts),
      orderByTimestamp()
    )

    function orderByTimestamp () {
      return (a, b) => {
        if (opts.reverse) {
          return a.value.timestamp > b.value.timestamp ? -1 : +1
        } else {
          return a.value.timestamp < b.value.timestamp ? -1 : +1
        }
      }
    }
  }
}

