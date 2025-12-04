const authRepository = require("./auth.repository");
const { sequelize } = require("../../db/models/index");

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const moment = require('moment');
const sendEmail = require("../../libs/email/sendEmail");
const { signJwtToken } = require("../../libs/jwt");

const SALT_ROUNDS = 10;
const VERIFICATION_EMAIL_TOKEN_EXPIRES_IN = 15;

module.exports = {
    signUp: async (data) => {
        const transaction = await sequelize.transaction();

        try {
            const account = await authRepository.findAccountByEmail(data.email);
            if (account) {
                const error = new Error("Email đã được đăng ký!");
                error.status = 409;
                throw error;
            }

            const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
            const verificationEmailToken = crypto.randomBytes(32).toString('hex');
            const verificationEmailTokenExpiredAt = moment().add(VERIFICATION_EMAIL_TOKEN_EXPIRES_IN, 'minutes').toDate();

            await authRepository.createAccount(
                {
                    username: data.username,
                    email: data.email,
                    password: hashedPassword,
                    type: data.type,
                    token: verificationEmailToken,
                    token_expired_at: verificationEmailTokenExpiredAt

                },
                { transaction: transaction }
            );

            await sendEmail(
                "verificationEmailToken",
                "phivanduc325@gmail.com",
                {
                    username: data.username,
                    verificationEmailToken
                }
            );

            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    verifyEmail: async (data) => {
        const transaction = await sequelize.transaction();

        try {
            const account = await authRepository.findAccountByToken(data.token);
            if (!account) {
                const error = new Error("Liên kết xác thực không hợp lệ!");
                error.status = 400;
                throw error;
            }

            const tokenExpiredAtUTC = moment(account.token_expired_at).utc();
            const nowUTC = moment().utc();

            if (nowUTC.isAfter(tokenExpiredAtUTC)) {
                const error = new Error("Liên kết xác thực đã hết hạn!");
                error.status = 400;
                throw error;
            }

            await authRepository.verifyAccount(account.id, { transaction: transaction });
            await authRepository.clearAccountToken(account.id, { transaction: transaction });

            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    signIn: async (data) => {
        try {
            const account = await authRepository.findAccountByEmail(data.email);
            if (!account) {
                const error = new Error("Email hoặc mật khẩu không đúng!");
                error.status = 401;
                throw error;
            }

            const isPasswordValid = await bcrypt.compare(data.password, account.password);
            if (!isPasswordValid) {
                const error = new Error("Email hoặc mật khẩu không đúng!");
                error.status = 401;
                throw error;
            }

            if (!account.is_verified) {
                const error = new Error("Tài khoản của bạn chưa được xác thực!");
                error.status = 401;
                throw error;
            }

            const accessToken = signJwtToken({
                id: account.id,
                username: account.username,
                email: account.email,
                rank: account.rank,
                role: account.role,
                type: account.type
            }, "5s");

            const refreshToken = signJwtToken({
                id: account.id
            }, "1h");

            return { accessToken, refreshToken };
        }
        catch (error) { throw error; }
    }
};