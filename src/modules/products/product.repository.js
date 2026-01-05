const { Product, ProductCategory, ProductColor } = require("../../db/models/index");

const createBaseRepository = require("../base/base.repository");
const baseRepository = createBaseRepository(Product);

module.exports = {
    ...baseRepository,

    createCategoriesToProduct: async ({ productId, categories, options = {} } = {}) => {
        const records = categories.map(category => ({ product_id: productId, category_id: category.id }));
        return ProductCategory.bulkCreate(records, options);
    },

    createColorsToProduct: async ({ productId, colors, options = {} } = {}) => {
        const records = colors.map(color => ({ product_id: productId, color_id: color.id }));
        return ProductColor.bulkCreate(records, options);
    }
}