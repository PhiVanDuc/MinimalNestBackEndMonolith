const generateWhere = require("../../utils/generate-where");

const createBaseRepository = (model) => {
    const findAll = async ({ page, limit, filter, whereConfig, options = {} } = {}) => {
        const whereResult = generateWhere(filter, whereConfig);

        return model.findAndCountAll({
            where: whereResult,
            offset: (page - 1) * limit,
            limit,
            raw: true,
            nest: true,
            ...options
        });
    };

    const findById = async ({ id, options = {} } = {}) => {
        return model.findByPk(id, {
            raw: true,
            nest: true,
            ...options
        });
    };

    const findBySlug = async ({ slug, options = {} } = {}) => {
        return model.findOne({
            where: { slug },
            raw: true,
            nest: true,
            ...options
        });
    };

    const create = async ({ data, options = {} } = {}) => {
        return model.create(data, options);
    };

    const update = async ({ id, data, options = {} } = {}) => {
        return model.update(data, {
            where: { id },
            ...options
        });
    };

    const destroy = async ({ id, options = {} } = {}) => {
        return model.destroy({
            where: { id },
            ...options
        });
    };

    return {
        findAll,
        findById,
        findBySlug,
        create,
        update,
        destroy
    };
};

module.exports = createBaseRepository;