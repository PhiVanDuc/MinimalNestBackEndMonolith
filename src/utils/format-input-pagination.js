const defaultPagination = {
    defaultPage: 1,
    defaultLimit: 20,
    maxLimit: 100
}

module.exports = (page, limit) => {
    let formatPage = Number(page);
    let formatLimit = Number(limit);

    if (!Number.isInteger(formatPage) || formatPage <= 0) formatPage = defaultPagination.defaultPage;
    if (!Number.isInteger(formatLimit) || formatLimit <= 0) formatLimit = defaultPagination.defaultLimit;
    if (formatLimit > defaultPagination.maxLimit) formatLimit = defaultPagination.maxLimit;

    return { page: formatPage, limit: formatLimit };
}