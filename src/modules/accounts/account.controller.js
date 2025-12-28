const accountService = require("./account.service");
const throwHttpError = require("../../utils/throw-http-error");
const isPositiveIntegerString = require("../../utils/is-positive-integer-string");

module.exports = {
    getAccounts: async (req, res, next) => {
        try {
            const data = req.query;
            if ((data.page && !isPositiveIntegerString(data.page)) || (data.limit && !isPositiveIntegerString(data.limit))) throwHttpError(400, "Dữ liệu đã cung cấp không hợp lệ!");

            const result = await accountService.getAccounts(data);

            return res.status(200).json({
                success: true,
                message: "Lấy danh sách tài khoản thành công!",
                data: result
            });
        }
        catch (error) { next(error); }
    },

    updateAccountRole: async (req, res, next) => {
        try {
            const data = { ...req.params, ...req.body }
            if (!data?.id || !data?.role) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            await accountService.updateAccountRole(data);

            return res.status(200).json({
                success: true,
                message: "Cập nhật vai trò cho tài khoản thành công!"
            });
        }
        catch (error) { next(error); }
    }
}