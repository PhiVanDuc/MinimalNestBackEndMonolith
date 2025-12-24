const { Color } = require("../../db/models/index");
const { Op } = require("sequelize");

const generateWhere = require("../../utils/generate-where");

module.exports = {
    findColors: async ({ page, limit, filter, options = {} } = {}) => {
        if (!page && !limit && !filter) return Color.findAll(options);

        const whereConfig = {
            name: (value) => {
                return {
                    [Op.iLike]: `%${value}%`
                }
            }
        }

        const whereResult = generateWhere(filter, whereConfig);

        return Color.findAndCountAll(
            {
                where: whereResult,
                offset: (page - 1) * limit,
                limit,
                ...options
            }
        );
    },

    findColorById: async ({ id, options = {} } = {}) => {
        return Color.findByPk(id, options);
    },

    findColorBySlug: async ({ slug, options = {} } = {}) => {
        return Color.findOne({
            where: { slug },
            ...options
        });
    },

    createColor: async ({ data, options = {} } = {}) => {
        return Color.create(data, options);
    },

    updateColor: async ({ id, data, options = {} } = {}) => {
        return Color.update(
            data,
            {
                where: { id },
                ...options
            }
        );
    },

    destroyColor: async ({ id, options = {} } = {}) => {
        return Color.destroy({ 
            where: { id },
            ...options
        });
    }
}