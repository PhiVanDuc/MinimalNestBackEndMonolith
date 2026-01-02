const colorRepository = require("./color.repository");
const formatFilter = require("../../utils/format-filter");
const generateSlug = require("../../utils/generate-slug");
const isUniqueError = require("../../utils/is-unique-error");
const throwHttpError = require("../../utils/throw-http-error");
const formatReturnDataPagination = require("../../utils/format-return-data-pagination");

module.exports = {
    getColors: async (data, attributes) => {
        const options = {
            attributes: attributes,
            order: [["updated_at", "DESC"]]
        }

        const page = Number(data.page || "1");
        const limit = Number(data.limit || "20");
        const filterWhitelist = ["name"];
        const filter = formatFilter(data, filterWhitelist);

        const { count, rows } = await colorRepository.findColors({ page, limit, filter, options });
        return formatReturnDataPagination({ rows: { colors: rows }, page, count, limit });
    },

    getColor: async (data) => {
        const color = await colorRepository.findById({
            id: data.id,
            options: { attributes: ["id", "name", ["color_code", "colorCode"]] }
        });

        if (!color) throwHttpError(404, "Không tìm thấy màu sắc!");
        return color;
    },

    addColor: async (data) => {
        try {
            await colorRepository.create({
                data: {
                    slug: generateSlug(data.name),
                    name: data.name,
                    color_code: data.colorCode
                }
            });
        }
        catch (error) {
            if (isUniqueError(error)) throwHttpError(409, "Tên màu sắc đã được sử dụng!");
            throw error;
        }
    },

    updateColor: async (data) => {
        try {
            const color = await colorRepository.findById({
                id: data.id,
                options: { attributes: ["id"] }
            });

            if (!color) throwHttpError(404, "Không tìm thấy màu sắc!");

            await colorRepository.update({
                id: data.id,
                data: {
                    slug: generateSlug(data.name),
                    name: data.name,
                    color_code: data.colorCode
                }
            });
        }
        catch (error) {
            if (isUniqueError(error)) throwHttpError(409, "Tên màu sắc đã được sử dụng!");
            throw error;
        }
    },

    deleteColor: async (data) => {
        const color = await colorRepository.findById({
            id: data.id,
            options: { attributes: ["id"] }
        });

        if (!color) throwHttpError(404, "Không tìm thấy màu sắc!");

        await colorRepository.destroy({ id: data.id });
    }
}