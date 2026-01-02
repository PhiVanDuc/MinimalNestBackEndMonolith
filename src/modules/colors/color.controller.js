const colorService = require("./color.service");
const throwHttpError = require("../../utils/throw-http-error");
const isPositiveIntegerString = require("../../utils/is-positive-integer-string");
const adminRoles = require("../../consts/roles.const");

module.exports = {
    getColors: async (req, res, next) => {
        try {
            const data = req.query;
            if ((data.page && !isPositiveIntegerString(data.page)) || (data.limit && !isPositiveIntegerString(data.limit))) throwHttpError(400, "Dữ liệu đã cung cấp không hợp lệ!");

            const user = req.user;
            const isAdmin = user && adminRoles.includes(user.role);
            const attributes = isAdmin
                ? ["id", "name", ["color_code", "colorCode"]]
                : ["id", "name", "slug", ["color_code", "colorCode"]];

            const result = await colorService.getColors(data, attributes);

            return res.status(200).json({
                success: true,
                message: "Lấy danh sách màu sắc thành công!",
                data: result
            });
        }
        catch (error) { next(error); }
    },

    getColor: async (req, res, next) => {
        try {
            const data = req.params;
            if (!data?.id) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            const result = await colorService.getColor(data);

            return res.status(200).json({
                success: true,
                message: "Lấy màu sắc thành công!",
                data: result
            });
        }
        catch (error) { next(error); }
    },

    addColor: async (req, res, next) => {
        try {
            const data = req.body;
            if (!data?.name || !data.colorCode) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            await colorService.addColor(data);

            return res.status(201).json({
                success: true,
                message: "Thêm màu sắc thành công!"
            });
        }
        catch (error) { next(error); }
    },

    updateColor: async (req, res, next) => {
        try {
            const data = { ...req.params, ...req.body }
            if (!data?.id || !data?.name || !data.colorCode) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            await colorService.updateColor(data);

            return res.status(200).json({
                success: true,
                message: "Cập nhật màu sắc thành công!"
            });
        }
        catch (error) { next(error); }
    },

    deleteColor: async (req, res, next) => {
        try {
            const data = req.params;
            if (!data?.id) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            await colorService.deleteColor(data);

            return res.status(200).json({
                success: true,
                message: "Xoá màu sắc thành công!"
            });
        }
        catch (error) { next(error); }
    }
}