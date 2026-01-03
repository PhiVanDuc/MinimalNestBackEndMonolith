const deepTrim = require("deep-trim");

module.exports = (req, res, next) => {
    if (req.params) req.params = deepTrim(req.params);
    if (req.body) req.body = deepTrim(req.body);
    if (req.query) req.query = deepTrim(req.query);

    next();
};
