'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProductColor extends Model {
        static associate(models) {
            ProductColor.belongsTo(models.Product, {
                foreignKey: "product_id",
                as: "product"
            });

            ProductColor.belongsTo(models.Color, {
                foreignKey: "color_id",
                as: "color"
            });

            ProductColor.hasMany(models.ProductImage, {
                foreignKey: "product_color_id",
                as: "product_images"
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
            product_id: {
                type: DataTypes.UUID,
                allowNull: false
            },
            color_id: {
                type: DataTypes.UUID,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'ProductColor',
            tableName: 'products_colors',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true
        }
    );
    
    return ProductColor;
};