const { ProductCategory } = require("../../../db/models/index");

const createBaseRepository = require("../../base/base.repository");
const baseRepository = createBaseRepository(ProductCategory);

module.exports = {
    ...baseRepository,

    addCategoriesToProduct: async ({ productId, categories, options = {} } = {}) => {
        const records = categories.map(category => ({ productId: productId, categoryId: category.id }));
        return ProductCategory.bulkCreate(records, options);
    }
}