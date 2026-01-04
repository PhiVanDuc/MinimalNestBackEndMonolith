'use strict';

const RANKS = require("../../consts/ranks");
const ROLES = require("../../consts/roles");

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('accounts', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
                unique: true,
                defaultValue: Sequelize.UUIDV4
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.TEXT
            },
            rank: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: RANKS.NEW_CUSTOMER
            },
            role: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: ROLES.CUSTOMER
            },
            provider: {
                type: Sequelize.STRING,
                allowNull: false
            },
            token: {
                type: Sequelize.STRING
            },
            token_type: {
                type: Sequelize.STRING
            },
            token_expired_at: {
                type: Sequelize.DATE
            },
            is_verified: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
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
        await queryInterface.dropTable('accounts');
    }
};