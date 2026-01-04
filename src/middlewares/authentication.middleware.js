const { verifyJWTToken } = require("../libs/jwt");
const throwHttpError = require("../utils/throw-http-error");

const ROLES = require("../consts/roles");

module.exports = (req, res, next) => {
    try {
        const AUTHENTICATION = process.env.AUTHENTICATION;
        if (AUTHENTICATION !== "allow") next();

        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken || accessToken === "undefined") throwHttpError(401, "Không nhận được phiên đăng nhập phụ!", { isExpired: false, isInvalid: true });

        const verified = verifyJWTToken(accessToken);
        if (verified.isExpired) throwHttpError(401, "Phiên đăng nhập phụ đã hết hạn!", verified);
        if (verified.isInvalid) throwHttpError(401, "Phiên đăng nhập phụ không hợp lệ!", verified);

        const user = verified.decoded;
        user.isAdmin = user.role !== ROLES.CUSTOMER;

        req.user = verified.decoded;
        next();
    }
    catch (error) { next(error); }
}