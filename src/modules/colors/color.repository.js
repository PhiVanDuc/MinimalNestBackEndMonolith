const { Op } = require("sequelize");
const { Color } = require("../../db/models/index");

const createBaseRepository = require("../base/base.repository");
const baseRepository = createBaseRepository(Color);

module.exports = {
    ...baseRepository,

    paginateColors: async ({ page, limit, filter, options = {} } = {}) => {
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