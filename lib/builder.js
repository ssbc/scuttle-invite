const {
  isResponse,
  isInvite,
  versionStrings
} = require('ssb-invites-schema')

const mappings = {
  'response': isResponse,
  'invite': isInvite
}

module.exports = function Builder (type) {
  var mapping = mappings[type]
  if (typeof mapping !== 'function') throw new Error('Incorrect mapping')

  return function (params) {
    var self = Object.assign(
      {}, { type: type },
      params, { version: versionStrings.V1_SCHEMA_VERSION_STRING }
    )

    self.isValid = () => {
      return mapping(self)
    }

    return self
  }
}
