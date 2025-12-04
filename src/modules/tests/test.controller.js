module.exports = {
    get: (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Thành công kiểm tra kết nối phương thức GET!"
        });
    },

    post: (req, res) => {
        return res.status(201).json({
            success: true,
            message: "Thành công kiểm tra kết nối phương thức POST!"
        });
    },

    put: (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Thành công kiểm tra kết nối phương thức PUT!"
        });
    },

    patch: (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Thành công kiểm tra kết nối phương thức PATCH!"
        });
    },

    delete: (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Thành công kiểm tra kết nối phương thức DELETE!"
        });
    }
}