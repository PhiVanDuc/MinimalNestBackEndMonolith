'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Address extends Model {
        static associate(models) {
            Address.belongsTo(models.Account, {
                foreignKey: 'accountId',
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
            accountId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            recipientName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            provinceId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            provinceName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            districtId: {
                type: DataTypes.STRING,
                allowNull: false
            },
            districtName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            wardCode: {
                type: DataTypes.STRING,
                allowNull: false
            },
            wardName: {
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
            timestamps: true,
            underscored: true
        }
    );

    return Address;
};