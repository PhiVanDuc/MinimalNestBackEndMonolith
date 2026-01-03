const { Account } = require("../../db/models/index");

const createBaseRepository = require("../base/base.repository");
const baseRepository = createBaseRepository(Account);

module.exports = {
    ...baseRepository,

    findByEmail: async ({ email, options = {} } = {}) => {
        return Account.findOne({
            where: { email },
            raw: true,
            nest: true,
            ...options
        });
    },

    findByToken: async ({ token, tokenType, options = {} } = {}) => {
        return Account.findOne({
            where: {
                token,
                token_type: tokenType
            },
            raw: true,
            nest: true,
            ...options
        });
    },
}