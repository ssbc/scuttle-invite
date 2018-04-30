# Things we want to be able to do

**CRUD**

1. Find
2. Create
3. Update
4. Delete // OPTIONAL

---


## Find invites and responses based on `root`

* This should return a `root` object with array of invites and each `invite` should reference a response.
* If `response` exists, should append invite object with `{ accepted: $result }`
* We want to open up this functionality to **any** other module `=>` We want to return a set of methods

```
api.invites.root.get(key, cb)
```

## Find invites based on `key`

* This should return an `invite` object
* Should return an attached `response`

## Create invites

* Build an invite object
* Validate before save
* If valid append to database

## Put invites

* 

## Methods returned by API

```
api.invites.get(key, cb)
api.invites.create(params)
api.invites.respond(key, params, cb)
api.invites.delete(key, cb)
```
