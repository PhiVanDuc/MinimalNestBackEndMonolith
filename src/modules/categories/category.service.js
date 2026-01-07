const formatFilter = require("../../utils/format-filter");
const generateSlug = require("../../utils/generate-slug");
const categoryRepository = require("./category.repository");
const throwHttpError = require("../../utils/throw-http-error");
const formatOutputPagination = require("../../utils/format-output-pagination");

const SEQUELIZE_ERRORS = require("../../consts/sequelize-errors");

module.exports = {
    getCategories: async (data) => {
        const options = {
            attributes: ["id", "name", "slug"],
            order: [["updated_at", "DESC"]]
        }

        const page = data.page;
        const limit = data.limit;
        const filterWhitelist = ["name"];
        const filter = formatFilter(data, filterWhitelist);

        const { count, rows } = await categoryRepository.paginateCategories({ page, limit, filter, options });
        return formatOutputPagination({ rows: { categories: rows }, page, count, limit });
    },

    getCategory: async (data) => {
        const category = await categoryRepository.findById({
            id: data.id,
            options: { attributes: ["id", "name", "slug"] }
        });

        if (!category) throwHttpError(404, "Không tìm thấy danh mục!");
        return category;
    },

    addCategory: async (data) => {
        try {
            await categoryRepository.create({
                data: {
                    slug: generateSlug(data.name),
                    name: data.name
                }
            });
        }
        catch (error) {
            if (error.name === SEQUELIZE_ERRORS.UNIQUE) throwHttpError(409, "Tên danh mục đã được sử dụng!");
            throw error;
        }
    },

    updateCategory: async (data) => {
        try {
            const category = await categoryRepository.findById({
                id: data.id,
                options: { attributes: ["id"] }
            });

            if (!category) throwHttpError(404, "Không tìm thấy danh mục!");

            await categoryRepository.update({
                id: data.id,
                data: {
                    slug: generateSlug(data.name),
                    name: data.name
                }
            });
        }
        catch (error) {
            if (error.name === SEQUELIZE_ERRORS.UNIQUE) throwHttpError(409, "Tên danh mục đã được sử dụng!");
            throw error;
        }
    },

    deleteCategory: async (data) => {
        const category = await categoryRepository.findById({
            id: data.id,
            options: { attributes: ["id"] }
        });

        if (!category) throwHttpError(404, "Không tìm thấy danh mục!");

        await categoryRepository.destroy({ id: data.id });
    }
}