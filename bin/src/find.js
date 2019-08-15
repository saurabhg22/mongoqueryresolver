System.register(["lodash"], function (exports_1, context_1) {
    "use strict";
    var __assign = (this && this.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
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
    var _this, _, validatePath, arrayMapper, find;
    _this = this;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (_1) {
                _ = _1;
            }
        ],
        execute: function () {
            validatePath = function (path) {
                if (path.indexOf(".$.") === 0 || path.indexOf(".") === 0) {
                    throw new Error("Invalid field " + path);
                }
            };
            arrayMapper = function (path, data) {
                validatePath(path);
                if (path.indexOf(".$.") === -1) {
                    return data[path];
                }
                var key = path.slice(0, path.indexOf(".$."));
                var values = data[key] || [];
                path = path.slice(path.indexOf(".$.") + 3);
                if (path) {
                    var subValues = [];
                    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                        var value = values_1[_i];
                        var subValue = arrayMapper(path, value);
                        if (_.isArray(subValue)) {
                            subValues.push.apply(subValues, subValue);
                        }
                        else {
                            subValues.push(subValue);
                        }
                    }
                    values = subValues;
                }
                return values;
            };
            find = function (db, filter) { return __awaiter(_this, void 0, void 0, function () {
                var collection, projection, _i, _a, field, cursor, results, _b, _c, _d, field, relation, index, instance, _e, _f, _g, throughInstances, _h, _j, _k, _l, _m, _o, formatedResults, index, formatedResult, _p, _q, field;
                var _r, _s;
                return __generator(this, function (_t) {
                    switch (_t.label) {
                        case 0:
                            collection = db.collection(filter.collection);
                            if (filter.fields) {
                                for (_i = 0, _a = filter.fields; _i < _a.length; _i++) {
                                    field = _a[_i];
                                    projection = projection || {};
                                    if (typeof field === "string") {
                                        validatePath(field);
                                        projection[field] = 1;
                                    }
                                    else if (!field.value.includes('$') && !!!field.resolve) {
                                        validatePath(field.value);
                                        projection[field.value] = 1;
                                    }
                                    else {
                                        validatePath(field.value);
                                    }
                                }
                            }
                            cursor = collection.find(filter.where, { projection: projection, limit: filter.limit, sort: filter.sort, skip: filter.skip });
                            return [4, cursor.toArray()];
                        case 1:
                            results = _t.sent();
                            if (!filter.include) return [3, 16];
                            _b = [];
                            for (_c in filter.include)
                                _b.push(_c);
                            _d = 0;
                            _t.label = 2;
                        case 2:
                            if (!(_d < _b.length)) return [3, 16];
                            field = _b[_d];
                            relation = filter.include[field];
                            index = 0;
                            _t.label = 3;
                        case 3:
                            if (!(index < results.length)) return [3, 15];
                            instance = results[index];
                            _e = relation.relation;
                            switch (_e) {
                                case "belongsTo": return [3, 4];
                                case "hasAndBelongsToMany": return [3, 6];
                                case "hasMany": return [3, 9];
                                case "referencesMany": return [3, 11];
                            }
                            return [3, 13];
                        case 4:
                            _f = instance;
                            _g = field;
                            return [4, find(db, __assign({}, relation.scope, { collection: relation.collection, where: { _id: instance[relation.foreignKey] } }))];
                        case 5:
                            _f[_g] = (_t.sent())[0];
                            return [3, 14];
                        case 6: return [4, find(db, __assign({}, relation.throughScope, { collection: relation.through, where: __assign({}, _.get(relation, "throughScope.where"), (_r = {}, _r[relation.foreignKey] = instance._id, _r)), fields: ["_id", relation.relationKey] }))];
                        case 7:
                            throughInstances = _t.sent();
                            _h = instance;
                            _j = field;
                            return [4, find(db, __assign({}, relation.scope, { collection: relation.collection, where: { _id: { $in: _.map(throughInstances, relation.relationKey) } } }))];
                        case 8:
                            _h[_j] = _t.sent();
                            return [3, 14];
                        case 9:
                            _k = instance;
                            _l = field;
                            return [4, find(db, __assign({}, relation.scope, { collection: relation.collection, where: (_s = {}, _s[relation.foreignKey] = instance._id, _s) }))];
                        case 10:
                            _k[_l] = _t.sent();
                            return [3, 14];
                        case 11:
                            _m = instance;
                            _o = field;
                            return [4, find(db, __assign({}, relation.scope, { collection: relation.collection, where: { _id: { $in: instance[relation.foreignKey] } } }))];
                        case 12:
                            _m[_o] = _t.sent();
                            _t.label = 13;
                        case 13: return [3, 14];
                        case 14:
                            index++;
                            return [3, 3];
                        case 15:
                            _d++;
                            return [3, 2];
                        case 16:
                            if (filter.fields) {
                                formatedResults = [];
                                for (index = 0; index < results.length; index++) {
                                    formatedResult = {};
                                    for (_p = 0, _q = filter.fields; _p < _q.length; _p++) {
                                        field = _q[_p];
                                        if (typeof field == "string") {
                                            formatedResult[field] = results[index][field];
                                        }
                                        else if (!field.resolve && typeof field.resolve !== 'undefined') {
                                            formatedResult[field.field] = field.value;
                                        }
                                        else if (!field.value.includes('$')) {
                                            formatedResult[field.field] = _.get(results[index], field.value);
                                        }
                                        else {
                                            formatedResult[field.field] = arrayMapper(field.value, results[index]);
                                            if (field.makeUnique) {
                                                if (_.isObject(formatedResult[field.field][0])) {
                                                    formatedResult[field.field] = _.uniqBy(formatedResult[field.field], field.uniqBy || '_id');
                                                }
                                                else {
                                                    formatedResult[field.field] = _.uniq(formatedResult[field.field]);
                                                }
                                            }
                                        }
                                    }
                                    formatedResults.push(formatedResult);
                                }
                                results = formatedResults;
                            }
                            return [2, results];
                    }
                });
            }); };
            exports_1("default", find);
        }
    };
});
//# sourceMappingURL=find.js.map