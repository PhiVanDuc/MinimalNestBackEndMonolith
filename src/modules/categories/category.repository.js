const { Op } = require("sequelize");
const { Category } = require("../../db/models/index");

const createBaseRepository = require("../base/base.repository");
const baseRepository = createBaseRepository(Category);

module.exports = {
    ...baseRepository,

    paginateCategories: async ({ page, limit, filter, options = {} } = {}) => {
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