const { Product } = require("../../../db/models/index");

const createBaseRepository = require("../../base/base.repository");
const baseRepository = createBaseRepository(Product);

module.exports = {
    ...baseRepository,

    paginateProducts: async ({ page, limit, filter, options = {} } = {}) => {
        const whereConfig = {
            name: (value) => {
                return {
                    [Op.iLike]: `%${value}%`
                }
            }
        }

        return baseRepository.findAndCountAll({ page, limit, filter, whereConfig, options });
    }
}