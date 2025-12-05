const { Account } = require("../../db/models/index");

module.exports = {
    findAccountByEmail: async (conditionData) => {
        return await Account.findOne(
            {
                where: {
                    email: conditionData.email
                }
            }
        );
    },

    createAccount: async (data, options) => {
        await Account.create(
            {
                username: data.username,
                email: data.email,
                password: data.password,
                provider: data.provider,
                token: data.token,
                token_type: data.tokenType,
                token_expired_at: data.tokenExpiredAt
            },
            { ...options }
        );
    },

    findAccountByToken: async (conditionData) => {
        return await Account.findOne(
            {
                where: {
                    token: conditionData.token,
                    token_type: conditionData.tokenType
                }
            }
        );
    },

    updateAccountToken: async (data, conditionData, options) => {
        await Account.update(
            {
                token: data.token,
                token_type: data.tokenType,
                token_expired_at: data.tokenExpiredAt
            },
            {
                where: {
                    id: conditionData.id
                },
                ...options
            }
        )
    },

    verifyAccount: async (conditionData, options) => {
        await Account.update(
            {
                is_verified: true
            },
            {
                where: {
                    id: conditionData.id
                },
                ...options
            }
        );
    },

    clearAccountToken: async (conditionData, options) => {
        await Account.update(
            {
                token: null,
                token_type: null,
                token_expired_at: null
            },
            {
                where: {
                    id: conditionData.id
                },
                ...options
            }
        );
    },

    updateAccountPassword: async (data, conditionData, options) => {
        await Account.update(
            {
                password: data.password
            },
            {
                where: {
                    id: conditionData.id
                },
                ...options
            }
        );
    }
}