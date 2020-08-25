export const mapper: { [index: string]: object } = {
    list: {
        type: "array",
    },
    set: {
        type: "array",
        uniqueItems: true
    },
    tuple: {
        type: "array"
    },
    map: {
        type: "array",
    }
}