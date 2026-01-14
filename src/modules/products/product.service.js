const { Category, Color, ProductColor, ProductImage, sequelize } = require("../../db/models/index");

const productRepository = require("./repositories/product.repository");
const productColorRepository = require("./repositories/product-color.repository");
const productImageRepository = require("./repositories/product-image.repository");
const productCategoryRepository = require("./repositories/product-category.repository");

const generateSlug = require("../../utils/generate-slug");
const formatFilter = require("../../utils/format-filter");
const cloudinary = require("../../configs/cloudinary.config");
const calculatePrice = require("../../utils/calculate-price");
const throwHttpError = require("../../utils/throw-http-error");
const generateBase64URL = require("../../utils/generate-base-64-url");
const formatOutputPagination = require("../../utils/format-output-pagination");

const SEQUELIZE_ERRORS = require("../../consts/sequelize-errors");

module.exports = {
    getProducts: async (data) => {
        const options = {
            attributes: ["id", "name", "slug", "costPrice", "interestPercent", "discountType", "discount", "price", "updatedAt"],
            include: [
                {
                    model: Category,
                    as: "categories",
                    attributes: ["id", "name", "slug"],
                    through: { attributes: [] }
                },
                {
                    model: Color,
                    as: "colors",
                    attributes: ["id", "name", "slug", "colorCode"],
                    through: { attributes: [] }
                },
                {
                    model: ProductColor,
                    as: "productsColors",
                    attributes: ["id"],
                    include: {
                        model: ProductImage,
                        as: "productImages",
                        attributes: ["id", "url", "blurUrl", "role"],
                        where: { role: "main-image" },
                        separate: true
                    }
                }
            ],
            order: [["updatedAt", "DESC"]],
        }

        const page = data.page;
        const limit = data.limit;
        const filterWhitelist = ["name"];
        const filter = formatFilter(data, filterWhitelist);

        const { count, rows } = await productRepository.paginateProducts({ page, limit, filter, options });

        const products = rows.map(productInstance => {
            const product = productInstance.get({ plain: true });
            const { updatedAt, productsColors, ...rest } = product;
            
            const payload = { ...rest };
            const image = productsColors[0]?.productImages[0];

            if (image) payload.image = image;
            return payload;
        });

        return formatOutputPagination({ rows: { products }, page, count, limit });
    },

    getProduct: async (data) => {
        const product = await productRepository.findById({
            id: data.id,
            options: {
                attributes: ["id", "name", "slug", "desc", "costPrice", "interestPercent", "discountType", "discount", "price"],
                include: [
                    {
                        model: Category,
                        as: "categories",
                        attributes: ["id", "name", "slug"],
                        through: { attributes: [] }
                    },
                    {
                        model: ProductColor,
                        as: "productsColors",
                        attributes: ["id"],
                        include: [
                            {
                                model: Color,
                                as: "color",
                                attributes: ["id", "name", "slug", "colorCode"]
                            },
                            {
                                model: ProductImage,
                                as: "productImages",
                                attributes: ["id", "url", "blurUrl", "role"]
                            }
                        ]
                    }
                ]
            }
        });

        if (!product) throwHttpError(404, "Không tìm thấy sản phẩm!");
        const { productsColors, ...rest } = product.get({ plain: true });

        return {
            ...rest,
            colors: productsColors.map(productColor => ({
                ...productColor.color,
                images: productColor.productImages
            }))
        }
    },

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

        const images = files.map((file, index) => {
            return {
                file,
                colorId: colorIds[index],
                role: roles[index]
            }
        });

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
            .filter(Boolean)
            .join(", ")
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

                    const blurUrl = await generateBase64URL(uploadImage.secure_url);

                    return {
                        productColorId: color.productColorId,
                        colorId: color.id,
                        colorName: color.name,
                        publicId: uploadImage.public_id,
                        url: uploadImage.secure_url,
                        blurUrl,
                        role: image.role
                    };
                }
                catch(error) {
                    console.error("Lỗi đăng tải ảnh lên Cloudinary -- ", error);
                    throw { error, colorId: image.colorId };
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

        try {
            const data = successImages.map(({ colorId, colorName, ...rest }) => rest);
            await productImageRepository.addProductImages({ data });
        }
        catch(error) {
            Promise.allSettled(successImages.map(image => cloudinary.uploader.destroy(image.publicId)))
                .catch(err => console.error("Lỗi dọn dẹp ảnh trong Cloudinary -- ", err));

            if (error.name === SEQUELIZE_ERRORS.FOREIGN_KEY) throwHttpError(400, "Không tìm thấy một số màu sắc!");
            throw error;
        }

        if (failedImages.length) {
            const countImageByColor = images.reduce((acc, image) => {
                acc[image.colorId] = (acc[image.colorId] || 0) + 1;
                return acc;
            }, {});

            const countFailedImageByColor = failedImages.reduce((acc, image) => {
                acc[image.colorId] = (acc[image.colorId] || 0) + 1;
                return acc;
            }, {});

            const partialSuccessMessages = Object.keys(countImageByColor).map(colorId => {
                const total = countImageByColor[colorId];
                const totalFailed = countFailedImageByColor[colorId] || 0;
                const totalSuccess = total - totalFailed;
                const colorName = colorMap.get(colorId).name.toLowerCase();

                if (totalFailed === 0) return { status: 201, message: `Thêm ảnh sản phẩm cho màu ${colorName} thành công!` };
                return { statusCode: 207, message: `Thêm thành công ${totalSuccess}/${total} ảnh sản phẩm cho màu ${colorName}!` };
            });

            return {
                statusCode: 207,
                message: `Thêm ảnh sản phẩm cho màu ${colorNames} thành công một phần!`,
                messages: partialSuccessMessages
            }
        }

        return {
            statusCode: 201,
            message: `Thêm ảnh sản phẩm cho màu ${colorNames} thành công!`
        };
    }
}