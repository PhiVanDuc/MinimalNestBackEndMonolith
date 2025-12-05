const authService = require("./auth.service");
const createHttpError = require("../../utils/create-http-error");
const tokenTypesConst = require("../../consts/token-types.const");
const emailTemplatesConst = require("../../consts/email-templates.const");

module.exports = {
    signUp: async (req, res, next) => {
        try {
            const data = req.body;
            if (!data?.username || !data?.email || !data?.password || !data?.confirmPassword || !data?.provider) createHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            if (data.password !== data.confirmPassword) createHttpError(400, "Mật khẩu xác nhận không khớp!");

            await authService.signUp(data);

            return res.status(201).json({
                success: true,
                message: "Đăng ký tài khoản thành công. Vui lòng truy cập gmail để xác minh email!",
            });
        }
        catch (error) { next(error); }
    },

    verifyEmail: async (req, res, next) => {
        try {
            const data = req.body;
            if (!data?.token) createHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            await authService.verifyEmail(data);

            return res.status(200).json({
                success: true,
                message: "Xác minh email thành công!"
            });
        }
        catch (error) { next(error); }
    },

    sendAuthEmail: async (req, res, next) => {
        try {
            const data = req.body;
            if (!data?.email || !data?.tokenType || !data?.emailTemplate) createHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            if (!Object.values(tokenTypesConst).includes(data.tokenType)) createHttpError(400, "Dữ liệu tokenType đã cung cấp không hợp lệ!");

            if (!Object.values(emailTemplatesConst).includes(data.emailTemplate)) createHttpError(400, "Dữ liệu emailTemplate đã cung cấp không hợp lệ!")

            await authService.sendAuthEmail(data);

            return res.status(200).json({
                success: true,
                message: "Gửi email xác minh thành công! Vui lòng truy cập gmail để xác minh email!",
            });
        }
        catch (error) { next(error); }
    },

    signIn: async (req, res, next) => {
        try {
            const data = req.body;
            if (!data?.email || !data?.password) createHttpError(400, "Vui lòng cung cấp đủ Email và mật khẩu!");

            const result = await authService.signIn(data);

            return res.status(200).json({
                success: true,
                message: "Đăng nhập thành công!",
                data: result
            });
        }
        catch (error) { next(error); }
    }
}