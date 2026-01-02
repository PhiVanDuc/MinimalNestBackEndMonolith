'use strict';

const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');

module.exports = {
    async up (queryInterface, Sequelize) {
        const now = new Date();
        const hashedPassword = await bcrypt.hash("123456", 10);

        await queryInterface.bulkInsert(
            "accounts",
            [
                {
                    id: uuidv4(),
                    username: "Siêu quản trị viên",
                    email: "phid808@gmail.com",
                    password: hashedPassword,
                    rank: "khach-vip",
                    role: "sieu-quan-tri-vien",
                    provider: "credentials",
                    is_verified: true,
                    created_at: now,
                    updated_at: now
                }
            ]
        )
    },

    async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete("accounts", null, {});
    }
};
