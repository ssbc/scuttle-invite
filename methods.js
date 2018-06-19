const { isInvite, isResponse } = require('ssb-invites-schema')

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
      getResponse: require('./invites/async/getResponse'),
      canReply: require('./invites/async/canReply'),
      isAccepted: require('./invites/async/isAccepted')
    },
    sync: {
      isInvite: () => isInvite,
      isResponse:  () => isResponse,
    }
  }
}
