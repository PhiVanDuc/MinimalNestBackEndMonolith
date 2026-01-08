'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.hasMany(models.ProductCategory, {
                foreignKey: "productId",
                as: "productsCategories"
            });

            Product.belongsToMany(models.Category, {
                through: models.ProductCategory,
                foreignKey: "productId",
                otherKey: "categoryId",
                as: "categories"
            });

            Product.hasMany(models.ProductColor, {
                foreignKey: "productId",
                as: "productsColors"
            });

            Product.belongsToMany(models.Color, {
                through: models.ProductColor,
                foreignKey: "productId",
                otherKey: "colorId",
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
            costPrice: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            interestPercent: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            discountType: {
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
            timestamps: true,
            underscored: true
        }
    );
    
    return Product;
};