const colorRepository = require("./color.repository");

const generateSlug = require("../../utils/generate-slug");
const throwHttpError = require("../../utils/throw-http-error");
const isPositiveIntegerString = require("../../utils/is-positive-integer-string");

module.exports = {
    getColors: async (data) => {
        if (Object.keys(data || {}).length === 0) return colorRepository.findColors();

        const page = data.page || "1";
        const limit = data.limit || "20";
        const filter = { name: decodeURIComponent(data.name || "") }

        if (!isPositiveIntegerString(page) || !isPositiveIntegerString(limit)) throwHttpError(400, "Dữ liệu page hoặc limit đã cung cấp không hợp lệ!");
        return colorRepository.findColors(Number(page), Number(limit), filter);
    },

    getColor: async (data) => {
        return colorRepository.findColorById(data.id);
    },

    addColor: async (data) => {
        const slug = generateSlug(data.name);

        const color = await colorRepository.findColorBySlug(slug);
        if (color) throwHttpError(409, "Tên màu sắc đã được sử dụng!");

        await colorRepository.createColor(
            {
                name: data.name,
                slug: slug,
                color_code: data.colorCode
            }
        );
    },

    updateColor: async (data) => {
        const slug = generateSlug(data.name);

        const color = await colorRepository.findColorById(data.id);
        if (!color) throwHttpError(404, "Không tìm thấy màu sắc!");

        const otherColor = await colorRepository.findColorBySlug(slug);
        if (otherColor && otherColor.id !== data.id) throwHttpError(409, "Tên màu sắc đã được sử dụng!");

        await colorRepository.updateColor(
            {
                name: data.name,
                slug: slug,
                color_code: data.colorCode
            },
            data.id
        );
    },

    deleteColor: async (data) => {
        await colorRepository.destroyColor(data.id);
    }
}