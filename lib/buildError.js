module.exports = function buildError (obj) {
  var errors = obj.errors.map(e => e.field).join(', ')
  return new Error(`invalid: ${errors}`)
}
