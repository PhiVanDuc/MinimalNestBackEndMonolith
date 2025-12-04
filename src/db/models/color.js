'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Color extends Model {
        static associate(models) { }
    }

    Color.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            slug: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            }
        },
        {
            sequelize,
            modelName: 'Color',
            tableName: 'colors',
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    );

    return Color;
};