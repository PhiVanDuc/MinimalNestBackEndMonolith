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
        const { productId, files, colorIds, roles } = data;
        const uniqueColorIds = [...new Set(colorIds)];

        const images = files.map((file, index) => {
            return {
                file,
                colorId: colorIds[index],
                role: roles[index]
            }
        });

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
                        as: "productsColors",
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
        if (product.productsColors.length !== uniqueColorIds.length) throwHttpError(400, "Không tìm thấy một số màu sắc!");

        const categoryNames = product.categories
            .map(category => category.name)
            .filter(Boolean).join(", ")
            .toLowerCase();

        const colorMap = new Map(
            product.productsColors.map(productColor => ([
                productColor.color.id,
                {
                    productColorId: productColor.id,
                    ...productColor.color
                }
            ]))
        );

        const uploadResults = await Promise.allSettled(
            images.map(async image => {
                const color = colorMap.get(image.colorId);
                const folderPath = `products/${product.name}/${color.name}`;
                const description = `${product.name.toLowerCase()} - Màu ${color.name.toLowerCase()} - Danh mục ${categoryNames}`;

                try {
                    const uploadImage = await cloudinary.uploader.upload(image.file.path, {
                        use_filename: false, 
                        unique_filename: true,
                        asset_folder: folderPath,
                        context: {
                            alt: `Ảnh ${description}`,
                            caption: description
                        },
                        fetch_format: "auto",
                        quality: "auto"
                    });

                    return {
                        productColorId: color.productColorId,
                        publicId: uploadImage.public_id,
                        url: uploadImage.secure_url,
                        role: image.role
                    };
                }
                catch(error) {
                    console.error("Lỗi đăng tải ảnh lên Cloudinary -- ", error);

                    throw {
                        colorId: image.colorId,
                        colorName: color.name
                    };
                }
            })
        );

        const successImages = [];
        const failedImages = [];
        const colorNames = Array.from(colorMap.values()).map(color => color.name).join(", ").toLowerCase();

        uploadResults.forEach(result => {
            if (result.status === 'fulfilled') successImages.push(result.value);
            else failedImages.push(result.reason);
        });

        if (!successImages.length) throwHttpError(400, `Thêm ảnh sản phẩm cho màu ${colorNames} hoàn toàn thất bại!`);
        const transaction = await sequelize.transaction();

        try {
            await productImageRepository.addProductImages({ data: successImages, options: { transaction } });
            await transaction.commit();
        }
        catch(error) {
            await transaction.rollback();

            try { await Promise.allSettled(successImages.map(image => cloudinary.uploader.destroy(image.publicId))); }
            catch(error) { console.error("Lỗi dọn dẹp ảnh trong Cloudinary -- ", error); }

            if (error.name === SEQUELIZE_ERRORS.FOREIGN_KEY) throwHttpError(400, "Không tìm thấy một số màu sắc!");
            throw error;
        }

        if (failedImages.length) {
            const countByColor = images.reduce((acc, image) => {
                acc[image.colorId] = (acc[image.colorId] || 0) + 1;
                return acc;
            }, {});

            const failSummary = failedImages.reduce((acc, fail) => {
                acc[fail.colorId] = (acc[fail.colorId] || 0) + 1;
                return acc;
            }, {});

            const errorData = Object.keys(failSummary).map(colorId => {
                const color = colorMap.get(colorId);

                return {
                    colorId,
                    colorName: color.name,
                    message: `Thêm ${failSummary[colorId]}/${countByColor[colorId]} ảnh sản phẩm cho màu ${color.name.toLowerCase()} thất bại!`
                };
            });

            return {
                statusCode: 207,
                message: `Thêm ảnh sản phẩm cho màu ${colorNames} thành công một phần!`,
                data: errorData
            }
        }

        return {
            statusCode: 201,
            message: `Thêm ảnh sản phẩm cho màu ${colorNames} thành công!`
        };
    }
}