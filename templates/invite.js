var default = { body: null, expiresAt: null, accepted: false }

module.exports = function Invite ({ body, root, expiresAt, recps, mentions } = default) {
  var self = { body, expiresAt, root, recps, mentions }

  // var errorMessages = []

//   self.response = function (callback) {
//     return new Promise((resolve, reject) => {
//       self.accepted = "Outcome"
//       resolve("Success!")
//     }).then(callback)
//   }.bind(self)

//   self.recipients = function (callback) {
//     return new Promise((resolve, reject) => {
//     }).then(callback)
//   }.bind(self)

//   self.invitable = function (callback) {
//     return new Promise((resolve, reject) => {
//     }).then(callback)
//   }.bind(self)

//   self.errors = errorMessages.map(msg => new Error(msg))

  return self
}
