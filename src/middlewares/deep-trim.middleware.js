function deepTrim(body) {
    if (typeof body === "string") return body.trim().replace(/\s+/g, " ");
    if (Array.isArray(body)) return body.map(item => deepTrim(item));

    if (body && typeof body === "object") {
        const obj = {};
        for (const key in body) obj[key] = deepTrim(body[key]);

        return obj;
    }

    return body;
}

module.exports = (req, res, next) => {
    if (req.body) req.body = deepTrim(req.body);
    next();
};
