# Mongo Query Resolver

MongoQueryResolver is an open-source library which makes querying and formating MongoDB databases easy. It runs on top of mongodb find function and can 

  - Include related models. (BelongsTo | HasOne | HasMany | HasAndBelongsToMany | ReferencesMany)
  - Do nested queries with infinite recursion
  - Formating

### Dependencies


* [Lodash] - A modern JavaScript utility library.
* [MongoDB] - A general purpose, document-based, distributed database.

### Installation

MongoQueryResolver requires [Node.js](https://nodejs.org/) v10+ to run.

```sh
$ npm i mongoqueryresolver -s
```

### Usage
Let's assume we have few collections:

```
Author: { firstName, lastName, _id, age, phone,  email }
Book: { title, description, _id, rating, storeId,  publishedDate }
AuthorBook: { authorId, bookId, _id }
Store: { name, adrress, _id, zipcode, }
Tag: { name, authorIds, _id }
```

Basic Example
```javascript
const MQR = require('mongoqueryresolver');

(async function () {
    const db = await MQR.init("mongodb://localhost:27017/testdb");
    const authors = await MQR.filter({
        collection: "Author",
        limit: 3,
        where: {
            age: { $gt: 18 }
        },
        fields: [
            "firstName",
            {
                field: "Age",
                value: "age"
            }
        ]
    });
    console.log(authors);
})();
```
Output
```json
[
  {
    "firstName": "Sylvester",
    "Age": 82
  },
  {
    "firstName": "Kenny",
    "Age": 72
  },
  {
    "firstName": "Emerson",
    "Age": 20
  }
]
```


More realistic Example
```javascript
const MQR = require('mongoqueryresolver');

(async function(){
    const db = await MQR.init("mongodb://localhost:27017/testdb");
    let authors = await MQR.filter({
        collection: "Author",
        limit: 2,
        skip:20,
        sort:{
            firstName:1
        }
        fields: [
            "_id",
            "firstName",
            "lastName",
            "age",
            "phone",
            "email",
            {
                field: "type",
                value: "Author",
                resolve: false
            },
            {
                field: "stores",
                value: "books.$.store",
                makeUnique: true,
                uniqBy: "name"
            },
            {
                field: "books",
                value: "books.$.title"
            }
        ],
        include: {
            books: {
                relation: "hasAndBelongsToMany",
                collection: "Book",
                foreignKey: "authorId",
                relationKey: "bookId",
                through: "AuthorBook",
                scope: {
                    include: {
                        store: {
                            relation: "belongsTo",
                            collection: "Store",
                            foreignKey: "storeId",
                            scope: {
                                fields: [
                                    "name",
                                    {
                                        field: "Street Address",
                                        value: "address"
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        }
    });
    console.log(authors);
})();
```
Output
```json
[
  {
    "_id": 16,
    "firstName": "Aiden",
    "lastName": "Lebsack",
    "age": 32,
    "phone": "1-913-163-0599",
    "email": "Lester15@yahoo.com",
    "type": "Author",
    "stores": [
      {
        "name": "Purdy Inc",
        "Street Address": "97735 Klein Plain"
      },
      {
        "name": "Boyle, Wintheiser and Runte",
        "Street Address": "8992 Rosalia Trail"
      },
      {
        "name": "Considine and Sons",
        "Street Address": "0716 Crist Dam"
      }
    ],
    "books": [
      "Internal Paradigm Administrator",
      "Direct Marketing Analyst",
      "Forward Optimization Orchestrator"
    ]
  },
  {
    "_id": 304,
    "firstName": "Aiden",
    "lastName": "Muller",
    "age": 59,
    "phone": "1-889-908-6466",
    "email": "Santino71@gmail.com",
    "type": "Author",
    "stores": [
      {
        "name": "O'Reilly - Leannon",
        "Street Address": "154 MacGyver Crossing"
      },
      {
        "name": "Gutmann, Weissnat and Heidenreich",
        "Street Address": "138 Brennon Shores"
      },
      {
        "name": "Considine and Sons",
        "Street Address": "0716 Crist Dam"
      },
      {
        "name": "Toy, McClure and Konopelski",
        "Street Address": "4174 Reynolds Greens"
      }
    ],
    "books": [
      "Lead Solutions Engineer",
      "Lead Branding Engineer",
      "International Metrics Designer",
      "Human Division Consultant"
    ]
  }
]
```


License
----

ISC


**Free Software, Hell Yeah!**
