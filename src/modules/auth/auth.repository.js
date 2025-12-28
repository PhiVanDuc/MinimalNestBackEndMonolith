const { Account } = require("../../db/models/index");

const createBaseRepository = require("../base/base.repository");
const baseRepository = createBaseRepository(Account);

module.exports = {
    ...baseRepository,

    findByEmail: async ({ email, options = {} } = {}) => {
        return Account.findOne({
            where: { email },
            ...options
        });
    },

    findByToken: async ({ token, tokenType, options = {} } = {}) => {
        return Account.findOne({
            where: {
                token,
                token_type: tokenType
            },
            ...options
        });
    },
}