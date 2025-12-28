const authRepository = require("./auth.repository");
const { sequelize } = require("../../db/models/index");

const bcrypt = require("bcrypt");
const moment = require("moment");

const sendEmail = require("../../libs/email/sendEmail");
const throwHttpError = require("../../utils/throw-http-error");
const tokenTypesConst = require("../../consts/token-types.const");
const { signJwtToken, verifyJwtToken } = require("../../libs/jwt");
const generateRandomToken = require("../../utils/generate-random-token");
const emailTemplatesConst = require("../../consts/email-templates.const");

const SALT_ROUNDS = 10;
const AUTH_TOKEN_EXPIRES_IN = 15;
const EXCHANGE_TOKEN_EXPIRES_IN= 1;

module.exports = {
    googleSignIn: async (data) => {
        const exchangeToken = generateRandomToken();
        const exchangeTokenExpiredAt = moment().add(EXCHANGE_TOKEN_EXPIRES_IN, 'minutes').toDate();

        const account = await authRepository.findByEmail({ email: data.email });

        if (account) {
            if (account.provider !== "google") throwHttpError(409, "Email này đã được đăng ký theo hình thức email và mật khẩu!");
            
            await authRepository.update({
                id: account.id,
                data: {
                    token: exchangeToken,
                    token_type: tokenTypesConst.EXCHANGE_GOOGLE,
                    token_expired_at: exchangeTokenExpiredAt
                }
            });

            return exchangeToken;
        }
        else {
            await authRepository.create({
                data: {
                    username: data.username,
                    email: data.email,
                    provider: data.provider,
                    token: exchangeToken,
                    token_type: tokenTypesConst.EXCHANGE_GOOGLE,
                    token_expired_at: exchangeTokenExpiredAt,
                    is_verified: true
                }
            });

            return exchangeToken;
        }
    },

    googleExchange: async (data) => {
        const account = await authRepository.findByToken({
            token: data.token,
            tokenType: tokenTypesConst.EXCHANGE_GOOGLE,
            options: { attributes: ["id", "username", "email", "rank", "role", "provider", "is_verified"] }
        });

        if (!account) throwHttpError(400, "Liên kết trao đổi google không hợp lệ!");

        const tokenExpiredAtUTC = moment(account.token_expired_at).utc();
        const nowUTC = moment().utc();

        await authRepository.update({
            id: account.id,
            data: {
                token: null,
                token_type: null,
                token_expired_at: null
            }
        });

        if (nowUTC.isAfter(tokenExpiredAtUTC)) throwHttpError(400, "Liên kết trao đổi google đã hết hạn!");

        const accessToken = signJwtToken({
            id: account.id,
            username: account.username,
            email: account.email,
            rank: account.rank,
            role: account.role,
            provider: account.provider
        }, "5s");

        const refreshToken = signJwtToken({ id: account.id }, "1h");
        
        return { accessToken, refreshToken };
    },

    signUp: async (data) => {
        const transaction = await sequelize.transaction();

        try {
            const account = await authRepository.findByEmail({
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
                    provider: data.provider,
                    token: authToken,
                    token_type: tokenTypesConst.VERIFY_EMAIL,
                    token_expired_at: authTokenExpiredAt
                },
                options: { transaction }
            });

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

    signIn: async (data) => {
        const account = await authRepository.findByEmail({
            email: data.email,
            options: { attributes: ["id", "username", "email", "password", "rank", "role", "provider", "is_verified"] }
        });

        if (!account) throwHttpError(401, "Email hoặc mật khẩu không đúng!");
        if (!account.is_verified) throwHttpError(401, "Email chưa được xác minh!");
        if (account && account.provider === "google") throwHttpError(409, "Email này được đăng ký theo hình thức google!");

        const isPasswordValid = await bcrypt.compare(data.password, account.password);
        if (!isPasswordValid) throwHttpError(401, "Email hoặc mật khẩu không đúng!");

        const accessToken = signJwtToken({
            id: account.id,
            username: account.username,
            email: account.email,
            rank: account.rank,
            role: account.role,
            provider: account.provider
        }, "5s");

        const refreshToken = signJwtToken({ id: account.id }, "1h");

        return { accessToken, refreshToken };
    },

    sendAuthEmail: async (data) => {
        const transaction = await sequelize.transaction();

        try {
            const account = await authRepository.findByEmail({
                email: data.email,
                options: { attributes: ["id", "username", "provider", "is_verified"] }
            });

            if (!account) throwHttpError(404, "Email chưa được đăng ký!");
            if (account && account.provider === "google") throwHttpError(409, "Email này được đăng ký theo hình thức google!");

            switch (data.tokenType) {
                case tokenTypesConst.VERIFY_EMAIL:
                    if (account.is_verified) throwHttpError(409, "Email đã được xác minh!");
                    break;
                case tokenTypesConst.RESET_PASSWORD:
                    if (!account.is_verified) throwHttpError(409, "Email chưa được xác minh!");
                    break;
            }

            const authToken = generateRandomToken();
            const authTokenExpiredAt = moment().add(AUTH_TOKEN_EXPIRES_IN, 'minutes').toDate();
            const emailTemplate = data.tokenType === tokenTypesConst.VERIFY_EMAIL
                ? emailTemplatesConst.VERIFICATION_EMAIL
                : emailTemplatesConst.RESET_PASSWORD_EMAIL;

            await authRepository.update({
                id: account.id,
                data: {
                    token: authToken,
                    token_type: data.tokenType,
                    token_expired_at: authTokenExpiredAt
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
        const account = await authRepository.findByToken({
            token: data.token,
            tokenType: tokenTypesConst.VERIFY_EMAIL,
            options: { attributes: ["id", "token_expired_at"] }
        });

        if (!account) throwHttpError(400, "Liên kết xác minh email không hợp lệ!");

        const tokenExpiredAtUTC = moment(account.token_expired_at).utc();
        const nowUTC = moment().utc();

        if (nowUTC.isAfter(tokenExpiredAtUTC)) {
            await authRepository.update({
                id: account.id,
                data: {
                    token: null,
                    token_type: null,
                    token_expired_at: null
                }
            });

            throwHttpError(400, "Liên kết xác minh email đã hết hạn!");
        }

        await authRepository.update({
            id: account.id,
            data: {
                token: null,
                token_type: null,
                token_expired_at: null,
                is_verified: true
            }
        });
    },

    resetPassword: async (data) => {
        const account = await authRepository.findByToken({
            token: data.token,
            tokenType: tokenTypesConst.RESET_PASSWORD,
            options: { attributes: ["id", "token_expired_at"] }
        });

        if (!account) throwHttpError(400, "Liên kết đặt lại mật khẩu không hợp lệ!");

        const tokenExpiredAtUTC = moment(account.token_expired_at).utc();
        const nowUTC = moment().utc();

        if (nowUTC.isAfter(tokenExpiredAtUTC)) {
            await authRepository.update({
                id: account.id,
                data: {
                    token: null,
                    token_type: null,
                    token_expired_at: null
                }
            });

            throwHttpError(400, "Liên kết đặt lại mật khẩu đã hết hạn!");
        }
        
        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

        await authRepository.update({
            id: account.id,
            data: {
                token: null,
                token_type: null,
                token_expired_at: null,
                password: hashedPassword
            }
        });
    },

    refreshTokens: async (data) => {
        const verified = verifyJwtToken(data.refreshToken);
        if (verified.isExpired) throwHttpError(401, "Phiên đăng nhập chính đã hết hạn!");
        if (verified.isInvalid) throwHttpError(401, "Phiên đăng nhập chính không hợp lệ!");

        const account = await authRepository.findById({
            id: verified.decoded.id,
            options: { attributes: ["id", "username", "email", "rank", "role", "provider"] }
        });

        if (!account) throwHttpError(401, "Không tìm thấy tài khoản!");

        const accessToken = signJwtToken({
            id: account.id,
            username: account.username,
            email: account.email,
            rank: account.rank,
            role: account.role,
            provider: account.provider
        }, "5s");

        const refreshToken = signJwtToken({ id: account.id }, "1h");
        return { accessToken, refreshToken };
    }
};