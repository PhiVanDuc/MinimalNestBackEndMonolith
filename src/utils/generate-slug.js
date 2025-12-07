const slugify = require('slugify');

module.exports = (string = "") => {
    return slugify(string, {
        lower: true,
        strict: true,
        locale: "vi"
    });
}