
interface BelongsTo {
    relation: "belongsTo",
    collection: string,
    foreignKey: string
}
interface HasMany {
    relation: "hasMany",
    collection: string,
    foreignKey: string
}

interface HasAndBelongsToMany {
    relation: "hasAndBelongsToMany",
    collection: string,
    foreignKey: string,
    relationKey: string,
    through: string,
    throughScope?: Omit<Filter, "collection">
}
interface ReferencesMany {
    relation: "referencesMany",
    collection: string,
    foreignKey: string
}

export default interface Filter {
    collection: string,
    where?: {
        [key: string]: any
    },
    fields?: (string | { field: string, value: string, resolve?: boolean, makeUnique?: boolean, uniqBy?: string })[],
    limit?: number,
    skip?: number,
    sort?: {
        [key: string]: 1 | -1
    },
    include?: {
        [key: string]: (BelongsTo | HasMany | HasAndBelongsToMany | ReferencesMany) & {
            scope?: Omit<Filter, "collection">
        }
    }
}
