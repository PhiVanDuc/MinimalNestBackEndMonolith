module.exports = (str) => {
    return /^[1-9]\d*$/.test(str.replace(/\./g, ""));
}