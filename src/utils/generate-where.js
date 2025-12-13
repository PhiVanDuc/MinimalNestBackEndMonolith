module.exports = (filter, configWhere) => {
    if (!filter) return {};
    const where = {};

    Object.keys(configWhere).forEach(key => {
        const value = filter[key];
        const func = configWhere[key];
        const isValidString = typeof value === "string";
        const isValidArray = Array.isArray(value) && value.length > 0;

        if (isValidString || isValidArray) where[key] = func(value);
    });

    return where;
}