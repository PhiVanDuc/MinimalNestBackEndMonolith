'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProductImage extends Model {
        static associate(models) {
            ProductImage.belongsTo(models.ProductColor, {
                foreignKey: "productColorId",
                as: "productsColors"
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
            productColorId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            publicId: {
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
            timestamps: true,
            underscored: true
        }
    );
    
    return ProductImage;
};