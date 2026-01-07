const { Category, Color, ProductColor, sequelize } = require("../../db/models/index");

const productRepository = require("./repositories/product.repository");
const productColorRepository = require("./repositories/product-color.repository");
const productImageRepository = require("./repositories/product-image.repository");
const productCategoryRepository = require("./repositories/product-category.repository");

const generateSlug = require("../../utils/generate-slug");
const cloudinary = require("../../configs/cloudinary.config");
const calculatePrice = require("../../utils/calculate-price");
const throwHttpError = require("../../utils/throw-http-error");

const SEQUELIZE_ERRORS = require("../../consts/sequelize-errors");

module.exports = {
    addProduct: async (data) => {
        const transaction = await sequelize.transaction();

        try {
            const { name, desc, costPrice, interestPercent, discountType, discount, categories, colors } = data;
            const slug = generateSlug(name);
            const price = calculatePrice(costPrice, interestPercent, discountType, discount);

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

            await productCategoryRepository.addCategoriesToProduct({
                productId: product.id,
                categories,
                options: { transaction }
            });

            await productColorRepository.addColorsToProduct({
                productId: product.id,
                colors,
                options: { transaction }
            });

            await transaction.commit();
            return { id: product.id }
        }
        catch (error) {
            await transaction.rollback();

            if (error.name === SEQUELIZE_ERRORS.UNIQUE) throwHttpError(409, "Tên sản phẩm đã được sử dụng!");
            throw error;
        }
    },

    addProductImages: async (data) => {
        const transaction = await sequelize.transaction();
        const { productId, files, colorIds, roles } = data;

        try {
            const uniqueColorIds = [...new Set(colorIds)];

            const productInstance = await productRepository.findById({
                id: productId,
                options: {
                    attributes: ["name"],
                    include: [
                        {
                            model: Category,
                            as: "categories",
                            attributes: ["name"],
                            through: { attributes: [] }
                        },
                        {
                            model: ProductColor,
                            as: "products_colors",
                            where: { color_id: uniqueColorIds },
                            attributes: ["id"],
                            include: {
                                model: Color,
                                as: "color",
                                attributes: ["id", "name"]
                            }
                        }
                    ]
                }
            });

            if (!productInstance) throwHttpError(404, "Không tìm thấy sản phẩm!");

            const product = productInstance.get({ plain: true });
            if (product.products_colors.length !== uniqueColorIds.length) throwHttpError(400, "Một số màu sắc không hợp lệ cho sản phẩm này!");

            const colorMap = new Map(
                product.products_colors.map(productColor => {
                    return [
                        productColor.color.id,
                        {
                            ...productColor.color,
                            product_color_id: productColor.id
                        }
                    ];
                })
            );

            const categoryNames = product.categories
                .map(category => category.name)
                .filter(Boolean)
                .join(", ");

            const uploadImages = await Promise.allSettled(
                files.map(async (file, index) => {
                    const color = colorMap.get(colorIds[index]);
                    const description = `${product.name.toLowerCase()} - Màu ${color.name.toLowerCase()} - Danh mục ${categoryNames.toLowerCase()}`

                    const upload = await cloudinary.uploader.upload(file.path, {
                        use_filename: false, 
                        unique_filename: true,
                        asset_folder: `products/${product.name}/${color.name}`,
                        context: {
                            alt: `Ảnh ${description}`,
                            caption: description
                        },
                        fetch_format: "auto",
                        quality: "auto"
                    });

                    return {
                        product_color_id: color.product_color_id,
                        public_id: upload.public_id,
                        url: upload.secure_url,
                        role: roles[index]
                    }
                })
            );

            const images = uploadImages
                .filter(uploadImage => uploadImage.status === "fulfilled")
                .map(uploadImage => uploadImage.value);

            if (images.length !== files.length) throwHttpError(502, "Dịch vụ đăng tải, lưu trữ ảnh thất bại!");

            await productImageRepository.createProductImages({
                data: images,
                options: { transaction }
            });

            await transaction.commit(); 
        }
        catch(error) {
            await transaction.rollback();
            await productRepository.destroy({ id: productId });

            if (error.name === SEQUELIZE_ERRORS.FOREIGN_KEY) {}
            throw error;
        }
    }
}