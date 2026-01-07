const multer = require("multer");
const path = require("path");
const fs = require("fs");

const throwHttpError = require("../../src/utils/throw-http-error");

const UPLOAD_DIRECTORY = path.join(__dirname, "..", "..", "public", "uploads", "product-images");
const LIMIT_FILE_SIZE = 1 * 1024 * 1024;
const LIMIT_FILE_NUMBER = 10;

if (!fs.existsSync(UPLOAD_DIRECTORY)) {
    fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIRECTORY);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const formatFilename = `${uniqueSuffix}${extension}`;

        cb(null, formatFilename);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /^(image\/jpeg|image\/jpg|image\/png|image\/webp|image\/avif)$/;
    const allowedExt = /\.(jpeg|jpg|png|webp|avif)$/i;

    const isValidMimetype = allowedTypes.test(file.mimetype);
    const isValidExtension = allowedExt.test(path.extname(file.originalname).toLowerCase());

    if (isValidMimetype && isValidExtension) cb(null, true);
    else cb(new Error("Vui lòng cung cấp ảnh có đuôi mở rộng (jpg, jpeg, png, webp, avif)!"), false);
}

const limits = {
    fileSize: LIMIT_FILE_SIZE,
    files: LIMIT_FILE_NUMBER
}

const upload = multer({
    storage,
    limits,
    fileFilter
}).array("images", LIMIT_FILE_NUMBER);

module.exports = (req, res, next) => {
    upload(req, res, (error) => {
        try {
            if (error instanceof multer.MulterError) {
                let message = "Lỗi xử lý ảnh!";
                if (error.code === "LIMIT_FILE_SIZE") message = `Vui lòng cung cấp ảnh có kích cỡ tối đa 2MB!`;
                if (error.code === "LIMIT_FILE_COUNT") message = `Vui lòng cung cấp tối đa ${LIMIT_FILE_NUMBER} ảnh!`;
                if (error.code === "LIMIT_UNEXPECTED_FILE") message = `Vui lòng đổi tên trường dữ liệu sang images!`;

                throwHttpError(400, message);
            }
            else if (error) throwHttpError(400, error.message);
        }
        catch(err) {
            console.error(error);
            return next(err);
        }

        next();
    });
}