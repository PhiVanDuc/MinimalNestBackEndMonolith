'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.hasMany(models.ProductCategory, {
                foreignKey: "product_id",
                as: "products_categories"
            });

            Product.belongsToMany(models.Category, {
                through: models.ProductCategory,
                foreignKey: "product_id",
                otherKey: "category_id",
                as: "categories"
            });

            Product.hasMany(models.ProductColor, {
                foreignKey: "product_id",
                as: "products_colors"
            });

            Product.belongsToMany(models.Color, {
                through: models.ProductColor,
                foreignKey: "product_id",
                otherKey: "color_id",
                as: "colors"
            });
        }
    }

    Product.init(
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
            desc: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            cost_price: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            interest_percent: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            discount_type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            discount: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Product',
            tableName: 'products',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true
        }
    );
    
    return Product;
};