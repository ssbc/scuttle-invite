# Thoughts

* Should a single invite record be able to be addressed to multiple people?
* Not just a single respondent?

## How would this look?

* Reply/reply still points to root and branch
* Can Reply now needs to check if the person performing the reply is any one of the recps
* Concept of single `recipient` in `parseInvite` disappears, recps should be returned instead...
* Reply/reply could be addressed to entire group, or just a single individual (allows for tailored replys, can be a 'limited public' reply)

## Todo

* `ssb-invites-db` should raise relevant errors from `getReply` / `getInvite`
* `ssb-invites-db` restructure the data to make `pull` easier, use a filter in `getInvite` / `getReply` rather than a `for` loop over an object's keys.
* `isAccepted` can then render different reply depending on whether there was a reply at all or if it was simply rejected
* Check ssb-schemas, if there isn't a clashing message type, rename `reply` to `reply`, or `inviteReply`
