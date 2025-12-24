const { Account } = require("../../db/models/index");

module.exports = {
    findAccountById: async ({ id, options = {} } = {}) => {
        return Account.findByPk(id, options);
    },

    findAccountByEmail: async ({ email, options = {} } = {}) => {
        return Account.findOne({
            where: { email },
            ...options
        });
    },

    findAccountByToken: async ({ token, tokenType, options = {} } = {}) => {
        return Account.findOne({
            where: {
                token,
                token_type: tokenType
            },
            ...options
        });
    },

    createAccount: async ({ data, options = {} } = {}) => {
        return Account.create(data, options);
    },

    updateAccount: async ({ id, data, options = {} } = {}) => {
        return Account.update(
            data,
            {
                where: { id },
                ...options
            }
        );
    },
}