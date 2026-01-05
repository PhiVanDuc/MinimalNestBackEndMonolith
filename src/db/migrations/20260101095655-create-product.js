'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('products', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
                unique: true,
                defaultValue: Sequelize.UUIDV4
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            slug: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            desc: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            cost_price: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            interest_percent: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            discount_type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            discount: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false
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
        await queryInterface.dropTable('products');
    }
};