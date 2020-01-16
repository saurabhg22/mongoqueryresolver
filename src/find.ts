
import Filter from './filter';
import { Db } from 'mongodb';
import * as _ from 'lodash';

const validatePath = (path: string) => {

    if (path.indexOf(`.$.`) === 0 || path.indexOf(`.`) === 0) {
        throw new Error(`Invalid field ${path}`);
    }
}
const arrayMapper = (path: string, data: { [key: string]: any }): any[] => {

    validatePath(path);

    if (path.indexOf(`.$.`) === -1) {
        return data[path];
    }
    let key = path.slice(0, path.indexOf(`.$.`));

    let values: any[] = data[key] || [];

    path = path.slice(path.indexOf(`.$.`) + 3);

    if (path) {
        let subValues: any[] = [];
        for (let value of values) {
            let subValue = arrayMapper(path, value);
            if (_.isArray(subValue)) {
                subValues.push(...subValue);
            }
            else {
                subValues.push(subValue);
            }
        }
        values = subValues;
    }

    return values;
}

const find = async (db: Db, filter: Filter): Promise<any[]> => {

    let collection = db.collection(filter.collection);
    let projection: { [key: string]: 1 };
    if (filter.fields) {
        for (let field of filter.fields) {
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

    let cursor = collection.find(filter.where, { projection, limit: filter.limit, sort: filter.sort, skip: filter.skip });


    let results = await cursor.toArray();
    if (filter.include) {
        for (let field in filter.include) {
            let relation = filter.include[field];
            for (let index = 0; index < results.length; index++) {
                let instance = results[index];
                switch (relation.relation) {
                    case "belongsTo":
                        instance[field] = (await find(db, {
                            ...relation.scope,
                            collection: relation.collection,
                            where: { [relation.primaryKey || '_id']: instance[relation.foreignKey] }
                        }))[0];
                        break;
                    case "hasAndBelongsToMany":
                        let throughInstances = await find(db, {
                            ...relation.throughScope,
                            collection: relation.through,
                            where: {
                                ..._.get(relation, "throughScope.where"),
                                [relation.foreignKey]: instance[relation.primaryKey || '_id']
                            },
                            fields: ["_id", relation.relationKey]
                        });

                        instance[field] = await find(db, {
                            ...relation.scope,
                            collection: relation.collection,
                            where: { [relation.relationPrimaryKey || '_id']: { $in: _.map(throughInstances, relation.relationKey) } }
                        })
                        break;
                    case "hasOne":
                        instance[field] = (await find(db, {
                            ...relation.scope,
                            collection: relation.collection,
                            where: { [relation.foreignKey]: instance[relation.primaryKey || '_id'] }
                        }))[0];
                        break;
                    case "hasMany":
                        instance[field] = await find(db, {
                            ...relation.scope,
                            collection: relation.collection,
                            where: { [relation.foreignKey]: instance[relation.primaryKey || '_id'] }
                        });
                        break;
                    case "referencesMany":
                        instance[field] = await find(db, {
                            ...relation.scope,
                            collection: relation.collection,
                            where: { [relation.primaryKey || '_id']: { $in: instance[relation.foreignKey] || [] } }
                        });
                    default:
                        break;
                }
            }

        }
    }
    if (filter.fields) {
        let formatedResults = [];
        for (let index in results) {
            let formatedResult: { [key: string]: any } = filter.includeRemainingFields ? results[index] : {};
            for (let field of filter.fields) {
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
    if (filter.exclude) {
        for (let index in results) {
            for (let excludeField of filter.exclude) {
                results[index] = removeField(results[index], excludeField);
            }
        }
    }

    return results;
}

const removeField = (data: { [key: string]: any }, field: string) => {
    if (typeof data !== 'object') return data;
    let _data = Object.assign({}, data);
    if (_data[field]) {
        delete _data[field];
    }
    else if (field.includes('.')) {
        const dotAt = field.indexOf('.');
        const key = field.slice(0, dotAt);
        if (_data[key]) {
            if (Array.isArray(_data[key])) {
                _data[key] = _.map(_data[key], value => removeField(value, field.slice(dotAt + 1)));
            }
            else {
                _data[key] = removeField(_data[key], field.slice(dotAt + 1));
            }
        }
    }
    return _data;
}

export default find;