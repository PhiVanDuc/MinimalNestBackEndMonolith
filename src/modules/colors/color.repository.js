const { Color } = require("../../db/models/index");
const { Op } = require("sequelize");

const generateWhere = require("../../utils/generate-where");

module.exports = {
    findColors: async (page, limit, filter) => {
        if (!page && !limit && !filter) return Color.findAll();

        const configWhere = {
            name: (value) => {
                return {
                    [Op.iLike]: `%${value}%`
                }
            }
        }

        const where = generateWhere(filter, configWhere);

        const { count, rows } = await Color.findAndCountAll({
            where,
            offset: (page - 1) * limit,
            limit,
            order: [["created_at", "DESC"]]
        });

        return {
            colors: rows,
            page: `${page}`,
            totalPage: `${Math.max(1, Math.ceil(count / limit))}`,
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