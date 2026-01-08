'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProductColor extends Model {
        static associate(models) {
            ProductColor.belongsTo(models.Product, {
                foreignKey: "productId",
                as: "product"
            });

            ProductColor.belongsTo(models.Color, {
                foreignKey: "colorId",
                as: "color"
            });

            ProductColor.hasMany(models.ProductImage, {
                foreignKey: "productColorId",
                as: "productImages"
            });
        }
    }

    ProductColor.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            productId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            colorId: {
                type: DataTypes.UUID,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'ProductColor',
            tableName: 'products_colors',
            timestamps: true,
            underscored: true
        }
    );
    
    return ProductColor;
};