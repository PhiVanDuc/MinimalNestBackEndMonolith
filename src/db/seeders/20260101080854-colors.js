'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
    async up (queryInterface, Sequelize) {
        const now = new Date();

        await queryInterface.bulkInsert(
            "colors",
            [
                { id: uuidv4(), name: "Trắng Sữa", slug: "trang-sua", color_code: "#F5F5F5", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Be Kem", slug: "be-kem", color_code: "#E5D3B3", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Xám Ghi", slug: "xam-ghi", color_code: "#8E9196", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Gỗ Sồi", slug: "go-soi", color_code: "#C19A6B", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Gỗ Óc Chó", slug: "go-oc-cho", color_code: "#4B3621", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Đen Nhám", slug: "den-nham", color_code: "#1A1A1A", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Xanh Sage", slug: "xanh-sage", color_code: "#9CAF88", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Xanh Denim", slug: "xanh-denim", color_code: "#5E7D9A", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Hồng Tro", slug: "hong-tro", color_code: "#D4A5A5", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Vàng Mustard", slug: "vang-mustard", color_code: "#E1AD01", created_at: now, updated_at: now }
            ]
        )
    },

    async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete("colors", null, {});
    }
};
