const jsonwebtoken = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const signJWTToken = (payload, expiresIn) => jsonwebtoken.sign(payload, JWT_SECRET_KEY, { expiresIn });

const verifyJWTToken = (jwtToken) => {
    try {
        const decoded = jsonwebtoken.verify(jwtToken, JWT_SECRET_KEY);

        return {
            isExpired: false,
            isInvalid: false,
            decoded
        }
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return {
                isExpired: true,
                isInvalid: false
            }
        }

        return {
            isExpired: false,
            isInvalid: true
        }
    }
}

module.exports = { signJWTToken, verifyJWTToken };