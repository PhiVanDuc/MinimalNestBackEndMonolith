const { Color } = require("../../db/models/index");

module.exports = {
    findColorsPaginated: async (page, limit) => {
        const { count, rows } = await Color.findAndCountAll({
            offset: (page - 1) * limit,
            limit,
            order: [["created_at", "DESC"]]
        });

        return {
            colors: rows,
            page: `${page}`,
            totalPage: `${Math.ceil(count / limit)}`,
        }
    },

    findColorById: async (id) => {
        return Color.findByPk(id);
    },

    findColorBySlug: async (slug) => {
        return Color.findOne({ where: { slug } });
    },

    createColor: async (data, options = {}) => {
        return Color.create(data, options);
    },

    updateColor: async (data, id, options = {}) => {
        return Color.update(
            data,
            {
                where: { id: id },
                ...options,
                returning: true
            }
        );
    },

    destroyColor: async (id) => {
        return Color.destroy({ where: { id } });
    }
}