const fs = require("fs");

module.exports = async (path) => {
    try {
        await fs.promises.unlink(path);
        console.log(`Đã xóa thành công ảnh tại -- ${path}`);
    }
    catch (error) {
        console.error(`Không thể xoá ảnh tại -- ${path}`);
        console.error(error);
    }
}