const methods = require('./methods')
const PLUGIN_DEPS = ['private', 'query']
const Inject = require('scuttle-inject')

module.exports = function (server, opts) {
  return Inject(server, methods, PLUGIN_DEPS)
}
