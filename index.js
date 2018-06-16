const methods = require('./methods')
const PLUGIN_DEPS = ['invites', 'private']
const Inject = require('./lib/inject')

module.exports = function (server, opts) {
  return Inject(server, methods, PLUGIN_DEPS)
}
