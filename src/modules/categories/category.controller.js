const categoryService = require("./category.service");
const throwHttpError = require("../../utils/throw-http-error");
const formatInputPagination = require("../../utils/format-input-pagination");

module.exports = {
    getCategories: async (req, res, next) => {
        try {
            const data = { ...req.query, ...formatInputPagination(req.query.page, req.query.limit) };
            const result = await categoryService.getCategories(data);

            return res.status(200).json({
                success: true,
                message: "Lấy danh sách danh mục thành công!",
                data: result
            });
        }
        catch (error) { next(error); }
    },

    getCategory: async (req, res, next) => {
        try {
            const data = req.params;
            if (!data?.id) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            const result = await categoryService.getCategory(data);

            return res.status(200).json({
                success: true,
                message: "Lấy danh mục thành công!",
                data: result
            });
        }
        catch (error) { next(error); }
    },

    addCategory: async (req, res, next) => {
        try {
            const data = req.body;
            if (!data?.name) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            await categoryService.addCategory(data);

            return res.status(201).json({
                success: true,
                message: "Thêm danh mục thành công!"
            });
        }
        catch (error) { next(error); }
    },

    updateCategory: async (req, res, next) => {
        try {
            const data = { ...req.params, ...req.body }
            if (!data?.id || !data?.name) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            await categoryService.updateCategory(data);

            return res.status(200).json({
                success: true,
                message: "Cập nhật danh mục thành công!"
            });
        }
        catch (error) { next(error); }
    },

    deleteCategory: async (req, res, next) => {
        try {
            const data = req.params;
            if (!data?.id) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            await categoryService.deleteCategory(data);

            return res.status(200).json({
                success: true,
                message: "Xoá danh mục thành công!"
            });
        }
        catch (error) { next(error); }
    }
}