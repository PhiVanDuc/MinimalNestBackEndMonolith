module.exports = (error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || "Lỗi server nội bộ!";
    const data = error.data;

    console.log("Đã xảy ra lỗi:");
    console.log(error);

    res.status(status).json({
        success: false,
        message,
        ...(data ? { data } : {})
    });
};