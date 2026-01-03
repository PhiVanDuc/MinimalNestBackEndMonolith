const accountService = require("./account.service");
const throwHttpError = require("../../utils/throw-http-error");
const formatInputPagination = require("../../utils/format-input-pagination");

module.exports = {
    getAccounts: async (req, res, next) => {
        try {
            const data = { ...req.query, ...formatInputPagination(req.query.page, req.query.limit) };
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