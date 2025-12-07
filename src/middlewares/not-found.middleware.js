module.exports = (req, res, next) => {
    console.log(`
    Không tìm thấy đường dẫn -- ${req.method} ${req.originalUrl}
    `);
    console.log(error);

    res.status(404).json({
        status: 404,
        message: "Không tìm thấy đường dẫn!"
    });
};;