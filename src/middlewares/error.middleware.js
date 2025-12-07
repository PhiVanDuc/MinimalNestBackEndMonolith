module.exports = (error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || "Lỗi server nội bộ!";
    const data = error.data;

    console.log(`
    Lỗi server nội bộ: ${message}
    `);
    console.log(error);

    res.status(status).json({
        status,
        message,
        ...(data ? { data } : {})
    });
};