const productService = require("./product.service");
const throwHttpError = require("../../utils/throw-http-error");
const deleteDiskStorageImage = require("../../utils/delete-disk-storage-image");

const DISCOUNT_TYPES = require("../../consts/discount-types.const");

module.exports = {
    addProduct: async (req, res, next) => {
        try {
            const data = req.body;
            const { name, desc, costPrice, interestPercent, discountType, discount, price, categories, colors } = data;
            const numberFields = [costPrice, interestPercent, discount, price];

            console.log(data);

            if (!name || !desc || !costPrice || !interestPercent || !discountType || !price || !categories || !colors) throwHttpError(400, "Vui lòng cung cấp đủ dữ liệu!");
            if (!numberFields.every(numberField => typeof numberField === "number" && Number.isInteger(numberField) && numberField >= 0)) throwHttpError(400, "Dữ liệu đã cung cấp không hợp lệ!");
            if (!Object.values(DISCOUNT_TYPES).includes(discountType)) throwHttpError(400, "Dữ liệu đã cung cấp không hợp lệ!");

            await productService.addProduct(data);

            return res.status(201).json({
                success: true,
                message: "Thêm sản phẩm thành công!"
            });
        }
        catch(error) { next(error); }
    },

    addProductImages: async (req, res, next) => {
        const files = req.files;
        const data = req.body;

        try {
            console.log("Các ảnh", files);
            console.log("Các dữ liệu: ", data);

            await Promise.all(files.map(file => deleteDiskStorageImage(file.path)));

            return res.status(201).json({
                success: true,
                message: "Thêm ảnh sản phẩm thành công!"
            });
        }
        catch (error) {
            await Promise.all(files.map(file => deleteDiskStorageImage(file.path)));
            next(error);
        }
    }
}