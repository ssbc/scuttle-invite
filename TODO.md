# Thoughts & Questions

* Should a single invite record be able to be addressed to multiple people?

## How would this look?

* Reply/reply still points to root and branch
* Can Reply now needs to check if the person performing the reply is any one of the recps
* Concept of single `recipient` in `parseInvite` disappears, recps should be returned instead...
* Reply/reply could be addressed to entire group, or just a single individual (allows for tailored replys, can be a 'limited public' reply)

# Todo

* Stop using flumeview-reduce ssb-invites-db?

