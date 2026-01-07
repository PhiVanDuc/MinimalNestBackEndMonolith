const generateWhere = require("../../utils/generate-where");

const createBaseRepository = (model) => {
    const findAndCountAll = async ({ page, limit, filter, whereConfig, options = {} } = {}) => {
        const whereResult = generateWhere(filter, whereConfig);

        return model.findAndCountAll({
            where: whereResult,
            offset: (page - 1) * limit,
            limit,
            ...options
        });
    };

    const findAll = async (options = {}) => {
        return model.findAll(options);
    }

    const findById = async ({ id, options = {} } = {}) => {
        return model.findByPk(id, options);
    };

    const findBySlug = async ({ slug, options = {} } = {}) => {
        return model.findOne({
            where: { slug },
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
        findAndCountAll,
        findAll,
        findById,
        findBySlug,
        create,
        update,
        destroy
    };
};

module.exports = createBaseRepository;