'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('products_categories', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
                unique: true,
                defaultValue: Sequelize.UUIDV4
            },
            product_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "products",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDELETE: "CASCADE"
            },
            category_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "categories",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDELETE: "CASCADE"
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('products_categories');
    }
};