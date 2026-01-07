const { Account } = require("../../db/models/index");
const { Op } = require("sequelize");

const createBaseRepository = require("../base/base.repository");
const baseRepository = createBaseRepository(Account);

module.exports = {
    ...baseRepository,

    paginateAccounts: async ({ page, limit, filter, options = {} } = {}) => {
        const whereConfig = {
            username: (value) => {
                return {
                    [Op.iLike]: `%${value}%`
                }
            },
            rank: (value) => {
                return {
                    [Op.iLike]: `%${value}%`
                }
            }
        }

        return baseRepository.findAndCountAll({ page, limit, filter, whereConfig, options });
    }
}