const productService = require("./product.service");
const throwHttpError = require("../../utils/throw-http-error");
const formatInputPagination = require("../../utils/format-input-pagination");
const deleteDiskStorageImage = require("../../utils/delete-disk-storage-image");

const DISCOUNT_TYPES = require("../../consts/discount-types.const");

module.exports = {
    getProducts: async (req, res, next) => {
        try {
            const data = { ...req.query, ...formatInputPagination(req.query.page, req.query.limit) };
            const result = await productService.getProducts(data);

            return res.status(200).json({
                success: true,
                message: "Lấy danh sách sản phẩm thành công!",
                data: result
            });
        }
        catch (error) { next(error); }
    },

    getProduct: async (req, res, next) => {
        try {
            const data = req.params;
            if (!data?.id) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            const result = await productService.getProduct(data);

            return res.status(200).json({
                success: true,
                message: "Lấy sản phẩm thành công!",
                data: result
            });
        }
        catch (error) { next(error); }
    },

    addProduct: async (req, res, next) => {
        try {
            const data = req.body;
            const { name, desc, costPrice, interestPercent, discountType, discount, categories, colors } = data;
            const numberFields = [costPrice, interestPercent, discount];

            if (!name || !desc || !costPrice || !interestPercent || !discountType || discount === undefined || discount === null || !categories || !colors) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");
            if (!numberFields.every(numberField => typeof numberField === "number" && Number.isInteger(numberField) && numberField >= 0)) throwHttpError(400, "Dữ liệu đã cung cấp không hợp lệ!");
            if (!Object.values(DISCOUNT_TYPES).includes(discountType)) throwHttpError(400, "Dữ liệu đã cung cấp không hợp lệ!");

            const result = await productService.addProduct(data);

            return res.status(201).json({
                success: true,
                message: "Thêm sản phẩm thành công!",
                data: result
            });
        }
        catch(error) { next(error); }
    },

    addProductImages: async (req, res, next) => {
        const data = {
            files: req.files,
            productId: req.params.id,
            ...req.body
        }

        try {
            if (!data.productId || !data?.files || !data?.files.length || !data?.colorIds || !data?.colorIds.length || !data?.roles || !data?.roles.length) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            const result = await productService.addProductImages(data);
            await Promise.all(data.files.map(file => deleteDiskStorageImage(file.path)));

            return res.status(result.statusCode).json({
                success: true,
                message: result.message,
                ...(result?.messages ? { data: result.messages } : {})
            });
        }
        catch (error) {
            await Promise.all(data.files.map(file => deleteDiskStorageImage(file.path)));
            next(error);
        }
    }
}