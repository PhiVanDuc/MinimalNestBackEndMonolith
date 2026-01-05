const { sequelize } = require("../../db/models/index");
const productRepository = require("./product.repository");

const generateSlug = require("../../utils/generate-slug");
const throwHttpError = require("../../utils/throw-http-error");

const SEQUELIZE_ERRORS = require("../../consts/sequelize-errors");

module.exports = {
    addProduct: async (data) => {
        const transaction = await sequelize.transaction();

        try {
            const { name, desc, costPrice, interestPercent, discountType, discount, price, categories, colors } = data;
            const slug = generateSlug(name);

            const product = await productRepository.create({
                data: {
                    name,
                    slug,
                    desc,
                    cost_price: costPrice,
                    interest_percent: interestPercent,
                    discount_type: discountType,
                    discount,
                    price
                },
                options: { transaction }
            });

            await productRepository.createCategoriesToProduct({
                productId: product.id,
                categories,
                options: { transaction }
            });

            await productRepository.createColorsToProduct({
                productId: product.id,
                colors,
                options: { transaction }
            });

            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();

            if (error.name === SEQUELIZE_ERRORS.UNIQUE) throwHttpError(409, "Tên sản phẩm đã được sử dụng!");
            throw error;
        }
    }
}