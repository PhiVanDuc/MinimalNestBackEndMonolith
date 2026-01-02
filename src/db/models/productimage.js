'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProductImage extends Model {
        static associate(models) {
            ProductImage.belongsTo(models.ProductColor, {
                foreignKey: "products_colors_id",
                as: "products_colors"
            })
        }
    }

    ProductImage.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            products_colors_id: {
                type: DataTypes.UUID,
                allowNull: false
            },
            public_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            url: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'ProductImage',
            tableName: 'product_images',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true
        }
    );
    
    return ProductImage;
};