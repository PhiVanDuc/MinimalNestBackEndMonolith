'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('addresses', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
                unique: true,
                defaultValue: Sequelize.UUIDV4
            },
            account_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "accounts",
                    key: "id"
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            recipient_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            phone_number: {
                type: Sequelize.STRING,
                allowNull: false
            },
            province_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            province_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            district_id: {
                type: Sequelize.STRING,
                allowNull: false
            },
            district_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            ward_code: {
                type: Sequelize.STRING,
                allowNull: false
            },
            ward_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            address: {
                type: Sequelize.TEXT,
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
        await queryInterface.dropTable('addresses');
    }
};