const { Account } = require("../../db/models/index");

module.exports = {
    findAccountByEmail: async (email) => {
        return await Account.findOne({ where: { email: email } });
    },

    findAccountByToken: async (token) => {
        return await Account.findOne({ where: { token: token } });
    },

    createAccount: async (data, options) => {
        await Account.create(data, options);
    },

    verifyAccount: async (id, options) => {
        await Account.update(
            { is_verified: true },
            {
                where: { id: id },
                ...options
            }
        );
    },

    clearAccountToken: async (id, options) => {
        await Account.update(
            {
                token: null,
                token_expired_at: null
            },
            {
                where: { id: id },
                ...options
            }
        );
    }
}