const { ProductCategory } = require("../../../db/models/index");

const createBaseRepository = require("../../base/base.repository");
const baseRepository = createBaseRepository(ProductCategory);

module.exports = {
    ...baseRepository,

    addCategoriesToProduct: async ({ productId, categories, options = {} } = {}) => {
        const records = categories.map(category => ({ product_id: productId, category_id: category.id }));
        return ProductCategory.bulkCreate(records, options);
    }
}