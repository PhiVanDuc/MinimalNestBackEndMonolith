const authRepository = require("./auth.repository");
const { sequelize } = require("../../db/models/index");

const bcrypt = require("bcrypt");
const moment = require("moment");

const PROVIDERS = require("../../consts/providers");
const sendEmail = require("../../libs/email/sendEmail");
const TOKEN_TYPES = require("../../consts/token-types.const");
const throwHttpError = require("../../utils/throw-http-error");
const { signJWTToken, verifyJWTToken } = require("../../libs/jwt");
const EMAIL_TEMPLATES = require("../../consts/email-templates.const");
const generateRandomToken = require("../../utils/generate-random-token");

const SALT_ROUNDS = 10;
const AUTH_TOKEN_EXPIRES_IN = 15;
const EXCHANGE_TOKEN_EXPIRES_IN = 1;

module.exports = {
    googleSignIn: async (data) => {
        const exchangeToken = generateRandomToken();
        const exchangeTokenExpiredAt = moment().add(EXCHANGE_TOKEN_EXPIRES_IN, 'minutes').toDate();

        const account = await authRepository.findAccountByEmail({ email: data.email });

        if (account) {
            if (account.provider !== "google") throwHttpError(409, "Email này đã được đăng ký theo hình thức email và mật khẩu!");
            
            await authRepository.update({
                id: account.id,
                data: {
                    token: exchangeToken,
                    tokenType: TOKEN_TYPES.EXCHANGE_GOOGLE,
                    tokenExpiredAt: exchangeTokenExpiredAt
                }
            });

            return exchangeToken;
        }
        else {
            await authRepository.create({
                data: {
                    username: data.username,
                    email: data.email,
                    provider: PROVIDERS.GOOGLE,
                    token: exchangeToken,
                    tokenType: TOKEN_TYPES.EXCHANGE_GOOGLE,
                    tokenExpiredAt: exchangeTokenExpiredAt,
                    isVerified: true
                }
            });

            return exchangeToken;
        }
    },

    googleExchange: async (data) => {
        const account = await authRepository.findAccountByToken({
            token: data.token,
            tokenType: TOKEN_TYPES.EXCHANGE_GOOGLE,
            options: { attributes: ["id", "username", "email", "rank", "role", "provider", "tokenExpiredAt"] }
        });

        if (!account) throwHttpError(400, "Liên kết trao đổi google không hợp lệ!");

        const tokenExpiredAtUTC = moment(account.tokenExpiredAt).utc();
        const nowUTC = moment().utc();

        await authRepository.update({
            id: account.id,
            data: {
                token: null,
                tokenType: null,
                tokenExpiredAt: null
            }
        });

        if (nowUTC.isAfter(tokenExpiredAtUTC)) throwHttpError(400, "Liên kết trao đổi google đã hết hạn!");

        const accessToken = signJWTToken({
            id: account.id,
            username: account.username,
            email: account.email,
            rank: account.rank,
            role: account.role,
            provider: account.provider
        }, "5m");

        const refreshToken = signJWTToken({ id: account.id }, "7d");
        return { accessToken, refreshToken };
    },

    signUp: async (data) => {
        const transaction = await sequelize.transaction();

        try {
            const account = await authRepository.findAccountByEmail({
                email: data.email,
                options: { attributes: ["id"] }
            });

            if (account) throwHttpError(409, "Email đã được đăng ký!");

            const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
            const authToken = generateRandomToken();
            const authTokenExpiredAt = moment().add(AUTH_TOKEN_EXPIRES_IN, 'minutes').toDate();

            await authRepository.create({
                data: {
                    username: data.username,
                    email: data.email,
                    password: hashedPassword,
                    provider: PROVIDERS.CREDENTIALS,
                    token: authToken,
                    tokenType: TOKEN_TYPES.VERIFY_EMAIL,
                    tokenExpiredAt: authTokenExpiredAt
                },
                options: { transaction }
            });

            await sendEmail(
                EMAIL_TEMPLATES.VERIFICATION_EMAIL,
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

    signIn: async (data) => {
        const account = await authRepository.findAccountByEmail({
            email: data.email,
            options: { attributes: ["id", "username", "email", "password", "rank", "role", "provider", "isVerified"] }
        });

        if (!account) throwHttpError(401, "Email hoặc mật khẩu không đúng!");
        if (!account.isVerified) throwHttpError(401, "Email chưa được xác minh!");
        if (account && account.provider === "google") throwHttpError(409, "Email này được đăng ký theo hình thức google!");

        const isPasswordValid = await bcrypt.compare(data.password, account.password);
        if (!isPasswordValid) throwHttpError(401, "Email hoặc mật khẩu không đúng!");

        const accessToken = signJWTToken({
            id: account.id,
            username: account.username,
            email: account.email,
            rank: account.rank,
            role: account.role,
            provider: account.provider
        }, "5m");

        const refreshToken = signJWTToken({ id: account.id }, "7d");
        return { accessToken, refreshToken };
    },

    sendAuthEmail: async (data) => {
        const transaction = await sequelize.transaction();

        try {
            const account = await authRepository.findAccountByEmail({
                email: data.email,
                options: { attributes: ["id", "username", "provider", "isVerified"] }
            });

            if (!account) throwHttpError(404, "Email chưa được đăng ký!");
            if (account.provider === PROVIDERS.GOOGLE) throwHttpError(409, "Email này được đăng ký theo hình thức google!");

            switch (data.tokenType) {
                case TOKEN_TYPES.VERIFY_EMAIL:
                    if (account.isVerified) throwHttpError(409, "Email đã được xác minh!");
                    break;
                case TOKEN_TYPES.RESET_PASSWORD:
                    if (!account.isVerified) throwHttpError(409, "Email chưa được xác minh!");
                    break;
            }

            const authToken = generateRandomToken();
            const authTokenExpiredAt = moment().add(AUTH_TOKEN_EXPIRES_IN, 'minutes').toDate();
            const emailTemplate = data.tokenType === TOKEN_TYPES.VERIFY_EMAIL
                ? EMAIL_TEMPLATES.VERIFICATION_EMAIL
                : EMAIL_TEMPLATES.RESET_PASSWORD_EMAIL;

            await authRepository.update({
                id: account.id,
                data: {
                    token: authToken,
                    tokenType: data.tokenType,
                    tokenExpiredAt: authTokenExpiredAt
                },
                options: { transaction }
            });

            await sendEmail(
                emailTemplate,
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

    verifyEmail: async (data) => {
        const account = await authRepository.findAccountByToken({
            token: data.token,
            tokenType: TOKEN_TYPES.VERIFY_EMAIL,
            options: { attributes: ["id", "tokenExpiredAt"] }
        });

        if (!account) throwHttpError(400, "Liên kết xác minh email không hợp lệ!");

        const tokenExpiredAtUTC = moment(account.tokenExpiredAt).utc();
        const nowUTC = moment().utc();

        if (nowUTC.isAfter(tokenExpiredAtUTC)) {
            await authRepository.update({
                id: account.id,
                data: {
                    token: null,
                    tokenType: null,
                    tokenExpiredAt: null
                }
            });

            throwHttpError(400, "Liên kết xác minh email đã hết hạn!");
        }

        await authRepository.update({
            id: account.id,
            data: {
                token: null,
                tokenType: null,
                tokenExpiredAt: null,
                isVerified: true
            }
        });
    },

    resetPassword: async (data) => {
        const account = await authRepository.findAccountByToken({
            token: data.token,
            tokenType: TOKEN_TYPES.RESET_PASSWORD,
            options: { attributes: ["id", "tokenExpiredAt"] }
        });

        if (!account) throwHttpError(400, "Liên kết đặt lại mật khẩu không hợp lệ!");

        const tokenExpiredAtUTC = moment(account.tokenExpiredAt).utc();
        const nowUTC = moment().utc();

        if (nowUTC.isAfter(tokenExpiredAtUTC)) {
            await authRepository.update({
                id: account.id,
                data: {
                    token: null,
                    tokenType: null,
                    tokenExpiredAt: null
                }
            });

            throwHttpError(400, "Liên kết đặt lại mật khẩu đã hết hạn!");
        }
        
        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

        await authRepository.update({
            id: account.id,
            data: {
                token: null,
                tokenType: null,
                tokenExpiredAt: null,
                password: hashedPassword
            }
        });
    },

    refreshTokens: async (data) => {
        const verified = verifyJWTToken(data.refreshToken);
        if (verified.isExpired) throwHttpError(401, "Phiên đăng nhập chính đã hết hạn!");
        if (verified.isInvalid) throwHttpError(401, "Phiên đăng nhập chính không hợp lệ!");

        const account = await authRepository.findById({
            id: verified.decoded.id,
            options: { attributes: ["id", "username", "email", "rank", "role", "provider"] }
        });

        if (!account) throwHttpError(401, "Không tìm thấy tài khoản!");

        const accessToken = signJWTToken({
            id: account.id,
            username: account.username,
            email: account.email,
            rank: account.rank,
            role: account.role,
            provider: account.provider
        }, "5m");

        const refreshToken = signJWTToken({ id: account.id }, "7d");
        return { accessToken, refreshToken };
    }
};