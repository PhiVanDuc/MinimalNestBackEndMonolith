const humps = require("humps");
const colorRepository = require("./color.repository");
const formatFilter = require("../../utils/format-filter");
const generateSlug = require("../../utils/generate-slug");
const throwHttpError = require("../../utils/throw-http-error");
const formatOutputPagination = require("../../utils/format-output-pagination");

const SEQUELIZE_ERRORS = require("../../consts/sequelize-errors");

module.exports = {
    getColors: async (data) => {
        const options = {
            attributes: ["id", "name", "slug", "color_code"],
            order: [["updated_at", "DESC"]]
        }

        const page = data.page;
        const limit = data.limit;
        const filterWhitelist = ["name"];
        const filter = formatFilter(data, filterWhitelist);

        const { count, rows } = await colorRepository.paginateColors({ page, limit, filter, options });
        const plainColors = rows.map(row => row.get({ plain: true }));

        return formatOutputPagination({ rows: { colors: humps.camelizeKeys(plainColors) }, page, count, limit });
    },

    getColor: async (data) => {
        const color = await colorRepository.findById({
            id: data.id,
            options: { attributes: ["id", "name", "slug", "color_code"] }
        });

        if (!color) throwHttpError(404, "Không tìm thấy màu sắc!");
        return humps.camelizeKeys(color.get({ plain: true }));
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
            if (error.name === SEQUELIZE_ERRORS.UNIQUE) throwHttpError(409, "Tên màu sắc đã được sử dụng!");
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
            if (error.name === SEQUELIZE_ERRORS.UNIQUE) throwHttpError(409, "Tên màu sắc đã được sử dụng!");
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