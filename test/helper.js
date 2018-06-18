const PublishEvent = function (server) {
  return function publishEvent (params = {}, cb) {
    if (typeof params === 'function') return publishEvent({}, params)
    server.publish({ type: 'event' }, cb)
  }
}

module.exports = {
  PublishEvent
}
