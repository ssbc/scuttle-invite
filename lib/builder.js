const { versionStrings } = require('scuttle-invite-schema')

module.exports = function Builder (type) {
  return function (params) {
    return Object.assign(
      {}, { type: type },
      params, { version: versionStrings.V1_SCHEMA_VERSION_STRING }
    )
  }
}
