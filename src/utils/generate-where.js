module.exports = (filter, whereConfig) => {
    if (!filter) return {};
    const where = {};

    Object.keys(whereConfig).forEach(key => {
        const value = filter[key];
        const func = whereConfig[key];
        const isValidString = typeof value === "string";
        const isValidArray = Array.isArray(value) && value.length > 0;

        if (isValidString || isValidArray) where[key] = func(value);
    });

    return where;
}