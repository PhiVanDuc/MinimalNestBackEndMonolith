'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Address extends Model {
        static associate(models) {
            Address.belongsTo(models.Account, {
                foreignKey: 'account_id',
                as: 'account'
            });
        }
    }

    Address.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            account_id: {
                type: DataTypes.UUID,
                allowNull: false
            },
            recipient_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phone_number: {
                type: DataTypes.STRING,
                allowNull: false
            },
            province_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            province_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            district_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            district_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            ward_code: {
                type: DataTypes.STRING,
                allowNull: false
            },
            ward_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            address: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Address',
            tableName: 'addresses',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true
        }
    );

    return Address;
};