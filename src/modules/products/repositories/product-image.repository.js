const { ProductImage } = require("../../../db/models/index");

const createBaseRepository = require("../../base/base.repository");
const baseRepository = createBaseRepository(ProductImage);

module.exports = {
    ...baseRepository,
    
    addProductImages: async ({ data, options = {} } = {}) => {
        return ProductImage.bulkCreate(data, options);
    }
}