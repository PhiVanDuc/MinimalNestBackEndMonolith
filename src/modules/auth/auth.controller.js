const authService = require("./auth.service");
const throwHttpError = require("../../utils/throw-http-error");
const tokenTypesConst = require("../../consts/token-types.const");

module.exports = {
    googleSignIn: async (req, res, next) => {
        try {
            const data = req.user;
            if (!data?.email || !data?.username) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            const token = await authService.googleSignIn(data);
            res.redirect(`${process.env.FE}/google-sign-in?token=${token}`);
        }
        catch(error) {
            const params = new URLSearchParams();
            if (error?.message) params.set("message", error.message);

            res.redirect(`${process.env.FE}/google-sign-in/failed?${params.toString()}`);
            next(error);
        }
    },

    googleExchange: async (req, res, next) => {
        try {
            const data = req.body;
            if (!data?.token) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            const result = await authService.googleExchange(data);

            return res.status(200).json({
                success: true,
                message: "Đăng nhập thành công!",
                data: result
            });
        }
        catch(error) { next(error); }
    },

    signUp: async (req, res, next) => {
        try {
            const data = req.body;
            if (!data?.username || !data?.email || !data?.password || !data?.confirmPassword || !data?.provider) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");
            if (data.password !== data.confirmPassword) throwHttpError(400, "Mật khẩu xác nhận không khớp!");

            await authService.signUp(data);

            return res.status(201).json({
                success: true,
                message: "Đăng ký tài khoản thành công. Vui lòng kiểm tra hộp thư để tiếp tục!",
            });
        }
        catch (error) { next(error); }
    },

    signIn: async (req, res, next) => {
        try {
            const data = req.body;
            if (!data?.email || !data?.password) throwHttpError(400, "Vui lòng cung cấp đủ email và mật khẩu!");

            const result = await authService.signIn(data);

            return res.status(200).json({
                success: true,
                message: "Đăng nhập thành công!",
                data: result
            });
        }
        catch (error) { next(error); }
    },

    sendAuthEmail: async (req, res, next) => {
        try {
            const data = req.body;
            if (!data?.email || !data?.tokenType) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");
            if (!Object.values(tokenTypesConst).includes(data.tokenType)) throwHttpError(400, "Dữ liệu tokenType đã cung cấp không hợp lệ!");

            await authService.sendAuthEmail(data);

            let message = "";
            if (data?.tokenType === tokenTypesConst.VERIFY_EMAIL) message = "Gửi email xác minh thành công! Vui lòng kiểm tra hộp thư để tiếp tục!";
            else if (data?.tokenType === tokenTypesConst.RESET_PASSWORD) message = "Gửi email đặt lại mật khẩu thành công! Vui lòng kiểm tra hộp thư để tiếp tục!";

            return res.status(200).json({
                success: true,
                message
            });
        }
        catch (error) { next(error); }
    },

    verifyEmail: async (req, res, next) => {
        try {
            const data = req.body;
            if (!data?.token) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            await authService.verifyEmail(data);

            return res.status(200).json({
                success: true,
                message: "Xác minh email thành công!"
            });
        }
        catch (error) { next(error); }
    },

    resetPassword: async (req, res, next) => {
        try {
            const data = req.body;
            if (!data?.password || !data?.confirmPassword || !data?.token) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");
            if (data.password !== data.confirmPassword) throwHttpError(400, "Mật khẩu xác nhận không khớp!");

            await authService.resetPassword(data);

            return res.status(200).json({
                success: true,
                message: "Đặt lại mật khẩu thành công!"
            });
        }
        catch (error) { next(error); }
    },

    refreshTokens: async (req, res, next) => {
        try {
            const data = req.body;
            if (!data?.refreshToken) throwHttpError(401, "Refresh token không hợp lệ!");

            const result = await authService.refreshTokens(data);

            return res.status(200).json({
                success: true,
                message: "Làm mới các token thành công!",
                data: result
            });
        }
        catch (error) { next(error); }
    }
}