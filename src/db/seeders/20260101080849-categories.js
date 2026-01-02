'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
    async up (queryInterface, Sequelize) {
        const now = new Date();

        await queryInterface.bulkInsert(
            "categories",
            [
                { id: uuidv4(), name: "Phòng khách", slug: "phong-khach", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Phòng bếp", slug: "phong-bep", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Phòng sinh hoạt chung", slug: "phong-sinh-hoat-chung", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Phòng ngủ", slug: "phong-ngu", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Phòng làm việc", slug: "phong-lam-viec", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Kho chứa đồ", slug: "kho-chua-do", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Sofa", slug: "sofa", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Bàn trà", slug: "ban-tra", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Kệ tivi", slug: "ke-tivi", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Tủ trang trí", slug: "tu-trang-tri", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Thảm trải sàn", slug: "tham-trai-san", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Tủ bếp", slug: "tu-bep", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Bàn ăn", slug: "ban-an", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Ghế ăn", slug: "ghe-an", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Ghế lười", slug: "ghe-luoi", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Kệ sách", slug: "ke-sach", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Bàn bệt", slug: "ban-bet", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Tủ lưu trữ", slug: "tu-luu-tru", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Giường ngủ", slug: "giuong-ngu", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Bàn làm việc", slug: "ban-lam-viec", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Giá sách", slug: "gia-sach", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Tủ hồ sơ", slug: "tu-ho-so", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Kệ đa năng", slug: "ke-da-nang", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Tủ kho", slug: "tu-kho", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Thùng lưu trữ", slug: "thung-luu-tru", created_at: now, updated_at: now },
                { id: uuidv4(), name: "Móc treo dụng cụ", slug: "moc-treo-dung-cu", created_at: now, updated_at: now }
            ]
        );
    },

    async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete("categories", null, {});
    }
};
