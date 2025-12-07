const colorRepository = require("./color.repository");

const generateSlug = require("../../utils/generate-slug");
const throwHttpError = require("../../utils/throw-http-error");

module.exports = {
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