const { Account } = require("../../db/models/index");

const createBaseRepository = require("../base/base.repository");
const baseRepository = createBaseRepository(Account);

module.exports = {
    ...baseRepository,

    findAccountByEmail: async ({ email, options = {} } = {}) => {
        return Account.findOne({
            where: { email },
            ...options
        });
    },

    findAccountByToken: async ({ token, tokenType, options = {} } = {}) => {
        return Account.findOne({
            where: { token, tokenType },
            ...options
        });
    },
}