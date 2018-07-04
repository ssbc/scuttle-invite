# Scuttle Invite

> Polymorphic invite and reply logic for Secure Scuttlebutt.

You're hosting a gathering and all your favourite hermit crabs want to attend. You create a gathering on Patchbay. But wait. Hhw can you send a message to everyone telling them about it? Its a bit laborious to expect them all to _just know_, and a new reference thread could easily get lost. Have no fear!

Scuttle Invite provides an easy-to-use set of functions that allow you to invite and reply to any given `root` record in your database. Simply pass the gathering key / message ID as the `{ root }` in the publish parameters. To reply to an invite, make sure you pass the root ID again, and the branch ID (the invite).

## API

```js
invites: {
  async: {
    private: {
      publish,
      reply
    },
    publish,
    reply,
    getInvite,
    getReply,
    canReply,
    isAccepted,
  }
  pull: {
    byRoot
  }
  sync: {
    isInvite,
    isReply
  }
}
```
