const authRepository = require("./auth.repository");
const { sequelize } = require("../../db/models/index");

const bcrypt = require("bcrypt");
const moment = require("moment");

const { signJwtToken } = require("../../libs/jwt");
const sendEmail = require("../../libs/email/sendEmail");
const createHttpError = require("../../utils/create-http-error");
const tokenTypesConst = require("../../consts/token-types.const");
const generateRandomToken = require("../../utils/generate-random-token");
const emailTemplatesConst = require("../../consts/email-templates.const");

const SALT_ROUNDS = 10;
const VERIFY_EMAIL_TOKEN_EXPIRES_IN = 15;

module.exports = {
    signUp: async (data) => {
        const transaction = await sequelize.transaction();

        try {
            const account = await authRepository.findAccountByEmail({ email: data.email });
            if (account) createHttpError(409, "Email đã được đăng ký!");

            const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
            const authToken = generateRandomToken();
            const authTokenExpiredAt = moment().add(VERIFY_EMAIL_TOKEN_EXPIRES_IN, 'minutes').toDate();

            await authRepository.createAccount(
                {
                    username: data.username,
                    email: data.email,
                    password: hashedPassword,
                    provider: data.provider,
                    token: authToken,
                    tokenType: tokenTypesConst.VERIFY_EMAIL,
                    tokenExpiredAt: authTokenExpiredAt
                },
                { transaction: transaction }
            );

            await sendEmail(
                emailTemplatesConst.VERIFICATION_EMAIL,
                data.email,
                {
                    username: data.username,
                    authToken
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
            const account = await authRepository.findAccountByToken({
                token: data.token,
                tokenType: tokenTypesConst.VERIFY_EMAIL
            });

            if (!account) createHttpError(400, "Liên kết xác minh email không hợp lệ!");

            const tokenExpiredAtUTC = moment(account.token_expired_at).utc();
            const nowUTC = moment().utc();

            if (nowUTC.isAfter(tokenExpiredAtUTC)) createHttpError(400, "Liên kết xác minh email đã hết hạn!");

            await authRepository.verifyAccount(
                { id: account.id },
                { transaction: transaction }
            );

            await authRepository.clearAccountToken(
                { id: account.id },
                { transaction: transaction }
            );

            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    sendAuthEmail: async (data) => {
        const transaction = await sequelize.transaction();

        try {
            const account = await authRepository.findAccountByEmail({ email: data.email });

            if (!account) createHttpError(404, "Email chưa được đăng ký!");
            if (account.is_verified) createHttpError(409, "Email đã được xác minh!");

            const authToken = generateRandomToken();
            const authTokenExpiredAt = moment().add(VERIFY_EMAIL_TOKEN_EXPIRES_IN, 'minutes').toDate();

            await authRepository.updateAccountToken(
                {
                    token: authToken,
                    tokenType: data.tokenType,
                    tokenExpiredAt: authTokenExpiredAt
                },
                { id: account.id },
                { transaction: transaction }
            );

            await sendEmail(
                data.emailTemplate,
                data.email,
                {
                    username: account.username,
                    authToken
                }
            );

            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    signIn: async (data) => {
        try {
            const account = await authRepository.findAccountByEmail({ email: data.email });

            if (!account) createHttpError(401, "Email hoặc mật khẩu không đúng!");
            if (!account.is_verified) createHttpError(401, "Email chưa được xác minh!");

            const isPasswordValid = await bcrypt.compare(data.password, account.password);
            if (!isPasswordValid) createHttpError(401, "Email hoặc mật khẩu không đúng!");

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
    },

    resetPassword: async (data) => { }
};