const { Category } = require("../../db/models/index");
const { Op } = require("sequelize");

const createBaseRepository = require("../base/base.repository");
const baseRepository = createBaseRepository(Category);

module.exports = {
    ...baseRepository,

    findCategories: async ({ page, limit, filter, options = {} } = {}) => {
        const whereConfig = {
            name: (value) => {
                return {
                    [Op.iLike]: `%${value}%`
                }
            }
        }

        return baseRepository.findAll({ page, limit, filter, whereConfig, options });
    }
}