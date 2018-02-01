actions will have the app they belong to
actions will have the prevAction
multiple actions can have the same previous actions (in case where previous action is a branch) or in the case of parallelization

Here is the structure we are creating for this demo
```
{
    "status": "ok",
    "apis": [
        {
            "id": "11bb00cd-8dff-4610-b466-3300840b1bb6",
            "name": "super real company assessment api",
            "end_points": [
                {
                    "id": "107e7988-25e6-4771-a6b5-cf435c527fef",
                    "name": "get all assessments",
                    "http_verb": "get",
                    "path": "assessments",
                    "created": "2018-02-01T05:00:00.000Z",
                    "actions": [
                        {
                            "id": "f0fa408d-07b6-448b-9455-eb81db43485a",
                            "name": "read data",
                            "type": "db-query",
                            "attributes": {
                                "x": 100,
                                "y": 20,
                                "table": "assessment",
                                "expects": [],
                                "queryType": "SELECT",
                                "connection": "someID"
                            },
                            "previus_action": []
                        }
                    ]
                },
                {
                    "id": "ff6a3765-6726-4cb7-8ac0-7dfb5ece6404",
                    "name": "create assessment",
                    "http_verb": "post",
                    "path": "assessments",
                    "created": "2018-02-01T05:00:00.000Z",
                    "actions": [
                        {
                            "id": "8b621e0e-2da5-40cf-8143-af9caa6abc5a",
                            "name": "validate input",
                            "type": "custom-function",
                            "attributes": {
                                "x": 54,
                                "y": 20,
                                "code": "if(!req.params.foo) return airComplete(null, { status: false }) else airComplete(null, { status: true });"
                            },
                            "previus_action": []
                        },
                        {
                            "id": "488e97b2-ac0b-4087-bf12-1ba61c6fcd02",
                            "name": "branch",
                            "type": "branch",
                            "attributes": {
                                "x": 100,
                                "y": 20
                            },
                            "previus_action": [
                                {
                                    "id": "8b621e0e-2da5-40cf-8143-af9caa6abc5a",
                                    "name": "validate input",
                                    "action_type": "custom-function",
                                    "attributes": {
                                        "x": 54,
                                        "y": 20,
                                        "code": "if(!req.params.foo) return airComplete(null, { status: false }) else airComplete(null, { status: true });"
                                    }
                                }
                            ]
                        },
                        {
                            "id": "b4df4e7a-bf48-4dae-9dfa-bae30d5a1639",
                            "name": "return validation error",
                            "type": "custom-function",
                            "attributes": {
                                "x": 400,
                                "y": 20,
                                "code": "airComplete(\"invalid input\")"
                            },
                            "previus_action": [
                                {
                                    "id": "488e97b2-ac0b-4087-bf12-1ba61c6fcd02",
                                    "name": "branch",
                                    "action_type": "branch",
                                    "attributes": {
                                        "x": 100,
                                        "y": 20
                                    }
                                }
                            ]
                        },
                        {
                            "id": "0757f9ae-62b3-494d-b879-33eb4d378ab7",
                            "name": "store data",
                            "type": "db-query",
                            "attributes": {
                                "x": 200,
                                "y": 20,
                                "table": "assessment",
                                "expects": [
                                    "name",
                                    "description"
                                ],
                                "queryType": "INSERT",
                                "connection": "someID"
                            },
                            "previus_action": [
                                {
                                    "id": "488e97b2-ac0b-4087-bf12-1ba61c6fcd02",
                                    "name": "branch",
                                    "action_type": "branch",
                                    "attributes": {
                                        "x": 100,
                                        "y": 20
                                    }
                                }
                            ]
                        },
                        {
                            "id": "d2030d23-691a-4cb8-90df-558d1da1abe9",
                            "name": "success function",
                            "type": "custom function",
                            "attributes": {
                                "x": 300,
                                "y": 20,
                                "code": "airComplete(null, { status: \"success\"})"
                            },
                            "previus_action": [
                                {
                                    "id": "0757f9ae-62b3-494d-b879-33eb4d378ab7",
                                    "name": "store data",
                                    "action_type": "db-query",
                                    "attributes": {
                                        "x": 200,
                                        "y": 20,
                                        "table": "assessment",
                                        "expects": [
                                            "name",
                                            "description"
                                        ],
                                        "queryType": "INSERT",
                                        "connection": "someID"
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "d1fc56d6-ea90-41a8-a34e-163cc5930d23",
                    "name": "update assessments",
                    "http_verb": "put",
                    "path": "assessment",
                    "created": "2018-02-01T05:00:00.000Z",
                    "actions": []
                }
            ]
        }
    ]
}
```
### Advantages of Postgres

* Data Validation
* Advanced Query Options
* Ability to set up relationships, deleting an api for example can easily clean up all children with almost no code
* Transaitons, we can perform updates accross multiple tables in a single transation to insure integrity        (https://www.postgresql.org/docs/9.6/static/tutorial-transactions.html)
* JSONB gives us some of what we had with mongo avoiding the need for hundred of tables

### Disadvantages

* Cumbersome
    * Harder to make changes to the schema
    * "Potentially" More work to figure out and define how data is martialed in and out of the db
* If our data can all be contained with a single document then we don't need some of the advantages of the relational DB
    * I say some because their are still hard to figure out scenarios in monbodb, like say we remove an action, is it still
        referenced anywhere, we'll need to do a second query to find out and potentially update some equivalent to the modelList, or
        conversely say we delete an action and it's referenced within end points, even if it's just with a single api, we'll still
        have to walk that api find those spots and performing multiple updates to remove that action. Most of this falls out
        naturally in a scenario where we use postgres

### Keep in mind

* mongo can do some key validation but only on specific keys, we can't really use mongo to say validate a unique
    name for arbitrary actions that are embedded inside an api, though it could easily ensure uniqueness of the apis name,
    if we break actions out into their own collection we could rely on mongo to enforce uniqueness rules, but would have the
    problme of implementing joins and because their are no transactions if you for example insert a pointer to the action
    into the end_point but then find you can't save the action because of a unique violation it's up to use to try and roll that
    back, but sql would do that for us
