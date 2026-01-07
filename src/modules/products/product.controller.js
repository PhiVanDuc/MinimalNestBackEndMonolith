const productService = require("./product.service");
const throwHttpError = require("../../utils/throw-http-error");
const deleteDiskStorageImage = require("../../utils/delete-disk-storage-image");

const DISCOUNT_TYPES = require("../../consts/discount-types.const");

module.exports = {
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
            if (!data.productId) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");

            await productService.addProductImages(data);
            await Promise.all(data.files.map(file => deleteDiskStorageImage(file.path)));

            return res.status(201).json({
                success: true,
                message: "Thêm ảnh sản phẩm thành công!"
            });
        }
        catch (error) {
            await Promise.all(data.files.map(file => deleteDiskStorageImage(file.path)));
            next(error);
        }
    }
}