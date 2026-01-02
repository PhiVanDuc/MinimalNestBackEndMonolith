'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProductCategory extends Model {
        static associate(models) {
            ProductCategory.belongsTo(models.Product, {
                foreignKey: "product_id",
                as: "product"
            });

            ProductCategory.belongsTo(models.Category, {
                foreignKey: "category_id",
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
            product_id: {
                type: DataTypes.UUID,
                allowNull: false
            },
            category_id: {
                type: DataTypes.UUID,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'ProductCategory',
            tableName: 'products_categories',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true
        }
    );

    return ProductCategory;
};