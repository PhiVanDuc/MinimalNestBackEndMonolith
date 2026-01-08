'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Color extends Model {
        static associate(models) {
            Color.hasMany(models.ProductColor, {
                foreignKey: "colorId",
                as: "colorsProducts"
            });

            Color.belongsToMany(models.Product, {
                through: models.ProductColor,
                foreignKey: "colorId",
                otherKey: "productId",
                as: "products"
            });
        }
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
                allowNull: false
            },
            slug: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            colorCode: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Color',
            tableName: 'colors',
            timestamps: true,
            underscored: true
        }
    );

    return Color;
};