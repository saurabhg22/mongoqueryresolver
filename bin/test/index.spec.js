System.register(["../src/index", "chai", "faker", "chai-as-promised"], function (exports_1, context_1) {
    "use strict";
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (this && this.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var QueryResolver, chai, faker, chaiAsPromised, TAGS_LENGTH, AUTHORS_LENGTH, BOOKS_LENGTH, AUTHOR_BOOKS_LENGTH, STORES_LENGTH;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (QueryResolver_1) {
                QueryResolver = QueryResolver_1;
            },
            function (chai_1) {
                chai = chai_1;
            },
            function (faker_1) {
                faker = faker_1;
            },
            function (chaiAsPromised_1) {
                chaiAsPromised = chaiAsPromised_1;
            }
        ],
        execute: function () {
            chai.use(chaiAsPromised);
            chai.should();
            TAGS_LENGTH = 100;
            AUTHORS_LENGTH = 1000;
            BOOKS_LENGTH = 2000;
            AUTHOR_BOOKS_LENGTH = 3000;
            STORES_LENGTH = 10;
            describe('init', function () {
                it('should fail with wrong uri', function () {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, QueryResolver.init("mongdb://localhost:27017/testdb").should.be.rejected];
                                case 1:
                                    _a.sent();
                                    return [2];
                            }
                        });
                    });
                });
                it('should pass with correct uri', function () {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, QueryResolver.init("mongodb://localhost:27017/testdb").should.be.fulfilled];
                                case 1:
                                    _a.sent();
                                    return [2];
                            }
                        });
                    });
                });
            });
            describe('find', function () {
                var _this = this;
                var db;
                this.beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
                    var tags, authors, books, authorBooks, stores;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, QueryResolver.init("mongodb://localhost:27017/testdb")];
                            case 1:
                                db = _a.sent();
                                tags = Array.from(new Array(TAGS_LENGTH).keys()).map(function (index) {
                                    var tag = {
                                        name: faker.name.jobTitle(),
                                        _id: index,
                                        authorIds: Array.from(new Array(faker.random.number({ min: 0, max: 10 })).keys()).map(function () { return faker.random.number({ min: 0, max: AUTHORS_LENGTH - 1 }); })
                                    };
                                    return tag;
                                });
                                authors = Array.from(new Array(AUTHORS_LENGTH).keys()).map(function (index) {
                                    var author = {
                                        firstName: faker.name.firstName(),
                                        lastName: faker.name.lastName(),
                                        _id: index,
                                        age: faker.random.number({ min: 5, max: 90 }),
                                        phone: faker.phone.phoneNumberFormat(2),
                                        email: faker.internet.email()
                                    };
                                    return author;
                                });
                                books = Array.from(new Array(BOOKS_LENGTH).keys()).map(function (index) {
                                    var book = {
                                        title: faker.name.title(),
                                        _id: index,
                                        description: faker.lorem.paragraph(),
                                        rating: faker.random.number({ min: 1, max: 10 }),
                                        publishedDate: faker.date.past(),
                                        storeId: faker.random.number({ min: 0, max: STORES_LENGTH - 1 })
                                    };
                                    return book;
                                });
                                authorBooks = Array.from(new Array(AUTHOR_BOOKS_LENGTH).keys()).map(function (index) {
                                    var authorBook = {
                                        authorId: faker.random.number({ min: 0, max: AUTHORS_LENGTH - 1 }),
                                        bookId: faker.random.number({ min: 0, max: BOOKS_LENGTH - 1 }),
                                        _id: index
                                    };
                                    return authorBook;
                                });
                                stores = Array.from(new Array(STORES_LENGTH).keys()).map(function (index) {
                                    var store = {
                                        name: faker.company.companyName(),
                                        _id: index,
                                        address: faker.address.streetAddress(),
                                        zipCode: faker.address.zipCode()
                                    };
                                    return store;
                                });
                                return [4, db.collection("Author").insertMany(authors)];
                            case 2:
                                _a.sent();
                                return [4, db.collection("Book").insertMany(books)];
                            case 3:
                                _a.sent();
                                return [4, db.collection("AuthorBook").insertMany(authorBooks)];
                            case 4:
                                _a.sent();
                                return [4, db.collection("Store").insertMany(stores)];
                            case 5:
                                _a.sent();
                                return [4, db.collection("Tag").insertMany(tags)];
                            case 6:
                                _a.sent();
                                return [2];
                        }
                    });
                }); });
                this.afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        db.dropDatabase();
                        return [2];
                    });
                }); });
                it('should give an array of length 3', function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var results;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, QueryResolver.filter({
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
                                    })];
                                case 1:
                                    results = _a.sent();
                                    results.should.be.an('array').of.length(3);
                                    results[0].should.have.keys("firstName", "Age");
                                    return [2];
                            }
                        });
                    });
                });
                it('should return with name test3', function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var results;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, QueryResolver.filter({
                                        collection: "Author",
                                        where: {
                                            _id: 2
                                        }
                                    })];
                                case 1:
                                    results = _a.sent();
                                    results[0]._id.should.be.equal(2);
                                    results[0].should.include.keys("firstName", "age", "lastName");
                                    return [2];
                            }
                        });
                    });
                });
                it('should include storeName and authors', function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var results;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, QueryResolver.filter({
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
                                    })];
                                case 1:
                                    results = _a.sent();
                                    results[0].should.have.keys("title", "storeId", "authors", "storeName");
                                    return [2];
                            }
                        });
                    });
                });
                it('should include books and stores', function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var results;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, QueryResolver.filter({
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
                                    })];
                                case 1:
                                    results = _a.sent();
                                    results[0].should.have.keys(["_id", "firstName", "lastName", "age", "phone", "email", "type", "stores", "books"]);
                                    return [2];
                            }
                        });
                    });
                });
                it('should include books', function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var results;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, QueryResolver.filter({
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
                                    })];
                                case 1:
                                    results = _a.sent();
                                    results[0].should.have.keys("name", "address", "_id", "books", "authors");
                                    return [2];
                            }
                        });
                    });
                });
                it('should include authors', function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var results;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, QueryResolver.filter({
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
                                    })];
                                case 1:
                                    results = _a.sent();
                                    results[0].should.have.keys("name", "_id", "authorIds", "authors");
                                    return [2];
                            }
                        });
                    });
                });
            });
        }
    };
});
//# sourceMappingURL=index.spec.js.map