const { Account } = require("../../db/models/index");

module.exports = {
    findAccountById: async (id) => {
        return Account.findByPk(id);
    },

    findAccountByEmail: async (email) => {
        return Account.findOne({ where: { email } });
    },

    findAccountByToken: async ({ token, tokenType } = {}) => {
        return Account.findOne({ where: { token, token_type: tokenType } });
    },

    createAccount: async ({ data, options = {} } = {}) => {
        return Account.create(data, options);
    },

    updateAccount: async ({ id, data, options = {} } = {}) => {
        return Account.update(
            data,
            {
                where: { id },
                returning: true,
                ...options
            }
        );
    },
}