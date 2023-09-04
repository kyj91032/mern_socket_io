const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { // jwt 토큰 생성.
        expiresIn: '30d',
    })
}

module.exports = generateToken;