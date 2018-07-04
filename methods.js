const { isInvite, isReply } = require('scuttle-invite-schema')

module.exports = {
  invites: {
    async: {
      private: {
        publish: require('./invites/async/private/publish'),
        reply: require('./invites/async/private/reply')
      },
      publish: require('./invites/async/publish'),
      reply: require('./invites/async/reply'),
      getInvite: require('./invites/async/getInvite'),
      getReply: require('./invites/async/getReply'),
      canReply: require('./invites/async/canReply'),
      isAccepted: require('./invites/async/isAccepted')
    },
    pull: {
      byRoot: require('./invites/pull/byRoot')
    },
    sync: {
      isInvite: () => isInvite,
      isReply:  () => isReply,
    }
  }
}
