const deleteDiskStorageImage = require("../../utils/delete-disk-storage-image");

module.exports = {
    addProduct: (req, res, next) => {},

    addProductImages: async (req, res, next) => {
        const files = req.files;
        const data = req.body;

        try {
            console.log("Các ảnh", files);
            console.log("Các dữ liệu: ", data);

            await Promise.all(files.map(file => deleteDiskStorageImage(file.path)));

            return res.status(200).json({
                success: true,
                message: "Thêm ảnh sản phẩm thành công!"
            });
        }
        catch (error) {
            await Promise.all(files.map(file => deleteDiskStorageImage(file.path)));
            next(error);
        }
    }
}