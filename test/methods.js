function PublishEvent (server) {
  return function publishEvent (params = {}, cb) {
    if (typeof params === 'function') return publishEvent({}, params)
    server.publish({ type: 'event' }, cb)
  }
}

function Server () {
  return require('scuttle-testbot')
    .use(require('ssb-private'))
    .use(require('ssb-query'))
    .call()
}

module.exports = {
  PublishEvent,
  Server
}
