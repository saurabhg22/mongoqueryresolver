import * as QueryResolver from '../src/index';
import * as chai from 'chai';
import * as faker from 'faker';
import * as chaiAsPromised from 'chai-as-promised';
import { Db } from 'mongodb';


chai.use(chaiAsPromised);
chai.should();

const TAGS_LENGTH = 100;
const AUTHORS_LENGTH = 1000;
const BOOKS_LENGTH = 2000;
const AUTHOR_BOOKS_LENGTH = 3000;
const STORES_LENGTH = 10;

describe('init', function () {
    it('should fail with wrong uri', async function () {
        await QueryResolver.init("mongdb://localhost:27017/testdb").should.be.rejected;
    });
    it('should pass with correct uri', async function () {
        await QueryResolver.init("mongodb://localhost:27017/testdb").should.be.fulfilled;
    });
});


describe('find', function () {
    let db: Db;
    this.beforeAll(async () => {
        db = await QueryResolver.init("mongodb://localhost:27017/testdb");
        let tags = Array.from(new Array(TAGS_LENGTH).keys()).map((index) => {
            let tag = {
                name: faker.name.jobTitle(),
                _id: index,
                authorIds: Array.from(new Array(faker.random.number({ min: 0, max: 10 })).keys()).map(() => faker.random.number({ min: 0, max: AUTHORS_LENGTH - 1 }))
            }
            return tag;
        });
        let authors = Array.from(new Array(AUTHORS_LENGTH).keys()).map((index) => {
            let author = {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                _id: index,
                age: faker.random.number({ min: 5, max: 90 }),
                phone: faker.phone.phoneNumberFormat(2),
                email: faker.internet.email()
            }
            return author;
        });

        let books = Array.from(new Array(BOOKS_LENGTH).keys()).map((index) => {
            let book = {
                title: faker.name.title(),
                _id: index,
                description: faker.lorem.paragraph(),
                rating: faker.random.number({ min: 1, max: 10 }),
                publishedDate: faker.date.past(),
                storeId: faker.random.number({ min: 0, max: STORES_LENGTH - 1 })
            }
            return book;
        });
        let authorBooks = Array.from(new Array(AUTHOR_BOOKS_LENGTH).keys()).map((index) => {
            let authorBook = {
                authorId: faker.random.number({ min: 0, max: AUTHORS_LENGTH - 1 }),
                bookId: faker.random.number({ min: 0, max: BOOKS_LENGTH - 1 }),
                _id: index
            }
            return authorBook;
        });

        let stores = Array.from(new Array(STORES_LENGTH).keys()).map((index) => {
            let store = {
                name: faker.company.companyName(),
                _id: index,
                address: faker.address.streetAddress(),
                zipCode: faker.address.zipCode()
            }
            return store;
        });
        await db.collection("Author").insertMany(authors);
        await db.collection("Book").insertMany(books);
        await db.collection("AuthorBook").insertMany(authorBooks);
        await db.collection("Store").insertMany(stores);
        await db.collection("Tag").insertMany(tags);
    })
    this.afterAll(async () => {
        db.dropDatabase();
    })

    it('should give an array of length 3', async function () {

        let results = await QueryResolver.filter({
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

        // console.log("results:", JSON.stringify(results));
        results.should.be.an('array').of.length(3);
        results[0].should.have.keys("firstName", "Age");

    });



    it('should return with name test3', async function () {

        let results = await QueryResolver.filter({
            collection: "Author",
            where: {
                _id: 2
            }
        });

        // console.log("results:", JSON.stringify(results));
        results[0]._id.should.be.equal(2);
        results[0].should.include.keys("firstName", "age", "lastName");

    });

    it('should include storeName and authors', async function () {

        let results = await QueryResolver.filter({
            collection: "Book",
            limit: 20,
            fields: [
                "title",
                "storeId",
                "authors",
                {
                    field: "storeName",
                    value: "store.name"
                }
            ],
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
                },
                authors: {
                    relation: "hasAndBelongsToMany",
                    collection: "Author",
                    foreignKey: "bookId",
                    relationKey: "authorId",
                    through: "AuthorBook"
                }
            }
        });
        // console.log("results:", JSON.stringify(results));
        results[0].should.have.keys("title", "storeId", "authors", "storeName");
    });


    it('should include books and stores', async function () {

        let results = await QueryResolver.filter({
            collection: "Author",
            limit: 20,
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
        // console.log("results:", JSON.stringify(results));
        results[0].should.have.keys(["_id", "firstName", "lastName", "age", "phone", "email", "type", "stores", "books"]);
    });


    it('should include books', async function () {

        let results = await QueryResolver.filter({
            collection: "Store",
            limit: 5,
            fields: [
                "name",
                "address",
                "_id",
                {
                    field: "books",
                    value: "books.$.title"
                },
                {
                    field: "authors",
                    value: "books.$.authors"
                }
            ],
            include: {
                books: {
                    relation: "hasMany",
                    collection: "Book",
                    foreignKey: "storeId",
                    scope: {
                        fields: [
                            "title",
                            {
                                field: "authors",
                                value: "authors.$.firstName"
                            }
                        ],
                        limit: 10,
                        include: {
                            authors: {
                                relation: "hasAndBelongsToMany",
                                collection: "Author",
                                foreignKey: "bookId",
                                relationKey: "authorId",
                                through: "AuthorBook",
                                scope: {
                                    fields: ['firstName']
                                }
                            }
                        }
                    }
                }
            }
        });
        // console.log("results:", JSON.stringify(results));
        results[0].should.have.keys("name", "address", "_id", "books", "authors");
    });
    
    it('should include authors', async function () {

        let results = await QueryResolver.filter({
            collection: "Tag",
            limit: 5,
            fields: [
                "name",
                "_id",
                "authorIds",
                {
                    field: "authors",
                    value: "authors"
                }
            ],
            include: {
                authors: {
                    relation: "referencesMany",
                    collection: "Author",
                    foreignKey: "authorIds"
                }
            }
        });
        // console.log("results:", JSON.stringify(results));
        results[0].should.have.keys("name", "_id", "authorIds", "authors");
    });

});