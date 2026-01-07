const { Product } = require("../../../db/models/index");

const createBaseRepository = require("../../base/base.repository");
const baseRepository = createBaseRepository(Product);

module.exports = {
    ...baseRepository,
}