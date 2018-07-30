const { isInvite, isReply } = require('scuttle-invite-schema')

module.exports = {
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
    invitesByRoot: require('./invites/pull/invitesByRoot'),
    repliesByRoot: require('./invites/pull/invitesByRoot'),
    allByRoot: require('./invites/pull/allByRoot')
  },
  sync: {
    isInvite: () => isInvite,
    isReply:  () => isReply,
  }
}
