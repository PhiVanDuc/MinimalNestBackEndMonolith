'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            Category.hasMany(models.ProductCategory, {
                foreignKey: "categoryId",
                as: "categoriesProducts"
            });

            Category.belongsToMany(models.Product, {
                through: models.ProductCategory,
                foreignKey: "categoryId",
                otherKey: "productId",
                as: "products"
            });
        }
    }

    Category.init(
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
            }
        },
        {
            sequelize,
            modelName: 'Category',
            tableName: 'categories',
            timestamps: true,
            underscored: true
        }
    );

    return Category;
};