const { describe } = require('tape-plus')
const { PublishEvent, Server } = require('../methods')
const pull = require('pull-stream')
const PullAllByRoot = require('../../invites/pull/allByRoot')
const getContent = require('ssb-msg-content')

describe('invites.pull.byRoot', context => {
  let server, grace
  let publishEvent, pullInvites

  context.beforeEach(t => {
    server = Server()
    grace = server.createFeed()

    pullByRoot = PullAllByRoot(server)
    publishEvent = PublishEvent(server)
  })

  context.afterEach(t => {
    server.close()
  })

  context("Returns a collection of invites and their replies", (assert, next) => {
    populateDB((root, invites, replies) => {
      pull(
        pullByRoot(root.key),
        pull.collect((err, data) => {
          var cloneInvites = JSON.parse(JSON.stringify(invites))
          var cloneReplies = JSON.parse(JSON.stringify(replies))

          invites.map(invite => {
            var inviteReplies = cloneReplies.filter(reply => getContent(reply).branch === invite.key)
            invite.replies = inviteReplies
          })

          replies.map(reply => {
            var replyInvite = cloneInvites.filter(invite => getContent(reply).branch === invite.key)
            delete replyInvite[0].timestamp
            reply.invite = replyInvite[0]
          })

          assert.deepEqual([ ...invites, ...replies ], data)
          next()
        })
      )
    })
  })

  function populateDB (callback) {
    publishEvent((err, event) => {
      pull(
        pull.values([
          { type: 'invite', version: '1', recps: [grace.id, server.id], body: '1', root: event.key },
          { type: 'invite', version: '1', recps: [grace.id, server.id], body: '2', root: event.key },
          { type: 'invite', version: '1', recps: [grace.id, server.id], body: '3', root: event.key },
          { type: 'invite', version: '1', recps: [grace.id, server.id], body: '4', root: event.key },
          { type: 'invite', version: '1', recps: [grace.id, server.id], body: '5', root: event.key }
        ]),
        pull.asyncMap(server.publish),
        pull.collect((err, invites) => {
          const [ first, second, third, fourth, fifth ] = invites

          pull(
            pull.values([
              { type: 'invite-reply', version: '1', recps: [grace.id, server.id], body: '1', root: event.key, branch: first.key, accept: true },
              { type: 'invite-reply', version: '1', recps: [grace.id, server.id], body: '2', root: event.key, branch: second.key, accept: true },
              { type: 'invite-reply', version: '1', recps: [grace.id, server.id], body: '3', root: event.key, branch: third.key, accept: true },
              { type: 'invite-reply', version: '1', recps: [grace.id, server.id], body: '4', root: event.key, branch: fourth.key, accept: true },
              { type: 'invite-reply', version: '1', recps: [grace.id, server.id], body: '5', root: event.key, branch: fifth.key, accept: true }
            ]),
            pull.asyncMap(grace.publish),
            pull.collect((err, replies) => {
              callback(event, invites, replies)
            })
          )
        })
      )
    })
  }
})

