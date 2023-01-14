const jwt = require('jsonwebtoken');

function createToken(object) {
    const token = jwt.sign(object, process.env.JWT_SECRET_KEY);
    return token
}

function decodeToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
        throw new Error("401 invalid token!")
    }
}

export { createToken, decodeToken }

