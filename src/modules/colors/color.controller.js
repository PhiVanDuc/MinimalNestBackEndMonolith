const colorService = require("./color.service");
const colorRepository = require("./color.repository");
const throwHttpError = require("../../utils/throw-http-error");

module.exports = {
    getColors: async (req, res, next) => {
        try {
            const data = req.query;
            if (!data?.page) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            const result = await colorRepository.findColorsPaginated(Number(data.page), 20);

            return res.status(200).json({
                success: true,
                message: "Lấy danh sách màu sắc đã phân trang thành công!",
                data: result
            });
        }
        catch (error) { next(error); }
    },

    getColor: async (req, res, next) => {
        try {
            const data = req.params;
            if (!data?.id) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            const result = await colorRepository.findColorById(data.id);

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
            const params = req.params;
            const data = req.body;
            if (!params?.id || !data?.name || !data.colorCode) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            await colorService.updateColor({ ...params, ...data });

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