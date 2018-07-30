const { versionStrings: { V1_SCHEMA_VERSION_STRING } } = require('scuttle-invite-schema')

module.exports = function Builder (type) {
  return function (params) {
    return Object.assign(
      {}, { type: type },
      params, { version: V1_SCHEMA_VERSION_STRING }
    )
  }
}
