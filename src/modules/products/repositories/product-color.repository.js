const { ProductColor } = require("../../../db/models/index");

const createBaseRepository = require("../../base/base.repository");
const baseRepository = createBaseRepository(ProductColor);

module.exports = {
    ...baseRepository,
    
    addColorsToProduct: async ({ productId, colors, options = {} } = {}) => {
        const records = colors.map(color => ({ product_id: productId, color_id: color.id }));
        return ProductColor.bulkCreate(records, options);
    }
}