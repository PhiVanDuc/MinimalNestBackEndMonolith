const formatFilter = require("../../utils/format-filter");
const generateSlug = require("../../utils/generate-slug");
const categoryRepository = require("./category.repository");
const isUniqueError = require("../../utils/is-unique-error");
const throwHttpError = require("../../utils/throw-http-error");
const formatReturnDataPagination = require("../../utils/format-return-data-pagination");

module.exports = {
    getCategories: async (data) => {
        const options = {
            attributes: ["id", "name"],
            order: [["updated_at", "DESC"]]
        }

        const page = Number(data.page || "1");
        const limit = Number(data.limit || "20");
        const filterWhitelist = ["name"];
        const filter = formatFilter(data, filterWhitelist);

        const { count, rows } = await categoryRepository.findCategories({ page, limit, filter, options });
        return formatReturnDataPagination({ rows: { categories: rows }, page, count, limit });
    },

    getCategory: async (data) => {
        const category = await categoryRepository.findById({
            id: data.id,
            options: { attributes: ["id", "name"] }
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
            if (isUniqueError(error)) throwHttpError(409, "Tên danh mục đã được sử dụng!");
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
            if (isUniqueError(error)) throwHttpError(409, "Tên danh mục đã được sử dụng!");
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