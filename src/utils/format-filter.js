module.exports = (searchParams, filterWhitelist) => {
    const filterBase = searchParams;

    return Object.keys(filterBase).reduce((acc, key) => {
        if (filterWhitelist.includes(key)) {
            const value = filterBase[key];

            if (value) {
                const decodeValue = decodeURIComponent(value);
                if (decodeValue.includes(',')) acc[key] = decodeValue.split(',').map(item => item.trim()).filter(item => item);
                else acc[key] = decodeValue.trim();
            }
        }

        return acc;
    }, {});
}