'use strict';

const { Model } = require('sequelize');

const RANKS = require("../../consts/ranks");
const ROLES = require("../../consts/roles");

module.exports = (sequelize, DataTypes) => {
    class Account extends Model {
        static associate(models) {
            Account.hasMany(models.Address, {
                foreignKey: 'account_id',
                as: 'addresses',
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            });
        }
    }

    Account.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.TEXT
            },
            rank: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: RANKS.NEW_CUSTOMER
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ROLES.CUSTOMER
            },
            provider: {
                type: DataTypes.STRING,
                allowNull: false
            },
            token: {
                type: DataTypes.STRING
            },
            token_type: {
                type: DataTypes.STRING
            },
            token_expired_at: {
                type: DataTypes.DATE
            },
            is_verified: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            sequelize,
            modelName: 'Account',
            tableName: 'accounts',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true
        }
    );

    return Account;
};