
interface BelongsTo {
    relation: "belongsTo",
    collection: string,
    foreignKey: string,
    primaryKey?: string
}
interface HasOne {
    relation: "hasOne",
    collection: string,
    foreignKey: string,
    primaryKey?: string
}
interface HasMany {
    relation: "hasMany",
    collection: string,
    foreignKey: string,
    primaryKey?: string
}

interface HasAndBelongsToMany {
    relation: "hasAndBelongsToMany",
    collection: string,
    foreignKey: string,
    primaryKey?: string,
    relationPrimaryKey?: string,
    relationKey: string,
    through: string,
    throughScope?: Omit<Filter, "collection">
}
interface ReferencesMany {
    relation: "referencesMany",
    collection: string,
    foreignKey: string,
    primaryKey?: string
}

export default interface Filter {
    collection: string,
    where?: {
        [key: string]: any
    },
    exclude?: string[],
    includeRemainingFields?: boolean,
    fields?: (string | { field: string, value: string, resolve?: boolean, makeUnique?: boolean, uniqBy?: string })[],
    limit?: number,
    skip?: number,
    sort?: {
        [key: string]: 1 | -1
    },
    include?: {
        [key: string]: (BelongsTo | HasOne | HasMany | HasAndBelongsToMany | ReferencesMany) & {
            scope?: Omit<Filter, "collection">
        }
    }
}
