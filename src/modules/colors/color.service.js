const colorRepository = require("./color.repository");
const generateSlug = require("../../utils/generate-slug");
const throwHttpError = require("../../utils/throw-http-error");

module.exports = {
    getColors: async (data) => {
        const options = {
            attributes: ["id", "name", "slug", "color_code"],
            order: [["created_at", "DESC"]]
        }

        if (Object.keys(data || {}).length === 0) return colorRepository.findColors({ options });

        const page = Number(data.page || "1");
        const limit = Number(data.limit || "20");
        const filter = { name: decodeURIComponent(data.name || "") }

        const { count, rows } = await colorRepository.findColors({ page, limit, filter, options });

        return {
            colors: rows,
            page: page.toString(),
            totalPage: Math.max(1, Math.ceil(count / limit)).toString(),
        }
    },

    getColor: async (data) => {
        return colorRepository.findColorById({
            id: data.id,
            options: { attributes: ["id", "name", "color_code"] }
        });
    },

    addColor: async (data) => {
        const slug = generateSlug(data.name);

        const color = await colorRepository.findColorBySlug({
            slug,
            options: { attributes: ["id"] }
        });

        if (color) throwHttpError(409, "Tên màu sắc đã được sử dụng!");

        await colorRepository.createColor({
            data: {
                name: data.name,
                slug,
                color_code: data.colorCode
            }
        });
    },

    updateColor: async (data) => {
        const slug = generateSlug(data.name);

        const color = await colorRepository.findColorById({
            id: data.id,
            options: { attributes: ["id"] }
        });
        if (!color) throwHttpError(404, "Không tìm thấy màu sắc!");

        const otherColor = await colorRepository.findColorBySlug({
            slug,
            options: { attributes: ["id"] }
        });
        if (otherColor && otherColor.id !== data.id) throwHttpError(409, "Tên màu sắc đã được sử dụng!");

        await colorRepository.updateColor({
            id: data.id,
            data: {
                name: data.name,
                slug: slug,
                color_code: data.colorCode
            }
        });
    },

    deleteColor: async (data) => {
        await colorRepository.destroyColor(data.id);
    }
}