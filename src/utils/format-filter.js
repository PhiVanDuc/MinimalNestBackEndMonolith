module.exports = (params, filterWhitelist) => {
    const filterBase = params;

    return Object.keys(filterBase).reduce((obj, key) => {
        if (filterWhitelist.includes(key)) {
            const value = filterBase[key];

            if (value) {
                const decodeValue = decodeURIComponent(value);
                if (decodeValue.includes(',')) obj[key] = decodeValue.split(',').map(item => item.trim()).filter(item => item);
                else obj[key] = decodeValue.trim();
            }
        }

        return obj;
    }, {});
}