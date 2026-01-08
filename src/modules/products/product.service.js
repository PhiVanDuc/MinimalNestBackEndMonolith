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
                    costPrice: costPrice,
                    interestPercent: interestPercent,
                    discountType: discountType,
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

        try {
            const { productId, files, colorIds, roles } = data;

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
                            where: { colorId: uniqueColorIds },
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

            const product = productInstance?.get({ plain: true });
            if (!product) throwHttpError(404, "Không tìm thấy sản phẩm!");
            if (product.products_colors.length !== uniqueColorIds.length) throwHttpError(400, "Không tìm thấy một số màu sắc!");

            const colorMap = new Map(product.products_colors.map(productColor => {
                return [
                    productColor.color.id,
                    {
                        ...productColor.color,
                        productColorId: productColor.id
                    }
                ];
            }));

            const categoryNames = product.categories
                .map(category => category.name).filter(Boolean).join(", ");

            const uploadImages = await Promise.allSettled(
                files.map(async (file, index) => {
                    const colorId = colorIds[index];
                    const color = colorMap.get(colorId);
                    const description = `${product.name.toLowerCase()} - Màu ${color.name.toLowerCase()} - Danh mục ${categoryNames.toLowerCase()}`;

                    try {
                        const uploadImage = await cloudinary.uploader.upload(file.path, {
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
                            productColorId: color.productColorId,
                            colorId: color.id,
                            color_name: color.name,
                            publicId: uploadImage.publicId,
                            url: uploadImage.secure_url,
                            role: roles[index]
                        }
                    }
                    catch(error) {
                        throw {
                            colorId: colorId,
                            color_name: color.name,
                            message: error.message
                        }
                    }
                })
            );

            const successImages = uploadImages
                .filter(uploadImage => uploadImage.status === 'fulfilled')
                .map(uploadImage => {
                    const { colorId, color_name, ...rest } = uploadImage.value;
                    return rest;
                });

            if (successImages.length) {
                await productImageRepository.createProductImages({
                    data: successImages,
                    options: { transaction }
                });
            }

            await transaction.commit();

            const failedImages = uploadImages
                .filter(uploadImage => uploadImage.status === 'rejected')
                .map(uploadImage => uploadImage.reason);

            if (failedImages.length) {
                const countByColorId = colorIds.reduce((obj, colorId) => {
                    obj[colorId] = (obj[colorId] || 0) + 1;
                    return obj;
                }, {});

                const countByFailedImage = failedImages.reduce((obj, failedImage) => {
                    obj[failedImage.colorId] = (obj[failedImage.colorId] || 0) + 1;
                    return obj;
                }, {});

                const payload = Object.keys(countByFailedImage).map(colorId => {
                    const colorName = colorMap.get(colorId).name;
                    const failedCount = countByFailedImage[colorId];
                    const totalCount = countByColorId[colorId];

                    return {
                        colorId,
                        colorName,
                        message: `Thêm ${failedCount}/${totalCount} ảnh sản phẩm cho màu ${colorName} đã thất bại!`
                    };
                });

                return payload;
            }
        }
        catch(error) {
            await transaction.rollback();

            if (error.name === SEQUELIZE_ERRORS.FOREIGN_KEY) {}

            throw error;
        }
    }
}