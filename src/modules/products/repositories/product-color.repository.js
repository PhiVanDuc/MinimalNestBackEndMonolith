const { ProductColor } = require("../../../db/models/index");

const createBaseRepository = require("../../base/base.repository");
const baseRepository = createBaseRepository(ProductColor);

module.exports = {
    ...baseRepository,
    
    addColorsToProduct: async ({ productId, colors, options = {} } = {}) => {
        const records = colors.map(color => ({ productId: productId, colorId: color.id }));
        return ProductColor.bulkCreate(records, options);
    }
}