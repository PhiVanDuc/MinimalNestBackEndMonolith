'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProductCategory extends Model {
        static associate(models) {
            ProductCategory.belongsTo(models.Product, {
                foreignKey: "productId",
                as: "product"
            });

            ProductCategory.belongsTo(models.Category, {
                foreignKey: "categoryId",
                as: "category"
            });
        }
    }

    ProductCategory.init(
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
            categoryId: {
                type: DataTypes.UUID,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'ProductCategory',
            tableName: 'products_categories',
            timestamps: true,
            underscored: true
        }
    );

    return ProductCategory;
};