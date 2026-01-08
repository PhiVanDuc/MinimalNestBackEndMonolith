'use strict';

const { Model } = require('sequelize');

const RANKS = require("../../consts/ranks");
const ROLES = require("../../consts/roles");

module.exports = (sequelize, DataTypes) => {
    class Account extends Model {
        static associate(models) {
            Account.hasMany(models.Address, {
                foreignKey: 'accountId',
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
            tokenType: {
                type: DataTypes.STRING
            },
            tokenExpiredAt: {
                type: DataTypes.DATE
            },
            isVerified: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            sequelize,
            modelName: 'Account',
            tableName: 'accounts',
            timestamps: true,
            underscored: true
        }
    );

    return Account;
};