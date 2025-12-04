const authService = require("./auth.service");

module.exports = {
    signUp: async (req, res, next) => {
        try {
            const data = req.body;

            if (!data?.username || !data?.email || !data?.password || !data?.confirmPassword || !data?.type) {
                const error = new Error("Vui lòng cung cấp đủ dữ liệu!");
                error.status = 400;
                throw error;
            }

            if (data.password !== data.confirmPassword) {
                const error = new Error("Mật khẩu xác nhận không khớp!");
                error.status = 400;
                throw error;
            }

            await authService.signUp(data);

            return res.status(201).json({
                success: true,
                message: "Đăng ký tài khoản thành công. Vui lòng xác thực Email!",
            });
        }
        catch (error) { next(error); }
    },

    verifyEmail: async (req, res, next) => {
        try {
            const data = req.body;

            if (!data?.token) {
                const error = new Error("Vui lòng cung cấp đủ dữ liệu!");
                error.status = 400;
                throw error;
            }

            await authService.verifyEmail(data);

            return res.status(200).json({
                success: true,
                message: "Xác thực Email thành công!"
            });
        }
        catch (error) { next(error); }
    },

    signIn: async (req, res, next) => {
        try {
            const data = req.body;

            if (!data?.email || !data?.password) {
                const error = new Error("Vui lòng cung cấp đủ Email và mật khẩu!");
                error.status = 400;
                throw error;
            }

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